// ============================================================
// 3단계 (1) — 현재 Apps Script 백엔드에서 데이터 내보내기
//
// 읽기 전용입니다. 원본 스프레드시트를 전혀 건드리지 않습니다.
// 관리자 토큰이 필요한 것(contestId:"all", 사용자 목록)은 쓰지 않고,
// 공개 조회만 조합해서 뽑습니다.
//
// 실행:  node export-from-sheets.mjs
// 결과:  ./export/ 폴더에 JSON 파일들
// ============================================================
import { writeFileSync, mkdirSync } from "node:fs";

const API = "https://script.google.com/macros/s/AKfycbx8jo76mJkxSj5ub-ysxSUFhOGI_U3y2Dn-w4XkrHIx9SNimetkEtXcvhfcgqStYsPz/exec";

// 젭퀴즈는 회차별로 따로 저장되므로 전부 나열합니다.
const CONTESTS = [
  "keyring", "cuttoon", "library", "transcription", "pixelart", "sound_album",
  "zepquiz_1", "zepquiz_2", "zepquiz_3", "zepquiz_4", "zepquiz_5", "zepquiz_6",
  "pixelart_draft"
];

// Apps Script 는 302 로 리다이렉트하는데 간헐적으로 실패해서 재시도가 필요합니다.
async function call(body, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(body),
        redirect: "follow"
      });
      const text = await res.text();
      if (text.trim().startsWith("{")) return JSON.parse(text);
    } catch (e) { /* 재시도 */ }
    await new Promise(r => setTimeout(r, 1500));
  }
  throw new Error("응답 실패: " + JSON.stringify(body).slice(0, 80));
}

mkdirSync("export", { recursive: true });

// ---- 제출물 ----
const submissions = [];
for (const contestId of CONTESTS) {
  const r = await call({ action: "getAllSubmissions", contestId });
  const rows = Array.isArray(r.data) ? r.data : [];
  rows.forEach(x => submissions.push({ ...x, contestId: x.contestId || contestId }));
  console.log(`  ${contestId.padEnd(16)} ${String(rows.length).padStart(4)}건`);
}
writeFileSync("export/submissions.json", JSON.stringify(submissions, null, 1));

// ---- 감상 반응 ----
const rx = await call({ action: "getReactions", contestId: "library", studentUsername: "" });
writeFileSync("export/reactions.json", JSON.stringify(rx.counts || {}, null, 1));

// ---- 설정 (공모전 잠금 + 활성 회차) ----
const locks = await call({ action: "getContestLocks" });
writeFileSync("export/settings.json", JSON.stringify({
  locks: locks.data || {},
  activeRound: locks.activeRound
}, null, 1));

console.log(`\n제출물 ${submissions.length}건 · 반응 ${Object.keys(rx.counts || {}).length}개 작품 · 설정 ${Object.keys(locks.data || {}).length}개`);
console.log("→ export/ 폴더에 저장했습니다.");
