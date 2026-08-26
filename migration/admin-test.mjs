// 관리자 권한 검증 — 학생과 관리자가 같은 동작을 시도했을 때의 차이를 봅니다.
const KEY="AIzaSyDe9QrX3PWh67cl9_B8LoM8Q6BOsJNLVf8";
const BASE="https://firestore.googleapis.com/v1/projects/soro-migration-test/databases/(default)/documents";
const ADMIN_PW = process.env.ADMIN_PW;
if (!ADMIN_PW) { console.error("ADMIN_PW 환경변수가 필요합니다."); process.exit(1); }

async function signIn(email, pw){
  const r=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pw,returnSecureToken:true})});
  const j=await r.json(); if(!j.idToken) throw new Error("로그인 실패: "+(j.error?.message||"")); return j.idToken;
}
const put=async(p,f,t)=>(await fetch(`${BASE}/${p}`,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({fields:f})})).ok;
const rows=[]; const check=(n,got,want)=>rows.push({시험:n,결과:got?"허용":"거부",기대:want?"허용":"거부",판정:got===want?"✅":"❌"});

const admin = await signIn("u0f2052e0c6e9e3f81573e067@soro.local", ADMIN_PW);
const student = await signIn("u6912bc044c36706a9f08c685@soro.local", "pw-student-a");

// 같은 동작을 관리자와 학생이 각각 시도
check("관리자가 공모전 잠금 변경", await put("settings/contest_lock_pixelart",{value:{booleanValue:true}},admin), true);
check("학생이 공모전 잠금 변경",   await put("settings/contest_lock_pixelart",{value:{booleanValue:false}},student), false);
check("관리자가 활성 회차 변경",   await put("settings/zepquiz_active_round",{value:{stringValue:"3"}},admin), true);
check("학생이 활성 회차 변경",     await put("settings/zepquiz_active_round",{value:{stringValue:"9"}},student), false);
check("관리자가 학급 정원 설정",   await put("settings/zep_student_count_5-1",{value:{integerValue:"25"}},admin), true);
check("학생이 학급 정원 설정",     await put("settings/zep_student_count_5-1",{value:{integerValue:"99"}},student), false);

console.table(rows);
console.log(`통과 ${rows.filter(r=>r.판정==="✅").length} / ${rows.length}`);
