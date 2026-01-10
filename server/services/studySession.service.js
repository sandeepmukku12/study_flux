const { StudySession, StudyGroup } = require("../models");

// Create session
const addNewStudySession = async (userId, studySessionBody) => {
  const { groupId, date, topic, startTime, duration } = studySessionBody;

  const groupData = await StudyGroup.findById(groupId)
    .populate("course", "name code")
    .populate("members", "_id");

  if (!groupData) {
    const error = new Error("Study group not found");
    error.statusCode = 404;
    throw error;
  }

  if (!groupData.members.some(m => m._id.toString() === userId)) {
    const error = new Error(
      "You are not allowed to create sessions for this group"
    );
    error.statusCode = 403;
    throw error;
  }

  const session = new StudySession({
    group: groupId,
    date,
    topic,
    startTime,
    duration,
    createdBy: userId,
  });

  await session.save();

  return session;
};

// Get sessions by group
const getSessionsByGroupByGroupId = async (userId, groupId) => {
  const group = await StudyGroup.findById(groupId);

  if (!group) {
    const error = new Error("Study group not found");
    error.statusCode = 404;
    throw error;
  }

  if (!group.members.includes(userId)) {
    const error = new Error(
      "You are not allowed to access the sessions of this group"
    );
    error.statusCode = 403;
    throw error;
  }

  const sessions = await StudySession.find({
    group: groupId,
  }).sort("date");

  return sessions;
};

// Delete session
const removeStudySessionById = async (userId, sessionId) => {
  const session = await StudySession.findById(sessionId);

  if (!session) {
    const error = new Error("Study session not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if group exists and if user is a member to allow deletion
  const group = await StudyGroup.findById(session.group);
  
  if (!group || !group.members.includes(userId)) {
    const error = new Error(
      "You do not have permission to delete this session"
    );
    error.statusCode = 403;
    throw error;
  }

  await StudySession.findByIdAndDelete(sessionId);
  return true;
};

module.exports = {
  addNewStudySession,
  getSessionsByGroupByGroupId,
  removeStudySessionById,
};