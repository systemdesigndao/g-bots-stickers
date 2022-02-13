#!/usr/bin/env zx

const videoType = 'mp4';
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
  $`ffmpeg -y -i ${sourcePath}.${videoType} -c:v libvpx-vp9 -b:v ${bitRate}k -vf scale=${size} -an ${buildPath}/${sourceNameToMerge}.webm`,
  $`ffmpeg -y -i ${sourcePath}.${videoType} -c:v libvpx-vp9 -b:v ${bitRate}k -vf scale=${size},reverse -an ${buildPath}/${sourceNameToMergeReverse}.webm`
]);

await $`echo "file '${sourceNameToMerge}.webm'\nfile '${sourceNameToMergeReverse}.webm'" > ${buildPath}/${sourceName + toMergePrefix}.txt`;

await $`ffmpeg -y -f concat -i ${buildPath}/${sourceName + toMergePrefix}.txt -c copy ${buildPath}/${sourceName + mergedPrefix}.webm`;