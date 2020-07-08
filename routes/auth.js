require('../middleware/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/loading');
});

router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: 'http://localhost:3000/loading',
    failureRedirect: '/fail',
  })
);

module.exports = router;
