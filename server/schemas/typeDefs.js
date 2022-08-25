const { gql } = require('apollo-server-express');

module.exports = gql`
  # Types

  type Auth {
    token: ID!
    user: User
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  # Mutations and Queries

  type Mutation {
    addFriend(friendId: ID!): User
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addThought(thoughtText: String!): Thought
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
  }

  type Query {
    me: User
    thought(_id: ID!): Thought
    thoughts(username: String): [Thought]
    user(username: String!): User
    users: [User]
  }
`;
