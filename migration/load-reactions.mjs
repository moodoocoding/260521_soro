import { readFileSync } from "node:fs";
const KEY=process.env.FB_KEY, P=process.env.FB_PROJECT;
const BASE=`https://firestore.googleapis.com/v1/projects/${P}/databases/(default)/documents`;
const r=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:process.env.FB_EMAIL,password:process.env.FB_PASSWORD,returnSecureToken:true})});
const {idToken}=await r.json();
const val=v=>typeof v==="string"?{stringValue:v}:typeof v==="boolean"?{booleanValue:v}:Number.isInteger(v)?{integerValue:String(v)}:{stringValue:String(v)};
const doc=o=>({fields:Object.fromEntries(Object.entries(o).map(([k,v])=>[k,val(v)]))});
const rx=JSON.parse(readFileSync("build/firestore-reactions.json","utf8"));
let ok=0;
for (let i=0;i<rx.length;i+=20){
  const chunk=rx.slice(i,i+20);
  const res=await Promise.all(chunk.map(async x=>{
    const {_id,...rest}=x;
    const r=await fetch(`${BASE}/reactions/${_id}`,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:`Bearer ${idToken}`},body:JSON.stringify(doc(rest))});
    return r.ok;
  }));
  ok+=res.filter(Boolean).length;
}
console.log(`반응 적재: ${ok}/${rx.length}`);
