const { userService } = require("../services");

// Get current user
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserProfileById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error.message || "Server error",
    });
  }
};

// Update user name or password
const updateProfile = async (req, res) => {
    try {
         const userId = req.user.id;
         const userBody = req.body;
         const user = await userService.updateUserProfileById(userId, userBody);

         if (!user) {
            throw new Error("User not found");
         }

         return res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
         });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: error.message || "Server error",
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};