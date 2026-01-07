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

module.exports = {
  getCourses,
  createCourse,
};
