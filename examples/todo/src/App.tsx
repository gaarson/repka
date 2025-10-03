import { repka, watch } from 'repka';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const state = repka<{foo: number, bar: string, toDo: () => void}>({
  foo: 0,
  bar: 'str',
  toDo() {
    this.foo = this.foo + 1;
  } 
});

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
        <Button onClick={() => state.toDo()} />

        <button onClick={() => state.bar = 'change'}>
          another count is {state.bar}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
