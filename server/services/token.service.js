const jwt = require("jsonwebtoken");

const generateToken = (userId, secretKey) => {
  if (!secretKey) {
    const error = new Error("JWT secret missing");
    error.statusCode = 500;
    throw error;
  }

  return jwt.sign({ id: userId }, secretKey, { expiresIn: "1h" });
};

module.exports = {
  generateToken,
};
