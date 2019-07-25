/*
    GLOBALS
*/
const Discord = require('discord.js')
const bot = new Discord.Client()
const tools = require('./tools.js')
const token = tools.token
const prefix = '?'

// console log on successful login
bot.on("ready", () => {
    console.log("aboto is now online!")
})


/*
    MSG REPLIES
*/
bot.on('message', msg => {
    if (!msg.content.startsWith(prefix)) {
        // found a msg not containing command 
        if (msg.content.includes('hello')) {
            msg.reply('hello')
        }
        if (msg.content.includes('poop')) {
            msg.react('💩')
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
    const command = args.shift().toLowerCase()
    
    console.log(args)
    console.log(command)
})



bot.login(token)


