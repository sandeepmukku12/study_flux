const express = require("express");
const { studySessionController } = require("../controllers");

const router = express.Router();

router.post("/", studySessionController.createSession);

router.get("/:groupId", studySessionController.getSessionsByGroup);

module.exports = router;
