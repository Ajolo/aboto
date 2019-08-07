module.exports = {
	name: 'play',
	description: 'Play song from specified yt url!',
	execute(msg, args) {
        // imports
        const ytdl = require('ytdl-core')

        if (args.length == 0) {
            msg.channel.send("Specify a name to search -- ie. ?play despacito")
            return
        }
        else {
            playSong(args[0])
        }

        async function playSong(msgUrl) {
            const voiceChannel = msg.member.voiceChannel
        
            // verify user in voice channel
            if (!voiceChannel) { 
                msg.channel.send("Join a voice channel to request playback")
                return
            }
        
            const songInfo = await ytdl.getInfo(msgUrl)
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
                        voiceChannel.leave()
        
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
    },
};
