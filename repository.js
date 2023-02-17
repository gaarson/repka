var F=Object.create;var _=Object.defineProperty,U=Object.defineProperties,D=Object.getOwnPropertyDescriptor,N=Object.getOwnPropertyDescriptors,B=Object.getOwnPropertyNames,b=Object.getOwnPropertySymbols,K=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty,V=Object.prototype.propertyIsEnumerable;var v=(i,e,t)=>e in i?_(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,u=(i,e)=>{for(var t in e||(e={}))w.call(e,t)&&v(i,t,e[t]);if(b)for(var t of b(e))V.call(e,t)&&v(i,t,e[t]);return i},T=(i,e)=>U(i,N(e));var k=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports),W=(i,e)=>{for(var t in e)_(i,t,{get:e[t],enumerable:!0})},I=(i,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of B(e))!w.call(i,s)&&s!==t&&_(i,s,{get:()=>e[s],enumerable:!(r=D(e,s))||r.enumerable});return i};var O=(i,e,t)=>(t=i!=null?F(K(i)):{},I(e||!i||!i.__esModule?_(t,"default",{value:i,enumerable:!0}):t,i)),L=i=>I(_({},"__esModule",{value:!0}),i);var C=k(R=>{"use strict";var y=require("react");function z(i,e){return i===e&&(i!==0||1/i===1/e)||i!==i&&e!==e}var q=typeof Object.is=="function"?Object.is:z,Y=y.useState,H=y.useEffect,G=y.useLayoutEffect,J=y.useDebugValue;function Q(i,e){var t=e(),r=Y({inst:{value:t,getSnapshot:e}}),s=r[0].inst,n=r[1];return G(function(){s.value=t,s.getSnapshot=e,M(s)&&n({inst:s})},[i,t,e]),H(function(){return M(s)&&n({inst:s}),i(function(){M(s)&&n({inst:s})})},[i]),J(t),t}function M(i){var e=i.getSnapshot;i=i.value;try{var t=e();return!q(i,t)}catch{return!0}}function X(i,e){return e()}var Z=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?X:Q;R.useSyncExternalStore=y.useSyncExternalStore!==void 0?y.useSyncExternalStore:Z});var E=k((de,P)=>{"use strict";P.exports=C()});var ee={};W(ee,{RepositoryClass:()=>h,repositoryCreator:()=>$});module.exports=L(ee);var d="__PROVIDER_ID__",f=class extends Function{constructor(){super();let e;return e=(...t)=>e.__call(...t),Object.setPrototypeOf(e,new.target.prototype)}},m=class extends f{constructor(t,r,s,n){super();this.__call=t;this.__methods=s;this.__onUpdate=[];this.__listeners={};this.__criticalFields={};this.call=void 0,this.muppet=new Proxy({__init__:r},{get:n.bind(this)});for(let o in r)this.__listeners[o]=new Map,this[o]=r[o]}},x=(i,e,t)=>{function r(n,o){return n[d]&&typeof n[d]=="string"&&o!==n[d]&&o!=="__init__"&&(n[n[d]]=!1,this.__criticalFields[n[d]]=[...this.__criticalFields[n[d]]||[],o]),o==="__init__"?n.__init__:n[o]===void 0?n.__init__[o]:n[o]}function s(n,o,p){return n[o]=p,n.muppet.__init__=T(u({},n.muppet.__init__),{[o]:p}),n.__listeners[o]&&n.__listeners[o].size&&n.__listeners[o].forEach((a,c)=>{n.muppet[c]!==void 0&&n.muppet[c]===!1&&(n.muppet[c]=!0),a()}),Array.isArray(n.__onUpdate)&&o!=="__onUpdate"&&(n.__onUpdate.forEach(a=>a()),n.__onUpdate=[]),!0}return new Proxy(new m(e,i,t,r),{set:s})};var g=class{constructor(){this.keys=[];this.SPECIAL_KEY=d}init(e,t={}){typeof e=="object"&&!Array.isArray(e)&&(this.keys=Object.keys(e||{}),this.sourceObj=x(e,t.provider,t.methods)),t.broadcastName&&this.createBroadcast(t.broadcastName)}createBroadcast(e="broadcastWatcher"){this.broadcast=new BroadcastChannel(e),this.broadcast.onmessage=({data:t})=>{if(t==="needSome")this.broadcast.postMessage({data:this.get()});else if(t.type===void 0)for(let r in t.data)this.sourceObj[r]=t.data[r];else this.set(t.type,t.data,!0)},this.broadcast.postMessage("needSome")}set(e,t,r=!1){this.sourceObj&&(this.sourceObj[e]=t),this.broadcast&&!r&&this.broadcast.postMessage({type:e,data:t})}get(e){if(this.sourceObj&&e)return this.sourceObj.muppet[e];if(!e)return this.sourceObj.muppet.__init__}watch(e){return new Promise(t=>{this.sourceObj.__onUpdate=[...this.sourceObj.__onUpdate,()=>{this.sourceObj[e]&&t(this.sourceObj[e])}]})}watchFor(e,t){return new Promise(r=>{this.sourceObj.__onUpdate=[...this.sourceObj.__onUpdate,()=>{this.sourceObj[e]===t&&r(this.sourceObj[e])}]})}},S=(i,e,t,r)=>{let s=new g;return s.init(i,{provider:e,methods:t,broadcastName:r}),s};var l=O(require("react")),j=O(E());function A(i){let e=j.useSyncExternalStore,t=!1,r=l.default.useId?l.default.useId():l.default.useRef(parseInt(String(Math.random()*1e7),10).toString()).current;l.default.useId&&(e=l.default.useSyncExternalStore,t=!0);let s=e(n=>(this.__criticalFields[r]&&this.__criticalFields[r].forEach(o=>{this.__listeners[o]&&typeof this.__listeners[o]!="function"&&this.__listeners[o].set(r,n)}),t?()=>{this.__criticalFields[r]&&(this.muppet[r]=!1,this.__criticalFields[r].forEach(o=>{this.__listeners[o]&&typeof this.__listeners[o]!="function"&&this.__listeners[o].delete(r)}))}:()=>{}),()=>(this.muppet.__PROVIDER_ID__=r,this.muppet[r]===!0?(delete this.muppet.__PROVIDER_ID__,t||(this.muppet[r]=!1),t?this.muppet.__init__:u({},this.muppet)):this.muppet));return l.default.useEffect(()=>()=>{this.muppet[r]&&this.__criticalFields[r]&&(t||this.__criticalFields[r.current].forEach(n=>{this.__listeners[n]&&typeof this.__listeners[n]!="function"&&this.__listeners[n].delete(r.current)}),delete this.__criticalFields[r],delete this.muppet[r])},[]),i!==void 0?s[i]:[s,this.__methods]}var h=class extends f{constructor(t,r){super();this._watcherFactory=t;this._provider=r;this.keys=[];this.actions=this.initRepository()}__call(t,r,s){let n,o=null;return r?(n=(r.constructor.name==="Object"?Object.keys(r):Object.getOwnPropertyNames(Object.getPrototypeOf(r))).reduce((a,c)=>c!=="constructor"&&typeof r[c]=="function"?T(u({},a),{[c]:r[c].bind(r)}):a,{}),r.repo||(r.repo=u({initializeState:this.initializeState,initRepository:this.initRepository},this)),r.repo.initializeState(t,n,s)):o=this.initRepository(t,n,s),(o||r.repo.actions).sourceObj}initializeState(t,r,s){this.actions=this.initRepository(t,r,s)}initRepository(t,r,s){this.keys=Object.keys(t||{});let n=this.keys.reduce((o,p)=>{let a;return this.actions!==void 0&&this.actions.get(p)!==void 0?a=this.actions.get(p):a=t[p],T(u({},o),{[p]:a})},t||{});return this._watcherFactory(n,this._provider,r,s)}},$=i=>new h(S,i||A);
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
