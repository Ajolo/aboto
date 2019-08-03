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

        async function bulkDelete(numDelete) {
            if (isNaN(numDelete)) {
                msg.channel.send("Specify number of messages to delete -- ie. ?delete 5")
                return
            }
    
            msg.delete() // delete msg containing delete command
            
            // grab x amount of messages, limit specified by user
            const fetched = await msg.channel.fetchMessages({limit: numDelete})
            console.log("!!! fetched.size is: " + fetched.size)
    
            msg.channel.bulkDelete(fetched)
                .catch(error => console.log(error))
        }
        
        bulkDelete(args[0])
    },
};