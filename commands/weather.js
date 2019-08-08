module.exports = {
	name: 'weather',
	description: 'Get weather desc based on ZIP code!',
	execute(msg, args) {
        // imports
        // const tools = require('../tools.js')
        const https = require('https')

        // weather map containing emoji for known descriptors 
        var weatherMap = {}
        weatherMap['Clear'] = '☀️'
        weatherMap['Rain'] = '🌧'
        weatherMap['Clouds'] = '⛅'
        weatherMap['Haze'] = weatherMap['Clouds']
        weatherMap['Snow'] = '❄️'
        weatherMap['Drizzle'] = '💧'
        weatherMap['Thunderstorm'] = '⚡'

        if (args.length == 0) {
            msg.channel.send("Specify ZIP code -- ie. ?weather 98119")
            return
        }
        
        // init request string
        var reqString = {
            host : 'api.openweathermap.org',
            port : 443,
            path : '/data/2.5/weather?zip='+ args[0] 
                + ',us&units=imperial&appid=' + process.env.WEATHER_TOKEN/*tools.weatherToken*/,
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
        })	},
};