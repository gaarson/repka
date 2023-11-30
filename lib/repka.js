var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
var require_use_sync_external_store_shim_development = __commonJS({
  "node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var React2 = require("react");
        var ReactSharedInternals = React2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var useState = React2.useState, useEffect = React2.useEffect, useLayoutEffect = React2.useLayoutEffect, useDebugValue = React2.useDebugValue;
        var didWarnOld18Alpha = false;
        var didWarnUncachedGetSnapshot = false;
        function useSyncExternalStore2(subscribe, getSnapshot, getServerSnapshot) {
          {
            if (!didWarnOld18Alpha) {
              if (React2.startTransition !== void 0) {
                didWarnOld18Alpha = true;
                error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release.");
              }
            }
          }
          var value = getSnapshot();
          {
            if (!didWarnUncachedGetSnapshot) {
              var cachedValue = getSnapshot();
              if (!objectIs(value, cachedValue)) {
                error("The result of getSnapshot should be cached to avoid an infinite loop");
                didWarnUncachedGetSnapshot = true;
              }
            }
          }
          var _useState = useState({
            inst: {
              value,
              getSnapshot
            }
          }), inst = _useState[0].inst, forceUpdate = _useState[1];
          useLayoutEffect(function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
          }, [subscribe, value, getSnapshot]);
          useEffect(function() {
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
            var handleStoreChange = function() {
              if (checkIfSnapshotChanged(inst)) {
                forceUpdate({
                  inst
                });
              }
            };
            return subscribe(handleStoreChange);
          }, [subscribe]);
          useDebugValue(value);
          return value;
        }
        function checkIfSnapshotChanged(inst) {
          var latestGetSnapshot = inst.getSnapshot;
          var prevValue = inst.value;
          try {
            var nextValue = latestGetSnapshot();
            return !objectIs(prevValue, nextValue);
          } catch (error2) {
            return true;
          }
        }
        function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
          return getSnapshot();
        }
        var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
        var isServerEnvironment = !canUseDOM;
        var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore2;
        var useSyncExternalStore$2 = React2.useSyncExternalStore !== void 0 ? React2.useSyncExternalStore : shim;
        exports.useSyncExternalStore = useSyncExternalStore$2;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/use-sync-external-store/shim/index.js
var require_shim = __commonJS({
  "node_modules/use-sync-external-store/shim/index.js"(exports, module2) {
    "use strict";
    if (false) {
      module2.exports = null;
    } else {
      module2.exports = require_use_sync_external_store_shim_development();
    }
  }
});

// src/repka.ts
var repka_exports = {};
__export(repka_exports, {
  repka: () => repka
});
module.exports = __toCommonJS(repka_exports);

// src/callable.ts
var SPECIAL_KEY = "__PROVIDER_ID__";
var Callable = class extends Function {
  constructor() {
    super();
    let closure = void 0;
    closure = (...args) => {
      return closure.__call(...args);
    };
    return Object.setPrototypeOf(closure, new.target.prototype);
  }
};
var Source = class extends Callable {
  constructor(__call, initObject, __methods, getter) {
    super();
    this.__call = __call;
    this.__methods = __methods;
    this.__onUpdate = [];
    this.__listeners = {};
    this.__criticalFields = {};
    this.call = void 0;
    this.muppet = new Proxy({ __init__: initObject }, { get: getter.bind(this) });
    for (const key in initObject) {
      this.__listeners[key] = /* @__PURE__ */ new Map();
      this[key] = initObject[key];
    }
  }
};
var createSource = (initObj, provider, methods) => {
  function getter(obj, prop) {
    if (obj[SPECIAL_KEY] && typeof obj[SPECIAL_KEY] === "string" && prop !== obj[SPECIAL_KEY] && prop !== "__init__") {
      obj[obj[SPECIAL_KEY]] = false;
      this.__criticalFields[obj[SPECIAL_KEY]] = [
        ...this.__criticalFields[obj[SPECIAL_KEY]] || [],
        prop
      ];
    }
    if (prop === "__init__") {
      return obj.__init__;
    }
    if (obj[prop] === void 0) {
      return obj.__init__[prop];
    }
    return obj[prop];
  }
  function setter(obj, prop, value) {
    obj[prop] = value;
    if (prop !== "__onUpdate") {
      obj.muppet.__init__ = __spreadProps(__spreadValues({}, obj.muppet.__init__), {
        [prop]: value
      });
    }
    if (obj.__listeners[prop] && obj.__listeners[prop].size) {
      obj.__listeners[prop].forEach((notify, key) => {
        if (obj.muppet[key] !== void 0 && obj.muppet[key] === false) {
          obj.muppet[key] = true;
        }
        notify();
      });
    }
    if (Array.isArray(obj.__onUpdate) && prop !== "__onUpdate") {
      obj.__onUpdate.forEach((fn) => fn && fn(prop));
    }
    return true;
  }
  return new Proxy(
    new Source(provider, initObj, methods, getter),
    { set: setter }
  );
};

