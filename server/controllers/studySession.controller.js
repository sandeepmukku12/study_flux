const { studySessionService } = require("../services");


// Create session
const createSession = async (req, res) => {
    try {
        const session = await studySessionService.addNewStudySession(req.body);

        return res.status(201).json(session);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

// Get sessions by group
const getSessionsByGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const sessions = await studySessionService.getSessionsByGroupByGroupId(groupId);

        return res.status(200).json(sessions);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
};


module.exports = {
    createSession,
    getSessionsByGroup,
};