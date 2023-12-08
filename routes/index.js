var express = require("express");
var router = express.Router();
const localStrategy = require("passport-local");
const passport = require("passport");
const userModel = require("./users");
passport.use(new localStrategy(userModel.authenticate()));

// const { profilepanel, } = require("../controller/usercontroller");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  try {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("profile", { user });
  } catch (error) {
    next(error);
  }
});

router.post("/register", function (req, res, next) {
  const { username, email, fullname, password } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, password, function (err) {
    if (err) {
      console.error("Error while registering:", err);
      return next(err);
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
"/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
