const express = require("express");
const todoListRoutes = express.Router();
const fs = require("fs");
/* const { v4: uuidv4 } = require("uuid"); */

const dataPath = "./db/db.json";

const saveListData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(dataPath, stringifyData);
};
const getListData = () => {
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
};

// get all lists
todoListRoutes.get("/todolist/list", (req, res) => {
  const lists = getListData();
  res.send(lists);
});

// add new list
todoListRoutes.post("/todolist/addlist", (req, res) => {
  var existingLists = getListData();

  if (req.body.id) {
    existingLists[req.body.id] = req.body;

    saveListData(existingLists);
    res.send({ success: true, msg: "list added successfully" });
  } else {
    res.send({ success: false, msg: "id is missing" });
  }
});

// delete list
todoListRoutes.delete("/todolist/list/:listid", (req, res) => {
  var existingLists = getListData();
  const listId = req.params["listid"];

  delete existingLists[listId];

  console.log(existingLists);
  saveListData(existingLists);
  res.send({ success: true, msg: "list removed successfully" });
});

// update list
todoListRoutes.put("/todolist/list/:listid", (req, res) => {
  var existingLists = getListData();

  const listId = req.params.listid;
  existingLists[listId] = req.body;
  saveListData(existingLists);
  res.send(`list with id ${listId} has been updated`);
});

// update todos of each list
todoListRoutes.put("/todolist/list/:listid/todo/update", (req, res) => {
  var existingLists = getListData();
  const listId = req.params.listid;

  let itemsToUpdate = req.body;

  console.log(req.body);

  existingLists[listId].todos = itemsToUpdate;

  saveListData(existingLists);
  res.send({ success: true, msg: "items updated successfully" });
});

module.exports = todoListRoutes;
