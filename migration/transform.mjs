// ============================================================
// 3단계 (2) — 내보낸 데이터를 Firebase 형식으로 변환
//
// 입력:
//   users.csv                (스프레드시트 Users 시트를 CSV 로 받은 것)
//   export/submissions.json  (export-from-sheets.mjs 결과)
//   export/settings.json
//
// 출력 (build/ 폴더):
//   auth-users.json          firebase auth:import 용
//   firestore-users.json     users/{uid} 프로필
//   firestore-submissions.json
//   firestore-settings.json
//   report.txt               변환 과정에서 걸러낸 것들의 기록
//
// 실행:  node transform.mjs <users.csv 경로>
// ============================================================
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import crypto from "node:crypto";

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("사용법: node transform.mjs <users.csv 경로>");
  process.exit(1);
}

// ---------- 공통: userKey → Firebase 식별자 ----------
// make-import-file.js 와 반드시 같은 규칙이어야 합니다.
const uidOf = k => crypto.createHash("sha1").update(k).digest("hex").slice(0, 28);
const emailOf = k => "u" + crypto.createHash("sha256").update(k, "utf8").digest("hex").slice(0, 24) + "@soro.local";
const sha256hex = s => crypto.createHash("sha256").update(s, "utf8").digest("hex");
const hexToB64 = h => Buffer.from(h, "hex").toString("base64");
const isHash = s => /^[0-9a-f]{64}$/.test(s);

// 한국어 로케일 시각 → epoch (app.js 의 parseSubmissionTime 과 동일한 규칙)
function parseTime(value) {
  if (!value) return 0;
  const m = String(value).match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.?\s*(오전|오후)?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) {
    const [, y, mo, d, ampm, hh, mi, ss] = m;
    let hour = parseInt(hh, 10);
    if (ampm === "오후" && hour < 12) hour += 12;
    if (ampm === "오전" && hour === 12) hour = 0;
    return new Date(+y, +mo - 1, +d, hour, +mi, +(ss || 0)).getTime();
  }
  const p = new Date(value).getTime();
  return isNaN(p) ? 0 : p;
}

// 최소한의 CSV 파서 (따옴표 안의 쉼표·줄바꿈 처리)
function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim()));
}

const log = [];
const note = s => { log.push(s); console.log(s); };

mkdirSync("build", { recursive: true });

// ================= 사용자 =================
const csvRows = parseCsv(readFileSync(csvPath, "utf8"));
// 이 시트에는 헤더 행이 없습니다 (백엔드도 getStartIndex 로 확인 후 0부터 읽습니다).
// 혹시 헤더가 붙어 온 경우만 걸러냅니다.
const userRows = csvRows.filter(r => r[0]?.trim() !== "UserKey");

note(`[사용자] CSV 행 ${userRows.length}`);

const seen = new Map();
let plainUpgraded = 0, skipped = 0;

for (const r of userRows) {
  const [userKey, grade, classNum, number, name, pw] = r.map(x => (x ?? "").trim());
  if (!userKey || !grade || !name) { skipped++; continue; }

  // 같은 userKey 가 여러 번 나오면 마지막 것을 씁니다.
  // (확인 결과 이번 데이터의 중복 4건은 비밀번호까지 동일한 단순 중복입니다)
  if (seen.has(userKey)) note(`  중복 정리: ${userKey.slice(0, 8)}…`);

  // 아직 평문으로 남아 있는 계정은 여기서 해시로 바꿔 옮깁니다.
  // (원래는 학생이 다음 로그인 때 자동 전환되지만, 이전 시점에 미리 맞춰둡니다)
  let hash = pw;
  if (!isHash(pw)) { hash = sha256hex(pw); plainUpgraded++; }

  seen.set(userKey, {
    userKey,
    uid: uidOf(userKey),
    email: emailOf(userKey),
    grade: parseInt(grade, 10),
    classNum: parseInt(classNum, 10),
    number: parseInt(number, 10),
    name,
    passwordHash: hexToB64(hash)
  });
}

const users = [...seen.values()];
note(`  → 고유 계정 ${users.length}명 (중복 정리 ${userRows.length - users.length - skipped}, 형식 오류 ${skipped})`);
note(`  → 평문 비밀번호를 해시로 전환: ${plainUpgraded}건`);

writeFileSync("build/auth-users.json", JSON.stringify({
  users: users.map(u => ({
    localId: u.uid,
    email: u.email,
    emailVerified: true,
    passwordHash: u.passwordHash
  }))
}, null, 1));

