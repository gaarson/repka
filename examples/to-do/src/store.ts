import { v4 as uuidv4 } from 'uuid';
import { callAble } from 'repka/repository';
import { repka } from 'repka';

export type taskType = callAble<{
  id: string,
  title: string,
  description: string
}>;

export const tasksRepo = repka<{
  tasks: taskType[],
}>({ 
  tasks: [] 
});

export const addTask = (event: any) => {
  event.preventDefault();
  const data = new FormData(event.target);

  tasksRepo.tasks = [
    repka({ 
      title: `${data.get('title')}`, 
      description: `${data.get('description')}`, 
      id: uuidv4() 
    }),
    ...tasksRepo.tasks,
  ];
};

export const removeTask = (id: string) => {
  tasksRepo.tasks = tasksRepo.tasks.filter((task) => task.id !== id);
};

