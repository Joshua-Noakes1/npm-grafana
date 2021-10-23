const clc = require("cli-color");
const path = require('path');
const geolite2 = require('geolite2-redist');

async function downloadMaxmind() {
    console.log(clc.blue("[Info]"), 'Downloading MaxMind GeoLite2 data');
    await geolite2.downloadDbs(path.join(__dirname, '../', 'maxmind'));
}

module.exports = {downloadMaxmind}