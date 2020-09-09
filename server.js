const express = require('express');
const Storage = require('./Storage');

const app = express();

const storage = Storage.createClient();

app.use(express.json());
app.get('/api/fetchAllToDos', function (req, res) {
  storage
    .getToDo()
    .then(({ title, tasks }) => res.send(JSON.stringify({ title, tasks })));
});

app.post('/api/addTask', function (req, res) {
  const { task } = req.body;
  storage.addTask(task).then((reply) => res.json({ successful: true }));
});

app.post('/api/deleteTask', function (req, res) {
  const { taskId } = req.body;
  storage.deleteTask(taskId).then((reply) => res.json({ successful: true }));
});

app.post('/api/toggleTaskStatus', function (req, res) {
  const { taskId } = req.body;
  storage.toggleStatus(taskId).then((reply) => res.json({ successful: true }));
});

app.post('/api/setTitle', function (req, res) {
  const { title } = req.body;
  storage.setTitle(title).then((reply) => res.json({ successful: true }));
});

app.post('/api/resetTodo', function (req, res) {
  storage.reset().then((reply) => res.json({ successful: true }));
});

app.listen(3030, () => console.log('listening to 3030'));