// src/watcher.ts
var Watcher = class {
  constructor() {
    this.keys = [];
    this.SPECIAL_KEY = SPECIAL_KEY;
  }
  init(initObj, options = {}) {
    if (typeof initObj === "object" && !Array.isArray(initObj)) {
      this.keys = Object.keys(initObj || {});
      this.sourceObj = createSource(initObj, options.provider, options.methods);
    }
    if (options.broadcastName)
      this.createBroadcast(options.broadcastName);
  }
  createBroadcast(broadcastName = "broadcastWatcher") {
    this.broadcast = new BroadcastChannel(broadcastName);
    this.broadcast.onmessage = ({ data }) => {
      if (data === "needSome") {
        this.broadcast.postMessage({ data: this.get() });
      } else if (data.type === void 0) {
        for (const key in data.data)
          this.sourceObj[key] = data.data[key];
      } else {
        this.set(data.type, data.data, true);
      }
    };
    this.broadcast.postMessage("needSome");
  }
  set(propertyName, value, ignoreBroadcast = false) {
    if (this.sourceObj) {
      this.sourceObj[propertyName] = value;
    }
    if (this.broadcast && !ignoreBroadcast) {
      this.broadcast.postMessage({ type: propertyName, data: value });
    }
  }
  get(propertyName) {
    if (this.sourceObj && propertyName) {
      return this.sourceObj.muppet[propertyName];
    } else if (!propertyName) {
      return this.sourceObj.muppet.__init__;
    }
  }
  watch(propertyName) {
    const index = this.sourceObj.__onUpdate.length;
    return new Promise((resolve) => {
      this.sourceObj.__onUpdate = [...this.sourceObj.__onUpdate, (updatedProperty) => {
        if (propertyName === updatedProperty) {
          resolve(this.sourceObj[propertyName]);
          this.sourceObj.__onUpdate[index] = null;
          if (this.sourceObj.__onUpdate.every((i) => i === null))
            this.sourceObj.__onUpdate = [];
        }
      }];
    });
  }
  watchFor(propertyName, neededValue) {
    const index = this.sourceObj.__onUpdate.length;
    return new Promise((resolve) => {
      this.sourceObj.__onUpdate = [...this.sourceObj.__onUpdate, (updatedProperty) => {
        if (propertyName === updatedProperty && this.sourceObj[propertyName] === neededValue) {
          resolve(this.sourceObj[propertyName]);
          this.sourceObj.__onUpdate[index] = null;
          if (this.sourceObj.__onUpdate.every((i) => i === null))
            this.sourceObj.__onUpdate = [];
        }
      }];
    });
  }
};
var watcherCreator = (obj, provider, methods, broadcastName) => {
  const watcher = new Watcher();
  watcher.init(obj, { provider, methods, broadcastName });
  return watcher;
};

