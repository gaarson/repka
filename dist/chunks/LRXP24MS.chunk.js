var c=class extends Function{constructor(){super();let n;return n=(...a)=>n.__call(...a),Object.setPrototypeOf(n,new.target.prototype)}},i="__PROVIDER_ID__",e="__REPO__",p=(t,n)=>(t[`${e}muppet`][i]&&n!==t[`${e}muppet`][i]&&!n.startsWith(e)&&(t[`${e}muppet`][t[`${e}muppet`][i]]=!1,t[`${e}criticalFields`][t[`${e}muppet`][i]]=[...new Set([...t[`${e}criticalFields`][t[`${e}muppet`][i]]||[],n])]),n.startsWith(e)||n==="__call"?t[n]:t[`${e}data`][n]),$=(t,n,a)=>n.startsWith(e)||n==="__call"?(t[n]=a,!0):(t[`${e}data`]={...t[`${e}data`],[n]:a},t[`${e}listeners`][n]&&t[`${e}listeners`][n].size&&t[`${e}listeners`][n].forEach((s,r)=>{t[`${e}muppet`][r]!==void 0&&t[`${e}muppet`][r]===!1&&(t[`${e}muppet`][r]=!0),s()}),t[`${e}onUpdate`].length&&t[`${e}onUpdate`].forEach(s=>s&&s(n)),!0),o=(t,n,a)=>{try{let s=function(){return a?[this,a]:this},r=new c;a&&(r[`${e}methods`]=a),r[`${e}onUpdate`]=[],r[`${e}data`]=t,r[`${e}criticalFields`]={},r[`${e}muppet`]={},r[`${e}listeners`]=Object.keys(t).reduce((d,l)=>({...d,[l]:new Map}),{});let u=new Proxy(r,{set:$,get:p});return r.__call=(n||s).bind(u),u}catch(s){console.error("SOURCE OBJECT ERROR: ",s)}};export{c as a,i as b,e as c,o as d};
