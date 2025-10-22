import { repka, watch } from 'repka';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const state = repka<{
  foo: number, 
  bar: string, 
  puk: string, 
  obj: {
    puk: {
      bar: {
        foo: string,
        num: number
      }
    }
  },
  toDo: () => void,
  toDoWithObj: () => void
}>({
  foo: 0,
  bar: 'str',
  puk: 'poo',
  obj: {
    puk: { 
      bar: {foo: 'foo_string', num: 123} 
    }
  },
  toDo() {
    this.foo = this.foo + 1;
  }, 
  toDoWithObj() {
    this.obj = {puk: {bar: { 
      foo: this.obj.puk.bar.foo === 'foo_string' ? 'foo_string_new' : 'foo_string',  
      num: this.obj.puk.bar.num === 321 ? 123 : 321
    }}};
  } 
});

state.toDo()

const Button = (
  { onClick }: { onClick: () => void }
) => {
  return (
    <button onClick={onClick}>
      count is {state.foo}
    </button>
  )
}

const watchFor = async () => {
  console.log('UPDATED VALUE', await watch(state, 'foo'));
  watchFor();
}

watchFor();

function App() {
  const { puk } = state;

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button onClick={() => {
          console.log('BUTTON CLICK');
          state.toDo() 
        }} />

        <button onClick={() => state.puk = 'POO'}>
          change puk {state.bar}
        </button>

        <button onClick={() => state.bar = 'change'}>
          another count is {state.bar}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        {puk}
      </p>

      <div className="card">
        <button onClick={() => state.toDoWithObj()}>
          SWITCH OBJECT
        </button>

        <p>
          STATE OF INCLUDED STRING {state.obj.puk.bar.foo}
        </p>
        <p>
          STATE OF INCLUDED NUM {state.obj.puk.bar.num}
        </p>
      </div>
    </>
  )
}

export default App
