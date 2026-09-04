// ============================================================
// Firestore 백엔드 (4단계)
//
// app.js 의 callBackend() 가 쓰던 Apps Script 액션 이름과 응답 모양을
// 그대로 흉내 냅니다. 그래서 화면 코드는 손대지 않고 백엔드만 갈아끼울 수 있습니다.
//
// 주소 뒤에 ?backend=firebase 를 붙일 때만 동작합니다.
// 기본값은 여전히 Apps Script 입니다.
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc, deleteField,
  collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage, ref as storageRef, uploadString
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 시험용 프로젝트 설정입니다. 실제 전환(6단계) 때 운영 프로젝트 값으로 바꿉니다.
// apiKey 는 원래 클라이언트에 공개되는 값이라 비밀이 아닙니다.
const firebaseConfig = {
  apiKey: "AIzaSyDe9QrX3PWh67cl9_B8LoM8Q6BOsJNLVf8",
  authDomain: "soro-migration-test.firebaseapp.com",
  projectId: "soro-migration-test",
  appId: "1:961856422255:web:8c67a9148e3e233631a89a",
  storageBucket: "soro-migration-test.firebasestorage.app"
};

// 비밀번호 초기화만 담당하는 기존 Apps Script 주소.
// 학생 데이터는 전부 Firestore 에 있고, 이 주소는 "선생님이 초기화를 승인할 때"만 쓰입니다.
const SHEETS_HELPER_URL = atob("aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4OGpvNzZtSmt4U2o1dWIteXN4U1VGaE9HSV9VM3kyRG4tdzRYa3JISXg5U05pbWV0a0V0WGN2aGZjZ3FTdFlzUHovZXhlYw==");
const TEMP_PASSWORD_HINT = "a1234567!";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------- userKey ↔ Firebase 식별자 ----------
// migration/ 의 변환 스크립트와 반드시 같은 규칙이어야 합니다.
async function sha(algo, text) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
const storage = getStorage(app);

// ====================================================
// 그림·음원을 Storage 에 올리고, 문서에는 주소만 남깁니다.
//
// 예전 앱스크립트는 제출된 그림을 드라이브에 올리고 링크만 시트에 넣었습니다.
// Firebase 로 옮기면서 이 단계가 빠져, base64 문자열이 그대로 문서에
// 들어갔습니다. 엽서 하나가 0.89~1.13MB 인데 문서 한도는 1MiB 라서,
// 큰 그림은 저장이 통째로 실패했고 화면에는 엉뚱하게 "접수 기간이 아니다" 가
// 떴습니다. 학생은 작품이 사라진 것도 몰랐습니다.
//
// data: 로 시작하는 값이면 그림이든 음원이든 전부 올립니다.
// 경로를 고정해 두어 다시 제출하면 같은 자리를 덮어씁니다.
// ====================================================
// 읽기가 공개라 토큰 없는 주소로 충분합니다. 계산으로 만들 수 있어서
// 업로드할 때마다 주소를 물어보는 왕복이 없고, 옛 그림을 옮길 때 만드는
// 주소와도 형태가 같습니다.
const publicUrlFor = path =>
  `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}` +
  `/o/${encodeURIComponent(path)}?alt=media`;

const EXT_BY_MIME = {
  "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif",
  "audio/mpeg": "mp3", "audio/mp3": "mp3", "audio/wav": "wav", "audio/webm": "webm",
  "audio/ogg": "ogg", "audio/mp4": "m4a", "video/mp4": "mp4"
};

// 올리기 전에 그림을 줄입니다.
//
// 드라이브는 갤러리에 축소본(sz=w600)을 줬지만 Storage 는 올린 그대로를 줍니다.
// 원본을 그대로 두면 갤러리 한 번에 24장 × 0.8MB ≈ 19MB 를 내려받게 되고,
// 전교생이 보면 하루 무료 한도(1GB)를 훌쩍 넘습니다.
//
// 가로 1000px 로 줄이고 JPEG 로 다시 저장하면 대략 0.8MB → 0.15MB 가 됩니다.
// 엽서를 화면에서 보는 용도로는 차이를 느낄 수 없고, 버킷이 미국에 있어
// 생기는 지연도 파일이 작아지면 대부분 묻힙니다.
//
// 원본보다 커지는 경우(이미 작거나 단색 위주의 PNG)에는 원본을 그대로 씁니다.
const MAX_IMAGE_WIDTH = 1000;
const JPEG_QUALITY = 0.82;

