import {$} from 'zx'

void async function () {
  const sourceVideoType = 'mp4';
  const outputVideoType = 'webm';
  const sourceDir = 'sources/mp4';
  const sourceName = 'TonBotsNftRobot1Face';
  const sourcePath = `${sourceDir}/${sourceName}`;
  const toMergePrefix = 'ToMerge';
  const reversePrefix = 'Reverse';
  const mergedPrefix = 'Merged';

  const bitRate = 2400;
  const size = '512:512';

  const sourceNameToMerge = sourceName + toMergePrefix;
  const sourceNameToMergeReverse = sourceNameToMerge + reversePrefix;

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
    $`ffmpeg -y -i ${sourcePath}.${sourceVideoType} -c:v libvpx-vp9 -b:v ${bitRate}k -vf scale=${size} -an ${buildPath}/${sourceNameToMerge}.${outputVideoType}`,
    $`ffmpeg -y -i ${sourcePath}.${sourceVideoType} -c:v libvpx-vp9 -b:v ${bitRate}k -vf scale=${size},reverse -an ${buildPath}/${sourceNameToMergeReverse}.${outputVideoType}`
  ]);

  await $`echo "file '${sourceNameToMerge}.webm'\nfile '${sourceNameToMergeReverse}.webm'" > ${buildPath}/${sourceName + toMergePrefix}.txt`;

  await $`ffmpeg -y -f concat -i ${buildPath}/${sourceName + toMergePrefix}.txt -c copy ${buildPath}/${sourceName + mergedPrefix}.webm`;
}()