const express = require("express");
const conn = require("./conn");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MySQLStore = require("express-mysql-session")(session);
const Passport = require("./passport");

// Create an app
const app = express();
const port = process.env.PORT || 2000;

// Connect to the database
conn.connect((err) => {
  if (err) { console.log(err) }
  else { console.log("DATABASE CONNECTED") }
});

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

// Cross-Origin Resource Sharing
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.set("trust proxy", 1);

// Express session
app.use(session({
  secret: "keyboard cat",
  store: new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data"
      }
    }
  }, conn),
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: false
  }
}));

// For parsing session information in browser cookie
app.use(cookieParser("keyboard cat"));

// Passport authentication
app.use(Passport.initialize());
app.use(Passport.session());

// Application routes
app.use("/api", require("./api"));

app.set("trust proxy", 1);

app.use(express.static("public"));
app.use(express.static("client/build"));
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// Start the app
app.listen(port, () => { console.log("SERVER STARTED") });
