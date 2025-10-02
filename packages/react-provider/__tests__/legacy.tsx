import React from 'react';
import {render, act, fireEvent} from '@testing-library/react';

import { reactProvider} from '../legacy';
import { createRepository } from '../../repka/create';

const EXPECTED_STRING = 'bar'
const EXPECTED_STRING_CHANGED = 'foo';
const EXPECTED_NUMBER = 161
const EXPECTED_NUMBER_CHANGED = 156;

type controllerType = { method: () => void };

describe('create legacy provider', () => {
  const repka = createRepository(reactProvider);
  const state = repka<{ foo: string, bar: number }, controllerType>(
    { foo: EXPECTED_STRING, bar: EXPECTED_NUMBER },
    { 
      method() {
        this.repo.actions.set('bar', EXPECTED_NUMBER);
        this.repo.actions.set('foo', EXPECTED_STRING);
      } 
    }
  );

  const Component = () => {
    const [{ foo, bar }, { method }] = state();

    return (
      <React.Fragment>
        <div>{foo}</div>
        <div>{bar}</div>
        <button onClick={method}>click</button>
      </React.Fragment>
    )
  }

  test('return initial expected values from div', () => {
    const { getByText } = render(<Component />);
    expect(getByText(EXPECTED_STRING).textContent).toBe(EXPECTED_STRING);
    expect(getByText(EXPECTED_NUMBER).textContent).toBe(EXPECTED_NUMBER.toString());
  });

  test('should return changed values from div after state properties changes', () => {
    const { getByText } = render(<Component />);

    expect(getByText(EXPECTED_STRING).textContent).toBe(EXPECTED_STRING);
    expect(getByText(EXPECTED_NUMBER).textContent).toBe(EXPECTED_NUMBER.toString());

    act(() => { 
      state.foo = EXPECTED_STRING_CHANGED;
      state.bar = EXPECTED_NUMBER_CHANGED;
    })

    expect(getByText(EXPECTED_STRING_CHANGED).textContent).toBe(EXPECTED_STRING_CHANGED);
    expect(getByText(EXPECTED_NUMBER_CHANGED).textContent).toBe(EXPECTED_NUMBER_CHANGED.toString());
  });

  test('component call method from state controller', () => {
    const { getByText } = render(<Component />);
    
    fireEvent.click(getByText('click'));

    expect(getByText(EXPECTED_STRING).textContent).toBe(EXPECTED_STRING);
    expect(getByText(EXPECTED_NUMBER).textContent).toBe(EXPECTED_NUMBER.toString());
  });
});

