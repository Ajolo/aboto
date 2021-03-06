module.exports = {
    name: 'help',
    description: 'Help displays commands available using aboto',
    execute(msg, args) {
        const Discord = require('discord.js')
        const exampleEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('aboto')
            .setURL('https://github.com/Ajolo/aboto/')
            .setDescription('Source code available on GitHub')
            .setThumbnail('https://avatars3.githubusercontent.com/u/4462793?s=460&v=4')
            .addField('Command overview', 'All features are WIP and may not be fully functional')
            .addBlankField()
            .addField('?help', 'Displays overview of currently available commands', true)
            .addField('?weather', 'Followed by a zip code will retrieve localized weather data', true)
            .addField('?play', 'Followed by a Youtube URL, will play video in voice channel user occupies', true)
            .addField('?search', 'Provide search arguments and retrieve first link result', true)
            .addField('?random', 'Generates a random integer 1-100', true)
            .addField('?ping', 'pong', true)
            .addField('?delete', 'Administrator command to delete 1-99 messages', true)
            .setTimestamp()
            .setFooter('Built using Discord.js', 'https://i.imgur.com/wSTFkRM.png');
   
        msg.channel.send(exampleEmbed);	

    },
}