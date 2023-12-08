// var express = require("express");
// var router = express.Router();
// const localStrategy = require("passport-local");
// const passport = require("passport");
// const userModel = require("../routes/users");
// passport.use(new localStrategy(userModel.authenticate()));


// profilepanel = async function (req, res, next) {
//   try {
//     const user = await userModel.findOne({
//       username: req.session.passport.user,
//     });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     res.render("profile", { user });
//   } catch (error) {
//     next(error);
//   }
// };

// const RegisterPanel = async (req, res, next) => {
//     try {
//       const { username, email, fullname, password } = req.body;
  
//       const newUser = new userModel({ username, email, fullname });

//       userModel.register(newUser, password, (err) => {
//         if (err) {
//           console.error("Error while registering:", err);
//           return next(err);
//         }
  
//         passport.authenticate("local")(req, res, () => {
//           res.redirect("/profile");
//         });
//       });
//     } catch (error) {

//       console.error("Error during registration:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   };

  

// module.exports = { profilepanel};
