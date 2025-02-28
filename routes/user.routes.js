const express = require("express");
const {
    createUser,
    loginUser,
    createKyc,

} = require("../controllers/user.controller");

const authorization = require("../middlewares/authorization");

const routes = express.Router();

routes.post("/user", createUser);
routes.post("/login", loginUser);
routes.post("/kyc", authorization, createKyc);