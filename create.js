var l=Object.defineProperty,b=Object.defineProperties,M=Object.getOwnPropertyDescriptor,R=Object.getOwnPropertyDescriptors,P=Object.getOwnPropertyNames,g=Object.getOwnPropertySymbols;var m=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var k=(n,r,e)=>r in n?l(n,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[r]=e,y=(n,r)=>{for(var e in r||(r={}))m.call(r,e)&&k(n,e,r[e]);if(g)for(var e of g(r))x.call(r,e)&&k(n,e,r[e]);return n},T=(n,r)=>b(n,R(r));var I=(n,r)=>{for(var e in r)l(n,e,{get:r[e],enumerable:!0})},C=(n,r,e,t)=>{if(r&&typeof r=="object"||typeof r=="function")for(let i of P(r))!m.call(n,i)&&i!==e&&l(n,i,{get:()=>r[i],enumerable:!(t=M(r,i))||t.enumerable});return n};var S=n=>C(l({},"__esModule",{value:!0}),n);var U={};I(U,{createRepository:()=>j});module.exports=S(U);var a="__PROVIDER_ID__",u=class extends Function{constructor(){super();let r;return r=(...e)=>r.__call(...e),Object.setPrototypeOf(r,new.target.prototype)}},_=class extends u{constructor(e,t,i){super();this.__call=e;this.__methods=i;this.__onUpdate=[];this.__listeners={};this.muppet=new Proxy({},{get(e,t){return e[a]&&typeof e[a]=="string"&&t!==e[a]&&(e[e[a]]?e[e[a]]=T(y({},e[e[a]]),{[t]:e.init[t]||void 0}):e[e[a]]={[t]:e.init[t]||void 0}),e[t]?e[t]:e.init[t]}});this.call=void 0,this.muppet.init=t;for(let s in t)this[s]=t[s]}},O=(n,r,e)=>new Proxy(new _(r,n,e),{set(t,i,s){if(t[i]=s,t.__listeners[i]&&t.__listeners[i].size)for(let[o,p]of t.__listeners[i])t.muppet[o]&&(t.muppet[o]=T(y({},t.muppet[o]),{[i]:s})),p();return Array.isArray(t.__onUpdate)&&i!=="onUpdate"&&(t.__onUpdate.forEach(o=>o()),t.__onUpdate=[]),!0}});var h=class extends u{constructor(e,t){super();this._watcherFactory=e;this._provider=t;this.keys=[];this.provider=t,this.actions=this.initRepository()}__call(e,t,i){let s,o,p=null;return t&&(o=(t.constructor.name==="Object"?Object.keys(t):Object.getOwnPropertyNames(Object.getPrototypeOf(t))).reduce((f,d)=>d!=="constructor"&&typeof t[d]=="function"?T(y({},f),{[d]:t[d].bind(t)}):f,{})),t?t.repo?(t.repo.initializeState(e),t.repo.initializeState(e,o)):(t.repo=this,t.repo.initializeState(e),t.repo.initializeState(e,o)):p=this.initRepository(e,o),i&&(s=new BroadcastChannel(`repository-${i}`),s.onmessage=({data:c})=>{c==="needSome"?s.postMessage({data:(p||t.repo.actions).convertToObject()}):c.type===void 0?this.initRepository(c.data):(p||t.repo.actions).set(c.type,c.data)},s.postMessage("needSome")),(p||t.repo.actions).sourceObj}initializeState(e,t){this.actions=this.initRepository(e,t)}initRepository(e,t){this.keys=Object.keys(e||{});let i=this.keys.reduce((s,o)=>{let p;return this.actions!==void 0&&this.actions.get(o)!==void 0?p=this.actions.get(o):p=e[o],T(y({},s),{[o]:p})},e||{});return this._watcherFactory(i,this.provider,t)}convertToObject(){return this.keys.reduce((e,t)=>T(y({},e),{[t]:this.actions.get(t)}),{})}};var w=class{constructor(){this.SPECIAL_KEY=a}init(r,e,t){typeof r=="object"&&(this.sourceObj=O(r,e,t))}set(r,e){this.sourceObj&&r!=="name"&&r!=="length"&&(this.sourceObj[r]=e)}get(r){if(this.sourceObj&&r)return this.sourceObj[r]}watch(r){return new Promise(e=>{this.sourceObj.__onUpdate=[...this.sourceObj.__onUpdate,()=>{this.sourceObj[r]&&e(this.sourceObj[r])}]})}watchFor(r,e){return new Promise(t=>{this.sourceObj.__onUpdate=[...this.sourceObj.__onUpdate,()=>{this.sourceObj[r]===e&&t(this.sourceObj[r])}]})}},v=(n,r,e)=>{let t=new w;return t.init(n,r,e),t};var j=n=>new h(v,n);
