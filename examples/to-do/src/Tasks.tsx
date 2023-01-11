import React from 'react';
import { Task } from './Task';

import { tasksRepo, addTask } from './store';

export const Tasks = () => {
  const [repo, methods] = tasksRepo();

  methods.doSome();

  return (
    <section> 
      <form onSubmit={addTask}>
        <input type="text" placeholder="title" name="title" />
        <input type="text" placeholder="description" name="description" />
        <input type="submit" value="Add Task" />
      </form>

      {repo.tasks.map((task) => {
        return <Task key={task.id} task={task} />
      })}
    </section>
  );
}
