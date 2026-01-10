const { courseService } = require("../services");

// Get all courses
const getCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses();
    return res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

// Add a new course
const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.addNewCourse(req.body);

    return res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// Get Course Details
const getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await courseService.getCourseById(id);

    res.status(200).json(course);
  } catch (error) {
    console.error(error.message);

    res.status(404).json({
      msg: error.message || "Failed to fetch course",
    });
  }
};

// Enroll in a course
const enrollCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.user.id;

    await courseService.enrollInCourse(courseId, userId);

    res.status(200).json({
      msg: "Enrolled in course successfully",
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message || "Failed to enroll in course",
    });
  }
};

// Unenroll from a course
const unenrollCourse = async (req, res, next) => {
  try {
    await courseService.unenrollFromCourse(req.params.id, req.user.id);
    res.status(200).json({
      message: "Unenrolled from course and left all related study groups",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  createCourse,
  getCourseDetails,
  enrollCourse,
  unenrollCourse,
};
