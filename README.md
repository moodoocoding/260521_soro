# 🎨 SORO | 학생 연간 이벤트 공모전 포털 (Students Annual Contest Portal)

> **상상력을 현실로!**  
> SORO는 학생들을 위해 매달 새롭게 열리는 **6대 연간 창의 공모전 및 이벤트 접수 포털**입니다.  
> 복잡한 프레임워크나 서버 설정 없이 **HTML5, Vanilla JavaScript, CSS3** 기술로만 빌드되어 로딩 속도가 극대화되었으며, 강력한 **Google Sheets Apps Script API** 및 **Local Storage**를 연동하여 완전한 회원가입, 로그인, 작품 응모, 내역 조회 및 취소 기능을 무중단으로 서비스합니다.

---

## 🌟 핵심 기능 (Key Features)

### 1. 프리미엄 UI & 감각적인 디자인 시스템
- **다크/라이트 테마 (Theme Switcher)**: 사용자 기호에 맞춰 부드러운 전환 인터랙션과 함께 테마를 변경할 수 있습니다.
- **Glassmorphism & 조명 효과**: 트렌디한 반투명 유리 질감 효과와 마우스 커서의 움직임을 추적해 광원이 흐르는 다이내믹 카드 조명 애니메이션(`Radial Gradient Hover`)이 적용되어 있습니다.
- **아날로그 노이즈 텍스처**: 배경에 고급스러운 미세 입자 노이즈가 오버레이되어 깊이감 있고 세련된 시각적 만족감을 제공합니다.

### 2. 연간 6대 다이내믹 공모전 라인업
- 매월 캘린더 일정에 따라 각 대회의 접수 상태가 **[접수 대기(Upcoming) / 접수 중(Active) / 접수 마감(Closed)]**으로 실시간 및 자동 갱신됩니다.
  - **6월 링컨 키링 공모전** 🎨: 아크릴 키링 제작을 위한 디자인 도안 이미지 업로드
  - **7월 안전사고 예방 컷툰** 📖: 4컷 만화 이미지 원고 업로드
  - **9월 온라인 도서관** 📚: 추천 책 제목, 저자, 150자 이내의 독서 리뷰/사유 작성
  - **10월 디지털 필사** ✍️: 한글날 기념 디지털 펜 손글씨 이미지 업로드 또는 명문장 직접 타이핑
  - **11월 픽셀아트** 👾: 레트로 감성의 도트 그래픽 픽셀 이미지 업로드
  - **12월 우정사진** 📸: 한 해를 마무리하는 따뜻한 단체 우정 사진 업로드

### 3. 시간 여행 테스트 도구 (Simulated Calendar)
- 화면 최하단에 테스트 전용 **가상 달력(Month Selector)** 바가 탑재되어 있어 클릭 한 번으로 현재 월(5월~12월)을 즉각 전환할 수 있습니다.
- 날짜 전환에 따라 공모전 카드가 활성화되거나 마감되는 로직, 폼 필드가 권한에 맞춰 반응하는 모습을 실시간으로 간편하게 검증할 수 있습니다.

### 4. 하이브리드 데이터베이스 설계 (Cloud + Local)
- **Local DB Mode**: 구글 시트 주소가 비어 있을 때는 브라우저의 `localStorage` 및 `sessionStorage`를 이용하여 회원 데이터와 응모작을 안전하게 기록하므로 로컬 환경에서도 완전한 시뮬레이션이 가능합니다.
- **Cloud DB Mode**: 제공되는 **Google Apps Script** 소스코드를 구글 스프레드시트에 배포 후 API 주소만 입력하면, 실시간 구글 클라우드 시트 DB 연동 상태로 자동 전환됩니다.

