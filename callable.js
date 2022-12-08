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

// src/callable.ts
var callable_exports = {};
__export(callable_exports, {
  Callable: () => Callable,
  SPECIAL_KEY: () => SPECIAL_KEY,
  Source: () => Source,
  createSource: () => createSource
});
module.exports = __toCommonJS(callable_exports);
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
