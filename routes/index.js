var express = require("express");
var router = express.Router();
const localStrategy = require("passport-local");
const passport = require("passport");
const userModel = require("./users");
passport.use(new localStrategy(userModel.authenticate()));

const { sendmail } = require("../utils/mail");

const multer = require("../utils/multer");

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


// other route 

router.get("/forgetpw", function (req, res) {
  res.render("forgetpw"); // Assuming your EJS file is named "forgetpw.ejs"
});

// Forget Password Route - POST
router.post("/forgetpw", multer.none(), async function (req, res, next) {
  try {
      const user = await userModel.findOne({ email: req.body.email });

      if (!user) {
          // Handle case when user with the provided email is not found
          return res.send("User not found");
      }

      // Assuming "sendmail" is a function that sends a password reset link
      sendmail(req, res, user);
  } catch (error) {
      next(error);
  }
});

// Change Password Route - GET
router.get("/changepass/:id", function (req, res) {
  const id = req.params.id;
  res.render("changepass", { id }); // Assuming your EJS file is named "changepw.ejs"
});

// Change Password Route - POST
router.post("/changepass/:id", multer.none(), async function (req, res, next) {
  try {
    const user = await userModel.findById(req.params.id);

    if (user.passwordResetToken === 1) {
      await user.setPassword(req.body.password);
      user.passwordResetToken = 0;
      await user.save();
      res.redirect("/login");
    } else {
      res.send(`Link expired. Please try again <a href="/forgetpw">Forget Password</a>`);
    }

  } catch (error) {
    // Handle the error appropriately, maybe log it
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
