require('../middleware/passport');
const express = require('express');
const passport = require('passport');
const passportGoogle = passport.authenticate('googleToken', { session: false });
const jwt = require('jsonwebtoken');
const { sendAdminEmail } = require('../graphql/services/email');
const { EMAIL } = require('../helpers/constants');
const router = express.Router();

router.post('/google', passportGoogle, async (req, res) => {
  try {
    sendAdminEmail(req.user.email, EMAIL.WELCOME_SUBJECT, EMAIL.WELCOME_BODY);
    const token = await jwt.sign(
      { userId: req.user.id, email: req.user.email },
      'jwtsecretkey'
    );
    const result = {
      auth: { userId: req.user.id, token, tokenExp: 24 },
      user: req.user,
    };
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

// router.get('/linkedin', passport.authenticate('linkedin'));

// router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//   res.redirect('/loading');
// });

// router.get(
//   '/linkedin/callback',
//   passport.authenticate('linkedin', {
//     successRedirect: `${process.env.CLIENT_URI}/loading`,
//     failureRedirect: '/fail',
//   })
// );

module.exports = router;
