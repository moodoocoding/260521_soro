// ============================================================
// 3단계 (5) — 감상 반응 변환
//
// 옛 반응은 (제출물ID, 학생, 종류) 행으로 저장돼 있습니다.
// 새 구조는 문서 ID 자체를 "제출물__uid__종류" 로 두어
// 같은 반응이 두 번 저장되는 것이 구조적으로 불가능합니다.
//
// 실행:  node transform-reactions.mjs <Reactions.csv 경로>
// ============================================================
import { readFileSync, writeFileSync } from "node:fs";
import crypto from "node:crypto";

const csvPath = process.argv[2];
if (!csvPath) { console.error("사용법: node transform-reactions.mjs <Reactions.csv>"); process.exit(1); }

const uidOf = k => crypto.createHash("sha1").update(k).digest("hex").slice(0, 28);

function parseCsv(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i+1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim()));
}

const idMap = JSON.parse(readFileSync("build/submission-id-map.json", "utf8"));
const subs = JSON.parse(readFileSync("build/firestore-submissions.json", "utf8"));
const ownerOf = new Map(subs.map(s => [s._id, s.uid]));

let rows = parseCsv(readFileSync(csvPath, "utf8"));
if (rows[0]?.[0]?.trim() === "SubmissionID") rows = rows.slice(1);

const out = new Map();
let orphan = 0, dupe = 0, selfReact = 0, badType = 0;
const ALLOWED = ["read", "art", "heart"];

for (const r of rows) {
  const [oldSubId, userKey, type, timestamp] = r.map(x => (x ?? "").trim());
  if (!ALLOWED.includes(type)) { badType++; continue; }

  const newSubId = idMap[oldSubId];
  if (!newSubId) { orphan++; continue; }        // 대상 작품이 이미 사라짐

  const uid = uidOf(userKey);

  // 자기 작품에 남긴 반응도 그대로 옮깁니다. (실제 반응의 16%를 차지하는 자연스러운 사용 패턴)
  if (ownerOf.get(newSubId) === uid) selfReact++;

  const docId = `${newSubId}__${uid}__${type}`;
  if (out.has(docId)) { dupe++; continue; }     // 같은 반응 중복 행
  out.set(docId, { _id: docId, submissionId: newSubId, uid, type, timestamp });
}

writeFileSync("build/firestore-reactions.json", JSON.stringify([...out.values()], null, 1));

console.log(`반응 원본 ${rows.length}행`);
console.log(`  → 옮길 문서 ${out.size}개`);
console.log(`  → 중복 행 제외: ${dupe}건 (새 구조에서는 애초에 생길 수 없음)`);
console.log(`  → 대상 작품이 사라져 제외: ${orphan}건`);
if (selfReact) console.log(`  → 그중 자기 작품에 남긴 반응: ${selfReact}건 (제외하지 않고 함께 옮김)`);
if (badType) console.log(`  → 알 수 없는 종류라 제외: ${badType}건`);
