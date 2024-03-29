import {$, argv} from 'zx'
import {globby} from 'globby';

void async function () {
  const outputVideoType = argv.outputVideoType;
  const sourceDir = argv.sourceDir;
  const fps = argv.fps;
  const playbackRate = argv.playbackRate;

  const toMergePostfix = 'ToMerge';
  const reversePostfix = 'Reverse';
  const mergedPostfix = 'Merged';

  const bitRate = argv.bitRate;
  const size = argv.size;

  const only = argv.only;

  let videos = await globby([sourceDir]);

  for (let video of videos) {
    const [sourcesDir, file] = video.split('/');
    const [sourceName, videoType] = file.split('.');
    if (only === sourceName || only === 'all') {
      const sourcePath = `${sourcesDir}/${sourceName}`;

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

      // make webm stickers
      await Promise.all([
        $`ffmpeg -y -i ${sourcePath}.${videoType} -c:v libvpx-vp9 -b:v ${bitRate}k -vf scale=${size},fps=${fps},setpts=${playbackRate}*PTS -an ${buildPath}/${sourceNameToMerge}.${outputVideoType}`,
        $`ffmpeg -y -i ${sourcePath}.${videoType} -c:v libvpx-vp9 -b:v ${bitRate}k -vf scale=${size},reverse,fps=${fps},setpts=${playbackRate}*PTS -an ${buildPath}/${sourceNameToMergeReverse}.${outputVideoType}`
      ]);

      // make telegram avatars
      await Promise.all([
        $`ffmpeg -y -i ${buildPath}/${sourceNameToMerge}.${outputVideoType} -c:v libx264 -b:v ${bitRate}k ${buildPath}/${sourceNameToMerge}.mp4`,
        $`ffmpeg -y -i ${buildPath}/${sourceNameToMergeReverse}.${outputVideoType} -c:v libx264 -b:v ${bitRate}k ${buildPath}/${sourceNameToMergeReverse}.mp4`
      ])

      // TODO:
      // 1. Echo realization scheme (repeating y(n)) docs/images/generate-sticker-chunk-reverse.jpg
      await $`echo "file '${sourceNameToMerge}.${outputVideoType}'\nfile '${sourceNameToMergeReverse}.${outputVideoType}'" > ${buildPath}/${sourceName + toMergePostfix}.txt`;

      await $`ffmpeg -y -f concat -i ${buildPath}/${sourceName + toMergePostfix}.txt -c copy ${buildPath}/${sourceName + mergedPostfix}.webm`;
      await $`ffmpeg -y -i ${buildPath}/${sourceName + mergedPostfix}.webm -c:v libx264 -c:a aac -strict experimental -b:a 192k ${buildPath}/${sourceName + mergedPostfix}.mp4`
    }
  }
}()