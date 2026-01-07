const express = require("express");
const { userController } = require("../controllers");

const router = express.Router();

router.get("/me", userController.getProfile);

router.put("/me", userController.updateProfile);

module.exports = router;
