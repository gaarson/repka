'use client'

import { useState } from 'react';

import { repka } from "repka";

class State {
  foo = 0
  bar = 'str'
  puk = 'poo'
  obj = { puk: { bar: {foo: 'foo_string', num: 123} } }

  toDo() {
    console.log('INCREMENT FOO')
    this.foo = this.foo + 1;
  } 
  toDoWithObj() {
    this.obj = {puk: {bar: { 
      foo: this.obj.puk.bar.foo === 'foo_string' ? 'foo_string_new' : 'foo_string',  
      num: this.obj.puk.bar.num === 321 ? 123 : 321
    }}};
  } 
}

const state = repka(new State())

const Button = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick}>
      count is {state.foo}
    </button>
  );
};

export default state(function Home() {
  const [condition, setCondition] = useState(true);
  
  const [one, setOne] = useState(1);

  let some;
  if (condition) {
    some = state.foo ? 'aa' : 'bb';
  }

  const [two, setTwo] = useState(2);

  const [three, setThree] = useState(3);

  const { puk } = state;

  return (
    <div>
      <h1>REPKA + NEXT</h1>
      
      <h3>{some}</h3>
      <button 
        onClick={() => setCondition(c => !c)} 
        style={{ color: 'red', margin: '10px' }}
      >
        Click me to BREAK React (condition: {String(condition)})
      </button>

      {/* Твои кнопки */}
      <div className="card">
        <Button onClick={() => state.toDo()} />
        <button onClick={() => state.puk = 'POO'}>
          change puk {state.bar}
        </button>
      </div>
      <p>... {puk} ...</p>
    </div>
  );
})
