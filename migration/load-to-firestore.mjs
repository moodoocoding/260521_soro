// ============================================================
// 3단계 (3) — 변환한 데이터를 Firestore 에 넣기
//
// 이전 전용 임시 규칙이 적용된 상태에서만 동작합니다.
// 끝나면 반드시 원래 보안 규칙을 다시 배포해야 합니다.
// ============================================================
import { readFileSync } from "node:fs";

const KEY = process.env.FB_KEY;
const PROJECT = process.env.FB_PROJECT;
const EMAIL = process.env.FB_EMAIL;
const PASSWORD = process.env.FB_PASSWORD;
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`, {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true })
});
const { idToken } = await r.json();
if (!idToken) { console.error("로그인 실패"); process.exit(1); }

function val(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(val) } };
  if (typeof v === "object") return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, val(x)])) } };
  return { stringValue: String(v) };
}
const doc = o => ({ fields: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, val(v)])) });

async function put(path, obj) {
  for (let i = 0; i < 4; i++) {
    const res = await fetch(`${BASE}/${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify(doc(obj))
    });
    if (res.ok) return true;
    if (res.status === 429 || res.status >= 500) { await new Promise(r => setTimeout(r, 800 * (i + 1))); continue; }
    console.error(`  실패 ${res.status}: ${path}`);
    return false;
  }
  return false;
}

// 동시에 너무 많이 보내지 않도록 묶어서 처리합니다.
async function batch(items, fn, size = 25, label = "") {
  let ok = 0;
  for (let i = 0; i < items.length; i += size) {
    const chunk = items.slice(i, i + size);
    const rs = await Promise.all(chunk.map(fn));
    ok += rs.filter(Boolean).length;
    process.stdout.write(`\r  ${label} ${Math.min(i + size, items.length)}/${items.length}`);
  }
  console.log(`  → 성공 ${ok}/${items.length}`);
  return ok;
}

const users = JSON.parse(readFileSync("build/firestore-users.json", "utf8"));
const subs = JSON.parse(readFileSync("build/firestore-submissions.json", "utf8"));
const settings = JSON.parse(readFileSync("build/firestore-settings.json", "utf8"));

console.log("[설정]");
await batch(settings, s => put(`settings/${s.key}`, { value: s.value }), 10, "설정");

console.log("[사용자 프로필]");
await batch(users, u => { const { uid, ...rest } = u; return put(`users/${uid}`, rest); }, 25, "프로필");

console.log("[제출물]");
await batch(subs, s => { const { _id, ...rest } = s; return put(`submissions/${_id}`, rest); }, 25, "제출물");

console.log("\n완료.");
