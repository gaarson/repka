import React from 'react';
import { Task } from './Task';
import { repka } from './store';

import { tasksRepo, addTask } from './store';


export const testRepo = repka<{
  tasks: string
}, { doSome(): void }>({ 
  tasks: 'PAPA'
}, {
  doSome() {
    console.log('OPUSHA', this.repo.actions.get());
  }
});

export const Tasks = () => {
  const [repo, methods] = tasksRepo();
  const [{ tasks }, testMethods] = testRepo();

  methods.doSome();
  testMethods.doSome();

  console.log(repo.tasks, tasks);

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
