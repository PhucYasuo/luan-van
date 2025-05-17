const session = require('express-session');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 tiếng
});

module.exports = sessionMiddleware;
