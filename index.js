require('dotenv-flow').config();
const express = require('express');
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/isAuth');
const passport = require('./middleware/passport');
const { connectDB } = require('./db');
const app = express();

// connect database
connectDB();

// cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// middlewares
app.use(express.json({ extended: false }));
app.use(passport);
app.use(isAuth);

// graphql route
app.use(
  '/',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

// connect server
app.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
