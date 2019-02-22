const conferenceService = require('./conference-service.js');
const agentService = require('./agent-service.js');
const nexmoService = require('./nexmo-service.js');

agentService.setCommunicationService(nexmoService);

// Obtain times of socials then set up the app.
conferenceService.getSocialTimes().then(socials => {
    const now = new Date();
    socials.map(s => {
        const millisTillSocialStart = new Date(s.start) - now;
        const millisTillSocialEnd = new Date(s.end) - now;
        if(millisTillSocialStart > 0) {
            setTimeout(() => { // TODO add an interaction every 10 minutes.
                console.log('Triggering interactions for start of social.');
                agentService.setAllowInteractions(true);
                agentService.triggerInteractions();
                setTimeout(() => {
                    console.log('Acknowledging end of social.');
                    agentService.setAllowInteractions(false);
                },millisTillSocialEnd);
            }, millisTillSocialStart);
        }
    });
    nexmoService.listen(agentService.processIncoming);
    
    // Force allowing interactions for demo
    agentService.setAllowInteractions(true);
});