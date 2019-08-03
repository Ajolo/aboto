module.exports = {
	name: 'random',
	description: 'Random num from 1-100!',
	execute(msg, args) {
        msg.channel.send(parseInt((Math.random() * 100) + 1))
	},
};