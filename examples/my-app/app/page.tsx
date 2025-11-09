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

const MagicButton = state(() => {
  const [cond, setCond] = useState(true);

  return (
    <div>
      <button onClick={() => setCond(c => !c)}>Toggle Magic</button>
      {cond && <p>Magic Foo: {state.foo}</p>} 
    </div>
  )
})

const Home = state(() => {
  

  const some = state.foo ? 'aa' : 'bb';

  const { puk } = state;

  return (
    <div>
      <h1>REPKA + NEXT</h1>
      
      <h3>{some}</h3>
      <button 
        onClick={() => {
          state.foo += 1;
        }} 
        style={{ color: 'red', margin: '10px' }}
      >
        Click me to BREAK React (condition: {String(9)})
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

export default function App () {
  return (
    <div>
      <Home />
      <MagicButton />
    </div>
  )
}
