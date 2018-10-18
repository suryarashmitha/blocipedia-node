'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard"
    }
  }, {});
  User.associate = function(models) {
   User.hasMany(models.Wiki, {
     foreignKey: "userId",
     as: "wikis"
   })
 };
 User.prototype.hasPremium = function() {
   return this.role === "premium";
 };
 User.prototype.isAdmin = function() {
   return this.role === "admin";
 };
 return User;
};
