var _=Object.defineProperty,g=Object.defineProperties,M=Object.getOwnPropertyDescriptor,w=Object.getOwnPropertyDescriptors,m=Object.getOwnPropertyNames,T=Object.getOwnPropertySymbols;var h=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable;var f=(r,e,t)=>e in r?_(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,a=(r,e)=>{for(var t in e||(e={}))h.call(e,t)&&f(r,t,e[t]);if(T)for(var t of T(e))R.call(e,t)&&f(r,t,e[t]);return r},d=(r,e)=>g(r,w(e));var k=(r,e)=>{for(var t in e)_(r,t,{get:e[t],enumerable:!0})},x=(r,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of m(e))!h.call(r,i)&&i!==t&&_(r,i,{get:()=>e[i],enumerable:!(n=M(e,i))||n.enumerable});return r};var v=r=>x(_({},"__esModule",{value:!0}),r);var C={};k(C,{RepositoryClass:()=>u,repositoryCreator:()=>I});module.exports=v(C);var c=class extends Function{constructor(){super();let e;return e=(...t)=>e.__call(...t),Object.setPrototypeOf(e,new.target.prototype)}};var u=class extends c{constructor(t,n){super();this._watcherFactory=t;this._provider=n;this.keys=[];this.actions=this.initRepository()}__call(t,n,i){let o,y=null;return n?(o=(n.constructor.name==="Object"?Object.keys(n):Object.getOwnPropertyNames(Object.getPrototypeOf(n))).reduce((s,l)=>l!=="constructor"&&typeof n[l]=="function"?d(a({},s),{[l]:n[l].bind(n)}):s,{}),n.repo||(n.repo=a({initializeState:this.initializeState,initRepository:this.initRepository},this)),n.repo.initializeState(t,o,i)):y=this.initRepository(t,o,i),(y||n.repo.actions).sourceObj}initializeState(t,n,i){this.actions=this.initRepository(t,n,i)}initRepository(t,n,i){this.keys=Object.keys(t||{});let o=this.keys.reduce((y,p)=>{let s;return this.actions!==void 0&&this.actions.get(p)!==void 0?s=this.actions.get(p):s=t[p],d(a({},y),{[p]:s})},t||{});return this._watcherFactory(o,this._provider,n,i)}};function I(r,e){return new u(r,e)}
