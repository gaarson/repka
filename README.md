# Repka

<p align="center">
  <img 
    src="https://raw.githubusercontent.com/gaarson/repka/refs/heads/master/.github/assets/logo.png" 
    alt="logo Repka" 
    width="350">
</p>

This is a simple yet powerful state manager for React. It leverages plain JavaScript classes (or objects) as stores, providing high performance with selective re-renders out of the box.

Forget about selectors and complex boilerplate. With `Repka`, you interact with your state as if it were a plain object, and the library ensures your components update efficiently.

## ✨ Key Features

- **Class or Object Stores:** Define your state and logic in a class or a plain object.
- **Direct Mutations:** Modify state with simple assignments (`store.myValue = 'new value'`). No reducers or setters are needed.
- **High Performance:** Components re-render only when the _specific_ data they use changes.
- **Boilerplate-Free TypeScript:** Strong typing out of the box with automatic type inference. No duplicate interfaces needed.
- **Composable:** Nests `repka` stores within each other for granular, decoupled state.
- **Automatic Cleanup:** Subscriptions are automatically cleaned up when components unmount, preventing memory leaks.

## 💾 Installation

```bash
# npm
npm install repka
```

## 🚀 Getting Started

### 1\. Define Your Store

Create a plain JavaScript class or object. `Repka` uses **type inference**, so you don't need to create separate interfaces.

```typescript
// store.ts
import { repka } from "repka";

// --- Option 1: Using a Class (Recommended for complex logic) ---
class SimpleStore {
  str = "initial string";
  num = 123;

  reset() {
    this.str = "initial string";
    this.num = 123;
  }
}

// 2. Create and export your reactive store
// No <ISimpleStore> needed! The type is inferred automatically.
export const simpleStore = repka(new SimpleStore());

// --- Option 2: Using a Plain Object ---
export const anotherStore = repka({
  count: 0,
  increment() {
    this.count++;
  },
});

// The type of simpleStore is now:
// SimpleStore & IRepkaCallable<SimpleStore>
```

### 2\. Use in Your React Component

You can now import `simpleStore` and use it. There are two primary ways to "listen" to changes.

```javascript
// MyComponent.jsx
import React from 'react';
import { simpleStore } from './store';

// 1. Read data from the store
<p>String: {simpleStore.str}</p>

// 2. Change data via direct assignment
<button onClick={() => simpleStore.str = 'new string!'}>
  Change String
</button>

// 3. Call a method from the store
<button onClick={() => simpleStore.reset()}>
  Reset
</button>
```

---

## 📖 Usage in React: The Two Methods

`Repka` provides two ways to subscribe to state.

### Method 1: The HOC Wrapper (Recommended Way)

This is the **safest and recommended** way to use `Repka`.

Wrap your component with the store instance itself. The store acts as a Higher-Order Component (HOC). This method reliably tracks all properties your component accesses during its render, even if they are **inside conditional logic** (`if`, `&&`, `?:`).

```javascript
// MyComponent.jsx
import { simpleStore } from "./store";

// Wrap the component with the store
export const MyComponent = simpleStore(({ shouldShow }) => {
  // ✅ SAFE: We can now use conditional logic
  let value = "default";
  if (shouldShow) {
    value = simpleStore.str;
  }

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={() => (simpleStore.str = "new string!")}>
        Change String
      </button>
    </div>
  );
});
```

### Method 2: Direct Property Access (Advanced Shortcut)

You can also access store properties (`store.prop`) directly in your component's render body. Under the hood, this acts like a React Hook (`useSyncExternalStore`).

```javascript
const StringDisplay = () => {
  // This access subscribes the component to 'str'
  return <p>String: {simpleStore.str}</p>;
};
```

⛔️ **CRITICAL WARNING: Respect the Rules of Hooks**

