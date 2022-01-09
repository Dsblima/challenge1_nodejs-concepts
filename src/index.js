const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({error: "There is not a user with this username!!"})
  }

  request.user = user;

  return next();
}

function getTodo(user, id) {
  const todo = user.todos.find( (todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({error: "This TODO does not exist!!"});
  }

  return todo;
}

app.use(express.json());
app.post('/users', (request, response) => {
  const {name, username} = request.body;

  const userAlreadyExists = users.some(
    (user) => user.username === username
  );

  if (userAlreadyExists) {
    return response.status(400).json({error: "The username already exists!!"});
  }

  const user = {
    id:uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user);
  
  return response.status(201).json({createdUser: user});
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;

  return response.send(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const {user} = request;
  
  const todo = {
    id:uuidv4(),
    title,
    done:false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).json({todo: todo});
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.query;

  const todo = getTodo(user, id);

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json({user: user});
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.query;

  const todo = getTodo(user, id);

  todo.done = true;

  return response.status(201).json({todo: todo});
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.query;

  const todoIndex = user.todos.findIndex( todo => todo.id === id);

  user.todos.splice(todoIndex, 1);

  return response.status(200).send(user.todos);
});

module.exports = app;