const express = require("express");
const userController = require("../controllers/UserController");
const jwtService = require("../helpers/jwtService");

const route = express.Router();

route.post("/register", userController.register);
route.post("/login", userController.login);
route.post("/refresh-token", userController.refreshToken);
route.post("/logout", userController.logout);

module.exports = route;
