require('dotenv').config();
const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

module.exports = {

  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: user.email,
        from: 'welcometeam@blocipedia.com',
        subject: 'Blocipedia account confirmation',
        html: '<div><h4>Welcome to Blocipedia!</h4><p>Your account has been successfully created.</p></div>',
      };
      sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getUser(id, callback){
         let result = {};
         User.findById(id)
         .then((user) => {
             if(!user) {
                 callback(404);
             } else {
                 result["user"] = user;

                 Wiki.scope({ method: ["userWikis", id]}).all()
                 .then((wikis) => {
                     result['wikis'] = wikis;
                     callback(null, result);
                 });
             }
             });
         },
         upgradeUser(id, callback){
             return User.findById(id)
             .then((user) => {
                 if(!user) {
                     return callback(404);
                 } else {
                     return user.updateAttributes({role: 'premium' });
                 }
             })
             .catch((err) => {
                 callback(err);
             })
         },

         downgradeUser(id, callback){
             return User.findById(id)
             .then((user) => {
                 if(!user){
                     return callback(404);
                 } else {
                     return user.updateAttributes({role: "standard"});
                 }
             })
             .catch((err) => {
                 callback(err);
             })
         }

 }
