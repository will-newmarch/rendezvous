const request = require('request');
/**
 * Obtain the start and end times of the conference socials
 */
exports.getSocialTimes = function() {
    console.log('Obtaining times of socials...');
    return new Promise(function(resolve,reject) {
        request('http://api.joind.in/v2.1/events/7001/talks', function (error, response, body) {
            const data = JSON.parse(body);
            let socialEvents = data.talks.reduce((a,t) => {
                if(t.type === 'Social Event') a.push(t);
                return a;
            },[]);
            const socials = socialEvents.map(e => {
                const start = new Date(e.start_date);
                const end = new Date(start.getTime() + e.duration*60000);
                return {start,end};
            });
            console.log('Socials found:',socials);
            resolve(socials);
        });
    });
}