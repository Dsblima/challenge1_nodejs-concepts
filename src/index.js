const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

app.use(express.json());
app.post('/users', (request, response) => {
  const {name, username} = request.body;

  const userALreadyExists = users.some(
    (user) => user.username === username
  );

  if (userALreadyExists) {
    return response.status(400).json({error: "The username already exists!!"});
  }

  const user = {
    id:uuidv4(),
    name,
    username,
    todos:[]
  };

  users.push(user);
  
  return response.status(201).json({createdUser: user});
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;