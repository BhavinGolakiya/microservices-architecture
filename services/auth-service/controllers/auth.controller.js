const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const Profile = require('../models/profile.models')
const metrics = require('../utils/metrics')
const amqp = require('amqplib')

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password })
  await user.save();
  await publishUser({ userId: user._id, email })
  res.json({ message: 'User created' })
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email, password })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
  metrics.incrementLogin()
  res.json({ token })
};

exports.createProfile = async (req, res) => {
  const { name, age } = req.body;
  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.userId },
    { name, age, email: req.user.email, userId: req.user.userId },
    { upsert: true, new: true }
  );
  res.json(profile);
};

exports.getProfiles = async (req, res) => {
  const profiles = await Profile.find({})
  res.json(profiles)
}

exports.health = (req, res) => res.send('OK')
exports.metrics = (req, res) => res.json({ logins: metrics.getLoginCount() })


async function publishUser(user) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq')
  const channel = await connection.createChannel()
  const queue = 'user.created'

  await channel.assertQueue(queue, { durable: false })
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)))
}

