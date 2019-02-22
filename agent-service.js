let allowInteractions = false;
let communcationService = null;
let agents = []; // Agents in play
const rendezvousMessages = [
    'The fox flies at midnight', 
    'It lands in virgin snow',
    'The eagle has landed',
    'Enemy at the tree line',
    'The horse is in the barn',
    'Cold for the time of year',
    'I saw a pink elephant last thursday',
    'The field mouse is fast but the owl sees at night',
    'The dog barks at midnight',
    'Time to feed the cat',
    'The rain comes from the west'
];

const self = this;

/**
 * Set the communication service to use for listening and sending messages
 */
exports.setCommunicationService = function(service) {
    communcationService = service;
}

/**
 * Set the boolean for allowing rendezvous interactions
 */
exports.setAllowInteractions = function(bool) {
    allowInteractions = bool;
}

/**
 * Get all agents in system
 */
exports.getAgents = function() {
    return agents;
}

/**
 * Trigger rendezvous interactions between agents
 */
exports.triggerInteractions = function() {
    agents.filter(a => a.stage === 4).map(a => {
        self.processAgentInteraction(a,'');
    });
}

/**
 * Create an instance of an 'agent'
 * @param {string} name 
 * @param {number} number 
 * @param {string} tell 
 */
exports.createAgent = function(name,number,tell) {
    let agent = {name,number,tell,stage:1,rendezvous:[]};
    console.log('Creating new agent:',agent);
    return agent;
}

/**
 * Find another agent than the one specified
 * @param {object} agent 
 */
exports.findAnotherAgent = function(agent) {
    let otherAgents = agents.filter(a => a.number != agent.number && a.rendezvous.indexOf(agent.number) === -1 && a.name != '' && a.tell != '');
    otherAgents.sort((a,b) => { 
        return a.rendezvous.length - b.rendezvous.length;
    });
    const otherAgent = otherAgents.length > 0 ? otherAgents[0] : false;
    console.log('Attempting to find another agent:',otherAgent);
    return otherAgent;
}

/**
 * Find another phrase than the one specified
 * @param {string} phrase 
 */
exports.findAnotherPhrase = function(phrase) {
    if(phrase == null) {
        const randomIndex = Math.floor(Math.random() * rendezvousMessages.length);
        return rendezvousMessages[randomIndex];
    }
    let otherRendezvousMessages = rendezvousMessages.filter(p => p != phrase);

    const randomIndex = Math.floor(Math.random() * otherRendezvousMessages.length);
    return otherRendezvousMessages[randomIndex];
}


/**
 * Create an agent instance if needed then process the interaction of the agent
 * @param {number} number 
 * @param {string} message 
 */
exports.processIncoming = function(number,message) {
    console.log('Processing incoming message:',number,message);
    let agent = agents.find(a => a.number == number);
    if(!agent) {
        agent = self.createAgent('',number,'');
        agents.push(agent);
    }
    self.processAgentInteraction(agent,message);
}

/**
 * Process the specific stage of the agent
 * @param {object} agent 
 * @param {string} message 
 */
exports.processAgentInteraction = function(agent,message) {
    console.log('Processing agent interaction:',agent,message);
    switch(agent.stage) {
        case 1: // Welcome the agent and request their name.
            console.log('Case 1');
            communcationService.send(agent.number,"Welcome agent, please state your agent name e.g. '007'");
            agent.stage++;
            break;
        case 2: // Recieve and record agent name and request their 'tell'.
            console.log('Case 2');
            agent.name = message;
            communcationService.send(agent.number,"Very well Agent "+agent.name+", please state something recognisable about your appearance today e.g. 'purple jumper, wearing glasses'.");
            agent.stage++;
            break;
        case 3: // Recieve and record agent tell.
            console.log('Case 3');
            agent.tell = message;
            communcationService.send(agent.number,"Recognised. Stay aware, and await further instruction.");
            agent.stage++;
            self.triggerInteractions();
            break;
        case 4: // If other agents exist in system, send each instructions on a rendezvous.
            console.log('Case 4');
            if(!allowInteractions) break;
            const otherAgent = self.findAnotherAgent(agent);
            if(!!otherAgent) {
                const phrase1 = self.findAnotherPhrase(null);
                const phrase2 = self.findAnotherPhrase(phrase1);
                // Person has to find this other person (both do at the same time) and they have an opening to talk to each other.
                communcationService.send(agent.number,"Rendezvous with "+otherAgent.name+". Recognised by "+otherAgent.tell+". Begin meeting with line '"+phrase1+"'. Expect '"+phrase2+"'. Good luck.");
                communcationService.send(otherAgent.number,"Rendezvous with "+agent.name+". Recognised by "+agent.tell+". Begin meeting with line '"+phrase2+"'. Expect '"+phrase1+"'. Good luck.");
                agent.rendezvous.push(otherAgent.number);
                otherAgent.rendezvous.push(agent.number);
            }
            break;
    }
}