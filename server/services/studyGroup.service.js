const { StudyGroup } = require("../models");

// Get all study groups
const getAllStudyGroups = async (filters) => {
  const query = {};

  /* Full-text search */
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  /* Filters */
  // Only add filters if provided
  if (filters.course) {
    query.course = filters.course;
  }

  if (filters.language) {
    query.language = { $regex: new RegExp(filters.language, "i") }; // case-insensitive match
  }

  if (filters.skillLevel) {
    query.skillLevel = filters.skillLevel;
  }

  let mongooseQuery = StudyGroup.find(query)
    .populate("course", "name code")
    .populate("members", "name email");

  // Apply text score ONLY if search exists
  if (filters.search) {
    mongooseQuery = mongooseQuery
      .select({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } });
  }

  const groups = await mongooseQuery;

  return groups;
};

// Create study group
const addNewStudyGroup = async (userId, studyGroupBody) => {
  const { name, description, course, language, skillLevel } = studyGroupBody;

  const group = new StudyGroup({
    name,
    description,
    course,
    language,
    skillLevel,
    members: [userId],
  });

  await group.save();

  return group;
};

// Join group
const joinGroupById = async (userId, groupId) => {
  const group = await StudyGroup.findById(groupId);

  if (!group) {
    const error = new Error("Study group not found");
    error.statusCode = 404;
    throw error;
  }

  if (group.members.includes(userId)) {
    const error = new Error("Already a member of this group");
    error.statusCode = 400;
    throw error;
  }

  group.members.push(userId);
  await group.save();

  return group;
};

// Leave group
const leaveGroupById = async (userId, groupId) => {
  const group = await StudyGroup.findById(groupId);

  if (!group) {
    const error = new Error("Study group not found");
    error.statusCode = 404;
    throw error;
  }

  if (!group.members.includes(userId)) {
    const error = new Error("You are not a member of this group");
    error.statusCode = 400;
    throw error;
  }

  group.members = group.members.filter((m) => m.toString() !== userId);

  await group.save();

  return group;
};

module.exports = {
  getAllStudyGroups,
  addNewStudyGroup,
  joinGroupById,
  leaveGroupById,
};
