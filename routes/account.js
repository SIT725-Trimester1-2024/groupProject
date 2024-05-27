const express = require("express");
const User = require("../models/user");
const Order = require("../models/orders");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isValid = require("../middlewares/isValid");
const router = express.Router();

router.get("/user/:id", isLoggedIn, isValid, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("account/user", { user });
  } catch (err) {
    console.log(err);
    req.flash("error", "forbidden");
    res.status(401).render("error");
  }
});
router.patch("/user/:id", isLoggedIn, isValid, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, req.body.user);
    req.flash("success", "Successfully updated your profile");

    res.redirect(`/user/${id}`);
  } catch (e) {
    console.log(err);
    req.flash("error", "forbidden");
    res.status(401).render("error");
  }
});

//change password
router.get("/user/:id/password", isLoggedIn, isValid, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("account/changepassword", { user });

  } catch (e) {
    console.log(err);
    req.flash("error", "forbidden");
    res.status(401).render("error");
  }
});

router.patch("/user/:id/password", isLoggedIn, isValid, async (req, res) => {
  try {
   
    let email = "tienht.vn@gmail.com"
    let newPasswordString= "tien2";
    User.findByUsername(email).then(function(sanitizedUser){
      if (sanitizedUser){
          sanitizedUser.setPassword(newPasswordString, function(){
              sanitizedUser.save();
              res.status(200).json({message: 'password reset successful'});
          });
      } else {
          res.status(500).json({message: 'This user does not exist'});
      }
  },function(err){
      console.error(err);
  })
  } catch (e) {
    console.log(err);
    req.flash("error", "forbidden");
    res.status(401).render("error");
  }
});

router.get("/orders/:id", isLoggedIn, isValid, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).populate(
      "products"
    );
    res.render("account/order", { orders });
  } catch (err) {
    console.log(err);
    req.flash("error", "Unable to fetch your orders");
    res.status(500).render("error");
  }
});

module.exports = router;
