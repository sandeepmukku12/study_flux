const { userService, tokenService, authService } = require("../services");
const secretKey = process.env.JWT_SECRET;

// Signup
const signup = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    const token = tokenService.generateToken(user._id, secretKey);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser(email, password);

    const token = tokenService.generateToken(user._id, secretKey);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};
