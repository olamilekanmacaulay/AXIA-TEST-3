const express = require("express");
const {
  createPost
 
} = require("../controllers/post.controller");
const authorization = require("../middlewares/authorization");
const routes = express.Router();

routes.post("/post", authorization, createPost);

module.exports = routes;