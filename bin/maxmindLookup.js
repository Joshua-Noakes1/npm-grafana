const clc = require("cli-color");
const path = require('path');
const Maxmind = require('maxmind');
const ipRegex = require('ip-regex');

async function maxmindLookup(IPAddress) {
    // check to see if the string passed includes an ipaddress
    if (ipRegex().test(IPAddress)) {
        // split the first ip address eg: [18/Oct/2021:01:18:03 +0100] - - 499 - GET [Client 000.001.002.003] [Length 0] [Gzip -] [Sent-to 004.005.006.007] > 000.001.002.003
        IPAddress = IPAddress.match(ipRegex())[0];
        console.log(clc.blue("[Info]"), `Peforming MaxMind lookup for "${IPAddress}"`);
        // load and resolve ip address with maxmind 
        const maxmind = await Maxmind.open(path.join(__dirname, '../', 'maxmind', 'GeoLite2-City.mmdb'));
        try {
            const maxmindLookup = maxmind.get(IPAddress);
            console.log(clc.green("[Success]"), `Found Country: "${maxmindLookup.country.names.en}"`);
            // format data and return it
            return {
                success: true,
                ISO: maxmindLookup.country.iso_code,
                country: maxmindLookup.country.names,
                city: maxmindLookup.subdivisions[0].names,
                lat: maxmindLookup.location.latitude,
                lon: maxmindLookup.location.longitude
            }
        } catch (error) {
            console.log(clc.yellow("[Warn]"), "Failed to find IP Address in MaxMind, skipping...");
            return {
                success: false,
                ISO: '00',
                country: 'Not Applicable',
                lat: 0,
                lon: 0
            }
        }

    } else {
        console.log(clc.yellow("[Warn]"), "Failed to find IP Address in string, skipping...");
        return {
            success: false,
            ISO: '00',
            country: 'Not Applicable',
            lat: 0,
            lon: 0
        }
    }
}

module.exports = {
    maxmindLookup
}