Because direct access (`store.prop`) **is a hook call**, you MUST follow the [React Rules of Hooks](https://reactjs.org/docs/hooks-rules.html).

**NEVER** access store properties conditionally, in loops, or in event handlers (if you expect reactivity).

❌ **This will BREAK your app:**

```javascript
const MyComponent = ({ shouldShow }) => {
  let value = "default";
  if (shouldShow) {
    // 🚨 WRONG! Calling a hook (store.prop) conditionally.
    // This will cause an "Invalid hook call" error.
    value = simpleStore.str;
  }
  return <div>{value}</div>;
};
```

> **Our Recommendation:**
>
> - **HOC (`repka(Component)`):** Use this 99% of the time. It's safe, works with any logic, and is compatible with `React.memo`.
> - **Direct Access (`store.prop`):** Use this _only_ for simple components where properties are _always_ accessed unconditionally at the top level.

---

## ⚡ Performance: Selective Re-renders

Repka's performance magic is that it tracks which property is used by which component.

If you change `store.num`, only components that use `store.num` will re-render. Components that only use `store.str` will be skipped.

```javascript
import { simpleStore } from "./store";

// This component ONLY depends on `simpleStore.str`
const StringDisplay = simpleStore(() => {
  // Using the HOC
  console.log("Render StringDisplay");
  return <p>String: {simpleStore.str}</p>;
});

// This component ONLY depends on `simpleStore.num`
const NumberDisplay = simpleStore(() => {
  // Using the HOC
  console.log("Render NumberDisplay");
  return <p>Number: {simpleStore.num}</p>;
});

const App = () => (
  <>
    <StringDisplay />
    <NumberDisplay />
    <button onClick={() => (simpleStore.str = "new value")}>
      Change Only String
    </button>
  </>
);
```

When you click the button, you will **only see "Render StringDisplay"** in the console. `NumberDisplay` will not re-render because its data did not change.

---

## 🧩 Composing Stores

You can safely nest `repka` stores inside each other. The reactivity will be tracked across stores automatically.

This is **different** from the "shallow reactivity" limitation. While plain objects aren't tracked deeply, other `repka` instances are.

```typescript
// stores.ts
import { repka } from "repka";

export const childStore = repka({
  text: "Hello",
});

export const parentStore = repka({
  child: childStore,
  // You can even swap them out
  setNewChild() {
    this.child = repka({ text: "World" });
  },
});
```

```javascript
// MyComponent.jsx
import { parentStore } from "./stores";

// This component tracks `parentStore.child` AND `parentStore.child.text`
export const MyComponent = parentStore(() => {
  return (
    <div>
      <p>{parentStore.child.text}</p>

      {/* This will trigger a re-render */}
      <button onClick={() => (parentStore.child.text = "New Text!")}>
        Change Child Text
      </button>

      {/* This will also trigger a re-render */}
      <button onClick={() => parentStore.setNewChild()}>Set New Child</button>
    </div>
  );
});
```

When you update `childStore.text` directly, `MyComponent` will correctly re-render because its HOC (`Reaction`) is subscribed to changes in both `parentStore` and `childStore`.

---

## 💡 How it Works

`Repka` uses a Proxy-based observable pattern with a dual-subscription mechanism:

1.  **HOC Wrapper (`repka(Component)`):** This is the recommended, MobX-like approach. It wraps your component in a `Reaction` (a special observer class). During the render (`reaction.track(...)`), any `store.prop` access is intercepted by the `Proxy`'s `get` handler. This handler reports the dependency (e.g., `foo`) to the `Reaction`. When `store.foo = 'new'` is called, the store notifies all `Reaction` objects subscribed to `foo`, which then trigger a `forceUpdate` in your component.

2.  **Direct Access (`store.prop`):** This is an advanced shortcut. When the `Proxy`'s `get` handler detects it's _not_ inside a `Reaction.track()` call, it instead invokes a React hook: `useSyncExternalStore`. This creates a granular subscription _only_ to that specific property. This is why it's subject to the Rules of Hooks.

3.  **Error Resilience for Hook-Based Access:**  
    When using direct property access (`store.prop`), Repka proactively handles React hook rule violations through a sophisticated error mitigation system:
    - **Spam Hash Precomputation:**  
      During library initialization, Repka intentionally triggers common React hook errors (like "Invalid hook call") in isolated test components. It captures the error message, normalizes it (removing prefixes like "Error:"), and computes a 32-bit hash of the first 200 characters. This `KNOWN_SPAM_HASH` is stored for both server (SSR) and client environments.
    - **Safe Error Handling in Getters:**  
      In `simpleReactProvider` (the getter handler), when an error occurs during hook execution:
      1.  The error message is normalized and hashed
      2.  The hash is compared against `KNOWN_SPAM_HASH`
      3.  **If matched:** The error is treated as non-critical "development spam". Repka safely falls back to returning the current raw property value, preventing crashes while still showing React's warning in console.
      4.  **If unmatched:** Repka throws a loud `Repka CRITICAL ERROR` containing:
          - The rendering component's name
          - Known vs. actual error hashes for diagnostics
          - Full original error details
          - Clear explanation about preventing "zombie components"
    - **Zombie Component Prevention:**  
      For non-spam errors (e.g., "Rendered more hooks than during previous render"), Repka _intentionally crashes_ with a detailed error rather than allowing corrupted UI states. This fails fast to prevent subtle data corruption issues that are extremely hard to debug.
    - **Context Detection:**  
      The getter first checks if it's executing within React's render cycle using internal React flags (`__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`). If not in a render context, it bypasses hooks entirely and returns raw values.

    This mechanism ensures:
    - 🛡️ Development warnings don't crash production apps
    - 🚨 Critical errors fail loudly with actionable diagnostics
    - ⚡ Zero performance overhead for successful hook executions
    - 🌐 Consistent behavior across SSR and client environments

---

## ⛔️ Known Limitations

`Repka` is designed for simplicity, which comes with trade-offs you must be aware of:

- **Shallow Reactivity (for Plain Objects):** `Repka` uses a **shallow `Proxy`**. It only tracks top-level properties of your store. Mutating a _plain nested object_ (e.g., `store.myObject.foo = 'bar'`) **will not** trigger a re-render.
  - **Solution:** You must re-assign the object: `store.myObject = { ...store.myObject, foo: 'bar' }`.
  - **Exception:** This limitation does **not** apply to nesting other `repka` stores. See "Composing Stores" above.

- **Dynamic HOC Dependencies:** The HOC wrapper (`repka(Component)`) only tracks dependencies that are _accessed during the current render_. If a property is behind conditional logic (e.g., `if (show)`), it will only become a dependency _after_ `show` becomes `true` and the component re-renders.

- **React Compiler:** Like all proxy-based state managers that use "magic" (e.g., MobX), the upcoming React Compiler will likely struggle to "see" the dependencies. This is a known trade-off for the DX of direct mutation.

---

## 🧐 Reactivity Outside React: `watch`

You can use the `watch` function to react to changes outside of a React component (e.g., for logging or async logic).

```javascript
import { repka, watch } from "repka";

const state = repka({ foo: 0 });

const logChanges = async () => {
  console.log('Waiting for "foo" to change...');
  const newValue = await watch(state, "foo");
  console.log(`"foo" changed! New value: ${newValue}`);

  // You can call this in a loop or recursively
  // logChanges();
};

// Start the watcher
logChanges();

// Somewhere in your app...
setTimeout(() => {
  state.foo = 1;
}, 2000);

/*
Console Output:
Waiting for "foo" to change...
"foo" changed! New value: 1
*/
```

## 📚 API Reference

### `repka(sourceObject)`

The main function to create a reactive store.

- `sourceObject: T`: An instance of your store class (e.g., `new MyStore()`) or a plain object.
- **Returns:** A reactive `RepkaStore<T>` proxy. This object can be used directly for property access, as a HOC, and for hooks.

### `watch(store, propertyKey)`

An async function to react to state changes outside of a React component.

- `store`: The reactive store instance created by `repka`.
- `propertyKey: string`: The string name of the property to watch.
- **Returns:** A `Promise` that resolves with the new value as soon as the specified property changes.

<!-- end list -->

```

```
