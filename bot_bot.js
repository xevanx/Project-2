const strat = require('./src/models/index');
const db = require('./src/database/database');
const Sequelize = require('sequelize');
const Discord = require('discord.js');
const bot = new Discord.Client();
const ytdl = require("ytdl-core");
var servers = {};
const queue = new Map();
const fs = require('fs');
const {
    meme
} = require('memejs');
const ReactionRole = require("reaction-role");
const reactionRole = new ReactionRole.Main(bot);
const reactionBot = reactionRole.Client();
const dotenv = require('dotenv').config();
const TOKEN = process.env.BOT_TOKEN;
const PREFIX = process.env.PREFIX;
const collection = new ReactionRole.Collection();
collection.set("ReactionRole", "https://www.npmjs.com/package/reaction-role")
console.log(collection.get("ReactionRole"));
let option1 = reactionRole.createOption("1️⃣", "715285878620029079");
let option2 = reactionRole.createOption("2️⃣", "715284834213429380");
reactionRole.createMessage("715288427142316122", "715283029525790790", option1, option2);
reactionRole.init();
reactionRole.reInit();
const eventDate = "2020-06-04 01:00:00";
const format = "m/d/y H:M";
const hourInMs = 3600000;
const minuteInMS = 60000;
const replyArray = ["The owner are Evan Wenzel, ",
    "Marc Salaver, ",
    "and David Castro."
];

bot.on('ready', message => {
    db.authenticate()
        .then(() => {
            console.log('logged into DB.');
            strat.init(db);
        })
        .catch(err => console.log(err));
    console.log("The bot is online!");
});

bot.on("guildMemberAdd", member => {
    bot.message.channels.cache.get("713775965783982120").send(`Welcome ${member}! \nPlease head over to role-select to select your roles.`);
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
    const commands = ["join", "leave", "play", "meme", "command", "event", "author"];

    if (command === 'meme') {
        message.channel.send('aiight BET!').then((message) => {
            fetchMemes(message);
        });
        const fetchMemes = (message) => {
            meme(function (err, data) {
                if (err) return console.error(err);
                console.log(data);
                const embed = new Discord.MessageEmbed()
                    .setTitle(data.title)
                    .setImage(data.url)
                    .setFooter(data.subreddit)
                    .setAuthor(data.author);
                message.edit(embed);
            });
        };
    }

    // if (command === "event") {
    //     // require package
    //     var datetimePackage = require("node-datetime");

    //     // create 2 variables for the event date
    //     var nextClanEventDate = datetimePackage.create(eventDate);
    //     var nextClanEventDateModify = datetimePackage.create(eventDate);

    //     // offset hours appropriate for your server that hosts the bot + local machine
    //     nextClanEventDateModify.offsetInHours(-8);

    //     // Format both variables into a different date format
    //     var formatNextClanEventDate = nextClanEventDate.format(format);
    //     var formatNextClanEventDateModify = nextClanEventDate.format(format);

    //     // Store the current date and time in a variable
    //     var dateRightNow = datetimePackage.create();
    //     // format the current date
    //     var formatDateRightNow = dateRightNow.format(format);

    //     // convert one of the event date variables and the current date variable so we can compare the dates
    //     var dateRightNowInMs = new Date(formatDateRightNow);
    //     var clanEventInMs = new Date(formatNextClanEventDateModify);

    //     // create a variable and store the difference between both dates
    //     const dateDifference = clanEventInMs - dateRightNowInMs;

    //     // calculate hours and minutes left
    //     var hoursLeft = Math.floor(dateDifference / hourInMs);
    //     var remainder = dateDifference - (hoursLeft * hourInMs);
    //     var minutesLeft = Math.floor(remainder / minuteInMS);

    //     // create a message array with the correct dates, hours, minutes until event begins
    //     var messageArray = [
    //         "Next event date is: " + formatNextClanEventDate + "PST\n",
    //         "The event begins in: " + hoursLeft + "h " + minutesLeft + "m\n",
    //         "The upcoming event is The 4th of July."
    //     ];

    //     // reply with a message displaying the correct values from the message array
    //     message.reply(messageArray[0] + messageArray[1] + messageArray[2]);

    // }

    // // check for !author
    if (command === "author") {
        // send back a message about the author
        message.reply(replyArray[0] + replyArray[1] + replyArray[2]);
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

    if (command === 'command') {
        for (var i = 0; i < commands.length; i++) {
            message.channel.send(commands[i])
        }
    }

    if (command === 'leave') {
        var connection = voiceChannel.leave();
    }

    // if (command === 'queue') {
    //     let channel = bot.channels.cache.get(textChannel.id);
    //     message.channel.send('Here is the current queue');
    //     for (var i = 0; i < playlist.length; i++) {
    //         message.channel.send(playlist[i]);
    //     };
    // }

    if (command === 'play') {
        if (!args) {
            return message.channel.send("User must provide a youtube URL inorder to run this command");
        }
        if (!voiceChannel) {
            return message.channel.send("User must be in a voice channel in order to run this command");
        }
        if (voiceChannel) {
            const serverQueue = queue.get(message.guild.id);
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
                        var connection = voiceChannel.join()
                        queueConstructor.connection = connection
                            .then(connection => {
                                const stream = ytdl(url, {
                                    filter: 'audioonly'
                                });
                                const dispatcher = connection.play(stream);
                                dispatcher.on('end', () => {
                                    voiceChannel.leave();
                                });
                            });
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

bot.login(TOKEN);