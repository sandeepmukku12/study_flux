const { Course } = require("../models");


//Get all courses
const getAllCourses = async () => {
    const courses = await Course.find();
    return courses;
};

// Add a new course
const addNewCourse = async (courseBody) => {
    const { name, code, description } = courseBody;
    
    if (!name || !code) {
        throw new Error("Name and code fields are required");
    }

    const course = new Course({
        name,
        code,
        description,
    });

    await course.save();

    return course;
};

module.exports = {
    getAllCourses,
    addNewCourse,
};