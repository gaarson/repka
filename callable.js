var T=Object.defineProperty,f=Object.defineProperties,k=Object.getOwnPropertyDescriptor,m=Object.getOwnPropertyDescriptors,w=Object.getOwnPropertyNames,d=Object.getOwnPropertySymbols;var c=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var o=(r,t,e)=>t in r?T(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,_=(r,t)=>{for(var e in t||(t={}))c.call(t,e)&&o(r,e,t[e]);if(d)for(var e of d(t))x.call(t,e)&&o(r,e,t[e]);return r},l=(r,t)=>f(r,m(t));var I=(r,t)=>{for(var e in t)T(r,e,{get:t[e],enumerable:!0})},M=(r,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let p of w(t))!c.call(r,p)&&p!==e&&T(r,p,{get:()=>t[p],enumerable:!(n=k(t,p))||n.enumerable});return r};var O=r=>M(T({},"__esModule",{value:!0}),r);var v={};I(v,{Callable:()=>y,SPECIAL_KEY:()=>i,Source:()=>a,createSource:()=>h});module.exports=O(v);var i="__PROVIDER_ID__",y=class extends Function{constructor(){super();let t;return t=(...e)=>t.__call(...e),Object.setPrototypeOf(t,new.target.prototype)}},a=class extends y{constructor(e,n,p){super();this.__call=e;this.__methods=p;this.__onUpdate=[];this.__listeners={};this.muppet=new Proxy({},{get(e,n){return e[i]&&typeof e[i]=="string"&&n!==e[i]&&(e[e[i]]?e[e[i]]=l(_({},e[e[i]]),{[n]:e.init[n]||void 0}):e[e[i]]={[n]:e.init[n]||void 0}),e[n]?e[n]:e.init[n]}});this.call=void 0,this.muppet.init=n;for(let s in n)this[s]=n[s]}},h=(r,t,e)=>new Proxy(new a(t,r,e),{set(n,p,s){if(n[p]=s,n.__listeners[p]&&n.__listeners[p].size)for(let[u,g]of n.__listeners[p])n.muppet[u]&&(n.muppet[u]=l(_({},n.muppet[u]),{[p]:s})),g();return Array.isArray(n.__onUpdate)&&p!=="onUpdate"&&(n.__onUpdate.forEach(u=>u()),n.__onUpdate=[]),!0}});
