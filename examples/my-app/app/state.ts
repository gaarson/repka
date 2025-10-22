'use client'

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

export default repka(new State())
