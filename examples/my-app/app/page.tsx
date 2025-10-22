'use client'
import { useState } from 'react';

import { repka } from "repka";

class State {
  foo = 0
  bar = 'str'
  puk = 'poo'
  obj = { puk: { bar: {foo: 'foo_string', num: 123} } }

  toDo() {
    this.foo = this.foo + 1;
  } 
  toDoWithObj() {
    console.log('AAAAAAA')
    this.obj = {puk: {bar: { 
      foo: this.obj.puk.bar.foo === 'foo_string' ? 'foo_string_new' : 'foo_string',  
      num: this.obj.puk.bar.num === 321 ? 123 : 321
    }}};
  } 
}

const state = repka(new State())

const Button = ({ onClick }: { onClick: any }) => {
  return (
    <button onClick={onClick}>
      count is {state.foo}
    </button>
  );
};

export default function Home() {
  const [condition, setCondition] = useState(true);
  
  const [one, setOne] = useState(1);
  console.log('1. useState(one)');

  let some;
  if (condition) {
    console.log('2. [IF=true] Доступ к state.foo -> вызов хуков...');
    some = state.foo ? 'aa' : 'bb';
  }

  const [two, setTwo] = useState(2);
  console.log('3. useState(two)');

  const [three, setThree] = useState(3);
  console.log('4. useState(three)');

  
  const { puk } = state;
  console.log('5. Доступ к state.puk -> вызов хуков...');

  return (
    <div>
      <h1>REPKA + NEXT</h1>
      
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
}
