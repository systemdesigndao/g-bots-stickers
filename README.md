# G-Bots Stickers

## Prerequisites

`ffmpeg5.0`, `npm16.13.2`, `npm 8.1.2`

Installing packages:

```zsh
npm install
```

## Prepare to generate sticker chunks

Create `sources` dir:

```zsh
mkdir sources
```

## Generate sticker chunks

And put content into the dir.

All files

```zsh
npm run build:generate-sticker-chunks -- --outputVideoType webm --sourceDir sources/ --bitRate 1300 --size 512:512 --only all --fps 24 --playbackRate 1.0
```

One file

```zsh
npm run build:generate-sticker-chunks -- --outputVideoType webm --sourceDir sources/ --bitRate 1300 --size 512:512 --only fight_01 --fps 24 --playbackRate 1.0
```

## Use stickers

[https://t.me/addstickers/GBots](https://t.me/addstickers/GBots)

## Based on

zx (license - [https://www.apache.org/licenses/LICENSE-2.0])