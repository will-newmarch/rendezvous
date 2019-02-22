const agentService = require('./agent-service.js');
const nexmoService = require('./nexmo-service.js');

nexmoService.setDebugMode(true);
agentService.setCommunicationService(nexmoService);

// Force allowing interactions for demo
agentService.setAllowInteractions(true);

/**
 * A quick integration test.
 */
console.log('Running Test.');
const testNumber1 = 0123456789;
const testNumber2 = 01234567810;
agentService.processIncoming(testNumber1,'hi');
agentService.processIncoming(testNumber1,'Willington');
agentService.processIncoming(testNumber2,'hello');
agentService.processIncoming(testNumber1,'Tall, Pink Floyd t-shirt');
agentService.processIncoming(testNumber2,'Arranton');
agentService.processIncoming(testNumber2,'Black top');