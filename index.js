require('dotenv-flow').config();
require('./middleware/passport');
const express = require('express');
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/isAuth');
const { google } = require('./graphql/resolvers');
const passport = require('passport');
const passportGoogle = passport.authenticate('google', { session: false });
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
app.use(isAuth);

// auth route
app.post('/auth/google', passportGoogle, google);

// graphql route
app.use(
  '/',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

// handle REST errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// connect server
app.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
