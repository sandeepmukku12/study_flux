const { Course, User, StudyGroup } = require("../models");
const mongoose = require("mongoose");

//Get all courses
const getAllCourses = async () => {
  const courses = await Course.find();
  return courses;
};

// Add a new course
const addNewCourse = async (courseBody) => {
  const { name, code, description } = courseBody;

  if (!name || !code) {
    const error = new Error("Name and code fields are required");
    error.statusCode = 400;
    throw error;
  }

  const course = new Course({
    name,
    code,
    description,
  });

  await course.save();

  return course;
};

// Get Course Details
const getCourseById = async (courseId) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new Error("Invalid course id");
  }

  const course = await Course.findById(courseId).lean();
  if (!course) {
    throw new Error("Course not found");
  }

  // Find enrolled users
  const enrolledUsers = await User.find(
    { enrolledCourses: courseId },
    { name: 1, email: 1 }
  ).lean();

  return {
    ...course,
    enrolledUsers,
  };
};

// Enroll in a course
const enrollInCourse = async (courseId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findById(courseId).session(session);
    if (!course) {
      throw new Error("Course not found");
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found");
    }

    // Prevent duplicate enrollment
    if (user.enrolledCourses.includes(courseId)) {
      throw new Error("Already enrolled in this course");
    }

    user.enrolledCourses.push(courseId);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return course;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Unenroll from a course
const unenrollFromCourse = async (courseId, userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  // Remove course from user
  user.enrolledCourses = user.enrolledCourses.filter(
    (c) => c.toString() !== courseId
  );
  await user.save();

  // Remove user from all study groups of this course
  await StudyGroup.updateMany(
    { course: courseId },
    { $pull: { members: userId } }
  );

  return true;
};

module.exports = {
  getAllCourses,
  addNewCourse,
  getCourseById,
  enrollInCourse,
  unenrollFromCourse,
};
