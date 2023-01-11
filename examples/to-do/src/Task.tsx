import React from 'react';

import { taskType, removeTask } from './store';

interface ITask {
  task: taskType
}

export const Task = ({ task }: ITask) => ( 
  <div>
    <button 
      onClick={() => removeTask(task.id)}
    >
      deleteTask
    </button>
    <h2>{task('title')}</h2>
    <p>{task('description')}</p>
    <input onChange={(e) => {
      task.title = e.target.value;
    }} />
  </div>
);
