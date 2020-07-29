const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/user');
const { sendAdminEmail } = require('../graphql/services/email');
const { EMAIL } = require('../helpers/constants');

passport.use(
  'googleToken',
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
          methodId,
          firstName,
          lastName,
          email,
          profilePictureUrl,
        });
        sendAdminEmail(email, EMAIL.WELCOME_SUBJECT, EMAIL.WELCOME_BODY);
        await user.save();
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id).then((user) => {
//     done(null, user);
//   });
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:
//         '109337351805-u9lmtvt87vvoikp2182a9tat8o0l2atr.apps.googleusercontent.com',
//       clientSecret: 'eXoetPM1U7d4BuqNqYYZiz8U',
//       callbackURL: '/auth/google/callback',
//       proxy: true,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const {
//           id: methodId,
//           name: { givenName: firstName, familyName: lastName },
//           emails,
//           photos,
//         } = profile;
//         const email = emails[0].value;
//         const profilePictureUrl = photos[0].value;
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//           return done(null, existingUser);
//         }
//         const user = new User({
//           methodId,
//           firstName,
//           lastName,
//           email,
//           profilePictureUrl,
//         });
//         await user.save();
//         return done(null, user);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   )
// );

// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: '78ru8oyls8x9ca',
//       clientSecret: 'YarbT520u0I3a2gY',
//       callbackURL: `${process.env.APOLLO_API_URI}/auth/linkedin/callback`,
//       scope: ['r_emailaddress', 'r_liteprofile'],
//       state: true,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       process.nextTick(async () => {
//         try {
//           const {
//             id: methodId,
//             name: { givenName: firstName, familyName: lastName },
//             emails,
//             photos,
//           } = profile;
//           const email = emails[0].value;
//           const profilePictureUrl = photos[3].value;
//           const existingUser = await User.findOne({ email });
//           if (existingUser) {
//             return done(null, existingUser);
//           }
//           const user = new User({
//             methodId,
//             firstName,
//             lastName,
//             email,
//             profilePictureUrl,
//           });
//           await user.save();
//           return done(null, user);
//         } catch (error) {
//           console.log(error);
//         }
//       });
//     }
//   )
// );
