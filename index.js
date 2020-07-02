require('dotenv-flow').config();
const express = require('express');
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/isAuth');
const { google } = require('./graphql/resolvers');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./middleware/passport');
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
// app.use(passport);
app.use(isAuth);

app.use(
  cookieSession({
    name: 'capazy-session',
    keys: ['key1', 'key2'],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.post('/test', (req, res) => {
  console.log('TEST', req.body);
  res.send(req.body);
});

// atuh routes
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
app.get('/auth/linkedin', passport.authenticate('linkedin'));

app.get('/fail', (req, res) => res.send('LOGIN FAIL'));
app.get('/good', (req, res) => res.send('LOGIN SUCCEEDED'));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/fail' }),
  google
);
app.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/good',
    failureRedirect: '/fail',
  })
);

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

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
