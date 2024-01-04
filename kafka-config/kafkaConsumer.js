const { kafkaClient } = require('./kafkaClient');

const kafkaConsumer = async (io) => {  // Accept io as an argument
  io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);
  });

  const consumer = kafkaClient.consumer({ groupId: 'rtls-services' });
  await consumer.connect();

  await consumer.subscribe({ topics: ['RTLS'], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const { coordinates, id } = JSON.parse(message.value.toString());
        console.log(`coordinates: ${JSON.stringify(coordinates)}, id: ${id}`);

        io.emit('live-location-update', { coordinates, id });
      } catch (error) {
        console.error(`Error parsing message: ${error.message}`);
      }
    },
  });
};

module.exports = { kafkaConsumer };
