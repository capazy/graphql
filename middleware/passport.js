const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '109337351805-u9lmtvt87vvoikp2182a9tat8o0l2atr.apps.googleusercontent.com',
      clientSecret: 'eXoetPM1U7d4BuqNqYYZiz8U',
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log('MMIDLE', profile);
        return done(null, { profile });
      } catch (error) {
        console.log(error);
      }
    }
  )
);
