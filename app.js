const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { kafkaConsumer } = require('./kafka-config/kafkaConsumer');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Start Kafka Consumer
kafkaConsumer(io);  // Pass the io object as an argument

app.get('/', (req, res) => {
  res.status(200).json({
    msg: 'This is RLTS microservices',
  });
});

const PORT = process.env.PORT || 8082;

server.listen(PORT, () => {
  console.log(`RLTS server started at port: ${PORT}`);
});

// Expose io for kafkaConsumer
module.exports = {
  app,
  server,
  io,
};
