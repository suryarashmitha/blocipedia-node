const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const User = require("../db/models").User;
const passport = require("passport");
const testKey = "sk_test_4ua3eKkZiWjKByUJiMtIHOaY";
const publishableKey = "pk_test_Ld2bXYZIQrOxZLKYpVSrc2SR";
const stripe = require('stripe')(testKey);

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
  },
  show(req, res, next){
    if(req.user === undefined){
      req.flash("notice", "Please login.");
      res.redirect("/");
    } else {
     res.render("users/show");
   }
 },
 upgradePage(req, res, next){
    userQueries.getUser(req.params.id, (err, user) => {
      if(err || user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/upgrade", {user});
      }
    });
  },
  upgrade(req, res, next){
     stripe.customers.create({
       email: req.body.stripeEmail,
       source: req.body.stripeToken
     })
       .then((customer) => {
         stripe.charges.create({
           amount: 1500,
           currency: "usd",
           customer: customer.id,
           description: "Premium membership"
         })
       })
       .then((charge) => {
         userQueries.upgradeUser(req.user.dataValues.id);
         res.redirect("/users/"+req.user.id);
       })
 },

 seeUpgradeSuccess(req, res, next){
   res.render('users/upgrade_success', {user});
  },
   downgradePage(req, res, next){
    userQueries.getUser(req.params.id, (err, user) => {
      if(err || user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/downgrade", {user});
      }
    });
  },
   downgrade(req, res, next){
    User.findOne({
      where: {id: req.params.id}
    })
    .then((user) => {
      if(user){
        userQueries.downgradeUser(req.params.id);
        wikiQueries.makePrivate(req.user.dataValues.id);
        req.flash("notice", "Downgrade successful!");
        res.redirect("/");
      } else {
          req.flash("notice", "Downgrade unsuccessful.");
          res.redirect("/users/show", {user});
      }
    })
  }

}
