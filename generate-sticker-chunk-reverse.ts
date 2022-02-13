import {$, argv} from 'zx'
import {globby} from 'globby';

void async function () {
  const outputVideoType = argv.outputVideoType;
  const sourceDir = argv.sourceDir;

  const toMergePostfix = 'ToMerge';
  const reversePostfix = 'Reverse';
  const mergedPostfix = 'Merged';

  const bitRate = argv.bitRate;
  const size = argv.size;

  let videos = await globby([sourceDir]);

  for (let video of videos) {
    const [sourcesDir, videoTypeDir, file] = video.split('/');
    const [sourceName, videoType] = file.split('.');
    const sourceDir = `${sourcesDir}/${videoTypeDir}`;
    const sourcePath = `${sourceDir}/${sourceName}`;

    const sourceNameToMerge = sourceName + toMergePostfix;
    const sourceNameToMergeReverse = sourceNameToMerge + reversePostfix;

    const buildDir = 'dist';
    const buildPath = `${buildDir}/${sourceName}`;

    await $`
    if [ ! -d "${buildDir}" ]; then
      mkdir ${buildDir}
    fi
    `

    await $`
    if [ ! -d "${buildPath}" ]; then
      mkdir ${buildPath}
    fi
    `

    await Promise.all([
      $`ffmpeg -y -i ${sourcePath}.${videoType} -c:v libvpx-vp9 -b:v ${bitRate}k -vf scale=${size} -an ${buildPath}/${sourceNameToMerge}.${outputVideoType}`,
      $`ffmpeg -y -i ${sourcePath}.${videoType} -c:v libvpx-vp9 -b:v ${bitRate}k -vf scale=${size},reverse -an ${buildPath}/${sourceNameToMergeReverse}.${outputVideoType}`
    ]);

    await Promise.all([
      $`ffmpeg -y -i ${buildPath}/${sourceNameToMerge}.webm -c:v libx264 -b:a ${bitRate}k ${buildPath}/${sourceNameToMerge}.mp4`,
      $`ffmpeg -y -i ${buildPath}/${sourceNameToMergeReverse}.webm -c:v libx264 -b:a ${bitRate}k ${buildPath}/${sourceNameToMergeReverse}.mp4`
    ])

    // TODO:
    // 1. Echo realization scheme docs/images/generate-sticker-chunk-reverse.jpg
    await $`echo "file '${sourceNameToMerge}.${outputVideoType}'\nfile '${sourceNameToMergeReverse}.${outputVideoType}'" > ${buildPath}/${sourceName + toMergePostfix}.txt`;

    await $`ffmpeg -y -f concat -i ${buildPath}/${sourceName + toMergePostfix}.txt -c copy ${buildPath}/${sourceName + mergedPostfix}.webm`;
    await $`ffmpeg -y -i ${buildPath}/${sourceName + mergedPostfix}.webm -c:v libx264 -c:a aac -strict experimental -b:a 192k ${buildPath}/${sourceName + mergedPostfix}.mp4`
    }
}()