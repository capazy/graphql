const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const jwt = require('jsonwebtoken');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '109337351805-u9lmtvt87vvoikp2182a9tat8o0l2atr.apps.googleusercontent.com',
      clientSecret: 'eXoetPM1U7d4BuqNqYYZiz8U',
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const {
          id: methodId,
          name: { givenName: firstName, familyName: lastName },
          emails,
          photos,
        } = profile;
        const email = emails[0].value;
        const profilePictureUrl = photos[0].value;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = new User({
          firstName,
          lastName,
          email,
          profilePictureUrl,
        });
        await user.save();
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);
