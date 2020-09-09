const TODO = 'todo';
const DOING = 'doing';
const DONE = 'done';

const Status = {
  [TODO]: DOING,
  [DOING]: DONE,
  [DONE]: TODO,
};

const nextState = (currState) => Status[currState];

const defaultState = () => TODO;

module.exports = { nextState, defaultState };
