const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const path = require('path');

const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  context: authMiddleware,
  resolvers,
  typeDefs,
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${ PORT }`);
      console.log(`Use GraphQL at http://localhost:${ PORT }${ server.graphqlPath }`);
    });
  });
}

startApolloServer().then(() => console.log('Server stopped.'));
