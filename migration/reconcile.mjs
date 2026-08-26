// 재이전 시 Firestore 에만 남아있는(원본에서 사라진) 문서를 찾아 정리합니다.
// 적재는 덮어쓰기라 "삭제"는 반영되지 않기 때문에 필요합니다.
import { readFileSync } from "node:fs";
const KEY=process.env.FB_KEY, P=process.env.FB_PROJECT;
const BASE=`https://firestore.googleapis.com/v1/projects/${P}/databases/(default)/documents`;
const r=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:process.env.FB_EMAIL,password:process.env.FB_PASSWORD,returnSecureToken:true})});
const {idToken}=await r.json();

async function allIds(coll){
  let ids=[],token=null;
  do{
    const u=new URL(`${BASE}/${coll}`); u.searchParams.set("pageSize","300");
    u.searchParams.set("mask.fieldPaths","uid");
    if(token)u.searchParams.set("pageToken",token);
    const j=await (await fetch(u,{headers:{Authorization:`Bearer ${idToken}`}})).json();
    (j.documents||[]).forEach(d=>ids.push(d.name.split(`/documents/${coll}/`)[1]));
    token=j.nextPageToken;
  }while(token);
  return ids;
}

const expected = new Set(JSON.parse(readFileSync("build/firestore-submissions.json","utf8")).map(s=>s._id));
const actual = await allIds("submissions");
const stale = actual.filter(id=>!expected.has(id));

console.log(`Firestore ${actual.length}건 / 원본 기준 ${expected.size}건`);
console.log(`원본에서 사라진 문서: ${stale.length}건`);

const apply = process.argv.includes("--delete");
for (const id of stale) {
  console.log(`   ${apply?"삭제":"발견"}: ${id}`);
  if (apply) await fetch(`${BASE}/submissions/${id}`,{method:"DELETE",headers:{Authorization:`Bearer ${idToken}`}});
}
if (stale.length && !apply) console.log("\n실제로 지우려면 --delete 를 붙여 다시 실행하세요.");
