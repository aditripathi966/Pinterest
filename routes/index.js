var express = require("express");
var router = express.Router();
const localStrategy = require("passport-local");
const passport = require("passport");
const userModel = require("./users");
const postModel = require("./posts")
passport.use(new localStrategy(userModel.authenticate()));

const { sendmail } = require("../utils/mail");

const multer = require("../utils/multer");
const upload = require("../utils/multer");

// const { profilepanel, } = require("../controller/usercontroller");

router.get("/", function (req, res, next) {
  res.render("index",   {nav:false});
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error"), nav: false });
});

router.get("/add",isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user,});
  res.render("add", {user,nav:true});
});

router.get("/edituser/:id",isLoggedIn, async function (req, res, next) {
    try {
      const currentuser = await userModel.findOne({
        _id: req.params.id
      })
      res.render("edituser",{user:currentuser,user:req.user,nav:true})
    } catch (error) {
      res.send(error)
    }
});

router.post("/edit/:userid", isLoggedIn, async function (req, res, next) {
  try {
    var currentUser = await userModel.findByIdAndUpdate(
      req.params.userid,
      {
        username: req.body.username,
        fullname: req.body.fullname
      },
      { new: true }
    );

    // Redirect to the profile page
    res.redirect("/profile");
  } catch (error) {
    // Handle the error appropriately, maybe log it
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});




router.get("/feed",async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user,});
  const posts = await postModel.find()
  .populate("user")

  res.render("feed",{user,posts,nav:true})
});

router.post("/createpost",isLoggedIn,upload.single("postimage") ,async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user,});
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description:req.body.description,
    image: req.file.filename
  });
    user.posts.push(post._id)
    await user.save();
    res.redirect("/profile")
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  try {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    }).populate("posts")

    if (!user) {
      return res.status(404).send("User not found");
    }
    
    res.render("profile", { user, nav: true });
  } catch (error) {
    next(error);
  }
});
router.get("/show/posts", isLoggedIn, async function (req, res, next) {
  try {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    }).populate("posts")

    if (!user) {
      return res.status(404).send("User not found");
    }
    
    res.render("show", { user, nav: true });
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
    {nav:true}
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}


// other route 

router.get("/forgetpw", function (req, res) {
  res.render("forgetpw",  {nav:true}); // Assuming your EJS file is named "forgetpw.ejs"
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
  res.render("changepass",  {nav:true}, { id }); // Assuming your EJS file is named "changepw.ejs"
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


router.post("/fileupload", isLoggedIn,upload.single("image"), async function (req, res, next) {
 
 const user =await userModel.findOne({username: req.session.passport.user})
  user.profileImage = req.file.filename;
   await user.save();
   res.redirect("/profile");
});


module.exports = router;
