const JWT = require("jsonwebtoken");
const { baseObjResponse } = require("../utils/BaseResponse");

const jwtService = {
  signAccessToken: async userId => {
    return new Promise((resolve, reject) => {
      const payload = { userId: userId };
      const secret = process.env.JWT_SECRET;

      const options = {
        expiresIn: "1h",
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  },

  verifyAccessToken: async (req, res, next) => {
    if (!req.headers["authorization"]) {
      next(baseObjResponse(false, "Authorization failed"));
    }

    const authHeader = req.headers["authorization"];

    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        next(baseObjResponse(false, "Authorization failed"));
      }
      req.payload = payload;
      next();
    });
  },

  signRefreshToken: async userId => {
    return new Promise((resolve, reject) => {
      const payload = { userId: userId };
      const secret = process.env.REFRESH_JWT_SECRET;

      const options = {
        expiresIn: "15d",
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  },

  verifyRefreshToken: async (refreshToken) => {
    return new Promise((resolve, reject) => { 
      JWT.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, payload) => {
        if (err) {
          reject(err);
        }
        resolve(payload);
      })
    })
  },
};

module.exports = jwtService;
