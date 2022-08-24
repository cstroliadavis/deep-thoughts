const { User, Thought } = require('../models');

exports.Query = {
  thought: async (parent, { _id }) => Thought.findOne({ _id }),
  thoughts: async (parent, { username }) => {
    const params = username ? { username } : {};

    return Thought.find(params).sort({ createdAt: -1 });
  },
  user: async (parent, { username }) => User
    .findOne({ username })
    .select('-__v -password')
    .populate('friends')
    .populate('thoughts'),
  users: async () => User
    .find()
    .select('-__v -password')
    .populate('friends')
    .populate('thoughts'),
};
