import React from 'react';
import logo from './logo.svg';

import { Tasks } from './Tasks';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Tasks />
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
