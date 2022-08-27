const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User, Thought } = require('../models');

const requiresLogin = (cb) => {
  return (...args) => {
    const [ , , { user } ] = args;
    if (user) {
      return cb(...args);
    }
    throw new AuthenticationError('Not logged in');
  }
}

exports.Query = {
  me: requiresLogin
  (
    (parent, args, context) => User.findOne({ _id: context.user._id })
      .select('-__v -password')
      .populate('thoughts')
      .populate('friends')
  ),

  thought: async (parent, { _id }) => Thought.findOne({ _id }),

  thoughts: async (parent, { username }) => {
    const params = username ? { username }:{};

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

exports.Mutation = {
  addFriend: requiresLogin
  (
    (parent, { friendId }, context) => User.findOneAndUpdate(
      { _id: context.user._id },
      { $addToSet: { friends: friendId } },
      { new: true }
    ).populate('friends')
  ),

  addReaction: requiresLogin
  (
    async (parent, { thoughtId, reactionBody }, context) => await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $push: { reactions: { reactionBody, username: context.user.username } } },
      { new: true, runValidators: true }
    )
  ),

  addThought: requiresLogin
  (
    async (parent, args, context) => {
      const thought = await Thought.create({ ...args, username: context.user.username });

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      return thought;
    }),

  addUser: async (parent, args) => {
    const user = await User.create(args);
    const token = signToken(user);

    return { token, user };
  },

  login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError('Incorrect credentials');
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      throw new AuthenticationError('Incorrect credentials');
    }

    const token = signToken(user);
    return { token, user };
  },
};
