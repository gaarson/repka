import { repka } from 'repka';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const state = repka<{foo: number}, {toDo: () => void}>({foo: 0}, { toDo()  {
  if (this.repo) {
    this.repo.actions.set('foo', this.repo.actions.get('foo') + 1)
  }
} });

const Button = (
  { repo, onClick }: { repo: any, onClick: () => void }
) => {
  // console.log(repo)
  return (
    <button onClick={onClick}>
      count is {repo.foo}
    </button>
  )
}

function App() {
  const [data, methods] = state();
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
        <Button repo={data} onClick={methods.toDo} />
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
