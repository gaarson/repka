var u=Object.defineProperty,v=Object.defineProperties,I=Object.getOwnPropertyDescriptor,O=Object.getOwnPropertyDescriptors,C=Object.getOwnPropertyNames,g=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var b=(o,e,t)=>e in o?u(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,l=(o,e)=>{for(var t in e||(e={}))M.call(e,t)&&b(o,t,e[t]);if(g)for(var t of g(e))x.call(e,t)&&b(o,t,e[t]);return o},y=(o,e)=>v(o,O(e));var R=(o,e)=>{for(var t in e)u(o,t,{get:e[t],enumerable:!0})},S=(o,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of C(e))!M.call(o,s)&&s!==t&&u(o,s,{get:()=>e[s],enumerable:!(r=I(e,s))||r.enumerable});return o};var P=o=>S(u({},"__esModule",{value:!0}),o);var A={};R(A,{createRepository:()=>j});module.exports=P(A);var d="__PROVIDER_ID__",T=class extends Function{constructor(){super();let e;return e=(...t)=>e.__call(...t),Object.setPrototypeOf(e,new.target.prototype)}},_=class extends T{constructor(t,r,s,i){super();this.__call=t;this.__methods=s;this.__onUpdate=[];this.__listeners={};this.__criticalFields={};this.call=void 0,this.muppet=new Proxy({__init__:r},{get:i.bind(this)});for(let n in r)this.__listeners[n]=new Map,this[n]=r[n]}},m=(o,e,t)=>{function r(i,n){return i[d]&&typeof i[d]=="string"&&n!==i[d]&&n!=="__init__"&&(i[i[d]]=!1,this.__criticalFields[i[d]]=[...this.__criticalFields[i[d]]||[],n]),n==="__init__"?i.__init__:i[n]===void 0?i.__init__[n]:i[n]}function s(i,n,p){return i[n]=p,i.muppet.__init__=y(l({},i.muppet.__init__),{[n]:p}),i.__listeners[n]&&i.__listeners[n].size&&i.__listeners[n].forEach((a,c)=>{i.muppet[c]!==void 0&&i.muppet[c]===!1&&(i.muppet[c]=!0),a()}),Array.isArray(i.__onUpdate)&&n!=="__onUpdate"&&(i.__onUpdate.forEach(a=>a()),i.__onUpdate=[]),!0}return new Proxy(new _(e,o,t,r),{set:s})};var h=class extends T{constructor(t,r){super();this._watcherFactory=t;this._provider=r;this.keys=[];this.actions=this.initRepository()}__call(t,r,s){let i,n=null;return r?(i=(r.constructor.name==="Object"?Object.keys(r):Object.getOwnPropertyNames(Object.getPrototypeOf(r))).reduce((a,c)=>c!=="constructor"&&typeof r[c]=="function"?y(l({},a),{[c]:r[c].bind(r)}):a,{}),r.repo||(r.repo=l({initializeState:this.initializeState,initRepository:this.initRepository},this)),r.repo.initializeState(t,i,s)):n=this.initRepository(t,i,s),(n||r.repo.actions).sourceObj}initializeState(t,r,s){this.actions=this.initRepository(t,r,s)}initRepository(t,r,s){this.keys=Object.keys(t||{});let i=this.keys.reduce((n,p)=>{let a;return this.actions!==void 0&&this.actions.get(p)!==void 0?a=this.actions.get(p):a=t[p],y(l({},n),{[p]:a})},t||{});return this._watcherFactory(i,this._provider,r,s)}};function w(o,e){return new h(o,e)}var f=class{constructor(){this.keys=[];this.SPECIAL_KEY=d}init(e,t={}){typeof e=="object"&&!Array.isArray(e)&&(this.keys=Object.keys(e||{}),this.sourceObj=m(e,t.provider,t.methods)),t.broadcastName&&this.createBroadcast(t.broadcastName)}createBroadcast(e="broadcastWatcher"){this.broadcast=new BroadcastChannel(e),this.broadcast.onmessage=({data:t})=>{if(t==="needSome")this.broadcast.postMessage({data:this.get()});else if(t.type===void 0)for(let r in t.data)this.sourceObj[r]=t.data[r];else this.set(t.type,t.data,!0)},this.broadcast.postMessage("needSome")}set(e,t,r=!1){this.sourceObj&&(this.sourceObj[e]=t),this.broadcast&&!r&&this.broadcast.postMessage({type:e,data:t})}get(e){if(this.sourceObj&&e)return this.sourceObj.muppet[e];if(!e)return this.sourceObj.muppet.__init__}watch(e){return new Promise(t=>{this.sourceObj.__onUpdate=[...this.sourceObj.__onUpdate,()=>{this.sourceObj[e]&&t(this.sourceObj[e])}]})}watchFor(e,t){return new Promise(r=>{this.sourceObj.__onUpdate=[...this.sourceObj.__onUpdate,()=>{this.sourceObj[e]===t&&r(this.sourceObj[e])}]})}},k=(o,e,t,r)=>{let s=new f;return s.init(o,{provider:e,methods:t,broadcastName:r}),s};function j(o){return w(k,o)}
