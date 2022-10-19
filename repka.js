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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
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
        var React = require("react");
        var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
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
        var useState = React.useState, useEffect2 = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue;
        var didWarnOld18Alpha = false;
        var didWarnUncachedGetSnapshot = false;
        function useSyncExternalStore2(subscribe, getSnapshot, getServerSnapshot) {
          {
            if (!didWarnOld18Alpha) {
              if (React.startTransition !== void 0) {
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
          useEffect2(function() {
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
        var useSyncExternalStore$2 = React.useSyncExternalStore !== void 0 ? React.useSyncExternalStore : shim;
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
    this.call = void 0;
    for (const key in initObject) {
      this[key] = initObject[key];
    }
    this.muppet = new Proxy({}, { get: getter.bind(this) });
  }
};
var createSource = (initObj, provider, methods) => {
  function getter(obj, prop) {
    if (obj[SPECIAL_KEY] && typeof obj[SPECIAL_KEY] === "string" && prop !== obj[SPECIAL_KEY]) {
      if (obj[obj[SPECIAL_KEY]]) {
        obj[obj[SPECIAL_KEY]] = __spreadProps(__spreadValues({}, obj[obj[SPECIAL_KEY]]), {
          [prop]: this[prop] !== void 0 ? this[prop] : void 0
        });
      } else {
        obj[obj[SPECIAL_KEY]] = {
          [prop]: this[prop] !== void 0 ? this[prop] : void 0
        };
      }
    }
    if (obj[prop] === void 0)
      return this[prop];
    return obj[prop];
  }
  return new Proxy(new Source(provider, initObj, methods, getter), {
    set(obj, prop, value) {
      obj[prop] = value;
      if (obj.__listeners[prop] && obj.__listeners[prop].size) {
        for (const [key, notify] of obj.__listeners[prop]) {
          if (obj.muppet[key]) {
            obj.muppet[key] = __spreadProps(__spreadValues({}, obj.muppet[key]), {
              [prop]: value
            });
          }
          notify();
        }
      }
      if (Array.isArray(obj.__onUpdate) && prop !== "onUpdate") {
        obj.__onUpdate.forEach((fn) => fn());
        obj.__onUpdate = [];
      }
      return true;
    }
  });
};

// src/repository.ts
var RepositoryService = class extends Callable {
  constructor(_watcherFactory, _provider) {
    super();
    this._watcherFactory = _watcherFactory;
    this._provider = _provider;
    this.keys = [];
    this.provider = _provider;
    this.actions = this.initRepository();
  }
  __call(defaultObject, controller, broadcastName) {
    let methods = void 0;
    let repo = null;
    if (controller) {
      const constructorKeys = controller.constructor.name === "Object" ? Object.keys(controller) : Object.getOwnPropertyNames(Object.getPrototypeOf(controller));
      methods = constructorKeys.reduce((prev, curr) => curr !== "constructor" && typeof controller[curr] === "function" ? __spreadProps(__spreadValues({}, prev), { [curr]: controller[curr].bind(controller) }) : prev, {});
      if (controller.repo) {
        controller.repo.initializeState(defaultObject, methods, broadcastName);
      } else {
        controller.repo = this;
        controller.repo.initializeState(defaultObject, methods, broadcastName);
      }
    } else {
      repo = this.initRepository(defaultObject, methods, broadcastName);
    }
    return (repo || controller.repo.actions).sourceObj;
  }
  initializeState(data, methods, broadcastName) {
    this.actions = this.initRepository(data, methods, broadcastName);
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
    return this._watcherFactory(withOnUpdate, this.provider, methods, broadcastName);
  }
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
    if (this.sourceObj && propertyName !== "name" && propertyName !== "length") {
      this.sourceObj[propertyName] = value;
    }
    if (this.broadcast && !ignoreBroadcast) {
      this.broadcast.postMessage({ type: propertyName, data: value });
    }
  }
  get(propertyName) {
    if (this.sourceObj && propertyName) {
      return this.sourceObj[propertyName];
    } else if (!propertyName) {
      return this.keys.reduce((prev, curr) => {
        return __spreadProps(__spreadValues({}, prev), {
          [curr]: this.sourceObj[curr]
        });
      }, {});
    }
  }
  watch(propertyName) {
    return new Promise((resolve) => {
      this.sourceObj.__onUpdate = [...this.sourceObj.__onUpdate, () => {
        if (this.sourceObj[propertyName]) {
          resolve(this.sourceObj[propertyName]);
        }
      }];
    });
  }
  watchFor(propertyName, neededValue) {
    return new Promise((resolve) => {
      this.sourceObj.__onUpdate = [...this.sourceObj.__onUpdate, () => {
        if (this.sourceObj[propertyName] === neededValue) {
          resolve(this.sourceObj[propertyName]);
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
var import_react = require("react");
var import_shim = __toESM(require_shim());
function reactProvider() {
  const key = (0, import_react.useRef)(parseInt(String(Math.random() * 1e7), 10).toString());
  const state = (0, import_shim.useSyncExternalStore)((notify) => {
    if (this.muppet[key.current]) {
      Object.keys(this.muppet[key.current]).forEach((prop) => {
        if (this.__listeners[prop]) {
          this.__listeners[prop].set(key.current, notify);
        } else {
          this.__listeners[prop] = /* @__PURE__ */ new Map([[key.current, notify]]);
        }
      });
    }
  }, () => {
    this.muppet["__PROVIDER_ID__"] = key.current;
    if (this.muppet[key.current]) {
      delete this.muppet["__PROVIDER_ID__"];
      return this.muppet[key.current];
    }
    return this.muppet;
  });
  (0, import_react.useEffect)(() => {
    return () => {
      if (this.muppet[key.current]) {
        Object.keys(this.muppet[key.current]).forEach((prop) => {
          if (this.__listeners[prop]) {
            this.__listeners[prop].delete(key.current);
          }
        });
        delete this.muppet[key.current];
      }
    };
  }, []);
  return [state, this.__methods];
}

// src/repka.ts
var repka = new RepositoryService(watcherCreator, reactProvider);
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
