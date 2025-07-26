const Profile = require('../models/profile.models');

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
  const profiles = await Profile.find({});
  res.json(profiles);
};

exports.health = (req, res) => res.status(200).send('Data service healthy');
