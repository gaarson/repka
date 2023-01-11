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

// src/repository.ts
var repository_exports = {};
__export(repository_exports, {
  RepositoryClass: () => RepositoryClass,
  repositoryCreator: () => repositoryCreator
});
module.exports = __toCommonJS(repository_exports);

// src/callable.ts
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
      if (controller.repo) {
        controller.repo.initializeState(
          defaultObject,
          methods,
          broadcastName
        );
      } else {
        controller.repo = __spreadValues({
          initializeState: this.initializeState,
          initRepository: this.initRepository
        }, this);
        controller.repo.initializeState(
          defaultObject,
          methods,
          broadcastName
        );
      }
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
    return this._watcherFactory(
      withOnUpdate,
      this._provider,
      methods,
      broadcastName
    );
  }
};
function repositoryCreator(_watcherFactory, _provider) {
  return new RepositoryClass(_watcherFactory, _provider);
}
