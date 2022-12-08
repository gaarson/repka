var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/watcher.ts
var watcher_exports = {};
__export(watcher_exports, {
  Watcher: () => Watcher,
  watcherCreator: () => watcherCreator
});
module.exports = __toCommonJS(watcher_exports);

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
    obj.muppet.__init__ = __spreadProps(__spreadValues({}, obj.muppet.__init__), {
      [prop]: value
    });
    if (obj.__listeners[prop] && obj.__listeners[prop].size) {
      obj.__listeners[prop].forEach((notify, key) => {
        if (obj.muppet[key] !== void 0 && obj.muppet[key] === false) {
          obj.muppet[key] = true;
        }
        notify();
      });
    }
    if (Array.isArray(obj.__onUpdate) && prop !== "__onUpdate") {
      obj.__onUpdate.forEach((fn) => fn());
      obj.__onUpdate = [];
    }
    return true;
  }
  return new Proxy(new Source(provider, initObj, methods, getter), { set: setter });
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
