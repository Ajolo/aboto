module.exports = {
    name: 'search',
    description: 'Search web and return first link based on input',
    execute(msg, args) {
        // imports
        const https = require('https')

        if (args.length == 0) {
            msg.channel.send("Specify search arguments -- ie. ?search how to git gud")
            return
        }

        // init request string
        // https://app.zenserp.com/api/v2/search?q=Pied%20Piper&hl=en&gl=US&location=United%20States&search_engine=google.com',
        var convertedArgs = encodeURI(args)  // .replace(" ", "%20")
        console.log("CONVERTED: " + convertedArgs)
        var reqString = {
            host : 'app.zenserp.com',
            port : 443,
            headers: {'apikey': process.env.SEARCH_TOKEN},
            path : '/api/v2/search?q=' + convertedArgs + 
                '&hl=en&gl=US&location=United%20States&search_engine=google.com',
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

                // loop to 'find' first url
                tryIndex = 1
                finalOutput = jsonOutput.organic[tryIndex].url
                while (finalOutput == undefined) {
                    tryIndex += 1
                    finalOutput = jsonOutput.organic[tryIndex].url
                }
                
                console.log(finalOutput)
                msg.channel.send(finalOutput)        
            })
        })

        reqGet.end();
      
        reqGet.on('error', function(e) {
            console.error(e);
        })
    },
}