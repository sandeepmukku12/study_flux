const bcrypt = require("bcryptjs");
const { User } = require("../models");

const createUser = async (userBody) => {
  const { name, email, password } = userBody;

  if (!name || !email || !password) {
    const error = new Error("All fields required");
    error.statusCode = 400;
    throw error;
  }

  let user = await User.findOne({ email });
  if (user) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = new User({ name, email, password: hashedPassword });
  await user.save();

  return user;
};

// Get current user
const getUserProfileById = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// Update user name or password
const updateUserProfileById = async (userId, userBody) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (userBody.name) {
    user.name = userBody.name;
  }

  if (userBody.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(userBody.password, salt);
  }

  await user.save();

  return user;
};

module.exports = {
  createUser,
  getUserProfileById,
  updateUserProfileById,
};
