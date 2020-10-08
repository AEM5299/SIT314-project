const match = require('mqtt-match');

/*
 * Just a utility class to provide an abstraction layer for filtering mqtt topics
 * Probably needs a better name
 *
*/
class MqttLayer {
    constructor(client, topics) {
        this.client = client;
        this.topics = topics;
    }

    baseListerenr(topic, message) {
        this.topics.forEach(el => {
            if(match(el.pattern, topic)) {
                el.callback({topic, message});
            }
        })
    }

    startListening() {
        this.client.on('message', this.baseListerenr.bind(this));
    }
}

module.exports = MqttLayer