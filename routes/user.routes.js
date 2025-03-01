const express = require("express");
const {
    createUser,
    loginUser,
    createKyc,
    deleteUser

} = require("../controllers/user.controller");

const authorization = require("../middlewares/authorization");

const routes = express.Router();

routes.post("/user", createUser);
routes.post("/login", loginUser);
routes.post("/kyc", authorization, createKyc);
routes.delete("/user", deleteUser);


module.exports = routes;