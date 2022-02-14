# G-Bots Stickers

## Prerequisites

`ffmpeg5.0`, `npm16.13.2`, `npm 8.1.2`

Installing packages:

```zsh
npm install
```

## Generate sticker chunks

All files

```zsh
npm run build:generate-sticker-chunks -- --outputVideoType webm --sourceDir sources/ --bitRate 1300 --size 512:512 --only all
```

One file

```zsh
npm run build:generate-sticker-chunks -- --outputVideoType webm --sourceDir sources/ --bitRate 1300 --size 512:512 --only fight_01
```

## Based on

zx (license - [https://www.apache.org/licenses/LICENSE-2.0])