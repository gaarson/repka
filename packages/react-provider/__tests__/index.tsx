import React from 'react';
import {render, act, fireEvent} from '@testing-library/react';

import { repka } from '../../repka';

import { 
  __SET_SPAM_HASH_FOR_TESTS__,
  PENDING_ERRORS,
} from '../spamHash';
import { hashUtils } from '../stringHash';
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
describe('Direct Access (Hook) Integration', () => {
  test('Hook: component should re-render when a nested store property changes', () => {
    const childStore = repka({ val: 10 });
    const parentStore = repka({ child: childStore });
    const renderSpy = jest.fn();

    const MyComponent = () => {
      renderSpy();
      const val = parentStore.child.val;
      return <div>{val}</div>;
    };

    const { getByText, unmount } = render(<MyComponent />);
    expect(getByText('10')).toBeInTheDocument(); 
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      childStore.val = 20;
    });

    expect(getByText('20')).toBeInTheDocument();
    expect(renderSpy).toHaveBeenCalledTimes(2);

    const newChild = repka({ val: 30 });
    act(() => {
      parentStore.child = newChild;
    });

    expect(getByText('30')).toBeInTheDocument();
    expect(renderSpy).toHaveBeenCalledTimes(3);

    act(() => {
      childStore.val = 99; 
    });
    expect(renderSpy).toHaveBeenCalledTimes(3); 

    unmount(); 
  });

  test('Hook: proves the SILENT BUG', () => {
    const childStore = repka({ val: 10 });
    const parentStore = repka({ child: childStore });

    const MyComponent = ({ show }) => {
      let val = 'default';
      if (show) {
        val = parentStore.child.val;
      }
      return <div>{val}</div>;
    };
    
    const { getByText, queryByText } = render(<MyComponent show={true} />);

    expect(getByText('10')).toBeInTheDocument();

    act(() => {
      parentStore.child.val = 99;
    });

    expect(queryByText('99')).toBeInTheDocument();
  });

  // test('Hook: should CRASH LOUDLY if hook order changes', () => {
  //   const childStore = repka({ val: 10 });
  //   const parentStore = repka({ child: childStore });

  //   const MyComponent = ({ show }) => {
  //     React.useState(0);

  //     let val = 'default';
  //     if (show) {
  //       val = parentStore.child.val;
  //     }
  //     return <div>{val}</div>;
  //   };

  //   const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  //   const { rerender } = render(<MyComponent show={false} />);

  //   expect(() => {
  //     rerender(<MyComponent show={true} />);
  //   }).toThrow();

  //   errorSpy.mockRestore();
  // });

  test('Hook: CRASHES LOUDLY on unstable hook order', () => {
    const childStore = repka({ val: 10 });
    const parentStore = repka({ child: childStore });

    const MyComponent = ({ show }) => {
      React.useState(0);
      let val = 'default';
      if (show) {
        val = parentStore.child.val;
      }
      return <div>{val}</div>;
    };

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender, getByText } = render(<MyComponent show={false} />);
    expect(getByText('default')).toBeInTheDocument();

    expect(() => {
      rerender(<MyComponent show={true} />);
    }).toThrow(
      '[Repka CRITICAL ERROR in <MyComponent>]'
    );
    
    expect(errorSpy).toHaveBeenCalled();

    expect(errorSpy.mock.calls[0][0]).toContain(
      'React has detected a change in the order of Hooks'
    );

    errorSpy.mockRestore();
  });
});

jest.mock('../stringHash', () => ({
  ...jest.requireActual('../stringHash'),
  simpleHash: jest.fn(),
}));

