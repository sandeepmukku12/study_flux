const express = require("express");
const { courseController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, courseController.getCourses);

router.post("/", authMiddleware, courseController.createCourse);

router.get("/:id", authMiddleware, courseController.getCourseDetails);

router.put("/:id/enroll", authMiddleware, courseController.enrollCourse);

router.put("/:id/unenroll", authMiddleware, courseController.unenrollCourse);

module.exports = router;
