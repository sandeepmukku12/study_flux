const express = require("express");
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const courseRoutes = require("./course.route");
const studyGroupRoutes = require("./studyGroup.route");
const studySessionRoutes = require("./studySession.route");

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/courses", courseRoutes);

router.use("/study-groups", studyGroupRoutes);

router.use("/study-sessions", studySessionRoutes);

module.exports = router;
