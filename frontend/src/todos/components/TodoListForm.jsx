import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@material-ui/styles";
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Checkbox from "@material-ui/core/Checkbox";
import { debounce } from "lodash";

const useStyles = makeStyles({
  card: {
    margin: "1rem",
  },
  todoLine: {
    display: "flex",
    alignItems: "center",
  },
  textField: {
    flexGrow: 1,
  },
  strikeThrough: {
    flexGrow: 1,
    textDecoration: "line-through",
  },
  standardSpace: {
    margin: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
});

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const classes = useStyles();
  const [todos, setTodos] = useState(todoList.todos);

  const handleSubmit = (event) => {
    event.preventDefault();
    saveTodoList(todoList.id, { todos });
    handleUpdateAllItems(todoList.id, todos);
  };

  const delayedHandleChange = debounce(
    (listId, todos) => handleUpdateAllItems(listId, todos),
    1000
  );

  const handleUpdateAllItems = (listId, todos) => {
    fetch("http://localhost:3001/todolist/list/" + listId + "/todo/update", {
      method: "PUT",
      body: JSON.stringify(todos),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Something went wrong.");
      })
      .then(function (text) {
        console.log("Request successful", text);
      })
      .catch(function (error) {
        console.log("Request failed", error);
      });
  };

  useEffect(() => {
    delayedHandleChange(todoList.id, todos);
  }, [todos, todoList, delayedHandleChange]);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography component="h2">{todoList.title}</Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          {todos.map((item, index) => (
            <div key={index} className={classes.todoLine}>
              <Checkbox
                className={classes.standardSpace}
                checked={item.done}
                onChange={() => {
                  setTodos(
                    todos.map((el, i) => {
                      if (i === index) {
                        el.done = !el.done;
                      }
                      return el;
                    })
                  );
                }}
                color="primary"
              />
              <Typography className={classes.standardSpace} variant="h6">
                {index + 1}
              </Typography>
              <TextField
                label="What to do?"
                value={item.todo}
                onChange={(event) => {
                  setTodos(
                    todos.map((el, i) => {
                      console.log(item);
                      if (i === index) {
                        el.todo = event.target.value;
                      }
                      return el;
                    })
                  );
                }}
                className={
                  item.done ? classes.strikeThrough : classes.textField
                }
              />
              <Button
                size="small"
                color="secondary"
                className={classes.standardSpace}
                onClick={() => {
                  setTodos([
                    // immutable delete
                    ...todos.slice(0, index),
                    ...todos.slice(index + 1),
                  ]);
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type="button"
              color="primary"
              onClick={() => {
                setTodos([
                  ...todos,
                  {
                    id: uuidv4(),
                    todo: "",
                    done: false,
                  },
                ]);
              }}
            >
              Add Todo <AddIcon />
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  );
};
