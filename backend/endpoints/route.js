const express = require("express");
const route = express.Router();
const todoListRoutes = require("./todoLists.js");
route.use(todoListRoutes); // use account route

module.exports = route;
