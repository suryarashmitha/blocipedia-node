const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");


router.get("/users/sign_up", userController.signUp);
router.post("/users", validation.validateUsers, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id", userController.show);
router.get('/users/account', userController.show);
router.get("/users/:id/upgrade", userController.upgradePage);
router.post("/users/:id/upgrade", userController.upgrade);
router.get("/users/upgrade-success", userController.seeUpgradeSuccess);
router.get("/users/:id/downgrade", userController.downgradePage);
router.post("/users/:id/downgrade", userController.downgrade);

module.exports = router;
