require("dotenv").config();
const clc = require("cli-color");
const Influx = require('influx');
const influxDB = new Influx.InfluxDB(`http://${process.env.INFLUX_USERNAME}:${process.env.INFLUX_PASSWORD}@${process.env.INFLUX_SERVER}:${process.env.INFLUX_PORT}/npm`);

async function saveInflux(data) {
    // check to see if npm database exists
    try {
        await influxDB.getDatabaseNames().then(async (dbs) => {
            if (!dbs.includes('npm')) {
                console.log(clc.blue("[Info]"), "Creating \"npm\" database");
                try {
                    return await influxDB.createDatabase('npm');
                } catch (error) {
                    return console.log(clc.red.bold("[Error]"), "Failed to create \"npm\" database");
                }
            }
        })
    } catch (error) {
        return console.log(clc.yellow("[Warn]"), "Failed to get databases");
    }

    // try and write to influx
    try {
        influxDB.writePoints(data);
        return console.log(clc.green("[Success]"), `Written "${data[0].tags.IP}" to InfluxDB`);
    } catch (error) {
        console.log(clc.red.bold("[Error]"), "Failed to write to database", error);
    }
}

module.exports = {
    saveInflux
}