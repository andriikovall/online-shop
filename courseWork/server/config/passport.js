require('dotenv').config();

const passport = require('passport');

const User = require('../models/user/user');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
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


const checkAdmin = (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else if (req.user.role !== 'admin') res.sendStatus(403);
  else next();
}

const checkAuth = passport.authenticate('jwt', { session: false });

const checkManager = (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  else if (req.user.role !== 'manager' && req.user.role !== 'admin') res.sendStatus(403);
  else next();
}

module.exports = { checkAdmin, checkAuth, checkManager };
