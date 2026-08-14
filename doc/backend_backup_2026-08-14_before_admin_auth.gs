
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
      var startIndex = getStartIndex(data, "UserKey");
      for (var i = startIndex; i < data.length; i++) {
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
        var startIndex = getStartIndex(data, "UserKey");
        for (var i = startIndex; i < data.length; i++) {
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

    // 2.5. 비밀번호 초기화 액션 (Users 시트 수정)
    else if (requestData.action === "resetPassword") {
      var sheet = ss.getSheetByName("Users");
      var updated = false;
      
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        var startIndex = getStartIndex(data, "UserKey");
        for (var i = startIndex; i < data.length; i++) {
          if (data[i][0] === requestData.userKey) {
            sheet.getRange(i + 1, 6).setValue(requestData.password); // 6번째 열 (Password) 수정
            updated = true;
            break;
          }
        }
      }
      
      if (updated) {
        response = { status: "success", message: "비밀번호 초기화 완료" };
      } else {
        response = { status: "error", message: "일치하는 학생 정보(계정)가 존재하지 않습니다." };
      }
    }
    
    // 3. 작품 응모 액션 (Submissions 시트 + 구글 드라이브 이미지 저장)
    else if (requestData.action === "submitContest") {
      var sheet = ss.getSheetByName("Submissions");
      if (!sheet) {
        sheet = ss.insertSheet("Submissions");
        sheet.appendRow(["ID", "ContestID", "ContestTitle", "StudentUsername", "StudentName", "StudentGrade", "StudentClass", "StudentNumber", "Timestamp", "DataJSON"]);
      }
      
      var entry = requestData.entry;
      
      // [사은품 보존 - 백엔드 이중 안전장치]
      // 동일 학생+대회의 기존 제출에 prizeStatus가 있으면 새 제출에 이월
      if (!entry.data.prizeStatus) {
        var existingData = sheet.getDataRange().getValues();
        var sIdx = getStartIndex(existingData, "ID");
        for (var i = sIdx; i < existingData.length; i++) {
          if (existingData[i][3] === entry.studentUsername && existingData[i][1] === entry.contestId) {
            try {
              var oldData = JSON.parse(existingData[i][9]);
              if (oldData.prizeStatus === "delivered") {
                entry.data.prizeStatus = "delivered";
              }
            } catch(pe) {}
            break;
          }
        }
      }
      
      // [핵심] 만약 이미지(Base64) 데이터가 존재한다면, 구글 드라이브에 파일을 생성하고 시트에는 URL 링크만 기입
      if (entry.data && entry.data.image && entry.data.image.indexOf("data:image/") === 0) {
        var fileExtension = getExtensionFromBase64(entry.data.image);
        var customFileName = entry.contestTitle + "_" + entry.studentGrade + "학년" + entry.studentClass + "반" + entry.studentNumber + "번_" + entry.studentName + "_" + entry.id + fileExtension;
        
        var uploadedFileUrl = saveBase64ToDrive(entry.data.image, customFileName, entry.contestId);
        if (uploadedFileUrl) {
          entry.data.image = uploadedFileUrl; // Base64 스트링 대신 구글 드라이브 링크 대입!
        }
      }
      
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
        var startIndex = getStartIndex(data, "ID");
        for (var i = startIndex; i < data.length; i++) {
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
        var startIndex = getStartIndex(data, "ID");
        var targetUsername = "";
        var targetContestId = "";
        
        // 1단계: 삭제 대상 ID의 StudentUsername과 ContestID를 조회합니다.
        for (var i = startIndex; i < data.length; i++) {
          if (data[i][0] === requestData.id) {
            targetUsername = data[i][3];
            targetContestId = data[i][1];
            break;
          }
        }
        
        // 2단계: 일치하는 모든 행을 지우고, 해당 행들에 속한 구글 드라이브 파일도 함께 삭제(휴지통 이동)합니다.
        if (targetUsername && targetContestId) {
          for (var i = data.length - 1; i >= startIndex; i--) {
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
          for (var i = data.length - 1; i >= startIndex; i--) {
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
    
    // 5.5. 회원 계정 영구 삭제 액션 (Users 시트 + Submissions 시트 연쇄 삭제 및 드라이브 파일 정리)
    else if (requestData.action === "deleteUser") {
      var usersSheet = ss.getSheetByName("Users");
      var subsSheet = ss.getSheetByName("Submissions");
      var userKey = requestData.userKey;
      var deleted = false;
      
      // 1단계: Users 시트에서 해당 계정 삭제
      if (usersSheet) {
        var userData = usersSheet.getDataRange().getValues();
        var userStartIndex = getStartIndex(userData, "UserKey");
        for (var i = userData.length - 1; i >= userStartIndex; i--) {
          if (userData[i][0] === userKey) {
            usersSheet.deleteRow(i + 1);
            deleted = true;
          }
        }
      }
      
      // 2단계: Submissions 시트에서 해당 학생이 제출한 모든 작품 삭제 및 드라이브 파일 정리
      if (subsSheet) {
        var subData = subsSheet.getDataRange().getValues();
        var subStartIndex = getStartIndex(subData, "ID");
        for (var i = subData.length - 1; i >= subStartIndex; i--) {
          if (subData[i][3] === userKey) {
            // 구글 드라이브 파일 연쇄 삭제
            try {
              var entryData = {};
              try { 
                entryData = JSON.parse(subData[i][9]); 
              } catch(e) {
                entryData = { image: subData[i][9] };
              }
              var fileUrl = entryData.image || entryData.audio || "";
              var fileId = extractFileIdFromUrl(fileUrl);
              if (fileId) {
                DriveApp.getFileById(fileId).setTrashed(true);
              }
            } catch(fileErr) {
              Logger.log("Failed to delete user file from drive: " + fileErr.toString());
            }
            
            subsSheet.deleteRow(i + 1);
          }
        }
      }
      
      if (deleted) {
        response = { status: "success", message: "회원 탈퇴 및 관련 제출물 삭제 완료" };
      } else {
        response = { status: "error", message: "삭제할 회원 계정을 찾을 수 없음" };
      }
    }
    
    // 6. 전체 작품 조회 액션 (Submissions 시트 - 갤러리 로딩용)
    else if (requestData.action === "getAllSubmissions") {
      var sheet = ss.getSheetByName("Submissions");
      var results = [];
      var filterContestId = requestData.contestId;
      
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        var startIndex = getStartIndex(data, "ID");
        for (var i = startIndex; i < data.length; i++) {
          if (filterContestId === "all" || data[i][1] === filterContestId) {
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
    
    // 7. 사은품 지급 상태 실시간 업데이트 액션 (Submissions 시트)
    else if (requestData.action === "updateSubmissionPrizeStatus") {
      var sheet = ss.getSheetByName("Submissions");
      var updated = false;
      
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        var startIndex = getStartIndex(data, "ID");
        for (var i = startIndex; i < data.length; i++) {
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

    // 8. 공모전 잠금 상태 조회 액션 (Settings 시트)
    else if (requestData.action === "getContestLocks") {
      var sheet = ss.getSheetByName("Settings");
      var locks = {};
      var activeRound = "3"; // 기본 활성 회차는 3회차
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        var startIndex = getStartIndex(data, "Key");
        for (var i = startIndex; i < data.length; i++) {
          var key = data[i][0];
          if (key.indexOf("contest_lock_") === 0) {
            var contestId = key.substring(13);
            locks[contestId] = (data[i][1] === "true" || data[i][1] === true);
          } else if (key === "zepquiz_active_round") {
            activeRound = data[i][1].toString();
          }
        }
      }
      response = { status: "success", data: locks, activeRound: activeRound };
    }

    // 8-1. 젭퀴즈 활성 회차 업데이트 액션 (Settings 시트)
    else if (requestData.action === "updateActiveZepRound") {
      var sheet = ss.getSheetByName("Settings");
      if (!sheet) {
        sheet = ss.insertSheet("Settings");
        sheet.appendRow(["Key", "Value"]);
      }
      var activeRound = requestData.activeRound.toString();
      var data = sheet.getDataRange().getValues();
      var foundIndex = -1;
      var startIndex = getStartIndex(data, "Key");
      for (var i = startIndex; i < data.length; i++) {
        if (data[i][0] === "zepquiz_active_round") {
          foundIndex = i;
          break;
        }
      }
      
      if (foundIndex !== -1) {
        sheet.getRange(foundIndex + 1, 2).setValue(activeRound);
      } else {
        sheet.appendRow(["zepquiz_active_round", activeRound]);
      }
      response = { status: "success", message: "활성 회차 설정 완료" };
    }

    // 9. 공모전 잠금 상태 업데이트 액션 (Settings 시트)
    else if (requestData.action === "updateContestLock") {
      var sheet = ss.getSheetByName("Settings");
      if (!sheet) {
        sheet = ss.insertSheet("Settings");
        sheet.appendRow(["Key", "Value"]);
      }
      var data = sheet.getDataRange().getValues();
      var key = "contest_lock_" + requestData.contestId;
      var foundIndex = -1;
      var startIndex = getStartIndex(data, "Key");
      for (var i = startIndex; i < data.length; i++) {
        if (data[i][0] === key) {
          foundIndex = i;
          break;
        }
      }
      if (foundIndex !== -1) {
        sheet.getRange(foundIndex + 1, 2).setValue(String(requestData.isLocked));
      } else {
        sheet.appendRow([key, String(requestData.isLocked)]);
      }
      response = { status: "success", message: "잠금 설정 완료" };
    }

    // 10. 별표 상태 업데이트 액션 (Submissions 시트)
    else if (requestData.action === "updateSubmissionStarStatus") {
      var sheet = ss.getSheetByName("Submissions");
      var updated = false;
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        var startIndex = getStartIndex(data, "ID");
        for (var i = startIndex; i < data.length; i++) {
          if (data[i][0] === requestData.id) {
            var entryData = {};
            try { 
              entryData = JSON.parse(data[i][9]); 
            } catch(e) {
              entryData = { image: data[i][9] };
            }
            entryData.isStarred = requestData.isStarred;
            sheet.getRange(i + 1, 10).setValue(JSON.stringify(entryData));
            updated = true;
            break;
          }
        }
      }
      if (updated) {
        response = { status: "success", message: "별표 상태 업데이트 완료" };
      } else {
        response = { status: "error", message: "업데이트 대상을 찾을 수 없음" };
      }
    }

    // 11. 젭퀴즈 통계 및 학급 현황 집계 액션 (Users + Submissions + Settings 시트)
    else if (requestData.action === "getZepQuizStats") {
      var usersSheet = ss.getSheetByName("Users");
      var subsSheet = ss.getSheetByName("Submissions");
      var settingsSheet = ss.getSheetByName("Settings");
      var roundId = requestData.roundId || "zepquiz";
      
      // 1. Settings 시트에서 학급 과자 지급 상태 및 학생 정원 로드
      var classPrizes = {};
      var classStudentCounts = {};
      if (settingsSheet) {
        var settingsData = settingsSheet.getDataRange().getValues();
        var startIndex = getStartIndex(settingsData, "Key");
        for (var i = startIndex; i < settingsData.length; i++) {
          var key = settingsData[i][0];
          if (key.indexOf("zep_prize_" + roundId + "_") === 0) {
            var classKey = key.substring(("zep_prize_" + roundId + "_").length);
            classPrizes[classKey] = settingsData[i][1];
          } else if (key.indexOf("zep_student_count_") === 0) {
            var classKey = key.substring("zep_student_count_".length);
            classStudentCounts[classKey] = parseInt(settingsData[i][1], 10);
          }
        }
      }
      
      // 2. Users 시트에서 가입된 모든 학생 리스트 로드
      var users = [];
      if (usersSheet) {
        var usersData = usersSheet.getDataRange().getValues();
        var startIndex = getStartIndex(usersData, "UserKey");
        for (var i = startIndex; i < usersData.length; i++) {
          users.push({
            userKey: usersData[i][0],
            grade: parseInt(usersData[i][1], 10),
            classNum: parseInt(usersData[i][2], 10),
            number: parseInt(usersData[i][3], 10),
            name: usersData[i][4]
          });
        }
      }
      
      // 3. Submissions 시트에서 젭퀴즈 완료 제출 정보 로드
      var submissions = {};
      if (subsSheet) {
        var subsData = subsSheet.getDataRange().getValues();
        var startIndex = getStartIndex(subsData, "ID");
        for (var i = startIndex; i < subsData.length; i++) {
          var contestId = subsData[i][1];
          if (contestId === roundId) {
            var username = subsData[i][3];
            var timestamp = subsData[i][8];
            var dataJSON = {};
            try { dataJSON = JSON.parse(subsData[i][9]); } catch (e) { dataJSON = { image: subsData[i][9] }; }
            
            submissions[username.toLowerCase()] = {
              id: subsData[i][0],
              timestamp: timestamp,
              image: dataJSON.image || ""
            };
          }
        }
      }
      
      // 4. 학급별 빈 통계 뼈대 생성 (실제 한도 반영)
      var classes = {};
      var GRADE_CLASS_LIMITS = { 3: 6, 4: 7, 5: 6, 6: 5 };
      for (var g = 3; g <= 6; g++) {
        var maxClass = GRADE_CLASS_LIMITS[g] || 3;
        for (var c = 1; c <= maxClass; c++) {
          var classKey = g + "-" + c;
          var configuredCount = classStudentCounts[classKey];
          classes[classKey] = {
            grade: g,
            classNum: c,
            totalStudents: typeof configuredCount === "number" ? configuredCount : 0,
            completedCount: 0,
            prizeStatus: classPrizes[classKey] || "waiting",
            students: [],
            isCustomStudentCount: typeof configuredCount === "number"
          };
        }
      }
      
      // 5. 학생 매칭
      for (var i = 0; i < users.length; i++) {
        var u = users[i];
        var classKey = u.grade + "-" + u.classNum;
        
        if (classes[classKey]) {
          if (!classes[classKey].isCustomStudentCount) {
            classes[classKey].totalStudents++;
          }
          
          var usernameLower = u.userKey.toLowerCase();
          var isCompleted = submissions.hasOwnProperty(usernameLower);
          var subData = isCompleted ? submissions[usernameLower] : null;
          
          if (isCompleted) {
            classes[classKey].completedCount++;
          }
          
          classes[classKey].students.push({
            name: u.name,
            number: u.number,
            username: u.userKey,
            completed: isCompleted,
            timestamp: subData ? subData.timestamp : "",
            image: subData ? subData.image : "",
            submissionId: subData ? subData.id : ""
          });
        }
      }
      
      // 번호 순 정렬
      for (var key in classes) {
        if (classes.hasOwnProperty(key)) {
          classes[key].students.sort(function(a, b) {
            return a.number - b.number;
          });
        }
      }
      
      response = { status: "success", classes: classes };
    }

    // 12. 학급 단체 과자 세트 지급 상태 업데이트 액션 (Settings 시트)
    else if (requestData.action === "updateClassPrizeStatus") {
      var sheet = ss.getSheetByName("Settings");
      if (!sheet) {
        sheet = ss.insertSheet("Settings");
        sheet.appendRow(["Key", "Value"]);
      }
      
      var roundId = requestData.roundId || "zepquiz";
      var classKey = requestData.classKey;
      var prizeStatus = requestData.prizeStatus;
      
      var key = "zep_prize_" + roundId + "_" + classKey;
      var data = sheet.getDataRange().getValues();
      var foundIndex = -1;
      var startIndex = getStartIndex(data, "Key");
      for (var i = startIndex; i < data.length; i++) {
        if (data[i][0] === key) {
          foundIndex = i;
          break;
        }
      }
      
      if (foundIndex !== -1) {
        sheet.getRange(foundIndex + 1, 2).setValue(prizeStatus);
      } else {
        sheet.appendRow([key, prizeStatus]);
      }
      
      response = { status: "success", message: "과자 지급 상태 업데이트 완료" };
    }
    
    // 13. 학급 학생 수 수정 액션 (Settings 시트)
    else if (requestData.action === "updateClassStudentCount") {
      var sheet = ss.getSheetByName("Settings");
      if (!sheet) {
        sheet = ss.insertSheet("Settings");
        sheet.appendRow(["Key", "Value"]);
      }
      
      var classKey = requestData.classKey;
      var studentCount = parseInt(requestData.studentCount, 10);
      
      var key = "zep_student_count_" + classKey;
      var data = sheet.getDataRange().getValues();
      var foundIndex = -1;
      var startIndex = getStartIndex(data, "Key");
      for (var i = startIndex; i < data.length; i++) {
        if (data[i][0] === key) {
          foundIndex = i;
          break;
        }
      }
      
      if (foundIndex !== -1) {
        sheet.getRange(foundIndex + 1, 2).setValue(studentCount);
      } else {
        sheet.appendRow([key, studentCount]);
      }
      
      response = { status: "success", message: "학생 수 설정 완료" };
    }
    
  } catch (error) {
    response = { status: "error", message: error.toString() };
  }
  
  // CORS 우회 응답 설정
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// 헤더 행 존재 여부를 판단하여 실제 데이터의 시작 인덱스를 반환하는 헬퍼 함수
function getStartIndex(data, headerText) {
  if (data && data.length > 0 && data[0] && data[0][0] === headerText) {
    return 1;
  }
  return 0;
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

// [헬퍼] Base64 데이터를 파싱하여 구글 드라이브에 이미지로 저장하는 함수 (젭퀴즈 격리 저장 기능 탑재)
function saveBase64ToDrive(base64Data, fileName, contestId) {
  try {
    var split = base64Data.split(',');
    var contentType = split[0].match(/:(.*?);/)[1];
    var base64String = split[1];
    var decodedBytes = Utilities.base64Decode(base64String);
    var fileBlob = Utilities.newBlob(decodedBytes, contentType, fileName);
    
    var folderName = "SORO_Submissions";
    // 젭퀴즈 제출인 경우 전용 폴더로 분리
    if (contestId && contestId.indexOf("zepquiz") === 0) {
      folderName = "SORO_ZepQuizzes";
    }
    
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    // 젭퀴즈 하위 회차 폴더 격리
    if (contestId && contestId.indexOf("zepquiz") === 0) {
      var subFolderName = contestId; // "zepquiz" 등
      var subFolders = folder.getFoldersByName(subFolderName);
      var subFolder;
      if (subFolders.hasNext()) {
        subFolder = subFolders.next();
      } else {
        subFolder = folder.createFolder(subFolderName);
      }
      folder = subFolder;
    }
    
    var createdFile = folder.createFile(fileBlob);
    // 외부 링크가 있는 누구나 뷰어로 조회할 수 있도록 권한 부여
    createdFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return createdFile.getUrl();
  } catch (err) {
    Logger.log("Error in saveBase64ToDrive: " + err.toString());
    return null;
  }
}

// [헬퍼] Base64 데이터의 마임타입을 감지하여 확장자를 반환하는 함수
function getExtensionFromBase64(base64Data) {
  try {
    var match = base64Data.match(/data:image\/(.*?);base64/);
    if (match && match[1]) {
      var ext = match[1];
      if (ext === "jpeg") return ".jpg";
      return "." + ext;
    }
  } catch (e) {}
  return ".png";
}

