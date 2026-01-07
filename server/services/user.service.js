const bcrypt = require("bcryptjs");
const { User } = require("../models");

const createUser = async (userBody) => {
  // console.log("REQ BODY:", userBody);

  const { name, email, password } = userBody;

  if (!name || !email || !password) {
    throw new Error("All fields required");
  }

  let user = await User.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = new User({ name, email, password: hashedPassword });
  await user.save();

  return user;
};

// Get current user
const getUserProfileById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  
  return user;
};

// Update user name or password
const updateUserProfileById = async (userId, userBody) => {
  const user = await User.findById(userId);

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
