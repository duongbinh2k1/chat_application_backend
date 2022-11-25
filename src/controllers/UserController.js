const User = require("../models/UserModel");
const jwtService = require("../helpers/jwtService");
const { baseObjResponse } = require("../utils/BaseResponse");

const userController = {
  register: async (req, res, next) => {
    try {
      const user = req.body;
      if (!user.email || !user.password || !user.username) {
        res.status(401).json(baseObjResponse(false, "Invalid username or email address or password"));
      }

      const isExits = await User.findOne({
        $or: [
          {
            email: user.email,
            username: user.username,
          },
        ],
      });

      if (isExits) {
        res.status(401).json(baseObjResponse(false, "Duplicate email address or username"));
      }

      const isCreate = await User.create({ email: user.email, password: user.password, username: user.username });

      return res.status(200).json(baseObjResponse(true, "Create new user success"));
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const userLogin = req.body;
      if (!userLogin.email || !userLogin.password) {
        res.status(401).json(baseObjResponse(false, "Invalid username or password"));
      }

      const user = await User.findOne({ email: userLogin.email });
      if (!user) {
        return res.status(401).json(baseObjResponse(false, "Invalid username or password"));
      }

      const isValid = await user.isCheckPassword(userLogin.password);

      if (!isValid) {
        return res.status(401).json(baseObjResponse(false, "Invalid username or password"));
      }

      const accessToken = await jwtService.signAccessToken(user.id);
      const refreshToken = await jwtService.signRefreshToken(user.id);

      const { password, ...others } = user._doc;

      return res.status(200).json(baseObjResponse(true, "Login Success", accessToken, refreshToken, { user: others }));
    } catch (err) {
      next(err);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(401).json(baseObjResponse(false, "Invalid refresh token, You need login"));
      }

      const { userId } = await jwtService.verifyRefreshToken(refreshToken);
      const accessToken = await jwtService.signAccessToken(userId);
      const newRefreshToken = await jwtService.signRefreshToken(userId);
      return res.status(200).json(baseObjResponse(true, "Refresh Token Success", accessToken, newRefreshToken));
    } catch (err) {
      next(err);
    }
  },

  logout: (req, res, next) => {
    return res.json({
      message: "Logout successfully completed",
    });
  },
};

module.exports = userController;