### 5. 똑똑한 작품 응모 & 실시간 취소 기능
- 로그인한 학생의 학적 정보(학년, 반, 번호, 이름)를 자동으로 연동하여 폼 입력을 최소화합니다.
- 공모전 성격에 맞는 폼 필드가 동적으로 렌더링됩니다(파일 드래그 앤 드롭 존, 멀티 텍스트박스, 탭 형태의 토글 입력 등).
- **내 접수 내역** 서랍(Drawer)을 통해 본인이 응모한 작품의 상세 내역과 제출 이미지를 즉각 조회하고, 필요 시 안전한 절차를 통해 응모를 취소(데이터 영구 삭제)할 수 있습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 스택 | 설명 |
| :--- | :--- | :--- |
| **Frontend** | HTML5, Vanilla JavaScript (ES6+) | 빌드/컴파일 과정 없이 브라우저에서 직접 초고속 실행되는 경량 구조 |
| **Styling** | Pure Vanilla CSS3 | CSS 변수(Custom Properties), Flexbox/Grid 레이아웃, 모던 트랜지션 |
| **Database** | Google Apps Script, Google Sheets | 간이 서버 및 클라우드 DB 역할 수행 (JSON 통신) |
| **Storage** | HTML5 Web Storage | 로컬 데이터 백업 및 독립 오프라인 시뮬레이션 지원 |
| **Hosting** | Vercel Ready | 정적 라우팅 및 리소스 브라우저 캐싱 구조 설계 최적화 |

---

## 📂 프로젝트 구조 (Project Structure)

```bash
soro/
├── index.html       # 메인 레이아웃 구성 및 다이내믹 모달/드로어(Drawer) 마크업
├── style.css        # 미세 노이즈 테스처, 테마 시스템, 드로어 모션 등을 담당하는 CSS
├── app.js           # 공모전 데이터셋 관리, DOM 제어, 구글 시트 API 연동 프론트엔드 비즈니스 로직
├── vercel.json      # Vercel 클라우드 호스팅 정적 파일 캐시 및 URL 경로 최적화 설정
└── README.md        # 본 프로젝트 소개 및 사용자 가이드 가이드 문서
```

---

## 🚀 시작하기 & 로컬 실행 방법

### 1. 로컬에서 실행하기
이 저장소를 로컬 컴퓨터로 복제(Clone)하거나 다운로드한 후, 브라우저에서 직접 실행할 수 있습니다.
```bash
# 1. 저장소 클론
git clone <repository-url>

# 2. 프로젝트 폴더 진입
cd soro

# 3. 로컬 서버 실행 (또는 index.html 더블클릭)
# VS Code를 사용하신다면 'Live Server' 확장 프로그램 실행을 권장합니다.
```

---

## ☁️ Google Sheets 클라우드 DB 연동 가이드

SORO 포털을 여러 사람이 실시간으로 함께 가입하고 작품을 실제로 구글 드라이브 스프레드시트에 영구 저장하려면 아래 절차대로 **원클릭 구글 API 연동**을 완료해 보세요!

