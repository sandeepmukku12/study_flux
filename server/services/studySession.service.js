const { StudySession, StudyGroup } = require("../models");

// Create session
const addNewStudySession = async (userId, studySessionBody) => {
  const { group, date, topic } = studySessionBody;

  const groupData = await StudyGroup.findById(group);

  if (!groupData) {
    const error = new Error("Study group not found");
    error.statusCode = 404;
    throw error;
  }

  if (!groupData.members.includes(userId)) {
    const error = new Error(
      "You are not allowed to create sessions for this group"
    );
    error.statusCode = 403;
    throw error;
  }

  const session = new StudySession({
    group,
    date,
    topic,
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
    const error = new Error("You are not allowed to access the sessions of this group");
    error.statusCode = 403;
    throw error;
  }

  const sessions = await StudySession.find({
    group: groupId,
  }).sort("date");

  return sessions;
};

module.exports = {
  addNewStudySession,
  getSessionsByGroupByGroupId,
};
