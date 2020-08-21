#!/usr/bin/node
/*
* ----
* PanchoBot for Telegram v2.7b
* Copyright PANCHO7532 - P7COMunications LLC 2020
* ----
* This software is distributed under a LICENSE file that you must read if you want to do modifications
* or code redistribution/packaging.
*/
const telegramApi = require('node-telegram-bot-api');
var botToken = "YOUR_TELEGRAM_TOKEN_HERE";
var botUsername = "YOUR_BOT_USERNAME";
var scapikey = "YOUR_SOUNDCLOUD_APIKEY_HERE";
var showHelp = false;
for(c = 0; c < process.argv.length; c++) {
    switch(process.argv[c]) {
        case "--botToken":
        case "-bt":
            botToken = process.argv[c+1];
            break;
        case "--botUsername":
        case "-bu":
            botUsername = process.argv[c+1];
            break;
        case "--scApiKey":
        case "-sak":
            scapikey = process.argv[c+1];
            break;
        case "--help":
        case "-h":
            showHelp = true;
            break;
    }
}
const bot = new telegramApi(botToken, {polling: true});
function fetchSoundcloud(sclink) {
    var c1 = require('sync-request')("GET", "https://api.soundcloud.com/resolve?url=" + sclink + "&client_id=" + scapikey);
    if(c1["statusCode"] == 404) {
        //resource not found
        return -1;
    } else if(!JSON.parse(c1["body"])["waveform_url"]) {
        //not an track
        return -2;
    } else {
        return JSON.parse(c1["body"]);
    }
}
bot.on('message', function(message) {
    if(message.text == "/start" || message.text == "/start@" + botUsername) {
        bot.sendMessage(message.chat.id, "Commands:\r\n/ping - Check your approximate ping from your location to the bot server.\r\n/dlsc + link - Download a SoundCloud song.");
    }
    if(message.text == "/ping" || message.text == "/ping@" + botUsername) {
        bot.sendMessage(message.chat.id, "Pong! (" + (Date.now() - message.date*1000) + " ms)", {reply_to_message_id: message.message_id});
    }
    if(message.text.substring(0, 5) == "/dlsc" || message.text.substring(0, 5 + botUsername.length) == "/dlsc@" + botUsername) {
        if(!message.text.split(" ")[1]) {
            bot.sendMessage(message.chat.id, "You may not have provided an link to your command, remember that you need to send the following (for example):\r\n/dlsc https://soundcloud.com/artistname/songtitle", {reply_to_message_id: message.message_id});
            return;
        }
        var sclink = fetchSoundcloud(message.text.split(" ")[1]);
        if(sclink == -1) {
            bot.sendMessage(message.chat.id, "Song not found in Souncloud servers. Please check your link and make sure that it's an SoundCloud link.", {reply_to_message_id: message.message_id});
            return;
        } else if(sclink == -2) {
            bot.sendMessage(message.chat.id, "The provided link isn't a direct link to an SoundCloud song.", {reply_to_message_id: message.message_id});
            return;
        }
        bot.sendAudio(message.chat.id, sclink["stream_url"] + "?client_id=" + scapikey, {title: sclink["title"] + " - " + sclink["user"]["username"], caption: "Title: " + sclink["title"] + "\r\nAuthor: " + sclink["user"]["username"], reply_to_message_id: message.message_id});
    }
});
bot.on('polling_error', function(error) {
    console.log("[ERROR] - Polling error:\r\n" + error);
});
console.log("[INFO] - Bot started!");