#!/usr/bin/env node
/*
 * Firebase Auth 가져오기용 파일 생성기
 *
 * 우리 Users 시트는 비밀번호를 "솔트 없는 SHA-256, 소문자 16진수"로 저장합니다.
 * Firebase Auth의 auth:import 는 해시를 base64로 받으므로 변환이 필요합니다.
 *
 * 사용법:
 *   node make-import-file.js "학년_반_번호_이름" "비밀번호해시(16진수)" [...반복]
 *   node make-import-file.js --test        (가짜 계정 1개로 시험용 파일 생성)
 */

const crypto = require("crypto");

function hexToBase64(hex) {
  return Buffer.from(hex, "hex").toString("base64");
}

// 학생 로그인은 이메일이 아니라 학년/반/번호/이름이라, Firebase Auth에는 합성 이메일로 등록합니다.
// 이름에 한글이 들어가면 이메일 주소로 쓸 수 없어서, userKey를 해시한 ASCII 식별자를 씁니다.
// 학생은 이 주소를 볼 일이 없고, 앱이 로그인할 때 같은 방식으로 다시 만들어 씁니다.
// (이름/학년/반/번호는 Firestore 프로필에 그대로 저장합니다)
function userKeyToEmail(userKey) {
  const id = crypto.createHash("sha256").update(userKey, "utf8").digest("hex").slice(0, 24);
  return `u${id}@soro.local`;
}

function buildUser(userKey, passwordHashHex) {
  // 솔트를 쓰지 않으므로 salt 필드는 아예 넣지 않습니다.
  // (빈 문자열로 넣으면 Firebase가 다르게 해석할 여지가 있습니다)
  return {
    localId: crypto.createHash("sha1").update(userKey).digest("hex").slice(0, 28),
    email: userKeyToEmail(userKey),
    emailVerified: true,
    passwordHash: hexToBase64(passwordHashHex)
  };
}

const args = process.argv.slice(2);

if (args[0] === "--test") {
  // 시험용: 비밀번호를 알고 있는 가짜 계정 1개
  const TEST_KEY = "9_9_99_테스트계정";
  const TEST_PASSWORD = "soro-test-1234";
  const hashHex = crypto.createHash("sha256").update(TEST_PASSWORD, "utf8").digest("hex");

  const out = { users: [buildUser(TEST_KEY, hashHex)] };
  console.log(JSON.stringify(out, null, 2));
  console.error("");
  console.error("── 시험 계정 정보 ─────────────────────────");
  console.error(`  로그인 이메일 : ${userKeyToEmail(TEST_KEY)}`);
  console.error(`  비밀번호      : ${TEST_PASSWORD}`);
  console.error(`  SHA-256(16진) : ${hashHex}`);
  console.error(`  base64 변환   : ${hexToBase64(hashHex)}`);
  console.error("───────────────────────────────────────────");
} else if (args.length >= 2 && args.length % 2 === 0) {
  const users = [];
  for (let i = 0; i < args.length; i += 2) {
    users.push(buildUser(args[i], args[i + 1]));
  }
  console.log(JSON.stringify({ users }, null, 2));
} else {
  console.error("사용법: node make-import-file.js --test");
  console.error("       node make-import-file.js <userKey> <해시16진수> [<userKey> <해시16진수> ...]");
  process.exit(1);
}
