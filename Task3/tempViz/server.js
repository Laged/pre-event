const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const port = process.env.PORT || 1337;
const app = express()
.use(express.static(__dirname + '/public'))
.use(bodyParser.urlencoded({extended:true}))
.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html' )
})
.get('/data', (req, res) => {
  const reqID = req.query.id;
  const reqValue = req.query.value;
  const reqLabeL = req.query.label;
  if (reqID && reqValue) {
    const data = {
      id: reqID,
      value: reqValue,
      timeStamp: moment().locale('fi').format('HH:mm'),
      label: reqLabeL
    }
    clients.forEach(client => client.send(JSON.stringify(data)));
    res.sendStatus(200);
    res.end();
  } else {
    res.sendStatus(400);
    res.end();
  }
})
.listen(port, () => console.log('Running on ' + port));


const clients = [];
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({server: app});

wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('close', (code, message) => {
    const idx = clients.indexOf(ws);
    if (idx >= 0) clients.splice(idx, 1);
  });
});
