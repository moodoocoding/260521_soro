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
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc,
  collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 시험용 프로젝트 설정입니다. 실제 전환(6단계) 때 운영 프로젝트 값으로 바꿉니다.
// apiKey 는 원래 클라이언트에 공개되는 값이라 비밀이 아닙니다.
const firebaseConfig = {
  apiKey: "AIzaSyDe9QrX3PWh67cl9_B8LoM8Q6BOsJNLVf8",
  authDomain: "soro-migration-test.firebaseapp.com",
  projectId: "soro-migration-test",
  appId: "1:961856422255:web:8c67a9148e3e233631a89a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------- userKey ↔ Firebase 식별자 ----------
// migration/ 의 변환 스크립트와 반드시 같은 규칙이어야 합니다.
async function sha(algo, text) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
const emailOf = async userKey => "u" + (await sha("SHA-256", userKey)).slice(0, 24) + "@soro.local";
const uidOf   = async userKey => (await sha("SHA-1", userKey)).slice(0, 28);

const ok   = extra => ({ status: "success", ...extra });
const fail = message => ({ status: "error", message });

// 화면 코드가 기대하는 제출물 모양으로 맞춰줍니다.
function toEntry(d) {
  const x = d.data();
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
    data: x.data || {}
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
        data: entry.data || {}
      }, { merge: true });
      return ok({ message: "접수 성공" });
    } catch (e) {
      return fail("현재 접수 기간이 아닌 공모전입니다.");
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
    let myUid = null;
    if (studentUsername) myUid = await uidOf(studentUsername);
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
    try { await updateDoc(doc(db, "submissions", id), { isStarred: !!isStarred }); return ok({}); }
    catch (e) { return fail("관리자 권한이 필요합니다."); }
  },

  async updateSubmissionPrizeStatus({ id, prizeStatus }) {
    try { await updateDoc(doc(db, "submissions", id), { prizeStatus }); return ok({}); }
    catch (e) { return fail("관리자 권한이 필요합니다."); }
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
