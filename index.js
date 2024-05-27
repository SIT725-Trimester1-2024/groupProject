const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user");
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const accountRoutes = require("./routes/account");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require('./routes/payment');
const dashRoutes = require('./routes/dashboard');
const socket = require('socket.io');


dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

mongoose.connect(process.env.MONGODB_URI);

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      //check if user already exists in our db with the given profile ID
      User.findOne({
        $or: [
          {
            username: profile._json.email,
          },
          {
            googleId: profile.id,
          },
        ],
      }).then((currentUser) => {
        if (currentUser) {
          //if we already have a record with the given profile ID
          done(null, currentUser);
        } else {
          //if not, create a new user
          new User({
            googleId: profile.id,
            username: profile._json.email,
            title: profile.displayName,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use(authRoutes);
app.use(productsRoutes);
app.use(accountRoutes);
app.use(cartRoutes);
app.use(paymentRoutes);
app.use(dashRoutes);

app.get("/", (req, res) => {
  res.redirect("/products");
});
app.all("*", (req, res) => {
  res.render("404");
});

//init socket.io
const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000.");
});
const io = socket(server);


// seed DB
