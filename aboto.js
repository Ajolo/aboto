//
//  GLOBALS
//
const Discord = require('discord.js')
const https = require('https')
const ytdl = require('ytdl-core')
const fs = require('fs') // fs is Node's native file system module
const tools = require('./tools.js')
const token = tools.token   // grab token from tools
const prefix = tools.prefix // grab prefix from tools

// init new bot
const bot = new Discord.Client()

// retrieve commands 
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// loop over commandFiles array and dynamically set your commands 
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	bot.commands.set(command.name, command);
}


// weather map containing emoji for known descriptors 
var weatherMap = {}
weatherMap['Clear'] = '☀️'
weatherMap['Rain'] = '🌧'
weatherMap['Clouds'] = '⛅'
weatherMap['Snow'] = '❄️'
weatherMap['Drizzle'] = '💧'
weatherMap['Thunderstorm'] = '⚡'


// console log basic listeners 
bot.on("ready", () => {
    console.log("aboto is now online!")
})
bot.on("reconnecting", () => {
    console.log("aboto is reconnecting . . .")
})
bot.on("disconnect", () => {
    console.log("aboto has disconnected")
})

//
//  MSG HANDLING
//
bot.on('message', msg => {
    // ignore bot messages
    if (msg.author.bot) return

    // simple reactions 
    if (!msg.content.startsWith(prefix)) {
        // found a msg not containing command 
        if (new RegExp("\\b"+"hello"+"\\b").test(msg.content)) {
            msg.reply('hello')
        }
        if (new RegExp("\\b"+"poop"+"\\b").test(msg.content)) {
            msg.react('💩')
        }
        if (new RegExp("\\b"+"area 51"+"\\b").test(msg.content)) {
            msg.react('👽')
        }
        if (new RegExp("\\b"+"69"+"\\b").test(msg.content)) {
            msg.channel.send('nice')
        }

        // check for bad words
        for (i = 0; i < tools.swears.length; i++) {
            if (msg.content.includes(tools.swears[i])) {
                // msg.delete(1000)
                msg.channel.send({ files: ['images/christianserver.jpg'] })
            }
        }

        return
    }

    // slice command and args
    const args = msg.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g)
    // pop first element (the command)
    const command = args.shift().toLowerCase()

    // check if msg contains command intended for aboto
    if (!bot.commands.has(command)) return;

    try {
        bot.commands.get(command).execute(msg, args);
    } 
    catch (err) {
        console.error(err);
        msg.reply('there was an error trying to execute that command!');
    }
    

    async function checkRole() {
        if (msg.member.roles.find("name", "creator")) {
            return true
        }
        return false
    }

    /* temp remove for further testing
    if (command === 'delete') {
        if (checkRole() == false) {
            msg.channel.send("Higher privileges needed for this command")
            return
        }

        async function bulkDelete(numDelete) {
            if (isNaN(numDelete)) {
                msg.channel.send("Specify number of messages to delete -- ie. ?delete 5")
                return
            }
    
            msg.delete() // delete msg containing delete command
            
            // grab x amount of messages, limit specified by user
            const fetched = await msg.channel.fetchMessages({limit: numDelete})
            console.log("~~~ fetched.size is: " + fetched.size)
    
            msg.channel.bulkDelete(fetched)
                .catch(error => console.log(error))
        }
        
        bulkDelete(args[0])
    }
    */

    // random num generator -- moved to controller
    /*
    if (command === 'random') {
        msg.channel.send(parseInt((Math.random() * 100) + 1))
    }
    */

    // openweather api handling
    if (command === 'weather') {
        if (args.length == 0) {
            msg.channel.send("Specify ZIP code -- ie. ?weather 98119")
            return
        }
        
        // init request string
        var reqString = {
            host : 'api.openweathermap.org',
            port : 443,
            path : '/data/2.5/weather?zip='+ args[0] 
                + ',us&units=imperial&appid=' + tools.weatherToken,
            method : 'GET' 
        };
        
        // perform the GET request
        var reqGet = https.request(reqString, function(res) {
            console.log("statusCode: ", res.statusCode)
            var output = ''
        
            res.on('data', function(d) {
                output += d
            })
            res.on('end', function() {
                var jsonOutput = JSON.parse(output);
                finalOutput = jsonOutput.name +' ~ ' + jsonOutput.main.temp +
                    'F and ' + jsonOutput.weather[0].main
                if (jsonOutput.weather[0].main in weatherMap) {
                    finalOutput += (' ' + weatherMap[jsonOutput.weather[0].main])
                }
                console.log(finalOutput)
                msg.channel.send(finalOutput)        
            })
        })

        reqGet.end();
      
        reqGet.on('error', function(e) {
            console.error(e);
        })
    }

    else if (command === 'play') {
        if (args.length == 0) {
            msg.channel.send("Specify a name to search -- ie. ?play despacito")
            return
        }

        getSong(msg, args[0])
    }

})

//
// PLAY REQ HANDLING 
//
async function getSong(msg, songName) {
    const voiceChannel = msg.member.voiceChannel

    // verify user in voice channel
    if (!voiceChannel) { 
        msg.channel.send("Join a voice channel to request playback")
        return
    }

    const songInfo = await ytdl.getInfo(songName)
    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    }

    // msg.channel.send(song.title)
    try {
        var connection = await voiceChannel.join()
        console.log("Playing " + song.title)
        const dispatcher = connection.playStream(ytdl(song.url, { filter : 'audioonly' }))
        
        dispatcher.on('end', () => {
                console.log('Stream finished')
                // voiceChannel.leave()

                // shift the queue
                // serverQueue.songs.shift()
        })
        dispatcher.on('error', err => {
                console.log(err)
        })

        dispatcher.setVolumeLogarithmic(5 / 5);
    }
    catch (err) {
        console.log(err)
    }
}



//
// LOGIN ON START
//
bot.login(token)