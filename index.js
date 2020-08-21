#!/usr/bin/node
const telegramApi = require('node-telegram-bot-api');
const botToken = "YOUR_TELEGRAM_TOKEN_HERE";
const scapikey = "YOUR_SOUNDCLOUD_APIKEY_HERE";
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
    if(message.text == "/ping") {
        bot.sendMessage(message.chat.id, "Pong! (" + (Date.now() - message.date*1000) + " ms)", {reply_to_message_id: message.message_id});
    }
    if(message.text.substring(0, 5) == "/dlsc") {
        var sclink = fetchSoundcloud(message.text.split(" ")[1]);
        if(sclink == -1) {
            bot.sendMessage(message.chat.id, "Song not found in Souncloud servers.", {reply_to_message_id: message.message_id});
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