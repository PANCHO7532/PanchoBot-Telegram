# PanchoBot-Telegram
Multi-Functional bot for Telegram written in Node.JS
### Warning: this bot is under reconstruction, some functions here may not work
## Features
- Download YouTube videos in Telegram! (under reconstruction)
- Download SoundCloud songs!
- Measure your ping in ms between your location and the bot!
- and... that's all (?

Well it ain't much at this time, probably i will add more features soon.

## Installation
1) Download everything in this repo inside an empty folder
2) Open an cmd in that folder
3) Execute "npm update --save" or "npm install node-telegram-bot-api ytdl-core sync-request --save"
4) Open index.js and write in the "botToken" var, your Telegram Bot Token, if you don't know your token, or you don't have bots yet, go to https://t.me/BotFather (or add the argument -bt + your telegram token if you don't wanna modify the file)
5) (Optional) Add your SoundCloud API Token in scapikey variable (or add the argument -sak + your SoundCloud API key if you don't wanna modify the file)
6) Execute "node index.js" and have fun!
- Remember! You can add arguments!, view the full list by executing "node index.js --help"

## Try It/Demo
You can try this code in my bot: PanchoBot in Telegram, you can start using it by going to: https://t.me/Pancho7Bot - go and test it!!!

## Bugs, Warnings and Source code updates
The /ytdl command it would be a bit unstable as i coded it asleep in my keyboard, if you find an bug, feel free to go to the issues section and share your problem (anyway nobody comes to my GitHub profile :'3)

Update 2.7b (24/08/2020):
- Code rebuild from zero
- Added pre ytdl-core functions, nothing usable yet but pushing anyways so i can't lose the changes i wrote
- Added ping command "/ping"

Update 2.0.1 (15/08/2019):
- Fixed bug where heavy MP4 720p aren't sent in Telegram due an server error. (limitations probably)
- catch() based exceptions to handle non-deliverable content (by mime/type limitations and size limitations)
- Fixed source-code (i uploaded an incorrect version to GitHub lol)
