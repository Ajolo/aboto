/*
    GLOBALS
*/
const Discord = require('discord.js')
const https = require('https')
const bot = new Discord.Client()
const tools = require('./tools.js')
const token = tools.token
const prefix = '?'

// weather map containing emoji for known descriptors 
var weatherMap = {}
weatherMap['Clear'] = '☀️'
weatherMap['Rain'] = '🌧'
weatherMap['Clouds'] = '⛅'
weatherMap['Snow'] = '❄️'
weatherMap['Drizzle'] = '💧'
weatherMap['Thunderstorm'] = '⚡'


// console log on successful login
bot.on("ready", () => {
    console.log("aboto is now online!")
})

/*
    MSG REPLIES
*/
bot.on('message', msg => {
    // simple replies 
    if (!msg.content.startsWith(prefix)) {
        // found a msg not containing command 
        if (new RegExp("\\b"+"hello"+"\\b").test(msg.content) && (!msg.author.bot)) {
            msg.reply('hello')
        }
        if (new RegExp("\\b"+"poop"+"\\b").test(msg.content)) {
            msg.react('💩')
        }
        if (new RegExp("\\b"+"area 51"+"\\b").test(msg.content)) {
            msg.react('👽')
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

    // else msg found containing command for aboto
    const args = msg.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g)
    // pop first element (the command)
    const command = args.shift().toLowerCase()

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
        
        // do the GET request
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
})


bot.login(token)