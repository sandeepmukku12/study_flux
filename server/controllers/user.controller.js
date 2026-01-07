const { userService } = require("../services");

// Get current user
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserProfileById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user name or password
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userBody = req.body;
    const user = await userService.updateUserProfileById(userId, userBody);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
