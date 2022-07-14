var U=Object.create;var T=Object.defineProperty,K=Object.defineProperties,V=Object.getOwnPropertyDescriptor,A=Object.getOwnPropertyDescriptors,L=Object.getOwnPropertyNames,v=Object.getOwnPropertySymbols,W=Object.getPrototypeOf,b=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var O=(n,t,e)=>t in n?T(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e,u=(n,t)=>{for(var e in t||(t={}))b.call(t,e)&&O(n,e,t[e]);if(v)for(var e of v(t))z.call(t,e)&&O(n,e,t[e]);return n},c=(n,t)=>K(n,A(t));var x=(n,t)=>()=>(t||n((t={exports:{}}).exports,t),t.exports),F=(n,t)=>{for(var e in t)T(n,e,{get:t[e],enumerable:!0})},M=(n,t,e,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of L(t))!b.call(n,i)&&i!==e&&T(n,i,{get:()=>t[i],enumerable:!(r=V(t,i))||r.enumerable});return n};var q=(n,t,e)=>(e=n!=null?U(W(n)):{},M(t||!n||!n.__esModule?T(e,"default",{value:n,enumerable:!0}):e,n)),Y=n=>M(T({},"__esModule",{value:!0}),n);var S=x(I=>{"use strict";var d=require("react");function B(n,t){return n===t&&(n!==0||1/n===1/t)||n!==n&&t!==t}var N=typeof Object.is=="function"?Object.is:B,H=d.useState,$=d.useEffect,G=d.useLayoutEffect,J=d.useDebugValue;function Q(n,t){var e=t(),r=H({inst:{value:e,getSnapshot:t}}),i=r[0].inst,o=r[1];return G(function(){i.value=e,i.getSnapshot=t,g(i)&&o({inst:i})},[n,e,t]),$(function(){return g(i)&&o({inst:i}),n(function(){g(i)&&o({inst:i})})},[n]),J(e),e}function g(n){var t=n.getSnapshot;n=n.value;try{var e=t();return!N(n,e)}catch{return!0}}function X(n,t){return t()}var Z=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?X:Q;I.useSyncExternalStore=d.useSyncExternalStore!==void 0?d.useSyncExternalStore:Z});var j=x((le,C)=>{"use strict";C.exports=S()});var te={};F(te,{repka:()=>ee});module.exports=Y(te);var a="__PROVIDER_ID__",l=class extends Function{constructor(){super();let t;return t=(...e)=>t.__call(...e),Object.setPrototypeOf(t,new.target.prototype)}},m=class extends l{constructor(e,r,i){super();this.__call=e;this.__methods=i;this.__onUpdate=[];this.__listeners={};this.muppet=new Proxy({},{get(e,r){return e[a]&&typeof e[a]=="string"&&r!==e[a]&&(e[e[a]]?e[e[a]]=c(u({},e[e[a]]),{[r]:e.init[r]||void 0}):e[e[a]]={[r]:e.init[r]||void 0}),e[r]?e[r]:e.init[r]}});this.call=void 0,this.muppet.init=r;for(let o in r)this[o]=r[o]}},R=(n,t,e)=>new Proxy(new m(t,n,e),{set(r,i,o){if(r[i]=o,r.__listeners[i]&&r.__listeners[i].size)for(let[s,p]of r.__listeners[i])r.muppet[s]&&(r.muppet[s]=c(u({},r.muppet[s]),{[i]:o})),p();return Array.isArray(r.__onUpdate)&&i!=="onUpdate"&&(r.__onUpdate.forEach(s=>s()),r.__onUpdate=[]),!0}});var f=class extends l{constructor(e,r){super();this._watcherFactory=e;this._provider=r;this.keys=[];this.provider=r,this.actions=this.initRepository()}__call(e,r,i){let o,s,p=null;return r&&(s=(r.constructor.name==="Object"?Object.keys(r):Object.getOwnPropertyNames(Object.getPrototypeOf(r))).reduce((k,h)=>h!=="constructor"&&typeof r[h]=="function"?c(u({},k),{[h]:r[h].bind(r)}):k,{})),r?r.repo?(r.repo.initializeState(e),r.repo.initializeState(e,s)):(r.repo=this,r.repo.initializeState(e),r.repo.initializeState(e,s)):p=this.initRepository(e,s),i&&(o=new BroadcastChannel(`repository-${i}`),o.onmessage=({data:y})=>{y==="needSome"?o.postMessage({data:(p||r.repo.actions).convertToObject()}):y.type===void 0?this.initRepository(y.data):(p||r.repo.actions).set(y.type,y.data)},o.postMessage("needSome")),(p||r.repo.actions).sourceObj}initializeState(e,r){this.actions=this.initRepository(e,r)}initRepository(e,r){this.keys=Object.keys(e||{});let i=this.keys.reduce((o,s)=>{let p;return this.actions!==void 0&&this.actions.get(s)!==void 0?p=this.actions.get(s):p=e[s],c(u({},o),{[s]:p})},e||{});return this._watcherFactory(i,this.provider,r)}convertToObject(){return this.keys.reduce((e,r)=>c(u({},e),{[r]:this.actions.get(r)}),{})}};var w=class{constructor(){this.SPECIAL_KEY=a}init(t,e,r){typeof t=="object"&&(this.sourceObj=R(t,e,r))}set(t,e){this.sourceObj&&t!=="name"&&t!=="length"&&(this.sourceObj[t]=e)}get(t){if(this.sourceObj&&t)return this.sourceObj[t]}watch(t){return new Promise(e=>{this.sourceObj.__onUpdate=[...this.sourceObj.__onUpdate,()=>{this.sourceObj[t]&&e(this.sourceObj[t])}]})}watchFor(t,e){return new Promise(r=>{this.sourceObj.__onUpdate=[...this.sourceObj.__onUpdate,()=>{this.sourceObj[t]===e&&r(this.sourceObj[t])}]})}},P=(n,t,e)=>{let r=new w;return r.init(n,t,e),r};var _=require("react"),E=q(j());function D(){let n=(0,_.useRef)(parseInt(String(Math.random()*1e7),10).toString()),t=(0,E.useSyncExternalStore)(e=>{this.muppet[n.current]&&Object.keys(this.muppet[n.current]).forEach(r=>{this.__listeners[r]?this.__listeners[r].set(n.current,e):this.__listeners[r]=new Map([[n.current,e]])})},()=>(this.muppet.__PROVIDER_ID__=n.current,this.muppet[n.current]?(delete this.muppet.__PROVIDER_ID__,this.muppet[n.current]):this.muppet));return(0,_.useEffect)(()=>()=>{this.muppet[n.current]&&(Object.keys(this.muppet[n.current]).forEach(e=>{this.__listeners[e]&&this.__listeners[e].delete(n.current)}),delete this.muppet[n.current])},[]),[t,this.__methods]}var ee=new f(P,D);
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
