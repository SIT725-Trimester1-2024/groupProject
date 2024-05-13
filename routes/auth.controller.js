const express = require("express");
const router = express.Router();
const userServices = require("../services/user.services");
const Role = require("../helpers/role");
const jwt = require("../helpers/jwt");


router.get("/login", (req, res, next) => { res.render("login"); });
router.post("/login", authenticate);

router.get("/register", (req, res, next) => { res.render("register"); });
router.post("/register", register);

router.get("/logout", (req, res, next) => { res.render("logout"); });



function authenticate(req, res, next) {
  userServices
    .authenticate(req.body)
    .then((user) => {
      console.log(user);
      user
        ? res.json({ user: user, message: "User logged in successfully" })
        : res
          .status(400)
          .json({ message: "Username or password is incorrect." });
    })
    .catch((error) => next(error));
}


function register(req, res, next) {
  userServices
    .create(req.body)
    .then((user) =>
      res.json({
        user: user,
        message: `User Registered successfully with email ${req.body.email}`,
      })
    )
    .catch((error) => next(error));
    res.redirect("/auth/login");
    next();
}

module.exports = router;