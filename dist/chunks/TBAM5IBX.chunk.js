import{a as _}from"./LGHY6XNV.chunk.js";import{a as m,b as c}from"./464H3A5W.chunk.js";import{b as r}from"./O3VCMV5J.chunk.js";import u from"react";import f from"react";function R(){let e="UnknownComponent";try{let n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;if(!n)return e;let a=n.ReactCurrentOwner?.current;if(!a)return e;let i=a.type;return i&&(i.displayName||i.name)||e}catch{return e}}function N(e,n,a,i){let s=e instanceof Error?e.message:String(e),o=new Error(`[Repka CRITICAL ERROR in <${n}>] 

Repka's magic getter (store.prop) caught an UNKNOWN React error. 
This is NOT the expected 'Invalid hook call' spam. 
(Known Spam Hash: ${a}, This Error Hash: ${i}) 

This is likely a CRITICAL React error (e.g., 'Rendered more hooks...'). 
Repka is crashing LOUDLY to prevent a "zombie component". 

Original error: 
> ${s}`);return o.cause=e,o}var d=(e,n)=>{let a=u.useSyncExternalStore;if(!a)return e[`${r}data`][n];let i=a(t=>{try{let s=n;e[`${r}listeners`][s]&&typeof e[`${r}listeners`][s].set=="function"&&e[`${r}listeners`][s].set(t,t),e[`${r}criticalFields`]&&typeof e[`${r}criticalFields`].set=="function"&&e[`${r}criticalFields`].set(t,[s]),e[`${r}muppet`]&&typeof e[`${r}muppet`].set=="function"&&e[`${r}muppet`].set(t,!0)}catch{}return()=>{try{e[`${r}muppet`]?.set(t,!1);let s=e[`${r}criticalFields`]?.get(t);s&&s.forEach(o=>{e[`${r}listeners`][o]?.delete(t)}),e[`${r}criticalFields`]?.delete(t),e[`${r}muppet`]?.delete(t)}catch{}}},()=>{try{return e[`${r}data`]}catch{return{}}},()=>{try{return e[`${r}data`]}catch{return{}}});return i?i[n]:e[`${r}data`][n]};function D(e){let n=_[_.length-1];if(n)return n.reportDependency(this,e),this[`${r}data`][e];let a=!1;if(u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?.H!==null&&(a=!0):u?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current&&(a=!0),!a)return this[`${r}data`][e];try{return d(this,e)}catch(i){if(!(i instanceof Error))throw i;let t=i.message.substring(0,200),s=m(t);if(c&&s===c)return this[`${r}data`][e];let o=R();throw N(i,o,c,s)}}export{N as a,d as b,D as c};
