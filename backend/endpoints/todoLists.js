const express = require("express")
const todoListRoutes = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dataPath = './db/db.json' 


const saveListData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}
const getListData = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)   
}


todoListRoutes.post('/todolist/addlist', (req, res) => {
 
    var existingLists = getListData()
    const newListId = uuidv4()
 
    existingLists[newListId] = req.body
    existingLists[newListId].id = newListId
   
    console.log(existingLists);
    saveListData(existingLists);
    res.send({success: true, msg: 'list added successfully'})
})

todoListRoutes.post('/todolist/list/:listid/addtodo', (req, res) => {
 
    var existingLists = getListData()
    const listId = req.params['listid'];
  
    const newtodoId = uuidv4()

    let itemToAdd = req.body

    itemToAdd.id = newtodoId
 
    existingLists[listId].todos.push(itemToAdd)

    console.log(existingLists);
    saveListData(existingLists);
    res.send({success: true, msg: 'item added successfully'})
})

todoListRoutes.delete('/todolist/list/:listid/todo/:todoid/delete', (req, res) => {
 
    var existingLists = getListData()
    const listId = req.params['listid'];
    const todoId = req.params['todoid'];
  
   
    existingLists[listId].todos = existingLists[listId].todos.filter(item => item.id != todoId)

    console.log(existingLists);
    saveListData(existingLists);
    res.send({success: true, msg: 'item removed successfully'})
})

todoListRoutes.put('/todolist/list/:listid/todo/:todoid/update', (req, res) => {
 
    var existingLists = getListData()
    const listId = req.params['listid'];
    const todoId = req.params['todoid'];
  
    let itemToUpdate = req.body

    itemToUpdate.id = todoId;

    let objIndex = existingLists[listId].todos.findIndex((item => item.id === todoId));

    existingLists[listId].todos[objIndex] = itemToUpdate
    
    console.log(existingLists);
    saveListData(existingLists);
    res.send({success: true, msg: 'item updated successfully'})
})

todoListRoutes.get('/todolist/list', (req, res) => {
    const lists = getListData()
    res.send(lists)
})

todoListRoutes.get('/todolist/list/:id', (req, res) => {
    var existingLists = getListData()
    const listId = req.params['id'];

    console.log(existingLists[listId])
    res.send( existingLists[listId] )
})

todoListRoutes.get('/todolist/list/:listid/todo/:todoid', (req, res) => {
    var existingLists = getListData()
    const listId = req.params['listid'];
    const todoId = req.params['todoid'];
  
    console.log(existingLists[listId])
    res.send( existingLists[listId].todos.find(e => e.id === todoId) )
})


todoListRoutes.put('/account/:id', (req, res) => {
    var existingLists = getListData()
    fs.readFile(dataPath, 'utf8', () => {
      const listId = req.params['id'];
      existingLists[listId] = req.body;
      saveListData(existingLists);
      res.send(`list with id ${listId} has been updated`)
    }, true);
});

todoListRoutes.delete('/account/delete/:id', (req, res) => {
    fs.readFile(dataPath, 'utf8', () => {
    var existingLists = getListData()
    const listId = req.params['id'];
      delete existingLists[listId] 
      saveListData(existingLists);
      res.send(`list with id ${listId} has been deleted`)
    }, true);
})

module.exports = todoListRoutes