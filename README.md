# Repka

**Repka** is a simple yet powerful state manager for React. It leverages plain JavaScript classes as stores, providing high performance with **selective re-renders** right out of the box.

Forget about selectors and complex boilerplate. With Repka, you interact with your state as if it were a plain object, and the library ensures your components update efficiently.

## ✨ Key Features

  * **Class-based Stores**: Define your state and the logic to change it all in one place.
  * **Direct Mutations**: Modify state with simple assignments (`store.myValue = 'new value'`). No reducers or setters are needed.
  * **High Performance**: Components re-render *only* when the specific data they use changes.
  * **Zero-Config**: Just create an instance of your class with `repka` and start using it.
  * **Automatic Cleanup**: Subscriptions are automatically cleaned up when components unmount, preventing memory leaks.

## 💾 Installation

```bash

# npm
npm install https://github.com/gaarson/repka
```

-----

## 🚀 Getting Started

### 1\. Define Your Store

Create a plain JavaScript class that holds your state (properties) and mutation logic (methods).
Use the main `repka` function to create a reactive instance of your store.

```typescript
// store.ts

import { repka } from 'repka';

// 1. (Optional) Define an interface for your store
interface ISimpleStore {
  str: string;
  num: number;
  reset(): void;
}

// 2. Create a class implementing that interface
class SimpleStore implements ISimpleStore {
  str = 'initial string';
  num = 123;

  reset() {
    this.str = 'initial string';
    this.num = 123;
  }
}

// 3. Create and export your reactive store
export const simpleStore = repka<ISimpleStore>(new SimpleStore());
```

### 2\. Use in Your React Component

You can now import `simpleStore` and use it in your components. There are two primary ways to make your component "listen" to changes.

```jsx
// MyComponent.jsx
import React from 'react';
import { simpleStore } from './store';

// See the "Usage in React" section for more on this.
const MyComponent = () => {
  return (
    <div>
      {/* 1. Read data from the store */}
      <p>String: {simpleStore.str}</p>
      <p>Number: {simpleStore.num}</p>
      
      {/* 2. Change data via direct assignment */}
      <button onClick={() => simpleStore.str = 'new string!'}>
        Change String
      </button>

      {/* 3. Call a method from the store */}
      <button onClick={() => simpleStore.reset()}>
        Reset
      </button>
    </div>
  );
};
```

-----

## 📖 Usage in React: The Two Methods

Repka provides two ways to consume state. Choosing the right one is critical for a stable application.

### Method 1: Direct Property Access (The "Easy" Way)

You can access properties like `simpleStore.foo` directly inside your component's render body.

**Under the hood, `simpleStore.foo` acts like a React Hook** (`useSyncExternalStore`).

```jsx
const StringDisplay = () => {
  // This access subscribes the component to 'str'
  return <p>String: {simpleStore.str}</p>;
};
```

> ### ⛔ CRITICAL WARNING: Respect the Rules of Hooks
>
> Because direct access (`store.prop`) **is a hook call**, you **MUST** follow the **[Rules of Hooks](https://www.google.com/search?q=https://react.dev/warnings/invalid-hook-call)**.
>
> **NEVER** access store properties conditionally, in loops, or in event handlers (if you expect reactivity).
>
> #### ❌ **This will BREAK your app:**
>
> ```jsx
> const MyComponent = ({ shouldShow }) => {
>   let value = 'default';
>   if (shouldShow) {
>     // 🚨 WRONG! Calling a hook (store.foo) conditionally.
>     value = simpleStore.foo; 
>   }
>   return <div>{value}</div>
> }
> ```
>
> This will cause an "Invalid hook call" error, as you are changing the order of hook calls between renders.

-----

### Method 2: The HOC Wrapper (The "Safe" Way)

To safely use state within complex components with conditional logic, wrap your component with the store instance itself. The store acts as a Higher-Order Component (HOC).

This method subscribes your component to *all* properties it accesses during its render, using a single, stable subscription that **does not** violate the Rules of Hooks.

```jsx
import { simpleStore } from './store';

export const MyComponent = simpleStore(({ shouldShow }) => {
  // ✅ SAFE: We can now use conditional logic
  let value = 'default';
  if (shouldShow) {
    value = simpleStore.foo; 
  }
  return <div>{value}</div>
})
```

**Recommendation:**

  * **Direct Access (`store.foo`):** Use for simple components where properties are *always* accessed unconditionally at the top level.
  * **HOC Wrapper (`store(Component)`):** Use for *any* component that has conditional logic (`if`, `&&`, `? :`) that might change which store properties are accessed.

-----

## ⚡ Performance: Selective Re-renders

Repka's performance magic is that it tracks *which* property is used by *which* component.

If you change `store.num`, **only the components that use `store.num`** will re-render. Components that only use `store.str` will be skipped.

### Example

```jsx
import { simpleStore } from './store';

// This component ONLY depends on `simpleStore.str`
const StringDisplay = () => {
  console.log('Render StringDisplay');
  return <p>String: {simpleStore.str}</p>;
};

// This component ONLY depends on `simpleStore.num`
const NumberDisplay = () => {
  console.log('Render NumberDisplay');
  return <p>Number: {simpleStore.num}</p>;
};

const App = () => (
  <>
    <StringDisplay />
    <NumberDisplay />
    <button onClick={() => simpleStore.str = 'new value'}>
      Change Only String
    </button>
  </>
);
```

When you click the button, you will **only** see `"Render StringDisplay"` in the console. `NumberDisplay` will not re-render because its data did not change.

-----

## 🧐 Reactivity Outside React: `watch` Example

You can create a recursive function to "listen" for all future changes to a property.

```javascript
import { repka, watch } from 'repka';

const state = repka({ foo: 0 });

// A function to perpetually watch and log 'foo' changes
const watchForFooChanges = async () => {
  console.log('Waiting for "foo" to change...');
  const updatedValue = await watch(state, 'foo');
  console.log(`"foo" changed! New value: ${updatedValue}`);
  
  // Call itself to wait for the next change
  watchForFooChanges();
}

// Start the watcher
watchForFooChanges();

// Sometime later, your app changes the state
setInterval(() => {
  state.foo += 1;
}, 2000);

/*
Console Output:
Waiting for "foo" to change...
"foo" changed! New value: 1
Waiting for "foo" to change...
"foo" changed! New value: 2
Waiting for "foo" to change...
...
*/
```

-----

## 📚 API Reference

### `repka<T>(sourceObject: T)`

The main function to create a reactive store.

  * `sourceObject`: An instance of your store class (e.g., `new MyStore()`).
  * **Returns**: A reactive proxy of your object that can be used in React and acts as a HOC.

### `watch(store, propertyKey)`

An async function to react to state changes *outside* of a React component (e.g., for logging, analytics, or async logic).

  * `store`: The reactive store instance created by `repka`.
  * `propertyKey`: The string name of the property to watch.
  * **Returns**: A `Promise` that resolves with the **new value** as soon as the specified property changes.

