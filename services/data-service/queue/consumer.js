const amqp = require('amqplib');
const Profile = require('../models/profile.models');

module.exports = async function consumeUserCreated() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq');
    const channel = await connection.createChannel();
    const queue = 'user.created';

    await channel.assertQueue(queue, { durable: false });
    console.log(`Listening to ${queue} queue`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const user = JSON.parse(msg.content.toString());
        console.log('Received:', user);

        await Profile.updateOne(
          { userId: user.userId },
          { email: user.email, userId: user.userId },
          { upsert: true }
        );

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('rabbitMQ connection error:', err.message);
  }
};
