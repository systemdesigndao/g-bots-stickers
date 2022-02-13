import {$} from 'zx'
import {globby} from 'globby';

void async function () {
  const outputVideoType = 'webm';
  const sourceDir = 'sources/mp4';

  const toMergePostfix = 'ToMerge';
  const reversePostfix = 'Reverse';
  const mergedPostfix = 'Merged';

  const bitRate = 2400;
  const size = '512:512';

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

    await $`echo "file '${sourceNameToMerge}.${outputVideoType}'\nfile '${sourceNameToMergeReverse}.${outputVideoType}'" > ${buildPath}/${sourceName + toMergePostfix}.txt`;

    await $`ffmpeg -y -f concat -i ${buildPath}/${sourceName + toMergePostfix}.txt -c copy ${buildPath}/${sourceName + mergedPostfix}.webm`;
    }
}()