//
//  GLOBALS
//
const Discord = require('discord.js')
const fs = require('fs') // fs is Node's native file system module
// const tools = require('./tools.js')
// const token = tools.token   // grab token from tools
// const prefix = tools.prefix // grab prefix from tools

// init bot
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
    if (!msg.content.startsWith(process.env.PREFIX)) {
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
        if (new RegExp("\\b"+"stop"+"\\b").test(msg.content)) {
            msg.channel.send({ files: ['images/penWAS.png'] })
        }

        // check for bad words
        /*
        for (i = 0; i < tools.swears.length; i++) {
            if (msg.content.includes(tools.swears[i])) {
                // msg.delete(1000)
                msg.channel.send({ files: ['images/christianserver.jpg'] })
            }
        }
        */

        return
    }

    // slice command and args
    const args = msg.content
        .slice(process.env.PREFIX.length)
        .trim()
        .split(/ +/g)
    // pop first element (the command)
    const command = args.shift().toLowerCase()

    // check if msg contains command intended for aboto
    if (!bot.commands.has(command)) return;

    // dynamically try executing built-in commands
    try {
        bot.commands.get(command).execute(msg, args);
    } 
    catch (err) {
        console.error(err);
        msg.reply('there was an error trying to execute that command!');
    }
})
//
// LOGIN ON START
//
// bot.login(token)
bot.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret
