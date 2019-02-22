const Nexmo = require('nexmo');
const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let debugMode = false;

const nexmo = new Nexmo({
    apiKey: 'API_KEY',
    apiSecret: 'API_SECRET'
}); // Nexmo instance

exports.setDebugMode = function(bool) {
    debugMode = bool;
}

/**
 * Send a message to a phone number
 * @param {number} number 
 * @param {string} message 
 */
exports.send = function(number,message) {
    const from = PHONE_NUMBER;
    const to = number;
    const text = message;
    if(debugMode) {
        console.log('Send message:',to,from,text);
        return;
    }
    nexmo.message.sendSms(from, to, text);
}

/**
 * Listen for new messages
 * @param {function} callback 
 */
exports.listen = function(callback) {
    function handleInboundSms(request, response) {
        const params = Object.assign(request.query, request.body);
        const agentNumber = params.msisdn;
        const agentMessage = params.text;
        callback(agentNumber,agentMessage);
        response.status(204).send();
    }
    app.route('/webhooks/inbound-sms').post(handleInboundSms);
    app.listen(3000);
}