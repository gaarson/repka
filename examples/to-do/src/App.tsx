import React from 'react';
import logo from './logo.svg';

import { repka } from 'repka';
import { Tasks } from './Tasks';

import './App.css';

const testRepo = repka<{ field: string }>({ field: '' });
;

function App() {
  const [repo] = testRepo();

  return (
    <div className="App">
      <header className="App-header">
        <Tasks />
        <img src={logo} className="App-logo" alt="logo" />
        {repo.field}
        <input onChange={(e) => {
          testRepo.field = e.target.value;
        }}/>
      </header>
    </div>
  );
}

export default App;
