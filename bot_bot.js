const Discord = require('discord.js');
const bot = new Discord.Client();
const ytdl = require("ytdl-core");
var servers = {};
const queue = new Map();
const fs = require('fs');
// const Youtube = require("simple-youtube-api");
// const youtube = new Youtube(API_KEY);
const playlist = [];
const { meme } = require('memejs');
const dotenv = require('dotenv').config();
const token = process.env.BOT_TOKEN;
const PREFIX = process.env.PREFIX;

// look into stripe api

bot.on('ready', message => {
    console.log("The bot is online!");
});

bot.on('message', message => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    
    const args = message.content.slice(PREFIX.length).split(/ +/);
    var url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
    var serverQueue = queue.get(message.guild.id);
    var searchString = args.slice(1).join(" ");
    const command = args.shift().toLowerCase();
    const textChannel = message.channel;
    const voiceChannel = message.member.voice.channel;
    //const channel = bot.channels.cache.get(textChannel.id);
    const commands = ["join", "leave", "play", "queue", "meme", "command", "help"];
    
	if (command === 'meme') {
		message.channel.send('aiight BET!').then((msg) => {
			fetchMemes(msg);
		});
		const fetchMemes = (msg) => {
			meme(function(err, data) {
				if (err) return console.error(err);
				console.log(data);
				const embed = new Discord.MessageEmbed()
					.setTitle(data.title)
					.setImage(data.url)
					.setFooter(data.subreddit)
					.setAuthor(data.author);
				msg.edit(embed);
			});
		};
	} 

    if (command === 'join') {
        if (!voiceChannel) {
            return message.channel.send("Please join a voice channel before runnning the command!");
        }
        if (voiceChannel) {
            var connection = voiceChannel.join();
            const joinChannel = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null
            };
            joinChannel.connection = connection;
        }
    }

    if (command === 'commands') {
        for (var i = 0; i < commands.length; i++) {
            message.channel.send(commands[i])
        }
    }

    if (command === 'leave') {
        var connection = voiceChannel.leave();
    }

    if (command === 'queue') {
        let channel = bot.channels.cache.get(textChannel.id);
        message.channel.send('Here is the current queue');
        for (var i = 0; i < playlist.length; i++) {
            message.channel.send(playlist[i]);
        };
    }

    if (command === 'play') {        
        console.log(playlist);
        if (!args) {
           return message.channel.send("User must provide a youtube URL inorder to run this command");
        }
        if (!voiceChannel) {
            return message.channel.send("User must be in a voice channel in order to run this command");
        }
        if (voiceChannel) {
            const serverQueue = queue.get(message.guild.id);
            playlist.push(url);

            function playSong() {
                if (!serverQueue) {
                    const queueConstructor = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 100,
                        playing: true,
                        loop: false
                    };
                    queue.set(message.guild.id, queueConstructor);                    
                    console.log(playlist)
                    if (playlist.length = 1) {
                        var connection = voiceChannel.join()
                        queueConstructor.connection = connection
                            .then(connection => {
                                const stream = ytdl(playlist[0], {
                                    filter: 'audioonly'
                                });
                                const dispatcher = connection.play(stream);
                                dispatcher.on('end', () => {
                                    voiceChannel.leave();
                                });
                            });
                    } else {
                        var connection = voiceChannel.join()
                        queueConstructor.connection = connection
                            .then(connection => {
                                const stream = ytdl(playlist[0], {
                                    filter: 'audioonly'
                                });
                                const dispatcher = connection.play(stream);
                                dispatcher.on('end', () => {
                                    playlist.shift();
                                    playSong();
                                });
                            });
                    }
                }
            }
            if (playlist.length = 1) {
                playSong();
            }
            else {
                playlist.push(url);
            }
        }
    }

    // if (command === 'playlist') {
    //     if (!args) {
    //         return message.channel.send("User must provide a youtube URL inorder to run this command");
    //     }
    //     if (!voiceChannel) {
    //          return message.channel.send("User must be in a voice channel in order to run this command");
    //     }
    //     if (voiceChannel) {
    //         const queueConstructor = {
    //             textChannel: message.channel,
    //             voiceChannel: voiceChannel,
    //             connection: null,
    //             songs: [],
    //             volume: 100,
    //             playing: true,
    //             loop: false
    //         };
    //         queue.set(message.guild.id, queueConstructor);
    //         function makeUrl(i) {
    //             return new Promise(resolve => {
    //                 var urls = args[i] ? args[i].replace(/<(.+)>/g, "$1") : "";
    //             });
    //         };
    //         const playList = async (urls) => {
    //             urls = await makeUrl();
    //             console.log(urls);
    //             var connection = voiceChannel.join()
    //             queueConstructor.connection = connection
    //                 .then(connection => {
    //                     const stream = ytdl(urls, {
    //                         filter: 'audioonly'
    //                     });
    //                     const dispatcher = connection.play(stream);
    //                     dispatcher.on('end', () => {
    //                         voiceChannel.leave();
    //                     });
    //                 });
    //         };
    //         for (var i = 0; i < args.length; i++) {
    //             playList(i);
    //         };
    //     }
    // }        
});

bot.login(token);
