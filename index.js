console.log("PanchoBot v2.01 - Telegram");
var request = require('request');
var tbot = require("node-telegram-bot-api");
var ytdl = require("ytdl-core");
var util = require("util");
var token = "your_telegram_bot_token_here";
const bot = new tbot(token, {polling: true});
var scapikey = "your_soundcloud_api_key_here";

bot.on("message", function(message){
    if(message.text.substring(0, 20) == "/download_soundcloud") {
        if(!message.text.substring(21) || message.text.substring(21) == "") {
            bot.sendMessage(message.chat.id, "\u{26D4} Debes especificar un link en el comando \u{26D4}");
            return;
        }
        request("http://api.soundcloud.com/resolve?url=" + message.text.substring(21) + "&client_id=" + scapikey, function(error, response, body4) {
			var jsonsc = JSON.parse(body4);
				if(response.statusCode == "404") {
					bot.sendMessage(message.chat.id, "No se encontro la cancion.");
					return;
				}
				if(!jsonsc.waveform_url) {
					bot.sendMessage(message.chat.id, "El enlace no es un link directo a una cancion de Soundcloud.");
					return;
				}
				bot.sendAudio(message.chat.id, jsonsc.stream_url + "?client_id=" + scapikey);
		});
    }
    if(message.text.substring(0, 14) == "/perfiltaringa") {
        if(!message.text.substring(15) || message.text.substring == "") {
            bot.sendMessage(message.chat.id, "\u{26D4} Debes especificar un nick, ejemplo: '/perfiltaringa fulano' \u{26D4}");
            return;
        }
        request("https://api.taringa.net/user/nick/view/" + message.text.substring(15), function(error, response, body){
            if(error) {
                console.log(error);
            }
            if(response.statusCode != 200) {
                bot.sendMessage(message.chat.id, "Ocurrió un error tratando de contactar a Taringa!, intenta mas tarde.");
                return;
            }
            var json_t = JSON.parse(body);
            if(!json_t.id) {
                bot.sendMessage(message.chat.id, "Los datos recibidos de Taringa! son invalidos, intenta mas tarde.");
                return;
            }
            //suponiendo que todo salió bien xd
            //genero...
            if(json_t.gender == "m") {
                var genero = "Masculino";
            } else {
                var genero = "Femenino";
            }
            //estado de cuenta
            // 5 - baneado
            // 10 - ok
            // profile_active
            // true - suspendida a voluntad
            // false - activa (sin suspension a voluntad)
            if(json_t.status == 5 && json_t.profile_active == false) {
                var acc_status = "Cuenta baneada y desactivada"
            } else if(json_t.status == 5 && json_t.profile_active == true) {
                var acc_status = "Cuenta baneada";
            } else if(json_t.status == 10 && json_t.profile_active == false) {
                var acc_status = "Cuenta desactivada a voluntad de usuario";
            } else {
                var acc_status = "Cuenta activa"
            }
            if(json_t.message == "") {
                var messagexd = "No hay mensaje acerca de el."
            } else {
                var messagexd = json_t.message;
            }
            if(json_t.rewards_active == true) {
                var creadoresxd = "SI";
            } else {
                var creadoresxd = "NO";
            }
            if(json_t.site == "") {
                var sitee = "No especificado"
            } else {
                var sitee = json_t.site;
            }
            bot.sendMessage(message.chat.id, "\u{27A1} Nombre/s completos: " + json_t.name + " " + json_t.last_name + "\r\n\u{27A1} Nick: " + json_t.nick + "\r\n\u{27A1} Cumpleaños: " + json_t.birthday + "\r\n\u{27A1} Cuenta creada el: " + json_t.created + "\r\n\u{27A1} Genero: " + genero + "\r\n\u{27A1} Pais: " + json_t.country + "\r\n\u{27A1} Rango (V6): " + json_t.range["name"] + "\r\n\u{27A1} Estado de cuenta (V6): " + acc_status + "\r\n\u{27A1} Sitio web: " + sitee + "\r\n\u{27A1} Mensaje acerca de el: \r\n\r\n" + messagexd + "\r\n\r\n\u{27A1} Participa de Taringa Creadores?: " + creadoresxd + "\r\n\r\n\u{1F4BB} PanchoBot V2.01 - Copyright PANCHO7532 (c) 2019 via Taringa!");
            return;
        });
        return;
    }
    if(message.text == "/start") {
        bot.sendMessage(message.chat.id, "\u{1F914}");
        return;
    }
    if(message.text == "/help") {
        bot.sendMessage(message.chat.id, "Lista de comandos:\r\n\r\n/help - Muestra esta ayuda\r\n/perfiltaringa + nick - Consulta un perfil de Taringa! y su estado de cuenta.\r\n/download_soundcloud + link - Descarga una canción de SoundCloud\r\n/ytdl + link - Descarga un video de YouTube\r\n\r\n\u{1F4BB} PanchoBot V2.01 - Copyright PANCHO7532 (c) 2019");
    }
    if(message.text.substring(0, 16) == "/dload_ytdlvideo") {
        if(!ytdl_linkstorage[message.from.id]) {
            bot.sendMessage(message.chat.id, "\u{26D4} ERROR: No hay ningun video cargado, primero utiliza /ytdl");
            return;
        }
        if(message.text.substring(11) == "" || !message.text.substring(11)) {
            bot.sendMessage(message.chat.id, "\u{26D4} ERROR: No hay ningun video cargado, primero utiliza /ytdl");
            return;
        }
        if(!ytdl_linkstorage[message.from.id] == "null") {
            bot.sendMessage(message.chat.id, "\u{26D4} ERROR: No hay ningun video cargado, primero utiliza /ytdl");
            return;
        }
        //#ytvid_mp4_720p|link, etc, etc
        var stage1 = ytdl_linkstorage[message.from.id];
        var stage2 = stage1.split("#");
        for(videoc = 1; videoc < stage2.length; videoc++) {
            if(stage2[videoc].substring(5, message.text.substring(16).length + 5) == message.text.substring(16)) {
                var stage3a = stage2[videoc].split("|");
                //console.log(stage3[1]);
                if(stage3a[0].indexOf("webm") != -1) {
                    bot.sendMessage(message.chat.id, "\u{23E9} Link de descarga: " + stage3a[1]);
                    ytdl_linkstorage[message.from.id] = "null";
                    return;
                } else {
                    bot.sendVideo(message.chat.id, stage3a[1]);
                    ytdl_linkstorage[message.from.id] = "null";
                    return;
                }
            }
        }
    }
    //audio_sending
    if(message.text.substring(0, 16) == "/dload_ytdlaudio") {
        if(!ytdl_linkstorage[message.from.id]) {
            bot.sendMessage(message.chat.id, "\u{26D4} ERROR: No hay ningun video cargado, primero utiliza /ytdl");
            return;
        }
        if(message.text.substring(11) == "" || !message.text.substring(11)) {
            bot.sendMessage(message.chat.id, "\u{26D4} ERROR: No hay ningun video cargado, primero utiliza /ytdl");
            return;
        }
        if(!ytdl_linkstorage[message.from.id] == "null") {
            bot.sendMessage(message.chat.id, "\u{26D4} ERROR: No hay ningun video cargado, primero utiliza /ytdl");
            return;
        }
        //#ytvid_mp4_720p|link, etc, etc
        var stage1a = ytdl_linkstorage[message.from.id];
        var stage2a = stage1a.split("#");
        //#ytaud_opus_webm_48kbps
        for(audioc = 1; audioc < stage2a.length; audioc++) {
            if(stage2a[audioc].substring(5, message.text.substring(16).length + 5) == message.text.substring(16)) {
                var stage3a = stage2a[audioc].split("|");
                //console.log("stage3: " + stage3a);
                if(stage3a[0].indexOf("webm") != -1 || stage3a[0].indexOf("m4a") != -1) {
                    bot.sendMessage(message.chat.id, "\u{23E9} Link de descarga: " + stage3a[1]);
                    ytdl_linkstorage[message.from.id] = "null";
                    return;
                } else {
                    bot.sendAudio(message.chat.id, stage3a[1]);
                    ytdl_linkstorage[message.from.id] = "null";
                    return;
                }
            }
        }
    }
    if(message.text.substring(0, 5) == "/ytdl") {
        if(!message.text.substring(6) || message.text.substring(6) == "") {
            bot.sendMessage(message.chat.id, "\u{26D4} Debes especificar un link en el comando \u{26D4}");
            return;
        }
        ytdl.getInfo(message.text.substring(6), function(err, info) {
            if(err) {
                console.log("[ERROR] - " + err);
                return;
            }
            if(info) {
                //do something
                var vid_rawinfo = info;
                if(vid_rawinfo["player_response"]["videoDetails"]["isPrivate"] == true) {
                    bot.sendMessage(message.chat.id, "\u{26D4} This video is private \u{26D4}");
                    return;
                }
                var vid_title = vid_rawinfo["player_response"]["videoDetails"]["title"];
                var vid_author = vid_rawinfo["player_response"]["videoDetails"]["author"];
                for(c = 0; c < vid_rawinfo["formats"].length; c++) {
                    //video and audio
                    if(vid_rawinfo["formats"][c]["audioEncoding"] != null && vid_rawinfo["formats"][c]["bitrate"] != null) {
                        ytdl_linkstorage[message.from.id] += "#ytvid_" + vid_rawinfo["formats"][c]["container"] + "_" + vid_rawinfo["formats"][c]["resolution"] + "|" + vid_rawinfo["formats"][c]["url"];
                    }
                    //audio only
                    if(vid_rawinfo["formats"][c]["bitrate"] == null && vid_rawinfo["formats"][c]["audioEncoding"] != null) {
                        ytdl_linkstorage[message.from.id] += "#ytaud_" + vid_rawinfo["formats"][c]["audioEncoding"] + "_" + vid_rawinfo["formats"][c]["container"] + "_" + vid_rawinfo["formats"][c]["audioBitrate"] + "kbps|" + vid_rawinfo["formats"][c]["url"];
                    }
                }
                var available_formats = "";
                var stage1 = ytdl_linkstorage[message.from.id];
                var stage2 = stage1.split("#");
                for(d = 1; d < stage2.length; d++) {
                    var stage3 = stage2[d].split("|");
                    if(stage3[0].substring(0, 5) == "ytvid") {
                        //console.log("youtube video element: " + stage3[1]);
                        available_formats+="\u{1F39E} /dload_ytdlvideo" + stage3[0].substring(5) + "\r\n";
                    }
                    if(stage3[0].substring(0, 5) == "ytaud") {
                        //console.log("youtube audio element: " + stage3[1]);
                        available_formats+="\u{1F50A} /dload_ytdlaudio" + stage3[0].substring(5) + "\r\n";
                    }
                }
                //console.log(stage2);
                //console.log(available_formats);
                bot.sendMessage(message.chat.id, "\u{2B07} Descarga de video Youtube \u{25B6}\r\n\r\n\u{23E9} Titulo: " + vid_title + "\r\n\u{23E9} Autor: " + vid_author + "\r\n\r\n\u{1F4C2} Selecciona formato de descarga: \r\n\r\n" + available_formats + "\r\n\r\n\u{203C} Debido a las restricciones en la API de Telegram, algunos videos/audios en .webm o .m4a no se enviaran mediante el chat, en cambio se proporcionara el link directo hacia el video. \u{203C}");
                return;
            }
        });
    }
});