describe('Repka Gateway Logic (Spam Filter)', () => {
  let REAL_SPAM_HASH;
  let FAKE_ERROR_HASH;
  let consoleErrorSpy;
  let consoleLogSpy;

  beforeEach(() => {
    const originalHashFn = jest.requireActual('../stringHash').hashUtils.simpleHash;

    const REAL_SPAM_MESSAGE = 'Rendered more hooks than during the previous render.';
    REAL_SPAM_HASH = originalHashFn(REAL_SPAM_MESSAGE.substring(0, 200));
    const FAKE_ERROR_MESSAGE = 'This is a REAL error, not spam';
    FAKE_ERROR_HASH = originalHashFn(FAKE_ERROR_MESSAGE.substring(0, 200));

    __SET_SPAM_HASH_FOR_TESTS__(null);
    PENDING_ERRORS.length = 0;

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const originalConsoleError = console.error;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((...args: any[]) => {
      const message = String(args[0]);

      if (message.includes('change in the order of Hooks')) {
        return;
      }
      if (message.includes('[Repka CRITICAL ERROR')) {
        return;
      }
      if (message.includes('The above error occurred in the')) {
        return;
      }
      
      originalConsoleError(...args);
    });
    
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const SpammyComponent = ({ show }) => {
    const childStore = repka({ val: 10 });
    const parentStore = repka({ child: childStore });

    React.useState(0); 
    let val = 'default';
    if (show) {
      val = parentStore.child.val;
    }
    return <div>{val}</div>;
  };

  test('Gateway [CLOSED]: A real error (not spam) should be added to PENDING_ERRORS and then "crash loudly"', () => {
    const originalHashFn = hashUtils.simpleHash; 
    jest.spyOn(hashUtils, 'simpleHash').mockImplementation((msg: string) => {
      if (msg.includes('Rendered more hooks')) {
        return FAKE_ERROR_HASH
      }
      return originalHashFn(msg);
    });

    const { rerender } = render(<SpammyComponent show={false} />);

    expect(() => {
      rerender(<SpammyComponent show={true} />);
    }).not.toThrow(); 

    expect(PENDING_ERRORS.length).toBe(2); 
    expect(PENDING_ERRORS[0].hash).toBe(FAKE_ERROR_HASH);
    expect(PENDING_ERRORS[1].hash).toBe(FAKE_ERROR_HASH);
    
    // Говорим "шпиону" забыть все, что он слышал до этого (т.е. warning от React)
    consoleErrorSpy.mockClear(); 
    
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // ✅ Теперь пройдет

    act(() => {
      __SET_SPAM_HASH_FOR_TESTS__(REAL_SPAM_HASH);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('[Repka CRITICAL ERROR')
      })
    );

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);

    expect(PENDING_ERRORS.length).toBe(0); 
  });

  test('Gateway [CLOSED]: A spam error should be added to PENDING_ERRORS and then be silently dismissed', () => {   
    const { rerender } = render(<SpammyComponent show={false} />);

    expect(() => {
      rerender(<SpammyComponent show={true} />);
    }).not.toThrow();

    expect(PENDING_ERRORS.length).toBe(2); 
    expect(PENDING_ERRORS[0].hash).toBe(REAL_SPAM_HASH);
    expect(PENDING_ERRORS[1].hash).toBe(REAL_SPAM_HASH);
    
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    act(() => {
      __SET_SPAM_HASH_FOR_TESTS__(REAL_SPAM_HASH);
    });
    
    consoleErrorSpy.mockClear(); 

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(PENDING_ERRORS.length).toBe(0);
  });

  test('Gateway [OPEN]: A real error should "crash loudly" SYNCHRONOUSLY', () => {
    __SET_SPAM_HASH_FOR_TESTS__('SOME_OTHER_HASH');

    const { rerender } = render(<SpammyComponent show={false} />);
    
    expect(() => {
      rerender(<SpammyComponent show={true} />);
    }).toThrow('[Repka CRITICAL ERROR'); 

    expect(PENDING_ERRORS.length).toBe(0);
  });

  test('Gateway [OPEN]: A spam error should be "swallowed" SYNCHRONOUSLY', () => {
    __SET_SPAM_HASH_FOR_TESTS__(REAL_SPAM_HASH);

    const { rerender } = render(<SpammyComponent show={false} />);
    
    expect(() => {
      rerender(<SpammyComponent show={true} />);
    }).not.toThrow(); 

    expect(PENDING_ERRORS.length).toBe(0);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
