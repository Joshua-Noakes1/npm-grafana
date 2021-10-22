const maxmind = require('maxmind');

maxmind.open('./GeoLite2-City.mmdb').then((lookup) => {
    console.log(lookup.get('81.109.157.236'));
});