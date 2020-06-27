const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (req, res, next) => {
  const passportConfig = {
    clientID:
      '109337351805-u9lmtvt87vvoikp2182a9tat8o0l2atr.apps.googleusercontent.com',
    clientSecret: 'eXoetPM1U7d4BuqNqYYZiz8U',
  };
  passport.use(
    new GoogleStrategy(
      passportConfig,
      (accessToken, refreshToken, profile, cb) => {
        console.log('GOOGLE', profile);
        req.user = profile;
        return cb(err, user);
      }
    )
  );
  return next();
};