function shrinkImage(dataUrl) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, MAX_IMAGE_WIDTH / img.naturalWidth);
        if (scale === 1 && dataUrl.length < 300 * 1024) return resolve(dataUrl);

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        const ctx = canvas.getContext("2d");
        // 투명 배경이 검게 나오지 않도록 흰 바탕을 깔고 그립니다.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const out = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        resolve(out.length < dataUrl.length ? out : dataUrl);
      } catch (e) {
        resolve(dataUrl);   // 줄이지 못하면 원본으로 올립니다
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

async function uploadDataUrls(uid, contestId, data) {
  if (!data || typeof data !== "object") return data;
  const out = { ...data };

  for (const [field, value] of Object.entries(out)) {
    if (typeof value !== "string" || !value.startsWith("data:")) continue;

    let payload = value;
    if (value.startsWith("data:image/")) payload = await shrinkImage(value);

    const mime = (payload.slice(5).split(";")[0] || "").toLowerCase();
    const ext = EXT_BY_MIME[mime] || "bin";
    const path = `submissions/${contestId}/${uid}/${field}.${ext}`;

    await uploadString(storageRef(storage, path), payload, "data_url");
    out[field] = publicUrlFor(path);
  }
  return out;
}

const emailOf = async userKey => "u" + (await sha("SHA-256", userKey)).slice(0, 24) + "@soro.local";
const uidOf   = async userKey => (await sha("SHA-1", userKey)).slice(0, 28);

// 이전해 온 484명은 uid 를 직접 지정해 넣었기 때문에 uidOf(userKey) 와 일치합니다.
// 하지만 그 뒤로 가입하는 학생은 Firebase 가 무작위 uid 를 발급하므로 일치하지 않습니다.
// 비밀번호를 잊은 학생은 로그인을 못 해 자기 uid 를 알 방법이 없고, users 문서도
// 읽을 수 없어서(본인·관리자 전용) 초기화 요청 자체가 불가능해집니다.
//
// 그래서 uidOf(userKey) → 실제 uid 를 알려 주는 작은 색인을 둡니다.
// 이 색인은 선생님이 초기화를 승인할 때만 읽습니다.
// uidOf(userKey) 로 계산한 값을 실제 계정 uid 로 바꿔 줍니다.
// 색인이 있으면 이전 이후에 가입한 학생이고, 없으면 이전해 온 학생이라
// 계산값이 곧 실제 uid 입니다.
async function realUidFor(hashedUid) {
  try {
    const idx = await getDoc(doc(db, "accountIndex", hashedUid));
    if (idx.exists() && idx.data().uid) return idx.data().uid;
  } catch (e) {
    // 색인을 못 읽으면(권한 없음 등) 이전해 온 계정으로 봅니다.
  }
  return hashedUid;
}

async function ensureAccountIndex(userKey, realUid) {
  try {
    const key = await uidOf(userKey);
    if (key === realUid) return;   // 이전해 온 계정 — 색인이 필요 없습니다
    await setDoc(doc(db, "accountIndex", key), { uid: realUid });
  } catch (e) {
    // 색인을 못 남겨도 로그인·가입 자체는 성공시킵니다.
    console.warn("[firebase] 계정 색인 기록 실패", e);
  }
}

const ok   = extra => ({ status: "success", ...extra });
const fail = message => ({ status: "error", message });

// 화면 코드가 기대하는 제출물 모양으로 맞춰줍니다.
function toEntry(d) {
  const x = d.data();
  const entryData = { ...(x.data || {}) };

  // 2026-09-04 이전 관리자 토글은 prizeStatus/isStarred를 data 안이 아니라
  // 문서 최상위에 잘못 저장했습니다. 화면은 data.*만 읽기 때문에 클릭 직후에는
  // 바뀐 것처럼 보여도 새로 로그인하면 사라졌습니다. 이미 저장된 값을 잃지 않도록
  // 중첩 값이 없을 때만 옛 최상위 값을 읽는 호환 경로를 둡니다.
  if (entryData.prizeStatus == null && x.prizeStatus != null) {
    entryData.prizeStatus = x.prizeStatus;
  }
  if (entryData.isStarred == null && x.isStarred != null) {
    entryData.isStarred = x.isStarred;
  }

  return {
    id: d.id,
    contestId: x.contestId,
    contestTitle: x.contestTitle || "",
    studentUsername: x.userKey || "",
    studentName: x.studentName || "",
    studentGrade: x.studentGrade,
    studentClass: x.studentClass,
    studentNumber: x.studentNumber,
    timestamp: x.timestamp || "",
    data: entryData
  };
}

let currentProfile = null;   // 로그인한 학생의 users/{uid} 내용
onAuthStateChanged(auth, async user => {
  if (!user) { currentProfile = null; return; }
  const snap = await getDoc(doc(db, "users", user.uid));
  currentProfile = snap.exists() ? { uid: user.uid, ...snap.data() } : { uid: user.uid };
});

async function requireProfile() {
  if (currentProfile) return currentProfile;
  const u = auth.currentUser;
  if (!u) return null;
  const snap = await getDoc(doc(db, "users", u.uid));
  currentProfile = snap.exists() ? { uid: u.uid, ...snap.data() } : { uid: u.uid };
  return currentProfile;
}

// ---------- 액션 구현 ----------
const actions = {

  async login({ userKey, _rawPassword }) {
    // Apps Script 로는 해시를 보내지만, Firebase Auth 는 원문 비밀번호로 인증합니다.
    // 그래서 화면 코드가 _rawPassword 로 원문을 함께 실어 보냅니다.
    if (!_rawPassword) return fail("비밀번호를 확인할 수 없습니다.");
    try {
      await signInWithEmailAndPassword(auth, await emailOf(userKey), _rawPassword);
      const p = await requireProfile();
      // 이 수정 이전에 가입한 계정도 로그인 한 번으로 색인이 채워집니다.
      // 이전해 온 계정은 해시 비교만 하고 끝나므로 추가 통신이 없습니다.
      ensureAccountIndex(userKey, auth.currentUser.uid);
      const res = ok({ message: "인증 성공" });
      if (p && p.admin === true) res.adminToken = await auth.currentUser.getIdToken();
      return res;
    } catch (e) {
      return fail("학년/반/번호/이름 또는 비밀번호가 틀렸습니다.");
    }
  },

  async signUp({ userKey, grade, classNum, number, name, _rawPassword }) {
    if (!_rawPassword) return fail("비밀번호를 확인할 수 없습니다.");
    try {
      const cred = await createUserWithEmailAndPassword(auth, await emailOf(userKey), _rawPassword);
      await setDoc(doc(db, "users", cred.user.uid), {
        grade: Number(grade), classNum: Number(classNum), number: Number(number),
        name, userKey
      });
      await ensureAccountIndex(userKey, cred.user.uid);
      return ok({ message: "가입 완료" });
    } catch (e) {
      if (e.code === "auth/email-already-in-use") return fail("이미 동일한 정보로 가입된 계정이 존재합니다.");
      return fail("가입에 실패했습니다.");
    }
  },

  async getContestLocks() {
    const snap = await getDocs(collection(db, "settings"));
    const locks = {};
    let activeRound = "3";
    snap.forEach(d => {
      if (d.id.startsWith("contest_lock_")) locks[d.id.slice("contest_lock_".length)] = d.data().value === true;
      else if (d.id === "zepquiz_active_round") activeRound = String(d.data().value);
    });
    return ok({ data: locks, activeRound });
  },

  async getAllSubmissions({ contestId }) {
    const q = contestId === "all"
      ? collection(db, "submissions")
      : query(collection(db, "submissions"), where("contestId", "==", contestId));
    const snap = await getDocs(q);
    return ok({ data: snap.docs.map(toEntry) });
  },

  async getSubmissions({ studentUsername }) {
    const snap = await getDocs(
      query(collection(db, "submissions"), where("userKey", "==", studentUsername)));
    return ok({ data: snap.docs.map(toEntry) });
  },

  async submitContest({ entry }) {
    const p = await requireProfile();
    if (!p) return fail("로그인이 필요합니다.");
    // 문서 ID 를 고정해 한 학생당 공모전별 1개만 남게 합니다.
    const id = `${entry.contestId}__${p.uid}`;

    // 그림·음원을 먼저 Storage 로 보냅니다. 실패하면 여기서 멈춰야
    // "저장됐다" 고 잘못 알리는 일이 없습니다.
    let payload;
    try {
      payload = await uploadDataUrls(p.uid, entry.contestId, entry.data || {});
    } catch (e) {
      console.error("[firebase] 파일 업로드 실패", e);
      return fail("작품 파일을 올리지 못했습니다. 연결을 확인하고 다시 시도해 주세요.");
    }

    try {
      await setDoc(doc(db, "submissions", id), {
        uid: p.uid,
        userKey: p.userKey || entry.studentUsername,
        contestId: entry.contestId,
        contestTitle: entry.contestTitle || "",
        studentName: entry.studentName,
        studentGrade: Number(entry.studentGrade),
        studentClass: Number(entry.studentClass),
        studentNumber: Number(entry.studentNumber),
        timestamp: entry.timestamp,
        data: payload
      }, { merge: true });
      return ok({ message: "접수 성공" });
    } catch (e) {
      // 예전에는 어떤 오류든 "접수 기간이 아니다" 로 바꿔 버려서, 용량 초과로
      // 저장에 실패한 학생이 원인을 알 수 없었습니다. 이제 구분해서 알립니다.
      console.error("[firebase] submitContest 실패", e);
      if (e && e.code === "permission-denied") {
        return fail("현재 접수 기간이 아닌 공모전입니다.");
      }
      return fail("작품을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  },

  async deleteSubmission({ id, studentUsername }) {
    // 옛 백엔드는 임의의 제출물 id 를 받았지만, 새 구조는 contestId__uid 형태입니다.
    let target = id;
    if (!String(id).includes("__")) {
      const snap = await getDocs(
        query(collection(db, "submissions"), where("userKey", "==", studentUsername || "")));
      const found = snap.docs.find(d => d.id === id || d.data().legacyId === id);
      if (!found) return fail("삭제 대상을 찾을 수 없음");
      target = found.id;
    }
    try {
      await deleteDoc(doc(db, "submissions", target));
      return ok({ message: "삭제 완료" });
    } catch (e) {
      return fail("삭제 권한이 없습니다.");
    }
  },

  async getReactions({ studentUsername }) {
    const snap = await getDocs(collection(db, "reactions"));
    const counts = {}, mine = {};
    // 반응은 실제 계정 uid 로 저장됩니다. 예전에는 여기서 uidOf(studentUsername) 으로
    // 비교해서, 이전 이후에 가입한 학생은 자기가 누른 하트가 눌리지 않은 것처럼
    // 보였습니다. 로그인해 있으면 실제 uid 가 확실하므로 그것을 씁니다.
    const myUid = auth.currentUser ? auth.currentUser.uid : null;
    snap.forEach(d => {
      const r = d.data();
      counts[r.submissionId] = counts[r.submissionId] || {};
      counts[r.submissionId][r.type] = (counts[r.submissionId][r.type] || 0) + 1;
      if (myUid && r.uid === myUid) (mine[r.submissionId] = mine[r.submissionId] || []).push(r.type);
    });
    return ok({ counts, mine });
  },

  async toggleReaction({ submissionId, reactionType }) {
    const p = await requireProfile();
    if (!p) return fail("로그인이 필요합니다.");
    const id = `${submissionId}__${p.uid}__${reactionType}`;
    const ref = doc(db, "reactions", id);
    try {
      const snap = await getDoc(ref);
      if (snap.exists()) await deleteDoc(ref);
      else await setDoc(ref, { submissionId, uid: p.uid, type: reactionType, timestamp: new Date().toISOString() });

      // 바뀐 뒤의 개수를 세어 돌려줍니다.
      const all = await getDocs(
        query(collection(db, "reactions"), where("submissionId", "==", submissionId), where("type", "==", reactionType)));
      return ok({ reacted: !snap.exists(), count: all.size });
    } catch (e) {
      return fail("반응을 저장하지 못했습니다.");
    }
  },

  async updateContestLock({ contestId, isLocked }) {
    try {
      await setDoc(doc(db, "settings", `contest_lock_${contestId}`), { value: !!isLocked });
      return ok({ message: "잠금 설정 완료" });
    } catch (e) { return fail("관리자 권한이 필요합니다."); }
  },

  async updateActiveZepRound({ activeRound }) {
    try {
      await setDoc(doc(db, "settings", "zepquiz_active_round"), { value: String(activeRound) });
      return ok({ message: "활성 회차 설정 완료" });
    } catch (e) { return fail("관리자 권한이 필요합니다."); }
  },

  async updateSubmissionStarStatus({ id, isStarred }) {
    try {
      await updateDoc(doc(db, "submissions", id), {
        "data.isStarred": !!isStarred,
        isStarred: deleteField()
      });
      return ok({});
    }
    catch (e) { return fail("관리자 권한이 필요합니다."); }
  },

  async updateSubmissionPrizeStatus({ id, prizeStatus }) {
    try {
      await updateDoc(doc(db, "submissions", id), {
        "data.prizeStatus": prizeStatus,
        prizeStatus: deleteField()
      });
      return ok({});
    }
    catch (e) { return fail("관리자 권한이 필요합니다."); }
  },

  // ---------- 관리자 전용 (5단계에서 추가) ----------

  async getZepQuizStats({ roundId }) {
    const round = roundId || "zepquiz";

    const [usersSnap, subsSnap, settingsSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(query(collection(db, "submissions"), where("contestId", "==", round))),
      getDocs(collection(db, "settings"))
    ]);

    // 학급 과자 지급 상태와 학생 정원 설정 읽기
    const classPrizes = {}, classCounts = {};
    settingsSnap.forEach(d => {
      const prizePrefix = `zep_prize_${round}_`;
      if (d.id.startsWith(prizePrefix)) classPrizes[d.id.slice(prizePrefix.length)] = d.data().value;
      else if (d.id.startsWith("zep_student_count_")) {
        classCounts[d.id.slice("zep_student_count_".length)] = parseInt(d.data().value, 10);
      }
    });

    // 이 회차를 제출한 학생 목록
    const submitted = new Map();
    subsSnap.forEach(d => {
      const x = d.data();
      submitted.set(x.uid, { id: d.id, timestamp: x.timestamp || "", image: (x.data || {}).image || "" });
    });

    const GRADE_CLASS_LIMITS = { 3: 6, 4: 7, 5: 6, 6: 5 };
    const classes = {};
    for (let g = 3; g <= 6; g++) {
      for (let c = 1; c <= (GRADE_CLASS_LIMITS[g] || 3); c++) {
        const key = `${g}-${c}`;
        const configured = classCounts[key];
        classes[key] = {
          grade: g, classNum: c,
          totalStudents: typeof configured === "number" && !isNaN(configured) ? configured : 0,
          completedCount: 0,
          prizeStatus: classPrizes[key] || "waiting",
          students: [],
          isCustomStudentCount: typeof configured === "number" && !isNaN(configured)
        };
      }
    }

    usersSnap.forEach(d => {
      const u = d.data();
      // 전시 전용으로 만든 계정(탈퇴 학생)은 참여율 집계에서 뺍니다.
      if (u.inactive === true) return;
      const key = `${u.grade}-${u.classNum}`;
      const cls = classes[key];
      if (!cls) return;

      if (!cls.isCustomStudentCount) cls.totalStudents++;
      const done = submitted.get(d.id);
      if (done) cls.completedCount++;

      cls.students.push({
        name: u.name, number: u.number, username: u.userKey || "",
        completed: !!done,
        timestamp: done ? done.timestamp : "",
        image: done ? done.image : "",
        submissionId: done ? done.id : ""
      });
    });

    Object.values(classes).forEach(c => c.students.sort((a, b) => a.number - b.number));
    return ok({ classes });
  },

  async deleteUser({ userKey }) {
    // Auth 계정 삭제는 관리자 SDK 가 필요해 여기서는 못 합니다.
    // 프로필과 제출물만 지우고, 그 사실을 분명히 알립니다.
    try {
      // 이전 이후에 가입한 학생은 계산한 uid 가 실제 uid 와 달라서, 예전에는
      // 삭제를 눌러도 아무것도 지워지지 않고 "삭제했습니다" 만 떴습니다.
      const hashed = await uidOf(userKey);
      const uid = await realUidFor(hashed);
      const subs = await getDocs(query(collection(db, "submissions"), where("uid", "==", uid)));
      await Promise.all(subs.docs.map(d => deleteDoc(d.ref)));
      await deleteDoc(doc(db, "users", uid));
      await deleteDoc(doc(db, "accountIndex", hashed)).catch(() => {});
      return ok({ message: `제출물 ${subs.size}건과 프로필을 삭제했습니다. (로그인 계정 자체는 Firebase 콘솔에서 지워야 합니다)` });
    } catch (e) {
      return fail("관리자 권한이 필요합니다.");
    }
  },

  async updateClassPrizeStatus({ roundId, classKey, prizeStatus }) {
    try {
      await setDoc(doc(db, "settings", `zep_prize_${roundId || "zepquiz"}_${classKey}`), { value: prizeStatus });
      return ok({ message: "과자 지급 상태 업데이트 완료" });
    } catch (e) { return fail("관리자 권한이 필요합니다."); }
  },

  async updateClassStudentCount({ classKey, studentCount }) {
    try {
      await setDoc(doc(db, "settings", `zep_student_count_${classKey}`), { value: parseInt(studentCount, 10) });
      return ok({ message: "학생 수 설정 완료" });
    } catch (e) { return fail("관리자 권한이 필요합니다."); }
  },

  // Firebase Auth 는 비밀번호 변경에 본인 세션이나 관리자 권한을 요구하는데,
  // 비밀번호를 잊은 학생에게는 둘 다 없습니다. 서버(Cloud Functions)가 있으면 대신
  // 바꿔줄 수 있지만 그건 결제 계정이 필요합니다.
  // 그래서 "학생이 요청 → 선생님이 처리" 방식으로 만들었습니다.
  async resetPassword({ userKey }) {
    if (!userKey) return fail("학년/반/번호/이름을 정확히 입력해 주세요.");

    // 선생님 승인 없이 바로 초기화합니다.
    // 비밀번호 변경에는 관리자 권한이 필요한데 브라우저에는 없으므로,
    // 소유자 권한을 가진 Apps Script 가 대신 처리합니다.
    // 실제 계정은 Apps Script 가 이메일로 찾습니다 — 로그인하지 못한 학생도
    // 자기 uid 를 알 필요가 없습니다.
    try {
      const r = await fetch(SHEETS_HELPER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify({ action: "selfResetPassword", userKey })
      });
      const res = await r.json();
      if (res.status !== "success") return fail(res.message || "초기화에 실패했습니다.");
      return ok({ tempPassword: res.tempPassword, message: res.message });
    } catch (e) {
      return fail("초기화 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  },

  // 관리자: 초기화 기록 읽기 (예전에는 승인 대기 목록이었습니다)
  async getPasswordResets() {
    try {
      const snap = await getDocs(collection(db, "passwordResets"));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => String(a.requestedAt).localeCompare(String(b.requestedAt)));
      return ok({ data: list });
    } catch (e) {
      return fail("관리자 권한이 필요합니다.");
    }
  },

  // 관리자: 기록 지우기(확인함)
  async resolvePasswordReset({ uid }) {
    try {
      await deleteDoc(doc(db, "passwordResets", uid));
      return ok({ message: "처리 완료로 표시했습니다." });
    } catch (e) {
      return fail("관리자 권한이 필요합니다.");
    }
  },

  // [삭제됨] approvePasswordReset — 승인 단계를 없애면서 쓰지 않게 되었습니다.
  // 초기화는 학생이 요청한 즉시 Apps Script 가 처리하고, 아래 getPasswordResets 는
  // 이제 "승인 대기 목록" 이 아니라 "초기화된 기록" 을 읽습니다.

  async changeOwnPassword({ newPassword }) {
    const me = auth.currentUser;
    if (!me) return fail("로그인이 필요합니다.");
    if (!newPassword || newPassword.length < 6) {
      return fail("비밀번호는 6자 이상으로 정해 주세요.");
    }
    if (newPassword === TEMP_PASSWORD_HINT) {
      return fail("임시 비밀번호와 다른 비밀번호로 정해 주세요.");
    }
    try {
      await updatePassword(me, newPassword);
      await updateDoc(doc(db, "users", me.uid), { mustChangePassword: false });
      currentProfile = null;   // 프로필을 다시 읽도록 비웁니다
      return ok({ message: "새 비밀번호가 설정되었습니다." });
    } catch (e) {
      if (e.code === "auth/requires-recent-login") {
        return fail("보안을 위해 다시 로그인한 뒤 변경해 주세요.");
      }
      return fail("비밀번호 변경에 실패했습니다.");
    }
  },

  // 학생이 지금 새 비밀번호를 정해야 하는 상태인지
  async needsPasswordChange() {
    const p = await requireProfile();
    return ok({ required: !!(p && p.mustChangePassword) });
  }
};

// ---------- 진입점 ----------
window.soroFirebase = {
  async call(payload) {
    const fn = actions[payload.action];
    if (!fn) {
      // 아직 옮기지 않은 액션 (관리자 전용 일부)
      console.warn(`[firebase] 미구현 액션: ${payload.action}`);
      return fail(`아직 옮기지 않은 기능입니다: ${payload.action}`);
    }
    try {
      return await fn(payload);
    } catch (e) {
      console.error(`[firebase] ${payload.action} 실패`, e);
      return fail("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.");
    }
  },
  signOut: () => signOut(auth),
  auth, db
};

console.log("[firebase] 백엔드 준비 완료 — 프로젝트:", firebaseConfig.projectId);

// 로딩을 기다리고 있던 호출들을 풀어 줍니다.
if (typeof window !== "undefined" && window.__soroFirebaseResolve) {
  window.__soroFirebaseResolve();
}
