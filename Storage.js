const redis = require('redis');
const { defaultState, nextState } = require('./TaskStatus');

class Storage {
  constructor(redisClient) {
    this.client = redisClient;
    this.lastID = 1;
  }

  static createClient(options = {}) {
    const host = options.host || '127.0.0.1';
    const port = options.port || 6379;
    const db = options.db || 1;
    const client = redis.createClient({ db, port, host });
    const storage = new Storage(client);
    return storage;
  }

  reset() {
    return new Promise((resolve, reject) => {
      this.client.set('title', 'TODO', (err, reply) => {});
      this.client.del('tasks', (err, reply) => {});
      resolve('ok');
    });
  }

  getTitle() {
    return new Promise((resolve, reject) =>
      this.client.get('title', (err, reply) => resolve(reply))
    );
  }

  getTasks() {
    return new Promise((resolve, reject) =>
      this.client.lrange('tasks', 0, -1, (err, reply) => resolve(reply))
    );
  }

  async getToDo() {
    const title = await this.getTitle();
    const tasks = await this.getTasks();
    return { title, tasks };
  }

  addTask(task) {
    return new Promise((resolve, reject) =>
      this.client.rpush(
        'tasks',
        JSON.stringify({ task, state: defaultState(), id: ++this.lastID }),
        (err, reply) => resolve(reply)
      )
    );
  }

  async deleteTask(taskIndex) {
    const tasks = await this.getTasks();
    const task = tasks[taskIndex];
    this.client.lrem('tasks', 1, task, (err, reply) => {});
  }

  async toggleStatus(taskIndex) {
    const tasks = await this.getTasks();
    const { task, id, state } = JSON.parse(tasks[taskIndex]);
    this.client.lset(
      'tasks',
      taskIndex,
      JSON.stringify({ task, id, state: nextState(state) }),
      (err, reply) => {}
    );
  }

  setTitle(title) {
    return new Promise((resolve, reject) =>
      this.client.set('title', title, (err, reply) => {
        resolve(reply);
      })
    );
  }
}

module.exports = Storage;
