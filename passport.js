const Passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const conn = require("./conn");

Passport.use(new LocalStrategy({
  usernameField: "username",
  passwordField: "password"
}, async (username, password, done) => {
  conn.query("CALL get_user(?)", [username], (err, rows) => {
    if (err) { console.log(err); }
    else if (!rows) { return done(null, false); }
    else {
      try {
        if (bcrypt.compareSync(password, rows[0][0].password)) {
          console.log("pwd match");
          return done(null, rows[0][0]);
        } else return done(null, false);
      } catch {
        return done(null, false);
      }
    }
  });
}));

Passport.serializeUser((user, done) => done(null, user.username));

Passport.deserializeUser((username, done) => {
  conn.query("CALL get_user(?)", [username], (err, rows) => {
    if (err) return done(err, false);
    else if (rows) return done(null, rows[0][0]);
    else return done(null, false);
  });
});

module.exports = Passport;
