const { courseService } = require("../services");

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    return res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Add a new course
const createCourse = async (req, res) => {
  try {
    const course = await courseService.addNewCourse(req.body);

    return res.status(201).json(course);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getCourses,
  createCourse,
};