### [1단계] 구글 스프레드시트 준비
1. [구글 스프레드시트](https://sheets.google.com)로 이동하여 **새 스프레드시트**를 생성합니다.
2. 스프레드시트 하단의 탭을 추가하여 총 2개의 시트를 만들고 이름을 정확히 변경합니다:
   - **첫 번째 시트명:** `Users`
   - **두 번째 시트명:** `Submissions`

### [2단계] Apps Script 백엔드 코드 작성 및 배포
1. 스프레드시트 상단 메뉴에서 **[확장 프로그램] -> [Apps Script]**를 클릭합니다.
2. 기존에 편집기에 적혀 있는 `function myFunction() {}` 코드를 **모두 삭제**합니다.
3. 아래의 **Google Apps Script 코드를 복사하여 붙여넣습니다**:

```javascript
function doPost(e) {
  var response = { status: "error", message: "알 수 없는 요청" };
  
  try {
    var requestData = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. 회원가입 액션 (Users 시트)
    if (requestData.action === "signUp") {
      var sheet = ss.getSheetByName("Users");
      if (!sheet) {
        sheet = ss.insertSheet("Users");
        sheet.appendRow(["UserKey", "Grade", "ClassNum", "Number", "Name", "Password"]);
      }
      
      var data = sheet.getDataRange().getValues();
      var exists = false;
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === requestData.userKey) {
          exists = true;
          break;
        }
      }
      
      if (exists) {
        response = { status: "error", message: "이미 동일한 정보로 가입된 계정이 존재합니다." };
      } else {
        sheet.appendRow([
          requestData.userKey,
          requestData.grade,
          requestData.classNum,
          requestData.number,
          requestData.name,
          requestData.password
        ]);
        response = { status: "success", message: "가입 완료" };
      }
    }
    
    // 2. 로그인 액션 (Users 시트 검증)
    else if (requestData.action === "login") {
      var sheet = ss.getSheetByName("Users");
      var authenticated = false;
      
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          if (data[i][0] === requestData.userKey && String(data[i][5]) === String(requestData.password)) {
            authenticated = true;
            break;
          }
        }
      }
      
      if (authenticated) {
        response = { status: "success", message: "인증 성공" };
      } else {
        response = { status: "error", message: "학년/반/번호/이름 또는 비밀번호가 틀렸습니다." };
      }
    }
    
    // 3. 작품 응모 액션 (Submissions 시트)
    else if (requestData.action === "submitContest") {
      var sheet = ss.getSheetByName("Submissions");
      if (!sheet) {
        sheet = ss.insertSheet("Submissions");
        sheet.appendRow(["ID", "ContestID", "ContestTitle", "StudentUsername", "StudentName", "StudentGrade", "StudentClass", "StudentNumber", "Timestamp", "DataJSON"]);
      }
      
      var entry = requestData.entry;
      sheet.appendRow([
        entry.id,
        entry.contestId,
        entry.contestTitle,
        entry.studentUsername,
        entry.studentName,
        entry.studentGrade,
        entry.studentClass,
        entry.studentNumber,
        entry.timestamp,
        JSON.stringify(entry.data)
      ]);
      response = { status: "success", message: "접수 성공" };
    }
    
    // 4. 작품 내역 조회 액션 (Submissions 시트)
    else if (requestData.action === "getSubmissions") {
      var sheet = ss.getSheetByName("Submissions");
      var results = [];
      
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          if (data[i][3] === requestData.studentUsername) {
            results.push({
              id: data[i][0],
              contestId: data[i][1],
              contestTitle: data[i][2],
              studentUsername: data[i][3],
              studentName: data[i][4],
              studentGrade: data[i][5],
              studentClass: data[i][6],
              studentNumber: data[i][7],
              timestamp: data[i][8],
              data: (function() {
                try { return JSON.parse(data[i][9]); }
                catch(e) { return { image: data[i][9] }; }
              })()
            });
          }
        }
      }
      response = { status: "success", data: results };
    }
    
    // 5. 작품 접수 취소 액션 (Submissions 시트 행 삭제, 중복 제거, 구글 드라이브 파일 함께 삭제)
    else if (requestData.action === "deleteSubmission") {
      var sheet = ss.getSheetByName("Submissions");
      var deleted = false;
      
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        var targetUsername = "";
        var targetContestId = "";
        
        // 1단계: 삭제 대상 ID의 StudentUsername과 ContestID를 조회합니다.
        for (var i = 1; i < data.length; i++) {
          if (data[i][0] === requestData.id) {
            targetUsername = data[i][3];
            targetContestId = data[i][1];
            break;
          }
        }
        
        // 2단계: 일치하는 모든 행을 지우고, 해당 행들에 속한 구글 드라이브 파일도 함께 삭제(휴지통 이동)합니다.
        if (targetUsername && targetContestId) {
          for (var i = data.length - 1; i >= 1; i--) {
            if (data[i][3] === targetUsername && data[i][1] === targetContestId) {
              // 파일 ID 추출 및 삭제
              try {
                var entryData = {};
                try { 
                  entryData = JSON.parse(data[i][9]); 
                } catch(e) {
                  entryData = { image: data[i][9] };
                }
                var fileUrl = entryData.image || entryData.audio || "";
                var fileId = extractFileIdFromUrl(fileUrl);
                if (fileId) {
                  DriveApp.getFileById(fileId).setTrashed(true);
                }
              } catch(fileErr) {
                Logger.log("Failed to delete file from drive: " + fileErr.toString());
              }
              
              sheet.deleteRow(i + 1);
              deleted = true;
            }
          }
        } else {
          // Fallback: ID 일치 행만 개별 삭제
          for (var i = data.length - 1; i >= 1; i--) {
            if (data[i][0] === requestData.id) {
              try {
                var entryData = {};
                try { 
                  entryData = JSON.parse(data[i][9]); 
                } catch(e) {
                  entryData = { image: data[i][9] };
                }
                var fileUrl = entryData.image || entryData.audio || "";
                var fileId = extractFileIdFromUrl(fileUrl);
                if (fileId) {
                  DriveApp.getFileById(fileId).setTrashed(true);
                }
              } catch(fileErr) {
                Logger.log("Failed to delete file from drive: " + fileErr.toString());
              }
              sheet.deleteRow(i + 1);
              deleted = true;
            }
          }
        }
      }
      
      if (deleted) {
        response = { status: "success", message: "삭제 완료" };
      } else {
        response = { status: "error", message: "삭제 대상을 찾을 수 없음" };
      }
    }
    
    // 6. 사은품 지급 상태 실시간 업데이트 액션 (Submissions 시트)
    else if (requestData.action === "updateSubmissionPrizeStatus") {
      var sheet = ss.getSheetByName("Submissions");
      var updated = false;
      
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          if (data[i][0] === requestData.id) {
            var entryData = {};
            try { 
              entryData = JSON.parse(data[i][9]); 
            } catch(e) {
              entryData = { image: data[i][9] };
            }
            entryData.prizeStatus = requestData.prizeStatus;
            sheet.getRange(i + 1, 10).setValue(JSON.stringify(entryData));
            updated = true;
            break;
          }
        }
      }
      
      if (updated) {
        response = { status: "success", message: "사은품 상태 업데이트 완료" };
      } else {
        response = { status: "error", message: "업데이트 대상을 찾을 수 없음" };
      }
    }
    
  } catch (error) {
    response = { status: "error", message: error.toString() };
  }
  
  // CORS 우회 및 올바른 웹 응답 반환
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// URL에서 구글 드라이브 파일 ID를 추출하는 헬퍼 함수
function extractFileIdFromUrl(url) {
  if (!url) return null;
  var id = "";
  if (url.indexOf("id=") !== -1) {
    id = url.split("id=")[1].split("&")[0];
  } else if (url.indexOf("/file/d/") !== -1) {
    id = url.split("/file/d/")[1].split("/")[0];
  }
  return id ? id.trim() : null;
}
```

4. 우측 상단의 **[배포] -> [새 배포]** 버튼을 클릭합니다.
5. 유형 선택(톱니바퀴 아이콘)에서 **[웹 앱 (Web App)]**을 선택합니다.
6. 아래와 같이 옵션을 설정합니다:
   - **설명:** `SORO DB API`
   - **웹앱을 실행할 사용자:** `나 (your-email@gmail.com)`
   - **액세스 권한이 있는 사용자:** **`모든 사용자 (Anyone)`** *(중요! 비회원도 API를 호출해 로그인을 수행할 수 있어야 하므로 반드시 모든 사용자로 설정합니다.)*
7. **[배포]** 버튼을 클릭합니다. (최초 배포 시 구글 계정 액세스 승인 팝업이 나타나며, [권한 검토] 버튼 클릭 후 계정을 선택하고 `고급 -> SORO(으)로 이동(안전하지 않음)`을 눌러 모든 권한을 허용해 주어야 합니다.)
8. 배포 성공 창이 뜨면 **"웹 앱 URL"**을 복사합니다.

### [3단계] Frontend 연결
1. 프로젝트 폴더의 `app.js` 파일을 엽니다.
2. 최상단 **7번째 줄** 부근에 있는 `GOOGLE_SHEET_API_URL` 상수에 복사한 웹 앱 URL을 붙여넣습니다:
   ```javascript
   // app.js 최상단
   const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycb.../exec"; 
   ```
3. 파일을 저장하고 프로젝트를 실행하면 원격 구글 시트와 완전하게 실시간 연동됩니다. (스프레드시트를 직접 열어두고 회원가입을 하거나 작품을 제출하면, 구글 행에 데이터가 실시간으로 쌓이는 신기한 모습을 확인하실 수 있습니다!)

---

## 🌐 Vercel 호스팅 배포 방법
본 프로젝트는 `vercel.json` 파일이 사전 최적화되어 있으므로 별도의 빌드 커맨드 설정 없이 즉시 배포할 수 있습니다.

1. [Vercel](https://vercel.com)에 가입 후 로그인합니다.
2. **[Add New] -> [Project]**를 선택하여 이 프로젝트가 올라가 있는 Github 저장소를 불러옵니다.
3. 빌드 및 설정 구성(Build and Development Settings)은 수정할 필요 없이 **[Deploy]** 버튼을 클릭합니다.
4. 배포가 1분 이내에 완료되며, 세계 어디서나 접속할 수 있는 `.vercel.app` 고유 주소가 생성됩니다!
