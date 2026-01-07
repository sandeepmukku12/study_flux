const { StudySession } = require("../models");

// Create session
const addNewStudySession = async (studySessionBody) => {
  const { group, date, topic } = studySessionBody;
  const session = new StudySession({
    group,
    date,
    topic,
  });

  await session.save();

  return session;
};

// Get sessions by group
const getSessionsByGroupByGroupId = async (groupId) => {
  const sessions = await StudySession.find({
    group: groupId,
  });

  return sessions;
};

module.exports = {
  addNewStudySession,
  getSessionsByGroupByGroupId,
};