writeFileSync("build/firestore-users.json", JSON.stringify(
  users.map(u => ({
    uid: u.uid,
    grade: u.grade, classNum: u.classNum, number: u.number, name: u.name,
    userKey: u.userKey
  })), null, 1));

// ================= 제출물 =================
const subs = JSON.parse(readFileSync("export/submissions.json", "utf8"));
const uidByUserKey = new Map(users.map(u => [u.userKey, u.uid]));

note(`\n[제출물] 내보낸 행 ${subs.length}`);

const best = new Map();   // contestId__uid → 가장 최근 제출
let noContest = 0;

// 명단(Users 시트)에는 없지만 제출물은 남아 있는 학생들이 있습니다.
// 계정만 지워지고 작품은 남은 경우로, 이 작품들은 지금도 갤러리에 보입니다.
// 작품을 버리지 않기로 해서(사용자 확인), 제출물에 들어있는 학년·반·번호·이름으로
// 프로필만 만들어 함께 옮깁니다. 비밀번호가 없으므로 로그인은 되지 않고 전시만 됩니다.
const ghostProfiles = new Map();

for (const s of subs) {
  const contestId = s.contestId;
  let uid = uidByUserKey.get(s.studentUsername);

  if (!contestId) { noContest++; continue; }

  if (!uid && s.studentUsername) {
    uid = uidOf(s.studentUsername);
    if (!ghostProfiles.has(uid)) {
      ghostProfiles.set(uid, {
        uid,
        grade: Number(s.studentGrade) || 0,
        classNum: Number(s.studentClass) || 0,
        number: Number(s.studentNumber) || 0,
        name: s.studentName || "",
        userKey: s.studentUsername,
        inactive: true   // 로그인 불가 — 작품 전시 목적의 프로필
      });
    }
  }
  if (!uid) { noContest++; continue; }

  const docId = `${contestId}__${uid}`;
  const t = parseTime(s.timestamp);
  const prev = best.get(docId);
  if (!prev || t > prev._t) {
    best.set(docId, {
      _t: t,
      _id: docId,
      _oldId: s.id,
      uid,
      contestId,
      contestTitle: s.contestTitle || "",
      studentName: s.studentName || "",
      studentGrade: Number(s.studentGrade) || 0,
      studentClass: Number(s.studentClass) || 0,
      studentNumber: Number(s.studentNumber) || 0,
      timestamp: s.timestamp,
      timestampMs: t,
      data: s.data && typeof s.data === "object" ? s.data : {}
    });
  }
}

const submissions = [...best.values()];
note(`  → 문서 ${submissions.length}개 (한 학생당 공모전별 1개로 통합)`);
note(`  → 통합되며 합쳐진 중복 제출: ${subs.length - submissions.length - noContest}건`);
if (ghostProfiles.size) {
  note(`  → 명단에 없지만 작품이 남아있는 학생 ${ghostProfiles.size}명: 프로필을 만들어 작품 보존 (로그인 불가)`);
}
if (noContest) note(`  → contestId 없어 제외: ${noContest}건`);

// 위에서 만든 보존용 프로필을 사용자 목록에 합칩니다.
if (ghostProfiles.size) {
  const merged = JSON.parse(readFileSync("build/firestore-users.json", "utf8"));
  merged.push(...ghostProfiles.values());
  writeFileSync("build/firestore-users.json", JSON.stringify(merged, null, 1));
  note(`  → Firestore 프로필 합계 ${merged.length}명 (로그인 가능 ${users.length} + 전시 전용 ${ghostProfiles.size})`);
}

// 옛 id → 새 문서 id 대응표. 반응을 옮길 때 필요합니다.
const idMap = Object.fromEntries(submissions.map(s => [s._oldId, s._id]));
writeFileSync("build/submission-id-map.json", JSON.stringify(idMap, null, 1));

writeFileSync("build/firestore-submissions.json", JSON.stringify(
  submissions.map(({ _t, _oldId, ...rest }) => rest), null, 1));

// ================= 설정 =================
const settings = JSON.parse(readFileSync("export/settings.json", "utf8"));
const settingDocs = [];
for (const [contestId, locked] of Object.entries(settings.locks || {})) {
  settingDocs.push({ key: `contest_lock_${contestId}`, value: locked === true || locked === "true" });
}
if (settings.activeRound != null) {
  settingDocs.push({ key: "zepquiz_active_round", value: String(settings.activeRound) });
}
writeFileSync("build/firestore-settings.json", JSON.stringify(settingDocs, null, 1));
note(`\n[설정] 문서 ${settingDocs.length}개`);

writeFileSync("build/report.txt", log.join("\n") + "\n");
note(`\n결과를 build/ 에 저장했습니다.`);
