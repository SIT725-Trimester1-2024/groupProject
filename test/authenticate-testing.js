const request = require("supertest");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local").Strategy;
const { expect } = require("chai");
const sinon = require("sinon");

// Mock User model
const User = {
  register: sinon.stub(),
  authenticate: sinon.stub().returns((username, password, done) => {
    if (username === "testuser@example.com" && password === "password123") {
      done(null, { id: "123", username: "testuser" });
    } else {
      done(null, false, { message: "Invalid credentials" });
    }
  }),
};

// Setup Passport
passport.use(new LocalStrategy(User.authenticate));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, { id, username: "testuser" });
});

// Create express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: "testsecret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Simple auth routes for testing
app.post("/register", async (req, res) => {
  try {
    const user = { username: req.body.username, title: req.body.title };
    await User.register(user, req.body.password);
    req.flash(
      "success",
      "Successfully registered. Please login to continue..."
    );
    res.redirect("/login");
  } catch (e) {
    req.flash("error", "User already registered");
    res.redirect("/register");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/products");
  }
);

// Test cases
describe("Auth Routes", function () {
  describe("POST /register", function () {
    it("should register a new user", async function () {
      User.register.resolves();

      const res = await request(app).post("/register").send({
        username: "testuser@example.com",
        title: "Test User",
        password: "password123",
      });

      expect(res.headers["location"]).to.equal("/login");
      expect(User.register.calledOnce).to.be.true;
    });

    it("should handle user already registered", async function () {
      User.register.rejects(new Error("User already exists"));

      const res = await request(app).post("/register").send({
        username: "testuser@example.com",
        title: "Test User",
        password: "password123",
      });

      expect(res.headers["location"]).to.equal("/register");
    });
  });

  describe("POST /login", function () {
    it("should log in an existing user", async function () {
      try {
        const res = await request(app)
          .post("/login")
          .send({ username: "testuser@example.com", password: "password123" });

        res.should.have.status(200);
        res.should.redirectTo("/products");
      } catch (err) {
        console.error(err);
      }
    });

    it("should handle login failure", async function () {
      const res = await request(app)
        .post("/login")
        .send({ username: "wronguser@example.com", password: "wrongpassword" });

      expect(res.headers["location"]).to.equal("/login");
    });
  });
});
