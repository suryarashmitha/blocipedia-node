const userQueries = require("../db/queries.users.js");
const passport = require("passport");
//const sgMail = require("@sendgrid/mail");

 module.exports = {
   signUp(req, res, next) {
 		res.render('users/sign_up', {title: "SignUp"});
 	},
  create(req, res, next) {
    //console.log(req.body);
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
     userQueries.createUser(newUser, (err, user) => {
      if(err) {
        //console.log(err);
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up! Check your email for confirmation.");
          res.redirect("/");
        });
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/sign_in", {title: "SignIn"});
  },

  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  }

}
