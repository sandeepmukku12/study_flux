const express = require("express");
const { studyGroupController } = require("../controllers");

const router = express.Router();

router.get("/", studyGroupController.getStudyGroups);

router.post("/", studyGroupController.createStudyGroup);

router.put("/:id/join", studyGroupController.joinGroup);

router.put("/:id/leave", studyGroupController.leaveGroup);

module.exports = router;