// src/react-provider.ts
var import_react = __toESM(require("react"));
var import_shim = __toESM(require_shim());
function reactProvider(parameter) {
  let useSync = import_shim.useSyncExternalStore;
  let isNewReact = false;
  let key = import_react.default.useId ? import_react.default.useId() : import_react.default.useRef(parseInt(String(Math.random() * 1e7), 10).toString()).current;
  if (import_react.default.useId) {
    useSync = import_react.default.useSyncExternalStore;
    isNewReact = true;
  }
  const state = useSync((notify) => {
    if (this.__criticalFields[key]) {
      this.__criticalFields[key].forEach((prop) => {
        if (this.__listeners[prop] && typeof this.__listeners[prop] !== "function")
          this.__listeners[prop].set(key, notify);
      });
    }
    return isNewReact ? () => {
      if (this.__criticalFields[key]) {
        this.muppet[key] = false;
        this.__criticalFields[key].forEach((prop) => {
          if (this.__listeners[prop] && typeof this.__listeners[prop] !== "function") {
            this.__listeners[prop].delete(key);
          }
        });
      }
    } : () => void 0;
  }, () => {
    this.muppet["__PROVIDER_ID__"] = key;
    if (this.muppet[key] === true) {
      delete this.muppet["__PROVIDER_ID__"];
      if (!isNewReact)
        this.muppet[key] = false;
      return isNewReact ? this.muppet.__init__ : __spreadValues({}, this.muppet);
    }
    return this.muppet;
  });
  import_react.default.useEffect(() => {
    return () => {
      if (this.muppet[key] && this.__criticalFields[key]) {
        if (!isNewReact) {
          this.__criticalFields[key.current].forEach((prop) => {
            if (this.__listeners[prop] && typeof this.__listeners[prop] !== "function") {
              this.__listeners[prop].delete(key.current);
            }
          });
        }
        delete this.__criticalFields[key];
        delete this.muppet[key];
      }
    };
  }, []);
  if (parameter !== void 0) {
    return state[parameter];
  }
  return [state, this.__methods];
}

// src/repository.ts
var RepositoryClass = class extends Callable {
  constructor(_watcherFactory, _provider) {
    super();
    this._watcherFactory = _watcherFactory;
    this._provider = _provider;
    this.keys = [];
    this.actions = this.initRepository();
  }
  __call(defaultObject, controller, broadcastName) {
    let methods = void 0;
    let repo = null;
    if (controller) {
      const constructorKeys = controller.constructor.name === "Object" ? Object.keys(controller) : Object.getOwnPropertyNames(Object.getPrototypeOf(controller));
      methods = constructorKeys.reduce(
        (prev, curr) => curr !== "constructor" && typeof controller[curr] === "function" ? __spreadProps(__spreadValues({}, prev), { [curr]: controller[curr].bind(controller) }) : prev,
        {}
      );
      controller.repo = __spreadValues(__spreadValues({
        initializeState: this.initializeState,
        initRepository: this.initRepository
      }, this), controller.repo ? controller.repo : {});
      controller.repo.initializeState(
        controller.repo ? __spreadValues(__spreadValues({}, controller.repo.actions.get()), defaultObject) : defaultObject,
        methods,
        broadcastName
      );
    } else {
      repo = this.initRepository(
        defaultObject,
        methods,
        broadcastName
      );
    }
    return (repo || controller.repo.actions).sourceObj;
  }
  initializeState(data, methods, broadcastName) {
    const newActions = this.initRepository(data, methods, broadcastName);
    newActions.sourceObj.__onUpdate = [...this.actions.sourceObj.__onUpdate];
    this.actions = newActions;
  }
  initRepository(repo, methods, broadcastName) {
    this.keys = Object.keys(repo || {});
    const withOnUpdate = this.keys.reduce((prev, curr) => {
      let value;
      if (this.actions !== void 0 && this.actions.get(curr) !== void 0) {
        value = this.actions.get(curr);
      } else {
        value = repo[curr];
      }
      return __spreadProps(__spreadValues({}, prev), {
        [curr]: value
      });
    }, repo || {});
    return this._watcherFactory(
      withOnUpdate,
      this._provider,
      methods,
      broadcastName
    );
  }
};
var repositoryCreator = (provider) => {
  return new RepositoryClass(watcherCreator, provider || reactProvider);
};

// src/repka.ts
var repka = repositoryCreator();
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
