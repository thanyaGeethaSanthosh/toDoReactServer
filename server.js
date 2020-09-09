const express = require('express');
const app = express();
let toDos = require('./todo.json');
let Title = 'TODO';
let currID = toDos.length;
const { nextState, defaultState } = require('./TaskStatus');

app.use(express.json());
app.get('/api/fetchAllToDos', function (req, res) {
  res.send(JSON.stringify({ title: Title, tasks: toDos }));
});

app.post('/api/addTask', function (req, res) {
  const { task } = req.body;
  currID += 1;
  toDos.push({ description: task, state: defaultState(), id: currID });
  //write to json file
  res.send(JSON.stringify({ title: Title, tasks: toDos }));
});

app.post('/api/deleteTask', function (req, res) {
  const { taskId } = req.body;
  toDos.splice(taskId, 1);
  //write to json file
  res.send(JSON.stringify({ title: Title, tasks: toDos }));
});

app.post('/api/toggleTaskStatus', function (req, res) {
  const { taskId } = req.body;
  toDos[taskId].state = nextState(toDos[taskId].state);
  //write to json file
  res.send(JSON.stringify({ title: Title, tasks: toDos }));
});

app.post('/api/setTitle', function (req, res) {
  const { title } = req.body;
  Title = title;
  //write to json file
  res.send(JSON.stringify({ title: Title, tasks: toDos }));
});

app.post('/api/resetTodo', function (req, res) {
  toDos = [];
  Title = 'TODO';
  //write to json file
  res.send(JSON.stringify({ title: Title, tasks: toDos }));
});

app.listen(3030, () => console.log('listening to 3030'));
