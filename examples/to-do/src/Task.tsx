import React from 'react';

import { taskType, removeTask } from './store';

interface ITask {
  task: taskType
}

export const Task = ({ task }: ITask) => {
  const [info] = task();

  return (
    <div>
      <button 
        onClick={() => removeTask(info.id)}
      >
        deleteTask
      </button>
      <h2>{info.title}</h2>
      <p>{info.description}</p>
      <input onChange={(e) => {
        task.title = e.target.value;
      }} />
    </div>
  );
};
