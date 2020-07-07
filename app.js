require('dotenv-flow').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// graphql
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');

// auth
const passport = require('passport');
const cookieSession = require('cookie-session');
const isAuth = require('./middleware/isAuth');
const app = express();

// connect database
connectDB();

// port
app.set('PORT', process.env.PORT || 5000);

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
app.use(morgan('dev'));
app.use(helmet());
app.use(
  cookieSession({
    name: 'capazy-session',
    keys: ['key1', 'key2'],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// auth routes
app.use('/auth', authRoutes);

// user routes
app.use('/api', userRoutes);

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

module.exports = app;
