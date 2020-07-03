const passport = require('passport');
const GoogleStrategy = require('passport-google-plus-token');

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID:
        '259457812212-sj1ga4eqacoqubksrl53e6pjgan5pp9o.apps.googleusercontent.com', // vantty ID
      clientSecret: '4iNaE1fePXJr_qA5BwfvEnG3',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        return done(null, { profile });
      } catch (error) {
        console.log(error);
      }
    }
  )
);

// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: '78ru8oyls8x9ca',
//       clientSecret: 'YarbT520u0I3a2gY',
//       callbackURL: 'http://localhost:5000/auth/linkedin/callback',
//       scope: ['r_emailaddress', 'r_liteprofile'],
//       state: true,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       process.nextTick(function () {
//         console.log('PROFILE_LINKEDIN', profile);
//         return done(null, profile);
//       });
//     }
//   )
// );
