const fs = require("fs");
const chokidar = require('chokidar');
const ipRegex = require('ip-regex');
const readLastLines = require('read-last-lines');
const path = require("path");
const clc = require("cli-color");
const {
    downloadMaxmind
} = require('./bin/downloadMaxmind');
const {
    maxmindLookup
} = require('./bin/maxmindLookup');
const {
    saveInflux
} = require('./bin/saveInflux');

(async () => {
    // checking for maxmind
    if (!fs.existsSync(path.join(__dirname, 'maxmind', 'GeoLite2-City.mmdb'))) {
        console.log(clc.red.bold("[Error]"), 'Missing MaxMind GeoLite2 data, Attempting download...');
        await downloadMaxmind();
        console.log(clc.green("[Success]"), 'Downloaded MaxMind GeoLite2 data');
    }

    // watch logs folder for anychanges
    console.log(clc.blue("[Info]"), `Watching "${path.join(__dirname, 'logs')}" for updates`);
    chokidar.watch(path.join(__dirname, 'logs')).on('all', (event, path) => {
        // theres the chance an may be missed on startup but this should stop wrong data in influx
        if (event == 'change') {
            // read last line in file
            readLastLines.read(path, 1).then(async (ipAddress) => {
                // check to see if theres an ip address
                if (ipRegex().test(ipAddress)) {
                    console.log(clc.blue("[Info]"), `New file update detected (${event} - "${path}") `);
                    // lookup lat lon for client ip address
                    const maxMind = await maxmindLookup(ipAddress.match(ipRegex())[0]);
                    // if maxmind succss try and write data to InfluxDB
                    if (maxMind.success) {
                        try {
                            await saveInflux([{
                                measurement: 'ReverseProxyConnections',
                                tags: {
                                    "ISO": maxMind.ISO,
                                    "latitude": maxMind.lat,
                                    "longitude": maxMind.lon,
                                    "domain": ipAddress.match(/([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/)[0], // https://stackoverflow.com/a/26093588
                                    "country": maxMind.country.en,
                                    "IP": ipAddress.match(ipRegex())[0]
                                },
                                fields: {
                                    "ISO": maxMind.ISO,
                                    "latitude": maxMind.lat,
                                    "longitude": maxMind.lon,
                                    "domain": ipAddress.match(/([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/)[0], // https://stackoverflow.com/a/26093588
                                    "country": maxMind.country.en,
                                    "IP": ipAddress.match(ipRegex())[0]
                                }
                            }], {
                                database: 'npm'
                            });
                        } catch (error) {
                            return console.log(clc.red.bold("[Error]"), "Failed to write to InfluxDB", error);
                        }
                    }
                }
            });
        }
    });
})();