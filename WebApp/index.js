const mongoose = require('mongoose');
const express = require('express');
const Light = require("./models/Light");
const path = require('path');
const mqtt = require('mqtt');
const MqttLayer = require('./mqttLayer');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header('Access-Control-Allow-Credentials', 'true')
    next();
});

const port = 3000;

mongoose.connect(
    "mongodb+srv://abood:jzPPHhrMLOQelSWo@cluster0.cfgen.mongodb.net/lights?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

app.post("/api/light", (req, res) => {
    if (!req.body.nickname || !req.body.room) return res.status(422).send('incomplete data');

    const light = new Light({
        nickname: req.body.nickname,
        room: req.body.room,
    });

    light
    .save()
    .then((doc) => {
      res.send(doc);
      client.publish(`aafifi-sit314-project/${doc._id}/connect`, '');
    });
});

app.get("/api/light", (req, res) => {
    Light.find({}, (err, docs) => {
        res.send(docs);
    });
});

// cts means: Client To Server
io.on('connection', (socket) => {
    socket.on('cts change light status', ({ light_id, status }) => {
        client.publish(`aafifi-sit314-project/${light_id}/change_status`, JSON.stringify({ status }));
        Light.findOne({ _id: light_id }, (err, doc) => {
            doc.status = status;
            doc.save();
        });
    });
    socket.on('cts change light color', ({ light_id, color }) => {
        client.publish(`aafifi-sit314-project/${light_id}/change_color`, JSON.stringify({ color }));
        Light.updateOne({ _id: light_id }, { $set: { color: color } });
    });
    socket.on('cts delete light', ({ light_id }) => {
        client.publish(`aafifi-sit314-project/${light_id}/disconnect`, '');
        Light.deleteOne({ _id: light_id }, (err) => {
            if (err) console.error(err);
        })
    });
});

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const changeStatus = ({topic, message}) => {
    const light_id = topic.split('/')[1];
    io.emit('stc light change status', { light_id, status: JSON.parse(message.toString()).status });
}

const changeColor = ({topic, message}) => {
    const light_id = topic.split('/')[1];
    io.emit('stc light change color', { light_id, color: JSON.parse(message.toString()).color });
}

const disconnectLight = ({topic}) => {
    const light_id = topic.split('/')[1];
    io.emit('stc light delete', { light_id });
}

const connectLight = ({topic}) => {
    const light_id = topic.split('/')[1];
    Light.findOne({ _id: light_id }, (err, doc) => {
        io.emit('stc light connect', doc);
    });
}

const mqttLayer = new MqttLayer(client, [
    { pattern: 'aafifi-sit314-project/+/connect', callback: connectLight },
    { pattern: 'aafifi-sit314-project/+/change_status', callback: changeStatus },
    { pattern: 'aafifi-sit314-project/+/disconnect', callback: disconnectLight },
    { pattern: 'aafifi-sit314-project/+/change_color', callback: changeColor },
]);

client.on('connect', () =>
{
    client.subscribe('aafifi-sit314-project/#');
    mqttLayer.startListening();
});

http.listen(port, () => {
    console.log(`listening on port ${port}`);
});