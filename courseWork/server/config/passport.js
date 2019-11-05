const passport = require('passport');

const User = require('../models/user/user');

const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'probabluSmthSecretDownHere'
}

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.getById(jwt_payload._id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}
));
