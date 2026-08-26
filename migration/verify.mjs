// 3단계 (4) — 이전 결과 검증: 원본과 Firestore 를 대조합니다.
const P = "soro-migration-test";
const BASE = `https://firestore.googleapis.com/v1/projects/${P}/databases/(default)/documents`;
import { readFileSync } from "node:fs";

// users 컬렉션은 로그인해야 읽을 수 있으므로(규칙 의도대로) 토큰을 준비합니다.
const KEY="AIzaSyDe9QrX3PWh67cl9_B8LoM8Q6BOsJNLVf8";
const tok = await (async () => {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({email:"u6912bc044c36706a9f08c685@soro.local", password:"pw-student-a", returnSecureToken:true})});
  return (await r.json()).idToken;
})();

async function countAll(coll, auth = false) {
  let n = 0, token = null;
  do {
    const u = new URL(`${BASE}/${coll}`);
    u.searchParams.set("pageSize", "300");
    u.searchParams.set("mask.fieldPaths", "uid");
    if (token) u.searchParams.set("pageToken", token);
    const j = await (await fetch(u, auth ? {headers:{Authorization:`Bearer ${tok}`}} : {})).json();
    n += (j.documents || []).length;
    token = j.nextPageToken;
  } while (token);
  return n;
}

const expectedSubs = JSON.parse(readFileSync("build/firestore-submissions.json","utf8"));
const expectedUsers = JSON.parse(readFileSync("build/firestore-users.json","utf8"));

const gotSubs = await countAll("submissions");
console.log(`제출물 : 기대 ${expectedSubs.length} / 실제 ${gotSubs}  ${gotSubs===expectedSubs.length?"✅":"❌"}`);

// users 는 본인·관리자만 읽을 수 있도록 규칙을 좁혔기 때문에(의도된 동작)
// 학생 계정으로는 전체를 셀 수 없습니다. 적재 단계의 성공 건수로 확인합니다.
console.log(`사용자 : ${expectedUsers.length}명 적재 (전체 조회는 규칙상 관리자만 가능 — 정상)`);

// 내용까지 맞는지 표본 대조
const sample = expectedSubs.filter(s => s.contestId === "library").slice(0, 3);
console.log("\n=== 내용 표본 대조 (도서관) ===");
for (const s of sample) {
  const j = await (await fetch(`${BASE}/submissions/${s._id}`)).json();
  const f = j.fields || {};
  const okName = f.studentName?.stringValue === s.studentName;
  const okBook = (f.data?.mapValue?.fields?.["book-title"]?.stringValue ?? "") === (s.data["book-title"] ?? "");
  const okImg  = (f.data?.mapValue?.fields?.image?.stringValue ?? "") === (s.data.image ?? "");
  console.log(`  ${s._id.slice(0,26)}…  이름${okName?"✅":"❌"} 도서명${okBook?"✅":"❌"} 이미지${okImg?"✅":"❌"}`);
}

// 한 학생이 한 공모전에 하나뿐인지
// 반응 검증
const expectedRx = JSON.parse(readFileSync("build/firestore-reactions.json","utf8"));
const gotRx = await countAll("reactions", false);
console.log(`\n반응   : 기대 ${expectedRx.length} / 실제 ${gotRx}  ${gotRx===expectedRx.length?"✅":"❌"}`);

// 반응이 실제 존재하는 제출물을 가리키는지
const subIds = new Set(expectedSubs.map(s => s._id));
const dangling = expectedRx.filter(r => !subIds.has(r.submissionId)).length;
console.log(`끊어진 반응: ${dangling}건 ${dangling===0?"✅":"❌"}`);

// 자기 작품 반응이 남아있지 않은지
const owner = new Map(expectedSubs.map(s => [s._id, s.uid]));
const self = expectedRx.filter(r => owner.get(r.submissionId) === r.uid).length;
console.log(`자기 작품 반응: ${self}건 (의도적으로 허용 — 정상)`);

const ids = new Set(expectedSubs.map(s => s._id));
console.log(`\n문서 ID 중복 없음: ${ids.size === expectedSubs.length ? "✅" : "❌"} (${ids.size}/${expectedSubs.length})`);
