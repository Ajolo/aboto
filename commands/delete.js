module.exports = {
	name: 'delete',
    description: 'Delete x number of most recent messages from channel!',
	execute(msg, args) {
        async function checkRole() {
            /* if (msg.member.roles.find("name", "creator")) {
                return true
            } */
            if (!msg.member.hasPermission('ADMINISTRATOR')) {
                msg.reply('No Perms!')
                return false
            }
            return true
        }

        if (!checkRole()) return

        async function deleteMessages(numDelete) {
            if (isNaN(numDelete)) {
                msg.channel.send("Specify number of messages to delete -- ie. ?delete 5")
                return
            }
            // validate number range (1 - 99)
            if (!(numDelete >= 1 && numDelete <= 99)) {
                msg.channel.send("Delete range must be between 1 and 99")
                return
            }
            
            // add one to numDelete to delete original delete message
            numDeleteInt = (parseInt(numDelete) + 1)

            // use bulkDelete for requests of size 2 - 100
            console.log("deleting " + numDeleteInt + " messages")
            msg.channel.bulkDelete(numDeleteInt).then(() => {
                msg.channel.send("Deleted messages.").then(message => message.delete(3000));
            });
        }
        
        deleteMessages(args[0])
    },
};