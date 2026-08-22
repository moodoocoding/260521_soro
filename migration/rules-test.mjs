// ============================================================
// Firestore 보안 규칙 검증 (2단계)
//
// 실행:  node rules-test.mjs
//
// 시험용 프로젝트(soro-migration-test)의 값들입니다.
//  - API 키는 Firebase 웹 앱 설정값으로, 원래 클라이언트에 공개되는 값입니다
//  - 계정 2개는 이 시험만을 위한 가짜 계정입니다 (실제 학생 아님)
// 실제 운영 프로젝트에 쓰는 값이 아니므로 그대로 커밋합니다.
//
// 막는 것만 시험하면 "전부 막는 규칙"도 통과하므로,
// 정상 동작(제출·재제출·반응)도 함께 확인합니다.
// ============================================================

const KEY = "AIzaSyDe9QrX3PWh67cl9_B8LoM8Q6BOsJNLVf8";
const BASE = "https://firestore.googleapis.com/v1/projects/soro-migration-test/databases/(default)/documents";

async function signIn(email, password) {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ email, password, returnSecureToken:true })});
  const j = await r.json();
  return { token: j.idToken, uid: j.localId };
}
function val(v){
  if (typeof v==="string") return {stringValue:v};
  if (typeof v==="boolean") return {booleanValue:v};
  if (Number.isInteger(v)) return {integerValue:String(v)};
  if (v && typeof v==="object") return {mapValue:{fields:Object.fromEntries(Object.entries(v).map(([k,x])=>[k,val(x)]))}};
  return {nullValue:null};
}
const doc = o => ({fields:Object.fromEntries(Object.entries(o).map(([k,v])=>[k,val(v)]))});
const write = async (p,o,t) => (await fetch(`${BASE}/${p}`,{method:"PATCH",headers:{"Content-Type":"application/json",...(t?{Authorization:`Bearer ${t}`}:{})},body:JSON.stringify(doc(o))})).ok;
const del   = async (p,t)   => (await fetch(`${BASE}/${p}`,{method:"DELETE",headers:t?{Authorization:`Bearer ${t}`}:{}})).ok;

const rows=[];
const check=(n,got,want)=>rows.push({시험:n,결과:got?"허용":"거부",기대:want?"허용":"거부",판정:got===want?"✅":"❌"});

// 도서관 공모전이 지금 열려 있는지 먼저 읽습니다.
// 이전된 실제 설정을 그대로 쓰므로, 잠겨 있으면 "제출 거부"가 정상입니다.
const lockRes = await fetch(`${BASE}/settings/contest_lock_library`);
const lockJson = lockRes.ok ? await lockRes.json() : null;
const libraryOpen = lockJson?.fields?.value?.booleanValue === false;
console.log(`도서관 공모전 상태: ${libraryOpen ? "접수 중" : "마감"} — 이에 맞춰 기대값을 정합니다\n`);

const A = await signIn("u6912bc044c36706a9f08c685@soro.local","pw-student-a");
const B = await signIn("u240ce1ee815bc2b33a4d3a1a@soro.local","pw-student-b");

const entry = uid => ({ uid, contestId:"library", contestTitle:"온라인 도서관",
  studentName:"학생", studentGrade:5, studentClass:1, studentNumber:11,
  timestamp:"2026-08-22", data:{ image:"https://drive.google.com/x", "book-title":"어린 왕자" } });

// ── 정상 동작 ──
check(`A가 본인 제출 (도서관 ${libraryOpen ? "접수중" : "마감"})`, await write(`submissions/library__${A.uid}`, entry(A.uid), A.token), libraryOpen);
check(`A가 자기 제출 수정 (도서관 ${libraryOpen ? "접수중" : "마감"})`, await write(`submissions/library__${A.uid}`, {...entry(A.uid), timestamp:"2026-08-23"}, A.token), libraryOpen);
const targetSub = `library__${A.uid}`;
check("B가 A 작품에 반응", await write(`reactions/${targetSub}__${B.uid}__heart`, {submissionId:targetSub, uid:B.uid, type:"heart"}, B.token), true);
check("B가 자기 반응 취소", await del(`reactions/${targetSub}__${B.uid}__heart`, B.token), true);

// ── 차단되어야 하는 것 ──
check("A가 자기 작품에 반응", await write(`reactions/library__${A.uid}__${A.uid}__heart`, {submissionId:`library__${A.uid}`, uid:A.uid, type:"heart"}, A.token), false);
check("B가 A 작품을 삭제", await del(`submissions/library__${A.uid}`, B.token), false);
check("A가 잠긴 공모전(키링)에 제출", await write(`submissions/keyring__${A.uid}`, {...entry(A.uid), contestId:"keyring"}, A.token), false);
check("A가 스스로 수상 표시를 붙임", await write(`submissions/library__${A.uid}`, {...entry(A.uid), award:"grand"}, A.token), false);
check("B가 A 이름으로 반응 위조", await write(`reactions/library__${A.uid}__${B.uid}__art`, {submissionId:`library__${A.uid}`, uid:A.uid, type:"art"}, B.token), false);
check("A가 허용되지 않은 반응 종류 사용", await write(`reactions/library__${A.uid}__${B.uid}__evil`, {submissionId:`library__${A.uid}`, uid:B.uid, type:"evil"}, B.token), false);

// ── 정리 ──
await del(`submissions/library__${A.uid}`, A.token);

const pass = rows.filter(r=>r.판정==="✅").length;
console.table(rows);
console.log(`\n통과 ${pass} / ${rows.length}`);
