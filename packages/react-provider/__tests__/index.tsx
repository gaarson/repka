import React from 'react';
import {render, act, fireEvent} from '@testing-library/react';

import { createSource } from '../../core/index';
import { simpleReactProvider } from '../index';
import { FIELDS_PREFIX } from '../../core/domain';

const EXPECTED_SIMPLE_STRING = 'string'
const EXPECTED_SIMPLE_STRING_CHANGED = 'foo';
const EXPECTED_SIMPLE_NUMBER = 123
const EXPECTED_SIMPLE_NUMBER_CHANGED = 156;

interface ISimple {
  bool: boolean, 
  str: string, 
  num: number,
  doSome(): void;
}

class Simple implements ISimple {
 bool = true;
 str = 'string';
 num = 123;
 doSome() {
   this.str = EXPECTED_SIMPLE_STRING
   this.num = EXPECTED_SIMPLE_NUMBER

   return; 
 }
}

describe('create simple provider', () => {
  const simple = createSource<
    ISimple, 
    {main: typeof simpleReactProvider, getter: typeof simpleReactProvider}
  >(
    new Simple(), 
    {main: simpleReactProvider, getter: simpleReactProvider}
  );

  const SimplestUsageComponent = () => {
    return (
      <React.Fragment>
        <div>{simple.str}</div>
        <div>{simple.num}</div>
        <button onClick={() => simple.doSome()}>click</button>
      </React.Fragment>
    )
  }
  const fooRenderSpy = jest.fn();
  const barRenderSpy = jest.fn();

  beforeEach(() => {
    fooRenderSpy.mockClear();
    barRenderSpy.mockClear();
  });

  const FooComponent = () => {
    fooRenderSpy();
    return <div>{simple.str}</div>;
  };

  const BarComponent = () => {
    barRenderSpy();
    return <div>{simple.num}</div>;
  };

  const ControlPanel = () => {
    return (
      <>
        <button onClick={() => (simple.str = EXPECTED_SIMPLE_STRING_CHANGED)}>Change str</button>
        <button onClick={() => (simple.num = EXPECTED_SIMPLE_NUMBER_CHANGED)}>Change num</button>
      </>
    );
  };

  const TestContainer = () => (
    <>
      <FooComponent />
      <BarComponent />
      <ControlPanel />
    </>
  );

  test('should return initial expected values from div', () => {
    const { getByText, unmount } = render(<SimplestUsageComponent />);
    expect(getByText(EXPECTED_SIMPLE_STRING).textContent).toBe(EXPECTED_SIMPLE_STRING);
    expect(getByText(EXPECTED_SIMPLE_NUMBER).textContent).toBe(EXPECTED_SIMPLE_NUMBER.toString());

    unmount()
  });

  test('should return changed values from div after state properties changes', () => {
    const { getByText, unmount } = render(<SimplestUsageComponent />);

    expect(getByText(EXPECTED_SIMPLE_STRING).textContent).toBe(EXPECTED_SIMPLE_STRING);
    expect(getByText(EXPECTED_SIMPLE_NUMBER).textContent).toBe(EXPECTED_SIMPLE_NUMBER.toString());

    act(() => { 
      simple.str = EXPECTED_SIMPLE_STRING_CHANGED;
      simple.num = EXPECTED_SIMPLE_NUMBER_CHANGED;
    })

    expect(getByText(EXPECTED_SIMPLE_STRING_CHANGED).textContent).toBe(EXPECTED_SIMPLE_STRING_CHANGED);
    expect(getByText(EXPECTED_SIMPLE_NUMBER_CHANGED).textContent).toBe(EXPECTED_SIMPLE_NUMBER_CHANGED.toString());

    unmount()
  });

  test('component call method from state controller', () => {
    const { getByText, unmount } = render(<SimplestUsageComponent />);

    fireEvent.click(getByText('click'));

    expect(getByText(EXPECTED_SIMPLE_STRING).textContent).toBe(EXPECTED_SIMPLE_STRING);
    expect(getByText(EXPECTED_SIMPLE_NUMBER).textContent).toBe(EXPECTED_SIMPLE_NUMBER.toString());

    unmount()
  });

  test('should only rerender the component whose state slice has changed', () => {
    const { getByText, unmount } = render(<TestContainer />);

    expect(fooRenderSpy).toHaveBeenCalledTimes(1);
    expect(barRenderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(getByText('Change str'));
    });

    expect(getByText(EXPECTED_SIMPLE_STRING_CHANGED).textContent).toBe(EXPECTED_SIMPLE_STRING_CHANGED);
    expect(fooRenderSpy).toHaveBeenCalledTimes(2);
    expect(barRenderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(getByText('Change num'));
    });

    expect(getByText(EXPECTED_SIMPLE_NUMBER_CHANGED).textContent).toBe(EXPECTED_SIMPLE_NUMBER_CHANGED.toString());
    expect(fooRenderSpy).toHaveBeenCalledTimes(2);
    expect(barRenderSpy).toHaveBeenCalledTimes(2); 

    unmount()
  });

  test('should remove all unmounted listeners', () => {
    const { unmount } = render(<SimplestUsageComponent />);

    unmount();

    expect(simple[`${FIELDS_PREFIX}criticalFields`]).toMatchObject({});
    expect(simple[`${FIELDS_PREFIX}muppet`]).toMatchObject({});
  });

});
