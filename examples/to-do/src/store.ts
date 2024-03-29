import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createRepository } from 'repka/create';
import { callAble } from 'repka/repository';
// import { repka } from 'repka';

let useSync = null;
let isNewReact = false;

const useGetKey = () => {
  let keyRef = React.useRef(parseInt(String((Math.random() * 10000000)), 10).toString());
  if (React.version.split('.')[0] === '18') {
    return React.useId();
  }
  return keyRef.current;
}

if (React.version.split('.')[0] === '18') {
  useSync = React.useSyncExternalStore;
  isNewReact = true;
}

export function reactProvider<T, M>(parameter?: keyof T): React.ReactNode {
  const key = useGetKey();

  const state = useSync(notify => {
    if (this.__criticalFields[key]) {
      this.__criticalFields[key].forEach(prop => {
        if (
          this.__listeners[prop] &&
          typeof this.__listeners[prop] !== 'function'
        ) this.__listeners[prop].set(key, notify);
      });
    }

    return isNewReact ? () => {
      if (this.__criticalFields[key]) {
        this.muppet[key] = false;
        this.__criticalFields[key].forEach(prop => {
          if (this.__listeners[prop]) this.__listeners[prop].delete(key);
        });
      }
    } : () => undefined;
  }, () => {
    this.muppet['__PROVIDER_ID__'] = key;
    
    if (this.muppet[key] === true) {
      delete this.muppet['__PROVIDER_ID__'];
      if (!isNewReact) this.muppet[key] = false;
      return isNewReact ? this.muppet.__init__ : { ...this.muppet };
    }

    return this.muppet;
  });

  React.useEffect(() => {
    return () => {
      if (this.muppet[key] && this.__criticalFields[key]) {
        if (!isNewReact) {
          this.__criticalFields[key.current].forEach(prop => {
            if (this.__listeners[prop]) {
              this.__listeners[prop].delete(key.current);
            }
          });
        }

        delete this.__criticalFields[key];
        delete this.muppet[key];
      }
    };
  }, []);

  if (parameter !== undefined) {
    return state[parameter];
  }

  return [state, this.__methods];
}

const repka = createRepository(reactProvider);

export type taskType = callAble<{
  id: string,
  title: string,
  description: string
}, undefined, React.ReactNode>;

export const tasksRepo = repka<{
  tasks: taskType[],
}, { doSome(): void }>({ 
  tasks: [] 
}, {
  doSome() {
    console.log('OPU', this.repo.actions.get());
  }
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

