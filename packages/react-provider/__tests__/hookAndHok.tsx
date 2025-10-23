import React, { useState } from 'react';
import { render, act, fireEvent, screen } from '@testing-library/react';
import { FIELDS_PREFIX } from '../../core/domain';
import { repka } from '../../repka';

describe('repka HOC (state(Component))', () => {
  test('HOC: component should re-render when a used property changes', () => {
    const state = repka({ foo: 0, bar: 'a' });
    const renderSpy = jest.fn();

    const MyComponent = state(() => {
      renderSpy();
      return <div>{state.foo}</div>;
    });

    render(<MyComponent />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      state.foo = 1;
    });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  test('HOC: component should NOT re-render when an unused property changes', () => {
    const state = repka({ foo: 0, bar: 'a' });
    const renderSpy = jest.fn();

    const MyComponent = state(() => {
      renderSpy();
      return <div>{state.foo}</div>;
    });

    render(<MyComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      state.bar = 'b';
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  test('HOC: should handle destructuring (from Next.js example)', () => {
    const state = repka({ foo: 0, puk: 'a' });
    const renderSpy = jest.fn();

    const MyComponent = state(() => {
      renderSpy();
      const { puk } = state; 
      return <div>{puk}</div>;
    });

    render(<MyComponent />);
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      state.puk = 'b';
    });
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(renderSpy).toHaveBeenCalledTimes(2);

    act(() => {
      state.foo = 1;
    });
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  test('HOC: should clean up subscriptions on unmount', () => {
    const state = repka({ foo: 0 });
    const MyComponent = state(() => <div>{state.foo}</div>);

    const { unmount } = render(<MyComponent />);
    
    expect(state[`${FIELDS_PREFIX}onUpdate`].length).toBe(1);

    unmount();
    
    expect(state[`${FIELDS_PREFIX}onUpdate`].length).toBe(0);
  });
});

describe('repka hook (state("prop"))', () => {
  test('Hook: component should re-render when the specified property changes', () => {
    const state = repka({ foo: 0, bar: 'a' });
    const renderSpy = jest.fn();

    const MyComponent = () => {
      renderSpy();
      const foo = state('foo');
      return <div>{foo}</div>;
    };

    render(<MyComponent />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      state.foo = 1;
    });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  test('Hook: component should NOT re-render when another property changes', () => {
    const state = repka({ foo: 0, bar: 'a' });
    const renderSpy = jest.fn();

    const MyComponent = () => {
      renderSpy();
      const foo = state('foo');
      return <div>{foo}</div>;
    };

    render(<MyComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      state.bar = 'b';
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});


describe('Integration Tests & Shortcomings', () => {
  test('HOC: dependency is NOT registered if conditionally rendered out', () => {
    const state = repka({ foo: 0, bar: 10 });
    const renderSpy = jest.fn();

    const MyComponent = state(() => {
      renderSpy();
      const [show, setShow] = useState(false);
      return (
        <div>
          <button onClick={() => setShow(true)}>Show Foo</button>

          {show && <p>Foo: {state.foo}</p>}

          <p>Bar: {state.bar}</p>
        </div>
      );
    });

    render(<MyComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Foo: 0')).not.toBeInTheDocument();

    act(() => {
      state.foo = 1;
    });
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      state.bar = 11;
    });
    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Bar: 11')).toBeInTheDocument();
  });

  test('HOC: dependency IS registered once conditionally rendered in', () => {
    const state = repka({ foo: 0 });
    const renderSpy = jest.fn();

    const MyComponent = state(() => {
      renderSpy();
      const [show, setShow] = useState(false);
      return (
        <div>
          <button onClick={() => setShow(s => !s)}>Toggle</button>
          {show && <p>Foo: {state.foo}</p>}
        </div>
      );
    });

    render(<MyComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(screen.getByText('Toggle'));
    });
    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Foo: 0')).toBeInTheDocument();

    act(() => {
      state.foo = 1;
    });
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(screen.getByText('Foo: 1')).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText('Toggle'));
    });
    expect(renderSpy).toHaveBeenCalledTimes(4);
    expect(screen.queryByText('Foo: 1')).not.toBeInTheDocument();

    act(() => {
      state.foo = 2;
    });
    expect(renderSpy).toHaveBeenCalledTimes(4);
  });

  test('HOC: component should NOT re-render on deep mutation', () => {
    const state = repka({ obj: { foo: 'a' } });
    const renderSpy = jest.fn();

    const MyComponent = state(() => {
      renderSpy();
      return <div>{state.obj.foo}</div>;
    });

    render(<MyComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      state.obj.foo = 'b';
    });

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('a')).toBeInTheDocument(); 
  });

  test('Mixed Usage: should not cause double subscription or errors', () => {
    const state = repka({ foo: 0, bar: 'a' });
    const renderSpy = jest.fn();

    const MyComponent = state(() => {
      const bar = state('bar');
      renderSpy();
      return <div>Foo: {state.foo}, Bar: {bar}</div>;
    });

    render(<MyComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      state.foo = 1;
    });
    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Foo: 1, Bar: a')).toBeInTheDocument();
    
    act(() => {
      state.bar = 'b';
    });
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(screen.getByText('Foo: 1, Bar: b')).toBeInTheDocument();
  });

});
