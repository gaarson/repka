var a=Object.defineProperty,m=Object.defineProperties,w=Object.getOwnPropertyDescriptor,k=Object.getOwnPropertyDescriptors,h=Object.getOwnPropertyNames,c=Object.getOwnPropertySymbols;var f=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var y=(n,e,r)=>e in n?a(n,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[e]=r,g=(n,e)=>{for(var r in e||(e={}))f.call(e,r)&&y(n,r,e[r]);if(c)for(var r of c(e))x.call(e,r)&&y(n,r,e[r]);return n},M=(n,e)=>m(n,k(e));var I=(n,e)=>{for(var r in e)a(n,r,{get:e[r],enumerable:!0})},v=(n,e,r,_)=>{if(e&&typeof e=="object"||typeof e=="function")for(let p of h(e))!f.call(n,p)&&p!==r&&a(n,p,{get:()=>e[p],enumerable:!(_=w(e,p))||_.enumerable});return n};var O=n=>v(a({},"__esModule",{value:!0}),n);var E={};I(E,{Callable:()=>T,SPECIAL_KEY:()=>s,Source:()=>d,createSource:()=>U});module.exports=O(E);var s="__PROVIDER_ID__",T=class extends Function{constructor(){super();let e;return e=(...r)=>e.__call(...r),Object.setPrototypeOf(e,new.target.prototype)}},d=class extends T{constructor(r,_,p,t){super();this.__call=r;this.__methods=p;this.__onUpdate=[];this.__listeners={};this.__criticalFields={};this.call=void 0,this.muppet=new Proxy({__init__:_},{get:t.bind(this)});for(let i in _)this.__listeners[i]=new Map,this[i]=_[i]}},U=(n,e,r)=>{function _(t,i){return t[s]&&typeof t[s]=="string"&&i!==t[s]&&i!=="__init__"&&(t[t[s]]=!1,this.__criticalFields[t[s]]=[...this.__criticalFields[t[s]]||[],i]),i==="__init__"?t.__init__:t[i]===void 0?t.__init__[i]:t[i]}function p(t,i,o){return t[i]=o,i!=="__onUpdate"&&(t.muppet.__init__=M(g({},t.muppet.__init__),{[i]:o})),t.__listeners[i]&&t.__listeners[i].size&&t.__listeners[i].forEach((u,l)=>{t.muppet[l]!==void 0&&t.muppet[l]===!1&&(t.muppet[l]=!0),u()}),Array.isArray(t.__onUpdate)&&i!=="__onUpdate"&&t.__onUpdate.forEach(u=>u&&u(i)),!0}return new Proxy(new d(e,n,r,_),{set:p})};
