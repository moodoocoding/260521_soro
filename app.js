// ====================================================
// GOOGLE SPREADSHEET DATABASE CONFIGURATION (Secure Masked Setup)
// ====================================================
// 난독화된 구글 스프레드시트 백엔드 API 주소 (Base64)
const SECURE_API_ENCODED = "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4OGpvNzZtSmt4U2o1dWIteXN4U1VGaE9HSV9VM3kyRG4tdzRYa3JISXg5U05pbWV0a0V0WGN2aGZjZ3FTdFlzUHovZXhlYw==";
const GOOGLE_SHEET_API_URL = atob(SECURE_API_ENCODED);

// contestLocks global object and fetch function
let contestLocks = {};
async function fetchContestLocks() {
  if (!GOOGLE_SHEET_API_URL) return;
  try {
    const response = await fetch(GOOGLE_SHEET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify({ action: "getContestLocks" })
    });
    const result = await response.json();
    if (result.status === "success") {
      contestLocks = result.data || {};
    }
  } catch (e) {
    console.error("Failed to fetch contest locks:", e);
  }
}

// ====================================================
// CONTEST DATA AND INLINE ILLUSTRATIONS (SVG)
// ====================================================
const CONTESTS_DATA = [
  {
    id: "keyring",
    title: "키링 공모전",
    month: 6,
    monthText: "6월",
    period: "2026. 6. 1.(월) ~ 2026. 6. 22.(월)",
    summary: "나만의 예쁜 키링 디자인을 설계하고 실제 키링 굿즈로 탄생시킬 특별한 기회!",
    description: "독창적이고 실용적인 키링 디자인 시안을 공모합니다. 캐릭터, 로고, 타이포그래피 등 자유로운 주제로 참여하세요. 수상작은 실제 고품질 아크릴 키링으로 무료 제작되어 참가자 전원에게 제공됩니다.",
    rules: [
      "참가 대상: 3~6학년 학생 누구나 (개인 참여)",
      "공모 주제: 청주소로초를 상징할 수 있는 것",
      "규격: 최대 50mm x 50mm 이내 규격 (해상도 300dpi 이상 PNG/SVG 권장)",
      "제출물: 키링 앞면 디자인 시안 이미지 파일",
      "시상 계획: 학년에 상관 없이 최우수 1명, 우수 1명, 장려 1명",
      "참고 링크: <a href=\"https://canva.link/7al5bl4pt23j015\" target=\"_blank\" class=\"contest-link\">키링 템플릿(Canva) 바로가기</a>"
    ],
    evaluationCriteria: [
      { category: "주제의 이해 및 표현", desc: "청주소로초와 디지털 활용 수업을 잘 이해하고 표현했는지 평가합니다.", weight: "20%" },
      { category: "창의성", desc: "이미지를 얼마나 창의적이고 독특한 방법으로 디자인했는지 평가합니다.", weight: "20%" },
      { category: "시각적 효과", desc: "색상, 레이아웃, 그림체 등 시각적 요소의 조화와 효과를 평가합니다.", weight: "20%" },
      { category: "메시지 전달력", desc: "디자인을 통해 전달하고자 하는 메시지나 감정이 잘 전달되었는지 평가합니다.", weight: "20%" },
      { category: "제작 적합성", desc: "이미지가 키링 형태에 잘 어울리는지 평가합니다.", weight: "20%" }
    ],
    submissionType: "image",
    inputLabel: "키링 디자인 도안 이미지",
    placeholder: "PNG, JPG, SVG 형식의 파일 (최대 5MB)",
    icon: `<svg class="card-visual-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="18" r="10" />
      <circle cx="32" cy="18" r="4" />
      <path d="M32 28v10" />
      <rect x="22" y="38" width="20" height="20" rx="4" />
      <circle cx="32" cy="48" r="4" fill="currentColor" fill-opacity="0.15" />
    </svg>`
  },
  {
    id: "zepquiz",
    title: "저작권 퀴즈",
    month: 6,
    monthText: "6월",
    period: "2026. 6. 1.(월) ~ 2026. 6. 30.(화)",
    summary: "zepquiz에 접속하여 저작권 문제를 풀고 완료 스크린샷을 찍어서 업로드하세요!",
    description: "올바른 저작권 사용에 관한 문제를 해결하는 온라인 퀴즈 이벤트입니다. 제공된 zepquiz 방에 입장하여 퀴즈 문제를 풀고, 최종 완료 화면(점수 또는 완료 문구가 보이는 화면)을 캡처하여 증빙 자료로 업로드해 주세요. <strong style=\"display: block; margin-top: 8px; color: #e63946;\">※ 반드시 학교 구글 아이디로 로그인해서 문제를 풀어야만 제출이 인정됩니다!</strong>",
    rules: [
      "참가 대상: 본교 3~6학년 학생 누구나",
      "퀴즈 내용: 저작권",
      "제한 사항: <strong style=\"color: #e63946;\">학교 구글 아이디로 로그인하여 문제 풀 것 (★반드시 로그인 후 풀이에 응해야 인정됩니다!)</strong>",
      "제출물: 젭퀴즈를 다 푼 완료 화면 스크린샷",
      "특별 혜택: 학급 모든 친구가 제출할 경우 과자 지급",
      "젭퀴즈 링크: <a href=\"https://quiz.zep.us/play/R53q9r\" target=\"_blank\" class=\"contest-link\" onclick=\"alert('⚠️ 반드시 학교 구글 아이디로 로그인한 후 문제를 풀어야 제출이 인정됩니다!'); alert('📸 문제를 다 푼 후 완료 화면 스크린샷을 찍어서 제출해 주세요!');\">zepquiz 바로가기 (https://quiz.zep.us/play/R53q9r)</a>"
    ],
    evaluationCriteria: [
      { category: "퀴즈 완료 여부", desc: "제시된 퀴즈를 끝까지 정상적으로 풀었는지 확인합니다.", weight: "50%" },
      { category: "본인 인증", desc: "완료 화면에서 본인의 참여 내역을 확인할 수 있는 정보를 식별합니다.", weight: "30%" },
      { category: "성실성", desc: "기간 내 퀴즈를 누락 없이 제출했는지 평가합니다.", weight: "20%" }
    ],
    submissionType: "image",
    inputLabel: "퀴즈 완료 스크린샷 캡처본",
    placeholder: "PNG, JPG 형식의 이미지 파일 (최대 5MB)",
    icon: `<svg class="card-visual-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="10" y="6" width="44" height="52" rx="5" />
      <path d="M20 18h24M20 28h24M20 38h14" />
      <path d="M40 40l4 4 8-8" stroke="#10b981" />
      <circle cx="32" cy="18" r="4" fill="currentColor" fill-opacity="0.1" />
    </svg>`
  },
  {
    id: "cuttoon",
    title: "안전 사고 예방 컷툰",
    month: 7,
    monthText: "7월",
    activeMonths: [7],
    period: "2026. 6. 15.(월) ~ 2026. 7. 03.(월)",
    summary: "일상 속 안전의 중요성을 재미있고 유익한 4컷 만화로 표현해보세요.",
    description: "학교, 가정, 길거리 등 일상생활 속에서 일어날 수 있는 다양한 안전사고(교통안전, 실험실 안전, 미끄러짐 등)를 예방하기 위한 수칙이나 경각심을 주는 스토리를 4컷~8컷 만화로 공모합니다.",
    rules: [
      "참가 대상: 3~6학년 학생 누구나 (개인 참여)",
      "규격: 4컷~8컷 구성의 이미지 파일 (가로형/세로형 자유)",
      "제출물: 완결된 만화 원고 이미지 파일",
      "심사 기준: 주제 전달력(50%), 흥미성(30%), 표현력(20%)"
    ],
    evaluationCriteria: [
      { category: "주제 전달력", desc: "일상생활 속 안전사고에 대한 경각심과 수칙이 만화 스토리에 잘 드러나는지 평가합니다.", weight: "50%" },
      { category: "흥미성", desc: "독자에게 재미와 교훈을 동시에 줄 수 있는 흥미로운 구성을 가졌는지 평가합니다.", weight: "30%" },
      { category: "표현력", desc: "4컷~8컷 구성의 완성도와 그림체, 폰트 조화 등 시각적 완성도를 평가합니다.", weight: "20%" }
    ],
    submissionType: "image",
    inputLabel: "컷툰 완성 원고 이미지",
    placeholder: "PNG, JPG 형식의 이미지 파일 (최대 5MB)",
    examples: [
      "asset/examples/cuttoon1.png",
      "asset/examples/cuttoon2.png",
      "asset/examples/cuttoon3.png",
      "asset/examples/cuttoon4.png"
    ],
    icon: `<svg class="card-visual-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8" y="8" width="48" height="48" rx="6" />
      <path d="M8 32h48M32 8v48" />
      <circle cx="20" cy="20" r="4" fill="currentColor" fill-opacity="0.1" />
      <path d="M40 24l8-8M42 44h8M18 42l4 4 4-4" />
    </svg>`
  },
  {
    id: "library",
    title: "온라인 도서관",
    month: 9,
    monthText: "9월",
    activeMonths: [8, 9],
    period: "2026. 8. 10.(목) ~ 2026. 9. 30.(수)",
    summary: "도서관 책 속 깊은 울림을 준 글귀를 타이핑하여 나만의 AI 캘리그라피 엽서로 만들어보세요.",
    description: "독서의 달 9월을 맞이하여, 자신이 감명 깊게 읽은 책 속의 한 줄이나 추천 글귀를 붓글씨 캘리그라피와 인공지능이 생성한 감성 배경을 결합한 엽서 카드 형태로 창작해 제출하는 디지털 문학 공모전입니다.",
    rules: [
      "참가 대상: 본교 3~6학년 학생 누구나",
      "공모 주제: 책에서 얻은 감동, 위로를 주는 도서 문장, 친구에게 추천하고 싶은 멋진 책 구절",
      "제출 규격: 생성기에서 실시간으로 생성한 AI 캘리그라피 엽서 이미지",
      "제출 방법: 도서명/저자/글귀 입력 후 'AI 엽서 생성'을 실행하여 완성된 이미지로 제출",
      "혜택: 멋진 작품들은 학교 복도 로비 전자 화랑(DID) 및 도서관 입구 대형 스크린에 가을 테마 엽서로 기획 전시됩니다."
    ],
    submissionType: "calligraphy",
    icon: `<svg class="card-visual-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12V52c0 2 2 4 4 4h48V8H8c-2 0-4 2-4 4z" />
      <path d="M8 8v44c0 2 2 4 4 4" />
      <path d="M38 18h12M38 28h12M18 18h12M18 28h12M18 38h32" />
      <path d="M42 46l12-12-4-4-12 12v4h4z" fill="currentColor" fill-opacity="0.15" />
    </svg>`
  },
  {
    id: "transcription",
    title: "디지털 필사",
    month: 10,
    monthText: "10월",
    summary: "한글날이 있는 10월, 우리 글의 아름다움을 디지털 펜이나 키보드로 깊이 새겨봅니다.",
    description: "선정된 멋진 시 구절이나 명문장을 온전히 읽고, 이를 손글씨나 태블릿 펜으로 필사하여 제출하거나 타이핑을 통한 감상을 남깁니다. 한글의 시각적 멋과 문장의 가치를 음미하는 시간입니다.",
    rules: [
      "참가 대상: 아름다운 한글을 사랑하는 3~6학년 학생 누구나",
      "제출 방식: [선택 1] 디지털 기기(아이패드, 갤럭시탭 등)로 필사한 이미지 파일 제출, [선택 2] 제공되는 양식에 타자로 텍스트 타이핑 제출",
      "특별 혜택: 학급 인원의 2/3 이상이 참여하였을 경우 학급 전체에 소정의 기념품을 지급합니다."
    ],
    submissionType: "image_or_text",
    inputLabel: "필사 작품 또는 감상",
    placeholder: "필사한 손글씨 이미지(PNG/JPG)를 업로드하거나 아래 텍스트 상자에 마음을 담아 입력해주세요.",
    icon: `<svg class="card-visual-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 20h30M12 32h20" />
      <path d="M38 10h14v44H12c-2.2 0-4-1.8-4-4V12c0-2.2 1.8-4 4-4h26v2" />
      <path d="M44 48l12-12-4-4-12 12v4h4z" />
    </svg>`
  },
  {
    id: "pixelart",
    title: "픽셀아트",
    month: 11,
    monthText: "11월",
    summary: "네모난 픽셀 속에 담아내는 나만의 디지털 세상과 미니멀리즘 디자인.",
    description: "레트로 감성을 자극하는 픽셀 도트 그래픽 대회입니다. 웹사이트에 내장된 30×30 도트 에디터에서 직접 작품을 그리거나, 외부에서 제작한 이미지를 업로드해 접수할 수 있습니다.",
    rules: [
      "참가 대상: 도트 그래픽과 레트로 감성을 좋아하는 3~6학년 학생",
      "규격: 30×30 도트 캔버스 (내장 에디터 사용 가능) 또는 자유 사이즈 이미지 업로드",
      "제출물: 내장 도트 에디터로 직접 그린 작품 또는 별도 제작한 이미지 파일",
      "심사 기준: 창의성(40%), 도트 정밀성(30%), 색상 조화(30%)"
    ],
    evaluationCriteria: [
      { category: "창의성", desc: "도트라는 제약을 활용해 자신만의 창의적이고 유니크한 세계를 묘사했는지 평가합니다.", weight: "40%" },
      { category: "도트 정밀성", desc: "어색한 부분 없이 세밀하고 깨끗한 픽셀 터치와 형태 구현력을 평가합니다.", weight: "30%" },
      { category: "색상 조화", desc: "제한된 픽셀 팔레트 내에서 세련되고 감각적인 색상 배합을 이루었는지 평가합니다.", weight: "30%" }
    ],
    submissionType: "image",
    inputLabel: "도트 픽셀아트 이미지 파일",
    placeholder: "PNG, JPG 형식의 픽셀 파일 (투명 배경 권장, 최대 5MB)",
    icon: `<svg class="card-visual-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8" y="8" width="48" height="48" rx="4" />
      <path d="M8 20h48M8 32h48M8 44h48M20 8v48M32 8v48M44 8v48" />
      <rect x="23" y="23" width="6" height="6" fill="currentColor" />
      <rect x="35" y="35" width="6" height="6" fill="currentColor" />
      <rect x="35" y="23" width="6" height="6" fill="currentColor" />
    </svg>`
  },
  {
    id: "sound_album",
    title: "소로 사운드 앨범",
    month: 12,
    monthText: "12월",
    summary: "디지털 음악 도구로 우리들의 소중한 학교생활 추억과 감정을 노래에 담아 공유해 보세요.",
    description: "디지털 음악 제작 도구(Chrome Music Lab, GarageBand, BandLab, 멜로디 카드 등)를 활용하여 2026년 학교생활, 친구와의 추억, 다채움 활용 수업, 한글날 활동 등 한 해 동안의 배움과 기억을 음악으로 자유롭게 표현해 제출합니다.",
    rules: [
      "참가 대상: 본교 3~6학년 재학생 누구나 (개인 참여)",
      "공모 주제: 2026년 학교생활, 친구와의 추억, 다채움 활용 수업, 한글날 활동 등 한 해를 돌아볼 수 있는 주제",
      "제출 규격: 디지털 음악 도구로 제작한 음악 파일 (MP3, WAV, M4A 형식, 최대 10MB)",
      "제출 내용: 음악 파일 및 곡 소개글 (장면, 분위기, 감정, 가사 등 200자 이내)",
      "활용 계획: 제출 작품은 온라인 사운드 앨범 형태로 공유하여 음악 감상 및 학교생활 회고에 활용되며, 우수작은 연말 성과 공유 자료 및 영상 배경음악 등으로 사용됩니다."
    ],
    submissionType: "audio",
    inputLabel: "디지털 기기로 직접 제작한 음악 파일 업로드",
    placeholder: "MP3, WAV, M4A 형식의 음악 파일 (최대 10MB)",
    icon: `<svg class="card-visual-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 48V14l30-6v34" />
      <circle cx="12" cy="48" r="6" fill="currentColor" fill-opacity="0.15" />
      <circle cx="42" cy="42" r="6" fill="currentColor" fill-opacity="0.15" />
      <path d="M18 26l30-6" />
    </svg>`
  }
];

const CALLIGRAPHY_THEMES_IMAGES = {
  sky: [
    "asset/backgrounds/sky_0.jpg",
    "asset/backgrounds/sky_1.jpg",
    "asset/backgrounds/sky_2.jpg",
    "asset/backgrounds/sky_3.jpg",
    "asset/backgrounds/sky_4.jpg",
    "asset/backgrounds/sky_5.jpg",
    "asset/backgrounds/sky_6.jpg",
    "asset/backgrounds/sky_7.jpg",
    "asset/backgrounds/sky_8.jpg",
    "asset/backgrounds/sky_9.jpg",
    "asset/backgrounds/sky_10.jpg",
    "asset/backgrounds/sky_11.jpg",
    "asset/backgrounds/sky_12.jpg",
    "asset/backgrounds/sky_13.jpg",
    "asset/backgrounds/sky_14.jpg",
    "asset/backgrounds/sky_15.jpg",
    "asset/backgrounds/sky_16.jpg",
    "asset/backgrounds/sky_17.jpg",
    "asset/backgrounds/sky_18.jpg",
    "asset/backgrounds/sky_19.jpg"
  ],
  forest: [
    "asset/backgrounds/forest_0.jpg",
    "asset/backgrounds/forest_1.jpg",
    "asset/backgrounds/forest_2.jpg",
    "asset/backgrounds/forest_3.jpg",
    "asset/backgrounds/forest_4.jpg",
    "asset/backgrounds/forest_5.jpg",
    "asset/backgrounds/forest_6.jpg",
    "asset/backgrounds/forest_7.jpg",
    "asset/backgrounds/forest_8.jpg",
    "asset/backgrounds/forest_9.jpg",
    "asset/backgrounds/forest_10.jpg",
    "asset/backgrounds/forest_11.jpg",
    "asset/backgrounds/forest_12.jpg",
    "asset/backgrounds/forest_13.jpg",
    "asset/backgrounds/forest_14.jpg",
    "asset/backgrounds/forest_15.jpg",
    "asset/backgrounds/forest_16.jpg",
    "asset/backgrounds/forest_17.jpg",
    "asset/backgrounds/forest_18.jpg",
    "asset/backgrounds/forest_19.jpg"
  ],
  ocean: [
    "asset/backgrounds/ocean_0.jpg",
    "asset/backgrounds/ocean_1.jpg",
    "asset/backgrounds/ocean_2.jpg",
    "asset/backgrounds/ocean_3.jpg",
    "asset/backgrounds/ocean_4.jpg",
    "asset/backgrounds/ocean_5.jpg",
    "asset/backgrounds/ocean_6.jpg",
    "asset/backgrounds/ocean_7.jpg",
    "asset/backgrounds/ocean_8.jpg",
    "asset/backgrounds/ocean_9.jpg",
    "asset/backgrounds/ocean_10.jpg",
    "asset/backgrounds/ocean_11.jpg",
    "asset/backgrounds/ocean_12.jpg",
    "asset/backgrounds/ocean_13.jpg",
    "asset/backgrounds/ocean_14.jpg",
    "asset/backgrounds/ocean_15.jpg",
    "asset/backgrounds/ocean_16.jpg",
    "asset/backgrounds/ocean_17.jpg",
    "asset/backgrounds/ocean_18.jpg",
    "asset/backgrounds/ocean_19.jpg"
  ],
  room: [
    "asset/backgrounds/room_0.jpg",
    "asset/backgrounds/room_1.jpg",
    "asset/backgrounds/room_2.jpg",
    "asset/backgrounds/room_3.jpg",
    "asset/backgrounds/room_4.jpg",
    "asset/backgrounds/room_5.jpg",
    "asset/backgrounds/room_6.jpg",
    "asset/backgrounds/room_7.jpg",
    "asset/backgrounds/room_8.jpg",
    "asset/backgrounds/room_9.jpg",
    "asset/backgrounds/room_10.jpg",
    "asset/backgrounds/room_11.jpg",
    "asset/backgrounds/room_12.jpg",
    "asset/backgrounds/room_13.jpg",
    "asset/backgrounds/room_14.jpg",
    "asset/backgrounds/room_15.jpg",
    "asset/backgrounds/room_16.jpg",
    "asset/backgrounds/room_17.jpg",
    "asset/backgrounds/room_18.jpg",
    "asset/backgrounds/room_19.jpg"
  ],
  paper: [
    "asset/backgrounds/paper_0.jpg",
    "asset/backgrounds/paper_1.jpg",
    "asset/backgrounds/paper_2.jpg",
    "asset/backgrounds/paper_3.jpg",
    "asset/backgrounds/paper_4.jpg",
    "asset/backgrounds/paper_5.jpg",
    "asset/backgrounds/paper_6.jpg",
    "asset/backgrounds/paper_7.jpg",
    "asset/backgrounds/paper_8.jpg",
    "asset/backgrounds/paper_9.jpg",
    "asset/backgrounds/paper_10.jpg",
    "asset/backgrounds/paper_11.jpg",
    "asset/backgrounds/paper_12.jpg",
    "asset/backgrounds/paper_13.jpg",
    "asset/backgrounds/paper_14.jpg",
    "asset/backgrounds/paper_15.jpg",
    "asset/backgrounds/paper_16.jpg",
    "asset/backgrounds/paper_17.jpg",
    "asset/backgrounds/paper_18.jpg",
    "asset/backgrounds/paper_19.jpg"
  ]
};

// ====================================================
// STATIC GALLERY DATA (2025 KEYRING SUBMISSIONS)
// ====================================================
const RAW_2025_KEYRING_DATA = `3-1,윤정민,https://drive.google.com/open?id=1p6_HRRsGOrqoja43s3-3QU1xiq-F-Owg
3-1,이도,https://drive.google.com/open?id=1GanqBkGLjS5tUcljCkTjkQWOke_S1_yS
3-1,김예은 ,https://drive.google.com/open?id=1xzZiycSCB4o_Wy1gzAhPlyCJLtM9SY6i
3-4,이수지,https://drive.google.com/open?id=1PV9DrKFtY3qjZ09AIVkGhd5YYk84GpkP
3-7,김민서,https://drive.google.com/open?id=11W0x9_A43_sGoLfdkY8aMjdvbIcpp1As
4-1,이예서,https://drive.google.com/open?id=14RVLCB3NTjbZ-J8B1dLK2o8GBTsRI6_d
4-1,신아윤 ,https://drive.google.com/open?id=1OonJHLjYlCUQeqCYL5eAkRrYdimDJJVI
4-3,김별,https://drive.google.com/open?id=1-9CE9QOGCJ9L5f_y3nFhfO2qg18UkV7W
4-3,윤성준,https://drive.google.com/open?id=1jJxzoLKRp6-A76XIoEY29RTK8IsW_Crj
4-3,이서은,https://drive.google.com/open?id=1XXm-zmLWsJdCZyim5bEygDOUcweiZxAP
4-3,신지아,https://drive.google.com/open?id=1QE48dS8EnNzO1bOz7w5ezQfrKke9Hslh
4-3,김우희,https://drive.google.com/open?id=1aRBOqeirvAdvobnmlPSYyv0dhQiI_KBQ
4-6,정윤채,https://drive.google.com/open?id=1O1RcNBqEOnhq2qtZIoDj9nkzPDzbcE_l
4-6,김다은,https://drive.google.com/open?id=1_wtCpaQZgvFYpLccIQ8yul6fBMScOmDu
5-2,남승민,https://drive.google.com/open?id=1qzQv6PtrNI1NH2rsnnmWen5V5QiePL0U
5-2,이예슬,https://drive.google.com/open?id=1Q7ukx4s6L3r0Aif8EDJM9TPOasNKJ_q3
5-2,김재윤,https://drive.google.com/open?id=1azlnKIwm43FNla9AL7A6A7Ym6_VV-8xF
5-2,홍지유,https://drive.google.com/open?id=17o2OwBpPnMF_KomfOtHBa1dR4cgYDMPD
5-2,김영준,https://drive.google.com/open?id=1Z3WgzmNGtfMgtJbDuH33RuJeTQw03o0q
5-2,남승민,https://drive.google.com/open?id=1qDgBMCu5ZnKo6Tmb_1DDS4Bu0xD8VZb4
5-2,홍지유,https://drive.google.com/open?id=1lmSbD2oKn7rCc4Yf2lFlyzvNzd7gQyOX
5-2,김영준,https://drive.google.com/open?id=1waNGFqlgcBYlfrSpvd65QV8iTpZ9Ue4X
5-2,유선우,https://drive.google.com/open?id=10G5Fh2TU6uAIZ_WoU9h27gc0cKclLZRP
5-2,유선우,https://drive.google.com/open?id=1wAGBi4_A8Ny3JSUA16nbDC9JSB94COnT
5-2,김영준,https://drive.google.com/open?id=1qCqZk5Zv3itgbiJOSuE5oZ9MmXqfOikE
5-2,이예슬,https://drive.google.com/open?id=1SZayQ-FLUtydJH6HdVDcMbc_7VjXDPxj
5-2,공도윤,https://drive.google.com/open?id=1K2f2Nd8T7h7F6LNVfHpf4ymuGvll8GX2
5-2,김민선,https://drive.google.com/open?id=1JjAY3JJsd4Q9PtEpbCTxr4g2ZAxgGWFF
5-2,김보빈,https://drive.google.com/open?id=1-VOfs_P4Xu2f4BPqMWKjd9PjBulNJB5c
5-2,김시완,https://drive.google.com/open?id=1LfYtpyMzekL5_FaxnIIdKycuFwr_99rt
5-2,김지율,https://drive.google.com/open?id=15FxyIkJi7IM8oucELYci9big5lVgWgmD
5-2,박나경,https://drive.google.com/open?id=1DbI0lLm02-_1iWxGU32BE6pe1YZFsFCl
5-2,박지후,https://drive.google.com/open?id=17vs8roUvLnyqUNDBEb7UlfKCmqR4yDa_
5-2,박지후2,https://drive.google.com/open?id=159_dpFKwuU-uXT-aLc0KtncV2f2RXmNK
5-2,방채민,https://drive.google.com/open?id=16IlFfENgBrA-lUq64NKichSxUfpAWDsz
5-2,백지민,https://drive.google.com/open?id=1RJc1mJUZsHq8MIXtBqFia4geTN25Ilyg
5-2,백지민,https://drive.google.com/open?id=16_rRTWuZfhnhff4PvH7RrpRGkAGUbmEa
5-2,유다은,https://drive.google.com/open?id=1tG_3tnVtLzGHs6J3MGjpDSoAV1Lv1Tkf
5-2,이건형,https://drive.google.com/open?id=1RH19vXf3l0AiHWHObqfXFacs30Z_kziQ
5-2,이재령,https://drive.google.com/open?id=1x-PhZLK_I_tCPoPE6cGN6FGamkK-KUqi
5-2,이재령,https://drive.google.com/open?id=1rlGkuFDiqlBMwfQZAtUzxTcry0EarOYd
5-2,임우현,https://drive.google.com/open?id=1MQX0M0p1fdbEun-buNjCHiqL1tAScLre
5-2,정하윤,https://drive.google.com/open?id=1RGqli6Ykvt4crdaiQw8fCpifXXNOv0zN
5-2,지준영,https://drive.google.com/open?id=1cDDjjL43fPt_GCeQDS7jZPtI_3vHIjOP
5-2,황주연,https://drive.google.com/open?id=1msqDyU0H9ZRrYEvcIj5in_qI3ZZGgRNF
5-2,황주연,https://drive.google.com/open?id=1-Y44EhbEOY4re5fzJWI2ZcNx4wp3FXkC
5-2,권대현,https://drive.google.com/open?id=1RrzRXKYpoEIoNqe0q33j4wlC1eOFSxy6
5-2,마준민,https://drive.google.com/open?id=1haJkab5JK26OOYZwpOxltAs5-M9NELsZ
5-2,마준민,https://drive.google.com/open?id=1uj0wBZTZvUPFnpYMgmsngCaNY_2_4vi9
5-3,조하준 ,https://drive.google.com/open?id=16SQT0S7azBPtD5nI4eJ1wSBE11nfT9r3
5-3,김하루 ,https://drive.google.com/open?id=1vexfwpbc7tKd_xIsjpvVWzOuxyq_yccj
5-3,김채빈,https://drive.google.com/open?id=1IlI9fZM1U3Cp_3_cWPPa7YsLTlHKeK_B
5-3,고윤서,https://drive.google.com/open?id=1xzcVhhZPvi38jcpURR_s3Noo2K35bt86
5-3,김서윤,https://drive.google.com/open?id=1MiVKmQAIL4jh-CQ92afpKcl6NJGft9dV
5-3,김서윤,https://drive.google.com/open?id=1PkaZnjINFSx_kX8QJSGbsk3dsaw4MRix
5-3,김서윤,https://drive.google.com/open?id=1OdvhE8dcnAmdU3eC_eCroWQEErm7PQL7
5-3,방채현,https://drive.google.com/open?id=1FKO2gPIwQLjH9PLZzu19jZE8SHCC8Ci-
5-3,정서현,https://drive.google.com/open?id=1eY8nLEkEl4hq3wKlWaeK6ZyGU25bvaM6
5-3,유서린,https://drive.google.com/open?id=10gsjoqaRTv9LsH8p5YYMyx70u0sp0_ju
5-3,이라임,https://drive.google.com/open?id=1lpbtGNhTYbchCGTmjD02Fqlx8fZR5Xz6
5-3,이효민,https://drive.google.com/open?id=1G7E1zKwrX6JW6gdSeQ9i5UNK-cPw6P4j
5-3,이은서,https://drive.google.com/open?id=1BzoajAIuGNdpGP3IEt18yTPrPRmWuKUv
5-3,이하빈 ,https://drive.google.com/open?id=1qJjWfmP7jAC2QZpUXtcu1i9iI_pAWpf2
3-6,김범준,https://drive.google.com/open?id=1okuiUWogXz8BWMWiKdZOAbEzXmLL1iTq
3-4,최예원,https://drive.google.com/open?id=1Ti4HIfP9MNR7Ew8c1I31bekzQYdut7a0
3-3,박홍비,https://drive.google.com/open?id=1jBFcCAYV6gpYC0ocjnPXJvOJPas1eH6X
4-6,양수아,https://drive.google.com/open?id=1ZfrhWLYU8T5xUU9pdeL196QYDuZKjNi5
5-1,곽로희,https://drive.google.com/file/d/1zUpqwg5N_ThduldaYIpVMIQHcPNrQz_O/
5-1,곽호영,https://drive.google.com/file/d/1YDGn3nots8gS2PoHyUs3u6DewlmUFtHd
5-1,김가현,https://drive.google.com/file/d/1T3vh5O9Fgoz_Wg76Ck5rOISA1cQRpDn-
5-1,김건우,https://drive.google.com/file/d/1T4T1EZzBf_WSkisGbSqXhnaVK0MOmtqk
5-1,김라임,https://drive.google.com/file/d/15pVserNg7-mir3xQJn3zg1ku0Gp5argx/view?usp=drive_link
5-1,김시유,https://drive.google.com/file/d/1bagLFa4zwvI8Tz5jDeoMTTYNuBYgsPAg/view?usp=drive_link
5-1,김하윤,https://drive.google.com/file/d/1QnRf3ll4QTOAw-luIZBFZUPpQpCUBZVu/view?usp=drive_link
5-1,문재현,https://drive.google.com/file/d/1T-kpv270q0dr3RxdTzICcJ0DmgCoAKUT/view?usp=drive_link
5-1,어현준,https://drive.google.com/file/d/1xjb4u9Yj1TbbWKNwBQDPfzHkZPSx5DHr/view?usp=drive_link
5-1,이종호,https://drive.google.com/file/d/1zSJMD37SNP0ymeKZMV-XIM7F_DbpDMtp/view?usp=drive_link
5-1,이지호,https://drive.google.com/file/d/1dgtM3HfVBs0ZNShTAx1yODzsnMrqaBWO/view?usp=drive_link
5-1,이하늘,https://drive.google.com/file/d/1Wx8oQkQV12NnbYrLgdWDtJXDtuUHJ66s/view?usp=drive_link
5-1,임예서,https://drive.google.com/file/d/19kL4Nm2bCbvMYNnc3dQK4HG5iGQlbH3X/view?usp=drive_link
5-1,임재열,https://drive.google.com/file/d/1yWfrLxU89g4nIqZoBgNwH_1MZNJ1oIGU/view?usp=drive_link
5-1,임채연,https://drive.google.com/file/d/1LuBmm5_vd0JgD3kWVaI2pot86ERCMm0Z/view?usp=drive_link
5-1,전서현,https://drive.google.com/file/d/1QNwyAfY88D5TeFV9bmvk35Eq7JR15ZoU/view?usp=drive_link
5-1,정은명,https://drive.google.com/file/d/1Gcn0aPhdOh48UFNwec67vOrhCqqlNCx9/view?usp=drive_link
5-1,정지후,https://drive.google.com/file/d/11lCwNooH_O2bUZJqbtCl-JKdYoW4lUXj/view?usp=drive_link
5-1,조하늬,https://drive.google.com/file/d/1gWqytQWilFffJjw4L_2ssUgrv4_uDfAp/view?usp=drive_link
5-1,최지유,https://drive.google.com/file/d/1j84Fzs5C_OO4IHGlUZeoNAIyXRsbR3Db/view?usp=drive_link
5-1,양온유,https://drive.google.com/file/d/1-Ce_BsEI_XFrY6XcMEZFs5O4a70fq0tX/view?usp=drive_link
5-1,박소율,https://drive.google.com/file/d/1Ce7nTT6jJd5cz0Mr3YJ_xqKHfUPls2Gj`;

function extractDriveId(url) {
  let id = "";
  if (url.includes("id=")) {
    id = url.split("id=")[1].split("&")[0];
  } else if (url.includes("/file/d/")) {
    id = url.split("/file/d/")[1].split("/")[0];
  }
  return id.trim();
}

function getGoogleDriveDirectLink(url) {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w600` : url;
}

const GALLERY_2025_DATA = RAW_2025_KEYRING_DATA.trim().split("\n").map(line => {
  const [gradeClass, name, url] = line.split(",");
  const grade = parseInt(gradeClass.split("-")[0], 10);
  return {
    gradeClass,
    grade,
    name: name.trim(),
    imageUrl: getGoogleDriveDirectLink(url)
  };
});

// ====================================================
// STATE MANAGEMENT & USER SESSION CONFIGURATION
// ====================================================
let currentVirtualMonth = 6;
const FORCE_ACTIVE_CONTESTS = ["keyring", "zepquiz"];

function getContestStatus(contestOrMonth) {
  // If contestOrMonth is an object, extract month and id
  const contestMonth = typeof contestOrMonth === "object" ? contestOrMonth.month : (typeof contestOrMonth === "number" ? contestOrMonth : null);
  const contestId = typeof contestOrMonth === "object" ? contestOrMonth.id : (typeof contestOrMonth === "string" ? contestOrMonth : null);

  // 1. 관리자 수동 제어 우선 검사 (Locks 설정이 명시적으로 존재한다면 절대적 우선순위)
  if (contestId) {
    const locks = contestLocks;
    if (locks[contestId] !== undefined) {
      return locks[contestId] === true ? "closed" : "active";
    }
  }

  // 키링 공모전 및 저작권 퀴즈(6월)만 활성화하고 나머지는 모두 접수 마감(closed)으로 변경
  if (contestId === "keyring" || contestId === "zepquiz" || contestOrMonth === "keyring" || contestOrMonth === "zepquiz" || contestMonth === 6) {
    return "active";
  }
  return "closed";
}

let activeContest = null;
let uploadBase64Data = null;

// User Authentication States
let currentUser = null;
let GOOGLE_SHEET_API_URL_error = false;

// Auth Form Grade/Class/Number dropdown config
const GRADE_CLASS_LIMITS = {
  "3": 6,
  "4": 7,
  "5": 6,
  "6": 5
};

function setupAuthFormDropdowns() {
  const loginGrade = document.getElementById("login-grade");
  const loginClass = document.getElementById("login-class");
  const loginNumber = document.getElementById("login-number");

  const signupGrade = document.getElementById("signup-grade");
  const signupClass = document.getElementById("signup-class");
  const signupNumber = document.getElementById("signup-number");

  // Populate number options (1 to 27)
  function populateNumbers(selectElement) {
    if (!selectElement) return;
    selectElement.innerHTML = '<option value="" disabled selected>선택</option>';
    for (let i = 1; i <= 27; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${i}번`;
      selectElement.appendChild(opt);
    }
  }

  // Populate class options dynamically based on grade
  function updateClassDropdown(gradeVal, classSelectElement) {
    if (!classSelectElement) return;
    classSelectElement.innerHTML = '<option value="" disabled selected>선택</option>';
    
    if (!gradeVal) {
      const disabledOpt = document.createElement("option");
      disabledOpt.value = "";
      disabledOpt.disabled = true;
      disabledOpt.selected = true;
      disabledOpt.textContent = "학년 선택 필요";
      classSelectElement.appendChild(disabledOpt);
      return;
    }

    const maxClass = GRADE_CLASS_LIMITS[gradeVal] || 0;
    for (let i = 1; i <= maxClass; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${i}반`;
      classSelectElement.appendChild(opt);
    }
  }

  // Initialize Numbers
  populateNumbers(loginNumber);
  populateNumbers(signupNumber);

  // Initialize dynamic class updates
  if (loginGrade && loginClass) {
    loginGrade.addEventListener("change", (e) => {
      updateClassDropdown(e.target.value, loginClass);
    });
    updateClassDropdown("", loginClass);
  }

  if (signupGrade && signupClass) {
    signupGrade.addEventListener("change", (e) => {
      updateClassDropdown(e.target.value, signupClass);
    });
    updateClassDropdown("", signupClass);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  initVirtualTime();
  initUserSession();
  await fetchContestLocks();
  renderContestGrid();
  setupEventListeners();
  setupAuthFormDropdowns();
  updateLiveCounters();
  initAdminPanel();
});

// ====================================================
// THEME SWITCHER
// ====================================================
function initTheme() {
  const savedTheme = localStorage.getItem("soro_theme") || "dark";
  const body = document.body;

  if (savedTheme === "light") {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    updateThemeIcon("light");
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    updateThemeIcon("dark");
  }
}

function toggleTheme() {
  const body = document.body;
  let newTheme = "dark";

  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    newTheme = "light";
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    newTheme = "dark";
  }

  localStorage.setItem("soro_theme", newTheme);
  updateThemeIcon(newTheme);
  showToast(`${newTheme === "dark" ? "다크 테마" : "라이트 테마"}로 변경되었습니다.`, "info");
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById("theme-icon");
  if (!themeIcon) return;
  if (theme === "light") {
    themeIcon.innerHTML = `
      <path d="M12 3a6.79 6.79 0 0 0-6.79 6.79A6.79 6.79 0 0 0 12 16.58a6.59 6.59 0 0 0 4.13-1.45l.13-.1 1.62 1.62.1.13A9.76 9.76 0 0 1 12 21a9 9 0 1 1 0-18Z"></path>
    `;
  } else {
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
    `;
  }
}

// ====================================================
// PRODUCTION TIME CONFIGURATION (JUNE ONLY)
// ====================================================
function initVirtualTime() {
  // 실제 프로덕션 환경의 진행 월을 6월로 고정합니다.
  currentVirtualMonth = 6;
  sessionStorage.removeItem("soro_virtual_month"); // 가상 오버라이드 제거

  const statMonthEl = document.getElementById("stat-current-month");
  if (statMonthEl) {
    statMonthEl.textContent = `${currentVirtualMonth}월`;
  }
}

// ====================================================
// USER SESSION (SIGNUP / LOGIN / LOGOUT) LOGIC
// ====================================================
function initUserSession() {
  const savedUser = localStorage.getItem("soro_current_user");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    
    // [보안/오류 방어] 만약 구버전 세션 정보로 인해 userKey가 누락되어 있다면 자동 복구하여 기입합니다.
    if (currentUser && !currentUser.userKey && currentUser.grade && currentUser.classNum && currentUser.number && currentUser.name) {
      currentUser.userKey = `${currentUser.grade}_${currentUser.classNum}_${currentUser.number}_${currentUser.name}`;
      localStorage.setItem("soro_current_user", JSON.stringify(currentUser));
    }
    
    updateUIForLoggedInState();
  } else {
    currentUser = null;
    updateUIForLoggedOutState();
  }
}

function updateUIForLoggedInState() {
  document.getElementById("auth-trigger-btn").style.display = "none";
  document.getElementById("logout-btn").style.display = "inline-flex";
  document.getElementById("lookup-toggle-btn").style.display = "inline-flex";

  const profileBadge = document.getElementById("user-profile-badge");
  const infoText = document.getElementById("user-info-text");

  // Format: 학년-반 번호 이름
  infoText.textContent = `${currentUser.grade}-${currentUser.classNum} ${currentUser.number}번 ${currentUser.name}`;
  profileBadge.style.display = "inline-flex";

  // Check admin state to toggle admin button next to name
  const adminBtn = document.getElementById("admin-panel-trigger-btn");
  if (adminBtn) {
    const isAdmin = currentUser && 
                    parseInt(currentUser.grade, 10) === 5 && 
                    parseInt(currentUser.classNum, 10) === 1 && 
                    parseInt(currentUser.number, 10) === 27 && 
                    currentUser.name === "김태호";
    adminBtn.style.display = isAdmin ? "inline-flex" : "none";
  }

  closeAuthDrawer();
}

function updateUIForLoggedOutState() {
  document.getElementById("auth-trigger-btn").style.display = "inline-flex";
  document.getElementById("logout-btn").style.display = "none";
  document.getElementById("lookup-toggle-btn").style.display = "none";
  document.getElementById("user-profile-badge").style.display = "none";

  const adminBtn = document.getElementById("admin-panel-trigger-btn");
  if (adminBtn) {
    adminBtn.style.display = "none";
  }

  const levelContainer = document.getElementById("lookup-level-container");
  if (levelContainer) {
    levelContainer.innerHTML = "";
  }
}

function executeLogout() {
  localStorage.removeItem("soro_current_user");
  currentUser = null;
  updateUIForLoggedOutState();
  updateLiveCounters();

  if (activeContest) {
    openContestDetails(activeContest.id);
  }

  showToast("로그아웃 되었습니다.", "info");
}

// SHA-256 단방향 암호화 해싱 함수 (Web Crypto API 사용)
async function hashPassword(password) {
  if (!password) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// REST API or Local Sign Up
async function handleSignUp(grade, classNum, number, name, password) {
  const userKey = `${grade}_${classNum}_${number}_${name}`; // Unique Identifier Key
  const hashedPassword = await hashPassword(password);

  const payload = {
    action: "signUp",
    userKey: userKey,
    grade: grade,
    classNum: classNum,
    number: number,
    name: name,
    password: hashedPassword // 암호화된 패스워드 전송
  };

  if (GOOGLE_SHEET_API_URL) {
    showToast("클라우드 서버에 등록하고 있습니다...", "info");
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.status === "error") {
        showToast(result.message, "error");
        return false;
      }

      const loggedUser = { userKey, grade, classNum, number, name };
      currentUser = loggedUser;
      localStorage.setItem("soro_current_user", JSON.stringify(loggedUser));
      updateUIForLoggedInState();
      updateLiveCounters();
      if (activeContest) openContestDetails(activeContest.id);
      showToast(`${name} 학생의 가입과 로그인이 완료되었습니다! 🎉`, "success");
      return true;
    } catch (error) {
      console.error(error);
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
      return false;
    }
  } else {
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    return false;
  }
}

// REST API or Local Password Reset
async function handleResetPassword(grade, classNum, number, name, newPassword) {
  const userKey = `${grade}_${classNum}_${number}_${name}`;
  const hashedPassword = await hashPassword(newPassword);

  const payload = {
    action: "resetPassword",
    userKey: userKey,
    password: hashedPassword
  };

  // 1. Remote DB Cloud Mode (Google Sheets Apps Script API URL active)
  if (GOOGLE_SHEET_API_URL) {
    showToast("보안 서버에 비밀번호 초기화를 요청 중...", "info");
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.status === "error") {
        showToast(result.message, "error");
        return false;
      }

      // 원격 성공 시, 로컬스토리지 백업 데이터 마이그레이션 및 자동 로그인 처리
      const loggedUser = { userKey, grade, classNum, number, name };
      currentUser = loggedUser;
      localStorage.setItem("soro_current_user", JSON.stringify(loggedUser));

      // 기기 로컬스토리지의 백업 사용자 목록 정보도 갱신
      const users = JSON.parse(localStorage.getItem("soro_users") || "[]");
      const idx = users.findIndex(u => u.userKey === userKey);
      if (idx !== -1) {
        users[idx].password = hashedPassword;
      } else {
        users.push({ userKey, grade, classNum, number, name, password: hashedPassword });
      }
      localStorage.setItem("soro_users", JSON.stringify(users));

      updateUIForLoggedInState();
      updateLiveCounters();
      closeAuthDrawer();
      if (activeContest) openContestDetails(activeContest.id);
      showToast(`비밀번호 재설정 및 자동 로그인이 완료되었습니다! 🎉`, "success");
      return true;
    } catch (error) {
      console.error(error);
      showToast("원격 구글 서버 접속이 원활하지 않습니다. 로컬 초기화를 시도합니다.", "error");
    }
  }

  // 2. Fallback Local Mode
  const users = JSON.parse(localStorage.getItem("soro_users") || "[]");
  const idx = users.findIndex(u => u.userKey === userKey);
  if (idx === -1) {
    showToast("입력하신 정보와 일치하는 학생 계정이 존재하지 않습니다.", "error");
    return false;
  }

  users[idx].password = hashedPassword;
  localStorage.setItem("soro_users", JSON.stringify(users));

  const loggedUser = { userKey, grade, classNum, number, name };
  currentUser = loggedUser;
  localStorage.setItem("soro_current_user", JSON.stringify(loggedUser));

  updateUIForLoggedInState();
  updateLiveCounters();
  closeAuthDrawer();
  if (activeContest) openContestDetails(activeContest.id);
  showToast(`비밀번호 재설정 및 자동 로그인이 완료되었습니다! 🎉`, "success");
  return true;
}

// REST API or Local Login
async function handleLogin(grade, classNum, number, name, password) {
  const userKey = `${grade}_${classNum}_${number}_${name}`;
  const hashedPassword = await hashPassword(password);

  if (GOOGLE_SHEET_API_URL) {
    showToast("보안 서버에서 로그인 확인 중...", "info");
    
    let payload = {
      action: "login",
      userKey: userKey,
      password: hashedPassword
    };

    try {
      let response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload)
      });
      let result = await response.json();

      if (result.status === "error") {
        console.log("Hash login failed, attempting legacy plain text fallback...");
        
        payload.password = password; // 평문으로 재조회 시도
        response = await fetch(GOOGLE_SHEET_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: JSON.stringify(payload)
        });
        result = await response.json();
        
        if (result.status === "error") {
          showToast("학년/반/번호/이름 또는 비밀번호가 일치하지 않습니다.", "error");
          return false;
        }
        
        console.log("Legacy plain text login success! Upgrading user credentials to SHA-256 hash...");
        const upgradePayload = {
          action: "signUp",
          userKey: userKey,
          grade: grade,
          classNum: classNum,
          number: number,
          name: name,
          password: hashedPassword
        };
        
        try {
          await fetch(GOOGLE_SHEET_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(upgradePayload)
          });
        } catch (upgradeErr) {
          console.error("Failed to upgrade remote database password to hash:", upgradeErr);
        }
      }

      const loggedUser = { userKey, grade, classNum, number, name };
      currentUser = loggedUser;
      localStorage.setItem("soro_current_user", JSON.stringify(loggedUser));
      
      updateUIForLoggedInState();
      updateLiveCounters();
      if (activeContest) openContestDetails(activeContest.id);
      showToast(`${name} 학생, 로그인 성공을 환영합니다! 🚀`, "success");
      return true;
    } catch (error) {
      console.error(error);
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
      return false;
    }
  } else {
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    return false;
  }
}

// ====================================================
// AUTHENTICATION DRAWERS & TABS CONTROL
// ====================================================
function openAuthDrawer(defaultTab = "login") {
  const drawer = document.getElementById("auth-drawer");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  switchAuthTab(defaultTab);
}

function resetPasswordResetUI() {
  const passwordGroup = document.getElementById("login-confirm-password-group");
  if (passwordGroup) passwordGroup.style.display = "none";

  const passwordLabel = document.querySelector("label[for='login-password']");
  if (passwordLabel) passwordLabel.textContent = "비밀번호";

  const loginSubmitBtn = document.querySelector("#login-form button[type='submit']");
  if (loginSubmitBtn) {
    loginSubmitBtn.disabled = false;
    loginSubmitBtn.style.opacity = "1";
  }

  const resetBtn = document.getElementById("auth-reset-pw-btn");
  if (resetBtn) {
    resetBtn.innerHTML = "🔑 비밀번호 초기화";
    resetBtn.classList.remove("btn-primary");
    resetBtn.classList.add("btn-secondary");
  }

  const passwordInput = document.getElementById("login-password");
  const confirmInput = document.getElementById("login-confirm-password");
  if (passwordInput) passwordInput.value = "";
  if (confirmInput) confirmInput.value = "";
  document.querySelectorAll("#login-form .form-group").forEach(g => g.classList.remove("has-error"));
}

function closeAuthDrawer() {
  const drawer = document.getElementById("auth-drawer");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  document.getElementById("login-form").reset();
  document.getElementById("signup-form").reset();

  // Reset dynamic class dropdowns to '학년 선택 필요' state
  const loginClass = document.getElementById("login-class");
  if (loginClass) {
    loginClass.innerHTML = '<option value="" disabled selected>학년 선택 필요</option>';
  }
  const signupClass = document.getElementById("signup-class");
  if (signupClass) {
    signupClass.innerHTML = '<option value="" disabled selected>학년 선택 필요</option>';
  }

  document.querySelectorAll(".auth-panel .form-group.has-error").forEach(g => g.classList.remove("has-error"));
  resetPasswordResetUI();
}

function switchAuthTab(tabName) {
  const tabLogin = document.getElementById("tab-login-btn");
  const tabSignup = document.getElementById("tab-signup-btn");
  const panelLogin = document.getElementById("login-panel");
  const panelSignup = document.getElementById("signup-panel");

  resetPasswordResetUI();

  if (tabName === "login") {
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
    panelLogin.style.display = "block";
    panelSignup.style.display = "none";
  } else {
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");
    panelSignup.style.display = "block";
    panelLogin.style.display = "none";
  }
}

// ====================================================
// RENDER CONTEST CARDS
// ====================================================
function renderContestGrid() {
  const grid = document.getElementById("contests-grid");
  grid.innerHTML = "";
  let activeCount = 0;

  CONTESTS_DATA.forEach(contest => {
    const status = getContestStatus(contest);
    let statusClass = "status-pending";
    let statusLabel = "접수 대기";

    if (status === "active") {
      statusClass = "status-active";
      statusLabel = "접수 중";
      activeCount++;
    } else if (status === "closed") {
      statusClass = "status-closed";
      statusLabel = "접수 마감";
    }

    const card = document.createElement("div");
    card.className = "contest-card" + (status === "active" ? " active-contest" : "");
    card.setAttribute("data-id", contest.id);

    card.innerHTML = `
      <div class="card-top">
        <div class="card-meta">
          <span class="badge">${contest.monthText}</span>
          <span class="status-badge ${statusClass}">${statusLabel}</span>
        </div>
        <h3 class="card-title">${contest.title}</h3>
        <p class="card-desc">${contest.summary}</p>
      </div>
      
      <div class="card-visual-wrapper">
        ${contest.icon}
      </div>
      
      <div class="card-bottom">
        <span class="card-period">기간: ${contest.period || `2026년 ${contest.month}월 한 달 간`}</span>
        <button class="card-action-icon" aria-label="${contest.title} 보기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    `;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    card.addEventListener("click", () => openContestDetails(contest.id));
    grid.appendChild(card);
  });

  document.getElementById("stat-active-contests").textContent = `${activeCount}개`;
}

// ====================================================
// CONTEST DRAWER DETAILS & LOGGED-IN CONDITIONAL FORM
// ====================================================


function renderGallery2025(gradeFilter = "all") {
  const gridContainer = document.getElementById("gallery-grid-list");
  if (!gridContainer) return;

  gridContainer.innerHTML = "";

  const filteredData = gradeFilter === "all" 
    ? GALLERY_2025_DATA 
    : GALLERY_2025_DATA.filter(item => item.grade === parseInt(gradeFilter, 10));

  if (filteredData.length === 0) {
    gridContainer.innerHTML = `<div class="helper-text" style="text-align: center; grid-column: span 2; padding: 40px;">해당 학년의 작품이 존재하지 않습니다.</div>`;
    return;
  }

  filteredData.forEach(item => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    
    // Check for '4-6' '김다은' to attach Special '최우수' (Grand Prize) title badge
    const isSpecialAward = (item.gradeClass === "4-6" && item.name === "김다은");
    const awardBadgeHtml = isSpecialAward 
      ? `<span class="gallery-card-award" style="position: absolute; top: 8px; left: 8px; background: #eab308; color: #000; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; z-index: 10; border: 1px solid #000;">🏆 최우수</span>` 
      : "";
    
    card.innerHTML = `
      <div class="gallery-card-img-wrapper loading" style="position: relative;">
        ${awardBadgeHtml}
        <img class="gallery-card-img" src="${item.imageUrl}" alt="${item.name}" loading="lazy" onload="this.parentElement.classList.remove('loading')" onerror="this.src='https://placehold.co/150/0c0c0e/ffffff?text=No+Image'; this.parentElement.classList.remove('loading')">
      </div>
      <div class="gallery-card-info">
        <span class="gallery-card-class">${item.gradeClass}</span>
        <span class="gallery-card-name">${item.name}</span>
      </div>
    `;
    gridContainer.appendChild(card);
  });
}

// ONLINE LIBRARY SUBMISSIONS GALLERY (2026 SUBMISSIONS)
// ====================================================
async function getLibrarySubmissions(gradeFilter = "all", sortBy = "newest", searchKeyword = "") {
  const contestId = "library";
  let submissions = [];

  // 1. Fetch from Google Sheets Apps Script API URL
  if (GOOGLE_SHEET_API_URL) {
    const payload = {
      action: "getAllSubmissions",
      contestId: contestId
    };
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        submissions = result.data;
        // Clean up localStorage: remove any local submissions for this contestId that are NOT in the remote data
        const remoteIds = new Set(submissions.map(s => s.id));
        const allSubmissions = JSON.parse(localStorage.getItem("soro_submissions") || "[]");
        const cleanedSubmissions = allSubmissions.filter(entry => {
          if (entry.contestId !== contestId) return true;
          return remoteIds.has(entry.id);
        });
        localStorage.setItem("soro_submissions", JSON.stringify(cleanedSubmissions));
      }
    } catch (e) {
      console.warn(`Failed to fetch ${contestId} submissions remotely, using local backup:`, e);
    }
  }

  // 2. Fetch local storage entries to merge (or fallback)
  const localSubmissions = JSON.parse(localStorage.getItem("soro_submissions") || "[]")
                             .filter(entry => entry.contestId === contestId);

  if (submissions.length === 0) {
    submissions = localSubmissions;
  } else {
    // Merge local entries that are not yet in the remote submissions (avoid duplicates by id)
    const remoteIds = new Set(submissions.map(s => s.id));
    localSubmissions.forEach(localEntry => {
      if (!remoteIds.has(localEntry.id)) {
        submissions.push(localEntry);
      }
    });
  }

  // Normalize entry.data (Ensure it is parsed into an Object if it is a JSON string from Google Sheets API)
  submissions.forEach(entry => {
    if (entry && entry.data && typeof entry.data === "string") {
      try {
        entry.data = JSON.parse(entry.data);
      } catch (err) {
        console.warn("Failed to parse entry.data JSON string:", err);
        entry.data = {};
      }
    } else if (entry && !entry.data) {
      entry.data = {};
    }
  });

  // [Premium 1인 1작품 제한 필터] 학생당 가장 마지막(최신)으로 제출한 1개의 작품만 노출 및 중복 제거
  const latestSubmissionsMap = new Map();
  submissions.forEach(entry => {
    const studentKey = entry.studentUsername ? entry.studentUsername.toLowerCase() : (entry.studentName ? entry.studentName.toLowerCase() : "");
    if (studentKey) {
      const existing = latestSubmissionsMap.get(studentKey);
      if (!existing || new Date(entry.timestamp) > new Date(existing.timestamp)) {
        latestSubmissionsMap.set(studentKey, entry);
      }
    } else {
      latestSubmissionsMap.set(entry.id, entry);
    }
  });
  submissions = Array.from(latestSubmissionsMap.values());

  // Filter by grade
  if (gradeFilter !== "all") {
    const gradeNum = parseInt(gradeFilter, 10);
    submissions = submissions.filter(entry => parseInt(entry.studentGrade, 10) === gradeNum);
  }

  // Filter by search keyword
  if (searchKeyword.trim() !== "") {
    const kw = searchKeyword.trim().toLowerCase();
    submissions = submissions.filter(entry => {
      const bookTitle = (entry.data && entry.data["book-title"]) ? entry.data["book-title"].toLowerCase() : "";
      const title = (entry.data && entry.data["title"]) ? entry.data["title"].toLowerCase() : "";
      const bookAuthor = (entry.data && entry.data["book-author"]) ? entry.data["book-author"].toLowerCase() : "";
      const author = (entry.data && entry.data["author"]) ? entry.data["author"].toLowerCase() : "";
      const studentName = entry.studentName ? entry.studentName.toLowerCase() : "";
      return bookTitle.includes(kw) || title.includes(kw) || bookAuthor.includes(kw) || author.includes(kw) || studentName.includes(kw);
    });
  }

  // Sort
  if (sortBy === "likes") {
    const likes = JSON.parse(localStorage.getItem(`soro_${contestId}_likes`) || "{}");
    submissions.sort((a, b) => {
      const likesA = likes[a.id] || 0;
      const likesB = likes[b.id] || 0;
      if (likesA !== likesB) {
        return likesB - likesA;
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  } else {
    // Newest first
    submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  return submissions;
}

async function renderLibraryGallery(gradeFilter = "all") {
  const gridContainer = document.getElementById("gallery-grid-list");
  if (!gridContainer) return;

  const contestId = "library";

  gridContainer.innerHTML = `
    <div style="grid-column: span 2; display: flex; flex-direction: column; align-items: center; padding: 40px; color: var(--text-secondary);">
      <div class="spinner"></div>
      <p style="margin-top: 12px; font-weight: bold;">모두가 제출한 작품을 불러오고 있습니다...</p>
    </div>
  `;

  const submissions = await getLibrarySubmissions(gradeFilter, "newest", "");

  gridContainer.innerHTML = "";

  if (submissions.length === 0) {
    gridContainer.innerHTML = `<div class="helper-text" style="text-align: center; grid-column: span 2; padding: 40px; color: var(--text-secondary);">아직 등록된 작품이 없습니다. 🥺<br>가장 먼저 멋진 작품을 제출해 보세요!</div>`;
    return;
  }

  const likes = JSON.parse(localStorage.getItem(`soro_${contestId}_likes`) || "{}");
  const likedByMe = JSON.parse(localStorage.getItem(`soro_${contestId}_liked_by_me`) || "[]");

  submissions.forEach(entry => {
    const likesCount = likes[entry.id] || 0;
    const isLiked = likedByMe.includes(entry.id);
    
    // Dynamic image URL resolution
    let imageUrl = "";
    if (entry.data) {
      if (entry.data.image) {
        imageUrl = entry.data.image;
      } else if (entry.data.images && entry.data.images.length > 0) {
        imageUrl = entry.data.images[0];
      }
    }

    // Convert Google Drive viewer link to direct image link if applicable
    if (imageUrl && imageUrl.includes("drive.google.com")) {
      imageUrl = getGoogleDriveDirectLink(imageUrl);
    }

    // [Premium UI 방어막] 이미지가 깨졌거나 비어있는 무효한 테스트 데이터는 렌더링 배제
    if (!imageUrl || imageUrl.trim() === "" || imageUrl.includes("No Image") || imageUrl.includes("placehold.co")) {
      return;
    }

    const card = document.createElement("div");
    card.className = "gallery-card";
    
    // Mask name for privacy protection (e.g. 홍길동 -> 홍*동)
    let maskedName = entry.studentName || "학생";
    if (maskedName.length > 2) {
      maskedName = maskedName[0] + "*".repeat(maskedName.length - 2) + maskedName[maskedName.length - 1];
    } else if (maskedName.length === 2) {
      maskedName = maskedName[0] + "*";
    }

    // Dynamic title resolution
    let displayTitle = "";
    if (contestId === "library") {
      displayTitle = entry.data["book-title"] || "독서 엽서";
    } else if (contestId === "cuttoon") {
      displayTitle = entry.data["title"] || "안전사고 예방 컷툰";
    } else {
      displayTitle = entry.contestTitle || "제출작";
    }

    // Fetch award badge
    const awards = JSON.parse(localStorage.getItem("soro_admin_awards") || "{}");
    const currentAward = awards[entry.id] || "";
    const awardBadgeHtml = currentAward === "grand"
      ? `<span class="gallery-card-award" style="position: absolute; top: 8px; left: 8px; background: #eab308; color: #000; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; z-index: 10; border: 1px solid #000; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">🏆 최우수</span>`
      : (currentAward === "gold" ? `<span class="gallery-card-award" style="position: absolute; top: 8px; left: 8px; background: #cbd5e1; color: #000; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; z-index: 10; border: 1px solid #000; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">🥈 우수</span>` : "");

    card.innerHTML = `
      <div class="gallery-card-img-wrapper postcard-ratio loading" style="position: relative; cursor: pointer; overflow: hidden; border-radius: 8px;">
        ${awardBadgeHtml}
        <img class="gallery-card-img" src="${imageUrl}" alt="${displayTitle}" loading="lazy" style="width: 100%; transition: transform 0.3s;" onload="this.parentElement.classList.remove('loading')" onerror="this.src='https://placehold.co/800x600/0c0c0e/ffffff?text=No+Image'; this.parentElement.classList.remove('loading')" onclick="openImageModal('${imageUrl}')">
      </div>
      <div class="gallery-card-info" style="display:flex; justify-content:space-between; align-items:center; padding: 10px 6px;">
        <div style="display:flex; flex-direction:column; gap:2px;">
          <span style="font-weight:700; font-size:0.75rem; color:var(--text-secondary);">${entry.studentGrade}학년 ${entry.studentClass}반</span>
          <span style="font-weight:700; font-size:0.9rem; color:var(--text-primary);">${maskedName}</span>
        </div>
        <button class="gallery-card-like-btn${isLiked ? ' liked' : ''}" onclick="toggleLikePostcard('${entry.id}', this, false)" style="background:none; border:none; color:${isLiked ? '#ef4444' : 'var(--text-secondary)'}; cursor:pointer; display:flex; align-items:center; gap:4px; font-size:0.85rem; padding: 4px; font-weight:700; transition: color 0.2s;">
          <span class="heart-icon">${isLiked ? '❤️' : '🤍'}</span>
          <span class="like-count">${likesCount}</span>
        </button>
      </div>
    `;
    gridContainer.appendChild(card);
  });
}

function toggleLikePostcard(id, btn, fromDID = false) {
  const contestId = "library";
  const likesKey = `soro_${contestId}_likes`;
  const likedByMeKey = `soro_${contestId}_liked_by_me`;

  const likes = JSON.parse(localStorage.getItem(likesKey) || "{}");
  const likedByMe = JSON.parse(localStorage.getItem(likedByMeKey) || "[]");
  
  const countEl = btn.querySelector(".like-count");
  const heartEl = btn.querySelector(".heart-icon");
  if (!countEl || !heartEl) return;
  
  let currentCount = parseInt(countEl.textContent, 10) || 0;
  const isCurrentlyLiked = likedByMe.includes(id);
  
  if (isCurrentlyLiked) {
    // Unlike
    likedByMe.splice(likedByMe.indexOf(id), 1);
    currentCount = Math.max(0, currentCount - 1);
    likes[id] = currentCount;
    btn.classList.remove("liked");
    btn.style.color = fromDID ? "" : "var(--text-secondary)";
    heartEl.textContent = "🤍";
  } else {
    // Like
    likedByMe.push(id);
    currentCount += 1;
    likes[id] = currentCount;
    btn.classList.add("liked");
    btn.style.color = "#ef4444";
    heartEl.textContent = "❤️";
    
    // Trigger floating heart animations (premium UX!)
    createFloatingHeart(btn);
  }
  
  localStorage.setItem(likesKey, JSON.stringify(likes));
  localStorage.setItem(likedByMeKey, JSON.stringify(likedByMe));
  countEl.textContent = currentCount;

  // Sync both views
  if (fromDID) {
    // Sync to drawer
    const activeBadge = document.querySelector(".gallery-filter-badge.active");
    const gradeFilter = activeBadge ? activeBadge.getAttribute("data-grade") : "all";
    renderLibraryGallery(gradeFilter);
    // If autoplay is not active, we might also want to update the grid view items inside DID
    if (!isDidAutoplayActive) {
      const didGrid = document.getElementById("did-grid-view");
      if (didGrid) {
        const cards = didGrid.querySelectorAll(".did-card");
        cards.forEach(card => {
          const img = card.querySelector(".did-card-img");
          if (img && img.getAttribute("onclick").includes(id)) {
            const likeBtn = card.querySelector(".did-card-like-btn");
            if (likeBtn) {
              likeBtn.querySelector(".like-count").textContent = currentCount;
              if (isCurrentlyLiked) {
                likeBtn.classList.remove("liked");
                likeBtn.querySelector(".heart-icon").textContent = "🤍";
              } else {
                likeBtn.classList.add("liked");
                likeBtn.querySelector(".heart-icon").textContent = "❤️";
              }
            }
          }
        });
      }
    }
  } else {
    // Sync to DID
    const didModal = document.getElementById("did-exhibition-modal");
    if (didModal && didModal.style.display !== "none") {
      updateDIDExhibitionContent();
    }
  }
}

function createFloatingHeart(btn) {
  const rect = btn.getBoundingClientRect();
  const heart = document.createElement("div");
  heart.innerHTML = "❤️";
  heart.style.position = "fixed";
  heart.style.left = `${rect.left + rect.width / 2}px`;
  heart.style.top = `${rect.top}px`;
  heart.style.fontSize = "1rem";
  heart.style.pointerEvents = "none";
  heart.style.zIndex = "100000";
  heart.style.transition = "all 1s ease-out";
  
  document.body.appendChild(heart);
  
  // Trigger animation after append
  requestAnimationFrame(() => {
    const angle = (Math.random() - 0.5) * 60; // Random angle -30 to 30 deg
    const destX = (Math.random() - 0.5) * 100;
    const destY = -150 - Math.random() * 50;
    
    heart.style.transform = `translate(${destX}px, ${destY}px) scale(2.5) rotate(${angle}deg)`;
    heart.style.opacity = "0";
  });
  
  setTimeout(() => {
    heart.remove();
  }, 1000);
}

// DIGITAL DID EXHIBITION GLOBAL VARIABLES & CONTROLS
let didAutoplayInterval = null;
let didSubmissions = [];
let didCurrentSlideIndex = 0;
let isDidAutoplayActive = false;
let didCurrentGradeFilter = "all";
let didCurrentSortBy = "newest";
let didCurrentSearchKeyword = "";

function initDIDExhibition() {
  const modal = document.getElementById("did-exhibition-modal");
  if (!modal) return;

  document.getElementById("did-close").addEventListener("click", closeDIDExhibition);
  document.getElementById("did-exhibition-overlay").addEventListener("click", closeDIDExhibition);

  // Grade filter badges click
  document.querySelectorAll("#did-filter-bar .did-filter-badge").forEach(badge => {
    badge.addEventListener("click", async (e) => {
      document.querySelectorAll("#did-filter-bar .did-filter-badge").forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      didCurrentGradeFilter = e.currentTarget.getAttribute("data-grade");
      
      resetDIDAutoplay();
      didCurrentSlideIndex = 0;
      await updateDIDExhibitionContent();
    });
  });

  // Search input change
  const searchInput = document.getElementById("did-search-input");
  searchInput.addEventListener("input", debounce(async (e) => {
    didCurrentSearchKeyword = e.target.value;
    
    resetDIDAutoplay();
    didCurrentSlideIndex = 0;
    await updateDIDExhibitionContent();
  }, 300));

  // Sort selector change
  const sortSelect = document.getElementById("did-sort-select");
  sortSelect.addEventListener("change", async (e) => {
    didCurrentSortBy = e.target.value;
    
    resetDIDAutoplay();
    didCurrentSlideIndex = 0;
    await updateDIDExhibitionContent();
  });

  // Autoplay toggle button click
  const autoplayBtn = document.getElementById("did-autoplay-btn");
  autoplayBtn.addEventListener("click", () => {
    toggleDIDAutoplay();
  });

  // Slide navigation arrows click
  document.getElementById("did-prev-slide").addEventListener("click", () => {
    navigateDIDSlide(-1);
  });
  document.getElementById("did-next-slide").addEventListener("click", () => {
    navigateDIDSlide(1);
  });
}

function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

async function openDIDExhibition() {
  const modal = document.getElementById("did-exhibition-modal");
  if (!modal) return;

  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  didCurrentGradeFilter = "all";
  didCurrentSortBy = "newest";
  didCurrentSearchKeyword = "";
  didCurrentSlideIndex = 0;

  document.querySelectorAll("#did-filter-bar .did-filter-badge").forEach(b => {
    if (b.getAttribute("data-grade") === "all") b.classList.add("active");
    else b.classList.remove("active");
  });
  document.getElementById("did-search-input").value = "";
  document.getElementById("did-sort-select").value = "newest";

  resetDIDAutoplay();
  await updateDIDExhibitionContent();
}

function closeDIDExhibition() {
  const modal = document.getElementById("did-exhibition-modal");
  if (!modal) return;

  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  
  const contestDrawer = document.getElementById("contest-drawer");
  const isContestDrawerOpen = contestDrawer && contestDrawer.getAttribute("aria-hidden") === "false";
  if (!isContestDrawerOpen) {
    document.body.style.overflow = "";
  }

  resetDIDAutoplay();
}

async function updateDIDExhibitionContent() {
  didSubmissions = await getLibrarySubmissions(didCurrentGradeFilter, didCurrentSortBy, didCurrentSearchKeyword);

  const gridView = document.getElementById("did-grid-view");
  const slideshowView = document.getElementById("did-slideshow-view");

  if (isDidAutoplayActive) {
    gridView.style.display = "none";
    slideshowView.style.display = "flex";
    renderDIDSlideshow();
  } else {
    gridView.style.display = "grid";
    slideshowView.style.display = "none";
    renderDIDGrid();
  }
}

function renderDIDGrid() {
  const gridView = document.getElementById("did-grid-view");
  if (!gridView) return;

  gridView.innerHTML = "";

  if (didSubmissions.length === 0) {
    gridView.innerHTML = `
      <div style="grid-column: 1 / -1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 100px; color:rgba(255,255,255,0.4); width:100%;">
        <span style="font-size:3rem; margin-bottom:16px;">🔍</span>
        <p style="font-size:1.1rem; font-weight:bold;">검색 결과 또는 제출된 독서 엽서가 없습니다.</p>
      </div>
    `;
    return;
  }

  const contestId = "library";
  const likedByMe = JSON.parse(localStorage.getItem(`soro_${contestId}_liked_by_me`) || "[]");
  const likes = JSON.parse(localStorage.getItem(`soro_${contestId}_likes`) || "{}");

  didSubmissions.forEach(entry => {
    const likesCount = likes[entry.id] || 0;
    const isLiked = likedByMe.includes(entry.id);
    let imageUrl = entry.data && entry.data.image ? entry.data.image : "";

    // Convert Google Drive viewer link to direct image link if applicable
    if (imageUrl && imageUrl.includes("drive.google.com")) {
      imageUrl = getGoogleDriveDirectLink(imageUrl);
    }

    // [Premium UI 방어막] 이미지가 깨졌거나 비어있는 무효한 테스트 데이터는 렌더링 배제
    if (!imageUrl || imageUrl.trim() === "" || imageUrl.includes("No Image") || imageUrl.includes("placehold.co")) {
      return;
    }

    let maskedName = entry.studentName || "학생";
    if (maskedName.length > 2) {
      maskedName = maskedName[0] + "*".repeat(maskedName.length - 2) + maskedName[maskedName.length - 1];
    } else if (maskedName.length === 2) {
      maskedName = maskedName[0] + "*";
    }

    // Fetch award badge
    const awards = JSON.parse(localStorage.getItem("soro_admin_awards") || "{}");
    const currentAward = awards[entry.id] || "";
    const awardBadgeHtml = currentAward === "grand"
      ? `<span class="gallery-card-award" style="position: absolute; top: 8px; left: 8px; background: #eab308; color: #000; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; z-index: 10; border: 1px solid #000; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">🏆 최우수</span>`
      : (currentAward === "gold" ? `<span class="gallery-card-award" style="position: absolute; top: 8px; left: 8px; background: #cbd5e1; color: #000; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; z-index: 10; border: 1px solid #000; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">🥈 우수</span>` : "");

    const card = document.createElement("div");
    card.className = "did-card";
    card.innerHTML = `
      <div class="did-card-img-wrapper loading" style="position: relative;">
        ${awardBadgeHtml}
        <img class="did-card-img" src="${imageUrl}" alt="${entry.data["book-title"] || "독서 엽서"}" loading="lazy" onload="this.parentElement.classList.remove('loading')" onerror="this.src='https://placehold.co/800x600/0c0c0e/ffffff?text=No+Image'; this.parentElement.classList.remove('loading')" onclick="openImageModal('${imageUrl}')">
      </div>
      <div class="did-card-info" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 8px 4px 8px;">
        <div class="did-card-meta" style="display: flex; flex-direction: column; gap: 2px;">
          <span class="did-card-class" style="font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.5);">${entry.studentGrade}학년 ${entry.studentClass}반</span>
          <span class="did-card-student" style="font-size: 0.9rem; font-weight: 700; color: #ffffff;">${maskedName}</span>
        </div>
        <div class="did-card-footer" style="margin-top: 0;">
          <button class="did-card-like-btn${isLiked ? ' liked' : ''}" onclick="toggleLikePostcard('${entry.id}', this, true)" style="background:none; border:none; color:${isLiked ? '#ef4444' : 'rgba(255,255,255,0.4)'}; cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-size:1.1rem; font-weight:700; transition: all 0.2s;">
            <span class="heart-icon">${isLiked ? '❤️' : '🤍'}</span>
            <span class="like-count">${likesCount}</span>
          </button>
        </div>
      </div>
    `;
    gridView.appendChild(card);
  });
}

function renderDIDSlideshow() {
  const slideshowView = document.getElementById("did-slideshow-view");
  if (!slideshowView) return;

  slideshowView.innerHTML = "";

  if (didSubmissions.length === 0) {
    slideshowView.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:rgba(255,255,255,0.4); width:100%;">
        <span style="font-size:3rem; margin-bottom:16px;">🔍</span>
        <p style="font-size:1.1rem; font-weight:bold;">슬라이드쇼로 감상할 독서 엽서가 없습니다.</p>
      </div>
    `;
    return;
  }

  // Ensure index is within range
  if (didCurrentSlideIndex >= didSubmissions.length) {
    didCurrentSlideIndex = 0;
  } else if (didCurrentSlideIndex < 0) {
    didCurrentSlideIndex = didSubmissions.length - 1;
  }

  const entry = didSubmissions[didCurrentSlideIndex];
  const contestId = "library";
  const likedByMe = JSON.parse(localStorage.getItem(`soro_${contestId}_liked_by_me`) || "[]");
  const likes = JSON.parse(localStorage.getItem(`soro_${contestId}_likes`) || "{}");
  const likesCount = likes[entry.id] || 0;
  const isLiked = likedByMe.includes(entry.id);
  
  let imageUrl = entry.data && entry.data.image ? entry.data.image : "https://placehold.co/800x600/0c0c0e/ffffff?text=No+Image";
  if (imageUrl && imageUrl.includes("drive.google.com")) {
    imageUrl = getGoogleDriveDirectLink(imageUrl);
  }

  let maskedName = entry.studentName || "학생";
  if (maskedName.length > 2) {
    maskedName = maskedName[0] + "*".repeat(maskedName.length - 2) + maskedName[maskedName.length - 1];
  } else if (maskedName.length === 2) {
    maskedName = maskedName[0] + "*";
  }

  // Fetch award badge
  const awards = JSON.parse(localStorage.getItem("soro_admin_awards") || "{}");
  const currentAward = awards[entry.id] || "";
  const awardBadgeHtml = currentAward === "grand"
    ? `<span class="gallery-card-award" style="position: absolute; top: 12px; left: 12px; background: #eab308; color: #000; font-size: 0.8rem; font-weight: 800; padding: 4px 10px; z-index: 10; border: 1px solid #000; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">🏆 최우수</span>`
    : (currentAward === "gold" ? `<span class="gallery-card-award" style="position: absolute; top: 12px; left: 12px; background: #cbd5e1; color: #000; font-size: 0.8rem; font-weight: 800; padding: 4px 10px; z-index: 10; border: 1px solid #000; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">🥈 우수</span>` : "");

  const slide = document.createElement("div");
  slide.className = "did-slide active";
  slide.innerHTML = `
    <div class="did-slide-image-wrapper" style="position: relative;">
      ${awardBadgeHtml}
      <img class="did-slide-image" src="${imageUrl}" alt="${entry.data["book-title"] || "독서 엽서"}" onclick="openImageModal('${imageUrl}')">
    </div>
    <div class="did-slide-info">
      <div class="did-slide-meta">
        <span class="did-slide-class">${entry.studentGrade}학년 ${entry.studentClass}반</span>
        <span class="did-slide-student">${maskedName}</span>
      </div>
      <div class="did-slide-book">
        <h2 class="did-slide-book-title">${entry.data["book-title"] || "도서명"}</h2>
        <span class="did-slide-book-author">저자: ${entry.data["book-author"] || "저자"}</span>
      </div>
      <div class="did-slide-comment">“${entry.data["comment"] || "인상 깊은 구절"}”</div>
      <div class="did-slide-footer">
        <button class="did-slide-like-btn${isLiked ? ' liked' : ''}" onclick="toggleLikePostcard('${entry.id}', this, true)" style="background:none; border:none; color:${isLiked ? '#ef4444' : 'rgba(255,255,255,0.4)'}; cursor:pointer; display:inline-flex; align-items:center; gap:8px; font-size:1.3rem; font-weight:700; transition: all 0.2s;">
          <span class="heart-icon">${isLiked ? '❤️' : '🤍'}</span>
          <span class="like-count">${likesCount}</span>
        </button>
      </div>
    </div>
  `;
  slideshowView.appendChild(slide);

  // Setup autoplay if active
  if (isDidAutoplayActive && !didAutoplayInterval) {
    startDIDAutoplayInterval();
  }
}

function navigateDIDSlide(direction) {
  if (didSubmissions.length === 0) return;
  
  // Reset autoplay timer to prevent immediate jumping
  resetDIDAutoplay();
  
  didCurrentSlideIndex += direction;
  if (didCurrentSlideIndex >= didSubmissions.length) {
    didCurrentSlideIndex = 0;
  } else if (didCurrentSlideIndex < 0) {
    didCurrentSlideIndex = didSubmissions.length - 1;
  }
  
  renderDIDSlideshow();
}

function startDIDAutoplayInterval() {
  if (didAutoplayInterval) clearInterval(didAutoplayInterval);
  
  didAutoplayInterval = setInterval(() => {
    didCurrentSlideIndex++;
    if (didCurrentSlideIndex >= didSubmissions.length) {
      didCurrentSlideIndex = 0;
    }
    renderDIDSlideshow();
  }, 4000); // 4 seconds transition
}

function toggleDIDAutoplay() {
  const btn = document.getElementById("did-autoplay-btn");
  if (!btn) return;

  isDidAutoplayActive = !isDidAutoplayActive;

  const iconEl = btn.querySelector(".autoplay-icon") || btn.querySelector(".btn-icon");
  const textEl = btn.querySelector(".btn-text");

  if (isDidAutoplayActive) {
    btn.classList.add("active");
    if (iconEl) iconEl.textContent = "⏸";
    if (textEl) textEl.textContent = "자동 재생 중";
    else btn.innerHTML = "⏸ 자동 재생 중";
    
    startDIDAutoplayInterval();
    updateDIDExhibitionContent();
  } else {
    btn.classList.remove("active");
    if (iconEl) iconEl.textContent = "▶";
    if (textEl) textEl.textContent = "자동 슬라이드";
    else btn.innerHTML = "▶ 자동 슬라이드";
    
    if (didAutoplayInterval) {
      clearInterval(didAutoplayInterval);
      didAutoplayInterval = null;
    }
    updateDIDExhibitionContent();
  }
}

function resetDIDAutoplay() {
  if (didAutoplayInterval) {
    clearInterval(didAutoplayInterval);
    didAutoplayInterval = null;
  }
  if (isDidAutoplayActive) {
    startDIDAutoplayInterval();
  }
}

function switchDrawerTab(tabName) {
  const tabGuide = document.getElementById("drawer-tab-guide");
  const tabCriteria = document.getElementById("drawer-tab-criteria");
  const tabGallery = document.getElementById("drawer-tab-gallery");
  const tabExamples = document.getElementById("drawer-tab-examples");
  
  const guideContainer = document.getElementById("drawer-guide-container");
  const criteriaContainer = document.getElementById("drawer-criteria-container");
  const galleryContainer = document.getElementById("drawer-gallery-container");
  const examplesContainer = document.getElementById("drawer-examples-container");
  
  const formContainer = document.getElementById("submission-form-container");
  const noticeContainer = document.getElementById("submission-notice");

  if (!activeContest) return;
  const status = getContestStatus(activeContest);

  tabGuide.classList.remove("active");
  tabCriteria.classList.remove("active");
  tabGallery.classList.remove("active");
  if (tabExamples) tabExamples.classList.remove("active");

  if (tabName === "guide") {
    tabGuide.classList.add("active");
    
    guideContainer.style.display = "block";
    criteriaContainer.style.display = "none";
    galleryContainer.style.display = "none";
    if (examplesContainer) examplesContainer.style.display = "none";
    
    if (status === "active") {
      formContainer.style.display = "block";
      noticeContainer.style.display = "none";
    } else {
      formContainer.style.display = "none";
      noticeContainer.style.display = "block";
    }
  } else if (tabName === "criteria") {
    tabCriteria.classList.add("active");
    
    guideContainer.style.display = "none";
    criteriaContainer.style.display = "block";
    galleryContainer.style.display = "none";
    if (examplesContainer) examplesContainer.style.display = "none";
    formContainer.style.display = "none";
    noticeContainer.style.display = "none";
  } else if (tabName === "gallery") {
    tabGallery.classList.add("active");
    
    guideContainer.style.display = "none";
    criteriaContainer.style.display = "none";
    galleryContainer.style.display = "block";
    if (examplesContainer) examplesContainer.style.display = "none";
    formContainer.style.display = "none";
    noticeContainer.style.display = "none";
    
    document.querySelectorAll(".gallery-filter-badge").forEach(badge => {
      if (badge.getAttribute("data-grade") === "all") {
        badge.classList.add("active");
      } else {
        badge.classList.remove("active");
      }
    });

    if (activeContest && activeContest.id !== "keyring") {
      galleryContainer.querySelector(".gallery-title").textContent = `${activeContest.title} 제출작 갤러리 🏆`;
      galleryContainer.querySelector(".gallery-desc").textContent = `친구들이 작성한 감성 가득한 ${activeContest.title} 리스트입니다. 좋아요(❤️)를 눌러 응원해 주세요!`;
      
      let didBtn = document.getElementById("drawer-did-open-btn");
      if (activeContest.id === "library") {
        if (!didBtn) {
          didBtn = document.createElement("button");
          didBtn.type = "button";
          didBtn.id = "drawer-did-open-btn";
          didBtn.className = "btn-did-open";
          didBtn.innerHTML = "🖥️ 전체 화면 전자 화랑(DID) 입장";
          didBtn.onclick = () => openDIDExhibition();
          galleryContainer.insertBefore(didBtn, galleryContainer.querySelector(".gallery-filter-bar"));
        } else {
          didBtn.style.display = "inline-flex";
        }
      } else {
        if (didBtn) didBtn.style.display = "none";
      }
      renderLibraryGallery("all");
    } else {
      galleryContainer.querySelector(".gallery-title").textContent = "2025년도 출품작 갤러리";
      galleryContainer.querySelector(".gallery-desc").textContent = "작년에 선배들이 실제로 그린 소중한 키링 공모작들입니다. 아래 학년 필터를 통해 자유롭게 감상해 보세요.";
      
      const didBtn = document.getElementById("drawer-did-open-btn");
      if (didBtn) didBtn.style.display = "none";
      renderGallery2025("all");
    }
  } else if (tabName === "examples") {
    if (tabExamples) tabExamples.classList.add("active");
    
    guideContainer.style.display = "none";
    criteriaContainer.style.display = "none";
    galleryContainer.style.display = "none";
    if (examplesContainer) examplesContainer.style.display = "block";
    formContainer.style.display = "none";
    noticeContainer.style.display = "none";
  }
}

function openContestDetails(contestId) {
  // Check for contest locks (managed by administrator)
  const locks = contestLocks;
  if (locks[contestId]) {
    showToast(`해당 공모전은 접수가 마감되었습니다. 🔒`, "error");
    return;
  }

  const contest = CONTESTS_DATA.find(c => c.id === contestId);
  if (!contest) return;

  activeContest = contest;
  uploadBase64Data = null;

  const drawer = document.getElementById("contest-drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerSummary = document.getElementById("drawer-summary");
  const drawerBadge = document.getElementById("drawer-badge");
  const drawerStatus = document.getElementById("drawer-status");
  const guideList = document.getElementById("drawer-guide-list");

  const formContainer = document.getElementById("submission-form-container");
  const noticeContainer = document.getElementById("submission-notice");
  const noticeText = document.getElementById("submission-notice-text");

  const subForm = document.getElementById("submission-form");
  document.getElementById("dynamic-fields-container").innerHTML = "";
  const authNotice = document.getElementById("auth-required-notice");

  drawerBadge.textContent = contest.monthText;
  drawerTitle.textContent = contest.title;
  drawerSummary.innerHTML = contest.description;

  const visualHeader = document.getElementById("drawer-visual");
  visualHeader.style.background = getGradientForContest(contest.id);
  visualHeader.innerHTML = contest.icon;

  guideList.innerHTML = "";
  contest.rules.forEach(rule => {
    const li = document.createElement("li");
    li.innerHTML = rule;
    guideList.appendChild(li);
  });

  // Render Dynamic Evaluation Criteria Cards
  const criteriaListContainer = document.getElementById("criteria-cards-list");
  criteriaListContainer.innerHTML = "";
  
  if (contest.id !== "zepquiz" && contest.evaluationCriteria && contest.evaluationCriteria.length > 0) {
    const tabCriteria = document.getElementById("drawer-tab-criteria");
    if (tabCriteria) tabCriteria.style.display = "flex";
    contest.evaluationCriteria.forEach(item => {
      const card = document.createElement("div");
      card.className = "criteria-card";
      card.innerHTML = `
        <div class="criteria-card-header">
          <span class="criteria-card-name">${item.category}</span>
          <span class="criteria-card-weight">${item.weight}</span>
        </div>
        <p class="criteria-card-desc">${item.desc}</p>
      `;
      criteriaListContainer.appendChild(card);
    });
  } else {
    const tabCriteria = document.getElementById("drawer-tab-criteria");
    if (tabCriteria) tabCriteria.style.display = "none";
    criteriaListContainer.innerHTML = `<div class="helper-text" style="text-align: center; padding: 20px;">심사 기준 정보가 등록되지 않았습니다.</div>`;
  }

  const status = getContestStatus(contest);
  document.getElementById("form-contest-id").value = contest.id;

  if (status === "active") {
    drawerStatus.textContent = "접수 진행 중 (Active)";
    drawerStatus.className = "status-indicator status-active";

    // Asynchronously check and render the submission area (existing submission vs empty form)
    checkAndRenderSubmissionArea(contest);
  } else if (status === "pending") {
    drawerStatus.textContent = "접수 대기 중 (Upcoming)";
    drawerStatus.className = "status-indicator status-pending";
    noticeText.innerHTML = `🔒 <strong>이 대회는 아직 접수 기간이 아닙니다.</strong><br>대회 접수 기간은 ${contest.period || `2026년 ${contest.month}월 1일부터 시작됩니다.`}`;
  } else {
    drawerStatus.textContent = "접수 마감됨 (Closed)";
    drawerStatus.className = "status-indicator status-closed";
    noticeText.innerHTML = `🔒 <strong>이 대회의 접수가 종료되었습니다.</strong><br>${contest.period || `2026년 ${contest.month}월 한 달 간`} 진행되었던 작품 접수가 완료되었습니다.`;
  }

  // Show 3rd tab for all contests (hide for zepquiz as requested)
  const tabGallery = document.getElementById("drawer-tab-gallery");
  if (tabGallery) {
    if (contest.id === "zepquiz") {
      tabGallery.style.display = "none";
    } else {
      tabGallery.style.display = "flex";
      if (contest.id === "keyring") {
        tabGallery.textContent = "2025 출품작 🏆";
      } else {
        tabGallery.textContent = "제출작 갤러리 🏆";
      }
    }
  }

  // Dynamic Examples Tab
  let tabExamples = document.getElementById("drawer-tab-examples");
  if (!tabExamples) {
    tabExamples = document.createElement("button");
    tabExamples.type = "button";
    tabExamples.id = "drawer-tab-examples";
    tabExamples.className = "drawer-tab-btn";
    tabExamples.textContent = "예시 작품 👀";
    const drawerTabs = document.querySelector(".drawer-tabs");
    if (drawerTabs) drawerTabs.appendChild(tabExamples);
    tabExamples.addEventListener("click", () => switchDrawerTab("examples"));
  }

  let examplesContainer = document.getElementById("drawer-examples-container");
  if (!examplesContainer) {
    examplesContainer = document.createElement("div");
    examplesContainer.id = "drawer-examples-container";
    examplesContainer.className = "contest-gallery";
    examplesContainer.style.display = "none";
    const drawerBody = document.querySelector(".drawer-body");
    if (drawerBody) drawerBody.appendChild(examplesContainer);
  }

  if (contest.examples && contest.examples.length > 0) {
    tabExamples.style.display = "flex";
    examplesContainer.innerHTML = `
      <h3 class="gallery-title">예시 작품 👀</h3>
      <p class="gallery-desc">공모전 준비를 도와줄 훌륭한 예시 작품들입니다. 참고해서 멋진 작품을 완성해 보세요!</p>
      <div class="gallery-grid">
        ${contest.examples.map(img => `
          <div class="gallery-card" onclick="window.openImageModal('${img}')" style="cursor: zoom-in;">
            <div class="gallery-card-img-wrapper" style="position: relative; overflow: hidden; padding-bottom: 75%;">
              <img class="gallery-card-img" src="${img}" alt="예시 작품" loading="lazy" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: contain;">
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else {
    tabExamples.style.display = "none";
    examplesContainer.innerHTML = "";
  }

  // Always initialize to the guide & submission tab
  switchDrawerTab("guide");

  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

window.openImageModal = function(src) {
  let modal = document.getElementById("image-fullscreen-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "image-fullscreen-modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100dvh";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    modal.style.zIndex = "99999";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.cursor = "zoom-out";
    
    const img = document.createElement("img");
    img.id = "image-fullscreen-img";
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    img.style.objectFit = "contain";
    img.style.borderRadius = "8px";
    img.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
  
  const img = document.getElementById("image-fullscreen-img");
  img.src = src;
  modal.style.display = "flex";
};


function closeContestDrawer() {
  const drawer = document.getElementById("contest-drawer");
  drawer.setAttribute("aria-hidden", "true");
  drawer.classList.remove("pixel-fullscreen");
  document.body.style.overflow = "";

  document.getElementById("submission-form").reset();
  document.querySelectorAll("#submission-form .form-group.has-error").forEach(e => e.classList.remove("has-error"));

  // [오류 방어] 서랍이 닫힐 때 기존 미리보기 및 로딩 요소를 말끔히 제거합니다.
  const existingView = document.getElementById("existing-submission-view");
  if (existingView) existingView.remove();
  const loader = document.getElementById("submission-loading-indicator");
  if (loader) loader.remove();
}

// ====================================================
// ASYNCHRONOUS CHECK AND RENDER SUBMISSION PROCESS
// ====================================================
async function checkAndRenderSubmissionArea(contest) {
  const formContainer = document.getElementById("submission-form-container");
  const subForm = document.getElementById("submission-form");
  const authNotice = document.getElementById("auth-required-notice");
  formContainer.classList.remove("has-existing-submission");
  formContainer.classList.add("is-loading");

  // 기존 뷰/로더 잔여물 소거
  const existingView = document.getElementById("existing-submission-view");
  if (existingView) existingView.remove();
  const loader = document.getElementById("submission-loading-indicator");
  if (loader) loader.remove();

  if (!currentUser) {
    formContainer.classList.remove("is-loading");
    authNotice.style.display = "flex";
    subForm.style.display = "none";
    return;
  }

  authNotice.style.display = "none";
  subForm.style.display = "none";

  // 로딩 인디케이터 표시
  const loadingIndicator = document.createElement("div");
  loadingIndicator.id = "submission-loading-indicator";
  loadingIndicator.className = "submission-loading";
  loadingIndicator.innerHTML = `
    <div class="spinner"></div>
    <p style="margin-top: 8px;">제출 내역을 확인하고 있습니다...</p>
  `;
  formContainer.appendChild(loadingIndicator);

  // 1. 원격 또는 로컬 제출 목록 조회
  let mySubmissions = [];
  if (GOOGLE_SHEET_API_URL) {
    const payload = {
      action: "getSubmissions",
      studentUsername: currentUser.userKey
    };
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.status === "success") {
        mySubmissions = result.data;
      }
    } catch (e) {
      console.error("제출 내역 원격 조회 에러:", e);
    }
  }

  if (!GOOGLE_SHEET_API_URL || mySubmissions.length === 0) {
    const allSubmissions = JSON.parse(localStorage.getItem("soro_submissions") || "[]");
    mySubmissions = allSubmissions.filter(entry =>
      entry.studentUsername.toLowerCase() === currentUser.userKey.toLowerCase()
    );
  }

  // 로더 제거
  const activeLoader = document.getElementById("submission-loading-indicator");
  if (activeLoader) activeLoader.remove();
  formContainer.classList.remove("is-loading");

  const existingSubmission = mySubmissions.find(s => s.contestId === contest.id);

  if (existingSubmission) {
    formContainer.classList.add("has-existing-submission");
    // 2. 이미 제출한 작품이 있을 때: 상세 정보 노출 및 삭제 유도
    const viewDiv = document.createElement("div");
    viewDiv.id = "existing-submission-view";
    viewDiv.className = "existing-submission-view";

    let contentHtml = "";
    let entryData = {};
    try {
      entryData = typeof existingSubmission.data === "string" ? JSON.parse(existingSubmission.data) : (existingSubmission.data || {});
    } catch (err) {
      if (existingSubmission.data) entryData = { image: existingSubmission.data };
    }

    if (entryData.image) {
      const isDrive = entryData.image.includes("drive.google.com");
      const displayUrl = isDrive ? getGoogleDriveDirectLink(entryData.image) : entryData.image;
      const driveId = isDrive ? extractDriveId(entryData.image) : "";
      const downloadUrl = isDrive ? `https://drive.google.com/uc?export=download&id=${driveId}` : entryData.image;

      contentHtml += `
        <div class="submitted-media-preview-container" style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div class="submitted-media-preview" style="border: 1px solid var(--border-color); padding: 8px; background: var(--bg-tertiary); display: flex; justify-content: center; overflow: hidden; max-height: 240px;">
            <img src="${displayUrl}" alt="제출 작품 이미지" style="max-width: 100%; max-height: 220px; object-fit: contain; border: 1px solid var(--border-color); transition: transform var(--transition-smooth);">
          </div>
          <div style="text-align: center;">
            <a href="${downloadUrl}" target="_blank" download="submission_art.png" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.75rem; font-weight: 700; padding: 6px 14px; border-radius: 0; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); text-decoration: none; cursor: pointer; transition: all var(--transition-fast);">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
              </svg>
              제출 작품 다운로드
            </a>
          </div>
        </div>
      `;
    } else if (entryData.audio) {
      contentHtml += `
        <div class="submitted-media-preview-container audio-submission-preview" style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div class="submitted-media-preview" style="border: 1px solid var(--border-color); padding: 12px; background: var(--bg-tertiary); display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <div style="font-size: 1.5rem;">🎵</div>
            <audio src="${entryData.audio}" controls style="width: 100%; max-width: 320px;"></audio>
            ${entryData.description ? `
              <div style="margin-top: 8px; font-size: 0.85rem; color: var(--text-secondary); width: 100%; text-align: left; background: var(--bg-primary); padding: 10px; border: 1px solid var(--border-color); border-radius: 6px;">
                <strong>곡 소개 및 제작 의도:</strong>
                <p style="margin: 4px 0 0 0; white-space: pre-wrap; color: var(--text-primary); line-height: 1.4;">${entryData.description}</p>
              </div>
            ` : ''}
          </div>
          <div style="text-align: center;">
            <a href="${entryData.audio}" download="소로사운드앨범_${currentUser ? currentUser.name : '학생'}.mp3" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.75rem; font-weight: 700; padding: 6px 14px; border-radius: 8px; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); text-decoration: none; cursor: pointer; transition: all var(--transition-fast);">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
              </svg>
              곡 파일 다운로드
            </a>
          </div>
        </div>
      `;
    } else if (entryData["book-title"]) {
      contentHtml += `
        <div class="submitted-text-preview">
          <p><strong>📖 추천 도서:</strong> ${entryData["book-title"]} (${entryData["book-author"] || "저자 미상"})</p>
          <p style="margin-top: 6px;"><strong>✍️ 추천 사유:</strong> "${entryData["book-review"]}"</p>
        </div>
      `;
    } else if (entryData.type === "text") {
      contentHtml += `
        <div class="submitted-text-preview">
          <p><strong>✍️ 필사 구절:</strong></p>
          <blockquote style="font-family: serif; white-space: pre-line; background: var(--bg-tertiary); padding: 12px; border-radius: 6px; margin: 8px 0; border: 1px solid var(--border-color); color: var(--text-primary);">
            ${entryData.text}
          </blockquote>
        </div>
      `;
    }

    viewDiv.innerHTML = `
      <div class="submitted-badge-success">🎨 접수 완료됨</div>
      <p class="submitted-notice-title">이 대회에 이미 작품을 제출하셨습니다.</p>
      <p class="submitted-notice-time">제출 시각: ${existingSubmission.timestamp}</p>
      
      ${contentHtml}

      <div class="submitted-actions">
        <p class="submitted-actions-info">⚠️ 다른 작품을 새로 제출하시려면, 기존 접수를 취소하셔야 합니다.</p>
        <button type="button" class="btn btn-danger btn-block" onclick="cancelSubmissionInDrawer('${existingSubmission.id}')">
          접수 취소하기 (영구 삭제)
        </button>
      </div>
    `;
    formContainer.appendChild(viewDiv);
  } else {
    // 3. 제출한 작품이 없을 때: 정상 제출 폼 렌더링
    subForm.style.display = "block";
    document.getElementById("student-name").value = currentUser.name;
    document.getElementById("student-grade").value = `${currentUser.grade}학년`;
    document.getElementById("student-class").value = `${currentUser.classNum}반`;
    document.getElementById("student-number").value = `${currentUser.number}번`;
    setupDynamicFormFields(contest);
  }
}

// 서랍(Drawer) 내에서 직접 취소를 처리하는 전역 핸들러
window.cancelSubmissionInDrawer = async function (entryId) {
  if (confirm("정말 이 작품의 접수를 취소하고 삭제하시겠습니까? 한 번 지워진 접수 데이터는 복구할 수 없습니다.")) {
    if (GOOGLE_SHEET_API_URL) {
      showToast("클라우드에서 접수를 파기하고 있습니다...", "info");
      const payload = {
        action: "deleteSubmission",
        id: entryId
      };
      try {
        const response = await fetch(GOOGLE_SHEET_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.status === "error") {
          showToast(result.message, "error");
          return;
        }

        showToast("작품 접수 정보가 성공적으로 취소 및 삭제 처리되었습니다. ✨", "success");
        updateLiveCounters();
        if (activeContest) {
          checkAndRenderSubmissionArea(activeContest);
        }
      } catch (e) {
        console.error("원격 삭제 에러:", e);
        showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
      }
    } else {
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    }
  }
};

function getGradientForContest(id) {
  const gradients = {
    keyring: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    cuttoon: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    library: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    transcription: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    pixelart: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    sound_album: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
  };
  return gradients[id] || "linear-gradient(135deg, #374151 0%, #111827 100%)";
}

// ====================================================
// GENERATE CUSTOM SUBMISSION FIELD FORM TYPES
// ====================================================
function setupDynamicFormFields(contest) {
  const container = document.getElementById("dynamic-fields-container");
  container.innerHTML = "";
  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.style.display = contest.id === "pixelart" ? "none" : "block";

  if (contest.submissionType === "image" && contest.id === "pixelart") {
    // ===== PIXEL ART EXTENDED EDITOR UI =====
    container.innerHTML = `
      <div id="toggle-pixel-draw" class="active" style="display: none;"></div>
      <div id="toggle-pixel-upload" style="display: none;"></div>

      <div id="pixel-draw-container" class="pixel-editor-shell" style="display: none;">
        <!-- Left Toolbar -->
        <div class="pixel-toolbar">
          <!-- Back button reinstated at the top of Left Toolbar -->
          <button type="button" class="pixel-tool-btn pixel-back-tool-btn" id="pixel-close-editor" title="업로드 화면으로 돌아가기">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div class="pixel-tool-separator"></div>

          <div class="pixel-tool-group">
            <button type="button" class="pixel-tool-btn active" data-tool="pencil" title="연필">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
            </button>
            <button type="button" class="pixel-tool-btn" data-tool="brush" title="브러시">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg>
            </button>
            <button type="button" class="pixel-tool-btn" data-tool="eraser" title="지우개">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>
            </button>
            <button type="button" class="pixel-tool-btn" data-tool="bucket" title="채우기">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"></path><path d="m5 2 5 5"></path><path d="M2 13h15"></path><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"></path></svg>
            </button>
            <button type="button" class="pixel-tool-btn" data-tool="eyedropper" title="스포이트">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="m2 22 1-1h3l9-9"></path><path d="M3 21v-3l9-9"></path><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"></path></svg>
            </button>
            <button type="button" class="pixel-tool-btn" data-tool="special-shape" title="특별 도형 도구 (우측에서 선택)">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"></polygon></svg>
            </button>
          </div>
          <div class="pixel-tool-separator"></div>
          <div class="pixel-tool-group">
            <button type="button" class="pixel-tool-btn action" id="pixel-undo" title="되돌리기">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>
            </button>
            <button type="button" class="pixel-tool-btn action" id="pixel-redo" title="다시 실행">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path></svg>
            </button>
            <button type="button" class="pixel-tool-btn action" id="pixel-grid-toggle" title="격자 토글">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            </button>
            <button type="button" class="pixel-tool-btn action pixel-btn-danger" id="pixel-clear" title="전체 지우기">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        <!-- Center Stage -->
        <div class="pixel-stage">
          <div class="pixel-grid-wrapper">
            <div class="pixel-grid-board" id="pixel-grid-board"></div>
          </div>
        </div>

        <!-- Right Side Panel -->
        <div class="pixel-side-panel">
          <!-- 1단: 현재 색상 -->
          <div class="pixel-panel-section">
            <div class="pixel-panel-label">현재 색상</div>
            <div class="pixel-color-swatches-section">
              <div class="pixel-overlapping-swatches">
                <!-- Background Swatch (Right click) -->
                <div class="pixel-swatch-rect secondary" id="pixel-secondary-swatch" style="background-color: #ffffff;" title="오른쪽 클릭 색상 (배경색)"></div>
                <!-- Foreground Swatch (Left click) -->
                <div class="pixel-swatch-rect primary active" id="pixel-primary-swatch" style="background-color: #111111;" title="왼쪽 클릭 색상 (전경색 - 클릭하여 활성화)"></div>
                
                <!-- Swap arrow button (Photoshop style) -->
                <button type="button" class="pixel-swatch-swap-btn" id="pixel-swatch-swap" title="전경색/배경색 전환 (단축키: X)">
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M16 3h5v5"></path><path d="M4 20h5v5"></path><path d="M21 3C14.5 3 9.5 8 9.5 14.5"></path><path d="M3 21C9.5 21 14.5 16 14.5 9.5"></path></svg>
                </button>
                
                <!-- Reset button (D hotkey) -->
                <button type="button" class="pixel-swatch-reset-btn" id="pixel-swatch-reset" title="기본값 검정/흰색 리셋 (단축키: D)">
                  <div class="reset-black"></div>
                  <div class="reset-white"></div>
                </button>
              </div>
              <div class="pixel-custom-picker-btn">
                <input type="color" class="pixel-custom-color" id="pixel-custom-color" value="#111111" title="자유 색상 선택">
              </div>
            </div>
          </div>

          <!-- 2단: 팔레트 -->
          <div class="pixel-panel-section">
            <div class="pixel-panel-label">팔레트</div>
            <div class="pixel-palette-grid" id="pixel-palette-row">
              <div class="color-chip active" data-color="#111111" style="background:#111111;" title="검정 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#ffffff" style="background:#ffffff;" title="흰색 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#ef4444" style="background:#ef4444;" title="빨강 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#f97316" style="background:#f97316;" title="주황 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#eab308" style="background:#eab308;" title="노랑 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#22c55e" style="background:#22c55e;" title="연두 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#3b82f6" style="background:#3b82f6;" title="파랑 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#8b5cf6" style="background:#8b5cf6;" title="보라 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#ec4899" style="background:#ec4899;" title="핑크 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#92400e" style="background:#92400e;" title="갈색 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#6b7280" style="background:#6b7280;" title="회색 (마우스 우클릭 시 배경색 지정)"></div>
              <div class="color-chip" data-color="#67e8f9" style="background:#67e8f9;" title="하늘 (마우스 우클릭 시 배경색 지정)"></div>
            </div>
          </div>

          <!-- 세로 구분선 (Divider Line) -->
          <div class="pixel-tool-separator horizontal"></div>

          <!-- 3단: 도구 옵션 -->
          <div class="pixel-panel-section">
            <div class="pixel-panel-label">도구 옵션</div>
            <div class="pixel-brush-size-container-vertical">
              <span class="pixel-size-title">브러시/지우개 크기</span>
              <div class="pixel-size-buttons" id="pixel-brush-size-container">
                <button type="button" class="pixel-size-btn active" data-size="1" title="1 픽셀 (1x1)">1px</button>
                <button type="button" class="pixel-size-btn" data-size="2" title="2 픽셀 (2x2)">2px</button>
                <button type="button" class="pixel-size-btn" data-size="3" title="3 픽셀 (3x3)">3px</button>
                <button type="button" class="pixel-size-btn" data-size="4" title="4 픽셀 (4x4)">4px</button>
              </div>
            </div>
          </div>

          <!-- 세로 구분선 (Divider Line) -->
          <div class="pixel-tool-separator horizontal"></div>

          <!-- 4단: 특별 도형 (28종) -->
          <div class="pixel-panel-section">
            <div class="pixel-panel-label">특별 도형 선택 (28종)</div>
            <div class="pixel-special-shapes-grid" id="pixel-special-shapes-grid">
              <!-- Dynamically populated from JS -->
            </div>
          </div>
        </div>

        <!-- Bottom Action Bar & Status Bar -->
        <div class="pixel-bottom-bar">
          <div class="pixel-status-info">
            <span class="pixel-status-tool">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path></svg>
              <span id="pixel-tool-label-bottom">PENCIL</span>
            </span>
            <span class="pixel-status-coords" id="pixel-coords">X: -, Y: -</span>
          </div>
          <div class="pixel-action-buttons">
            <button type="button" class="btn btn-secondary" id="pixel-save-draft" style="color: #3b82f6;">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              임시저장
            </button>
            <button type="button" class="btn btn-primary" id="pixel-submit-draw">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              작품 최종 제출
            </button>
          </div>
        </div>
      </div>

      <div id="pixel-upload-container" style="display: block; padding: 20px 0;">
        <label style="margin-bottom: 8px;">작품 이미지 업로드</label>
        <div id="file-dropzone" class="file-dropzone">
          <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <div class="dropzone-text">
            파일을 이곳에 끌어다 놓거나 <span>기기에서 탐색</span>
          </div>
          <div class="helper-text">${contest.placeholder}</div>
          <input type="file" id="submission-file" accept="image/*" style="display: none;" required>
        </div>
        <div id="upload-preview-wrapper" style="display: none; margin-top: 12px;"></div>
        <div style="display: flex; gap: 10px; margin-top: 16px;">
          <button type="button" class="btn btn-secondary btn-block" id="pixel-switch-draw">픽셀아트 에디터</button>
          <button type="button" class="btn btn-primary btn-block" id="pixel-submit-upload">업로드 파일 제출하기</button>
        </div>
        <span class="error-message">응모할 디자인 시안 이미지를 꼭 업로드해 주세요.</span>
      </div>
      <canvas id="pixel-export-canvas" class="pixel-canvas-hidden" width="300" height="300"></canvas>
    `;

    // Init pixel art editor
    initPixelArtEditor();
    // Init file uploader for the upload tab
    setupFileUploader();

    const drawToggle = document.getElementById("toggle-pixel-draw");
    const drawContainer = document.getElementById("pixel-draw-container");
    const uploadContainer = document.getElementById("pixel-upload-container");
    const drawer = document.getElementById("contest-drawer");

    function setPixelMode(mode) {
      const isDraw = mode === "draw";
      drawer.classList.toggle("pixel-fullscreen", isDraw);
      drawToggle.classList.toggle("active", isDraw);
      drawContainer.style.display = isDraw ? "grid" : "none";
      uploadContainer.style.display = isDraw ? "none" : "block";
      if (isDraw) {
        const drawerContent = drawer.querySelector(".drawer-content");
        if (drawerContent) {
          drawerContent.scrollTop = 0;
        }
      }
    }

    document.getElementById("pixel-switch-draw").addEventListener("click", () => setPixelMode("draw"));
    document.getElementById("pixel-switch-upload")?.addEventListener("click", () => setPixelMode("upload"));
    document.getElementById("pixel-close-editor").addEventListener("click", () => setPixelMode("upload"));
    document.getElementById("pixel-submit-draw").addEventListener("click", () => {
      drawToggle.classList.add("active");
      if (validateSubmissionForm()) executeSubmit();
    });
    document.getElementById("pixel-submit-upload").addEventListener("click", () => {
      drawToggle.classList.remove("active");
      if (validateSubmissionForm()) executeSubmit();
    });

  } else if (contest.submissionType === "image") {
    container.innerHTML = `
      <label>${contest.inputLabel}</label>
      <div id="file-dropzone" class="file-dropzone">
        <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
        <div class="dropzone-text">
          파일을 이곳에 끌어다 놓거나 <span>기기에서 탐색</span>
        </div>
        <div class="helper-text">${contest.placeholder}</div>
        <input type="file" id="submission-file" accept="image/*" style="display: none;" required>
      </div>
      <div id="upload-preview-wrapper" style="display: none;"></div>
      <span class="error-message">응모할 디자인 시안 이미지를 꼭 업로드해 주세요.</span>
    `;
    setupFileUploader();
  }

  else if (contest.submissionType === "audio") {
    container.innerHTML = `
      <label>${contest.inputLabel}</label>
      <div id="file-dropzone" class="file-dropzone">
        <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
        <div class="dropzone-text">
          음악 파일을 이곳에 끌어다 놓거나 <span>기기에서 탐색</span>
        </div>
        <div class="helper-text">${contest.placeholder}</div>
        <input type="file" id="submission-file" accept="audio/*, .mp3, .wav, .m4a" style="display: none;" required>
      </div>
      <div id="upload-preview-wrapper" style="display: none;"></div>
      <span class="error-message">응모할 음악 파일을 꼭 업로드해 주세요.</span>

      <div class="form-group" style="margin-top: 16px;">
        <label for="sub-audio-description">🎵 곡 소개 및 제작 의도 (가사 등)</label>
        <textarea id="sub-audio-description" required placeholder="이 곡에 담긴 학교생활의 추억, 감정, 가사 또는 사용한 음악 도구 등을 자유롭게 적어주세요. (최대 200자)" maxlength="200" style="width: 100%; min-height: 80px;"></textarea>
        <span class="error-message">곡 소개를 입력해 주세요.</span>
      </div>
    `;
    setupAudioUploader();
  }

  else if (contest.submissionType === "calligraphy") {
    container.innerHTML = `
      <div class="form-group" style="margin-bottom: 12px;">
        <label for="sub-calli-title">📖 도서 제목</label>
        <input type="text" id="sub-calli-title" required placeholder="예) 어린 왕자">
        <span class="error-message">도서 제목을 정확히 입력해 주세요.</span>
      </div>
      <div class="form-group" style="margin-bottom: 12px;">
        <label for="sub-calli-author">✍️ 도서 저자 (작가)</label>
        <input type="text" id="sub-calli-author" required placeholder="예) 생텍쥐페리">
        <span class="error-message">저자명을 정확히 입력해 주세요.</span>
      </div>
      <div class="form-group" style="margin-bottom: 16px;">
        <label for="sub-calli-text">📝 감명 깊은 한 줄 글귀 (최대 60자)</label>
        <textarea id="sub-calli-text" required placeholder="가장 마음을 울렸던 문장을 적어주세요. 엽서에 캘리그라피로 들어갑니다..." maxlength="60" style="width: 100%; min-height: 60px;"></textarea>
        <span class="error-message">글귀를 입력해 주세요.</span>
      </div>
      
      <div class="form-group" style="margin-bottom: 12px;">
        <label for="sub-calli-theme">🌌 배경화면 AI 이미지 테마 선택</label>
        <select id="sub-calli-theme" style="width:100%; padding:10px; background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-color); border-radius:8px; font-weight:bold;">
          <option value="sky">🌌 깊고 푸른 밤하늘 & 우주 은하수 (20종 랜덤)</option>
          <option value="forest">🌿 평화로운 초록 숲속 & 나뭇잎 사이 햇살 (20종 랜덤)</option>
          <option value="ocean">🌅 노을빛 바다 & 부드러운 황금 파도 (20종 랜덤)</option>
          <option value="room">🕯️ 따뜻하고 아늑한 방 안 & 은은한 촛불 (20종 랜덤)</option>
          <option value="paper">📜 빈티지 양장 종이 질감 & 클래식 스크롤 (20종 랜덤)</option>
        </select>
      </div>

      <div class="form-group" style="margin-bottom: 16px;">
        <label for="sub-calli-font">✒️ 캘리그라피 서체 선택</label>
        <select id="sub-calli-font" style="width:100%; padding:10px; background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-color); border-radius:8px; font-weight:bold;">
          <option value="'East Sea Dokdo', sans-serif">✒️ 독도체 (개성 있는 붓글씨)</option>
          <option value="'Nanum Brush Script', cursive">✒️ 나눔붓체 (정갈한 손글씨)</option>
          <option value="'Nanum Pen Script', cursive">✒️ 나눔펜체 (귀엽고 깔끔한 필체)</option>
          <option value="'Gamja Flower', cursive">✒️ 감자꽃체 (동화적이고 따뜻한 서체)</option>
          <option value="'Yeon Sung', cursive">✒️ 연성체 (고전적인 멋을 내는 서체)</option>
          <option value="'CustomFont1', sans-serif">⭐ 사용자 에셋 서체 1 (asset/fonts/custom1.ttf / .otf)</option>
          <option value="'CustomFont2', sans-serif">⭐ 사용자 에셋 서체 2 (asset/fonts/custom2.ttf / .otf)</option>
        </select>
        <p style="margin-top:6px; font-size:0.75rem; color:var(--text-secondary); line-height:1.4;">
          ※ 개인 폰트는 프로젝트 폴더 내 <code>asset/fonts/custom1.ttf</code> (또는 <code>custom1.otf</code>) 경로로 파일을 업로드해두면 자동 적용됩니다.
        </p>
      </div>

      <button type="button" id="btn-generate-calli" class="btn btn-secondary btn-block" style="background: var(--accent-gradient, linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)); color: white; font-weight: bold; padding: 12px; margin-bottom: 16px; border:none; transition:transform 0.2s;">🎨 AI 캘리그라피 엽서 생성</button>
      
      <!-- Preview and loading area -->
      <div id="calli-preview-wrapper" style="display: none; border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; background: var(--bg-tertiary); text-align: center; margin-bottom: 16px;">
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom: 8px;">🖼️ 완성된 AI 캘리그라피 엽서</p>
        <div id="calli-image-container" style="display:flex; justify-content:center; overflow:hidden; border-radius:8px; border:1px solid var(--border-color); position:relative; min-height: 200px; background: var(--bg-primary);">
          <!-- Generated postcard image will go here -->
        </div>
      </div>
      
      <span class="error-message" id="calli-validation-error" style="display:none; text-align:center; margin-top:8px; color: var(--error-color);">엽서 생성을 위해 먼저 'AI 캘리그라피 엽서 생성' 버튼을 실행해 주세요.</span>
    `;

    document.getElementById("btn-generate-calli").addEventListener("click", generateAICalligraphyCard);

    }

  else if (contest.submissionType === "text_fields") {
    let html = "";
    contest.textFields.forEach(field => {
      html += `
        <div class="form-group" style="margin-bottom: 12px;">
          <label for="sub-${field.id}">${field.label}</label>
      `;
      if (field.type === "textarea") {
        html += `
          <textarea id="sub-${field.id}" required placeholder="${field.placeholder}" maxlength="200"></textarea>
        `;
      } else {
        html += `
          <input type="${field.type}" id="sub-${field.id}" required placeholder="${field.placeholder}">
        `;
      }
      html += `
          <span class="error-message">${field.label}을 정확히 채워주세요.</span>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  else if (contest.submissionType === "image_or_text") {
    container.innerHTML = `
      <label style="margin-bottom: 8px;">제출 방식 선택</label>
      <div class="form-group-row" style="margin-bottom: 16px;">
        <button type="button" id="toggle-method-file" class="btn btn-secondary btn-block active">🖼️ 손글씨/이미지 업로드</button>
        <button type="button" id="toggle-method-text" class="btn btn-secondary btn-block">⌨️ 텍스트 직접 입력</button>
      </div>
      
      <div id="method-file-container">
        <div id="file-dropzone" class="file-dropzone">
          <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <div class="dropzone-text">
            필사한 손글씨 사진을 이곳에 올리거나 <span>파일 선택</span>
          </div>
          <div class="helper-text">PNG, JPG 포맷 파일 지원 (최대 5MB)</div>
          <input type="file" id="submission-file" accept="image/*" style="display: none;">
        </div>
        <div id="upload-preview-wrapper" style="display: none;"></div>
        <span class="error-message">필사 손글씨 사진을 올려주세요.</span>
      </div>
      
      <div id="method-text-container" style="display: none;">
        <label for="sub-transcribe-text">필사 텍스트 감상 입력</label>
        <textarea id="sub-transcribe-text" placeholder="한글 명문장을 아래에 한 자 한 자 정성을 담아 입력해주세요..." maxlength="500"></textarea>
        <span class="error-message">필사 감상평을 최소 10자 이상 채워주세요.</span>
      </div>
    `;

    setupFileUploader();

    const btnFile = document.getElementById("toggle-method-file");
    const btnText = document.getElementById("toggle-method-text");
    const cFile = document.getElementById("method-file-container");
    const cText = document.getElementById("method-text-container");

    btnFile.addEventListener("click", () => {
      btnFile.classList.add("active");
      btnFile.classList.replace("btn-secondary", "btn-primary");
      btnText.classList.remove("active");
      btnText.classList.replace("btn-primary", "btn-secondary");
      cFile.style.display = "block";
      cText.style.display = "none";
      uploadBase64Data = null;
      document.getElementById("sub-transcribe-text").value = "";
    });

    btnText.addEventListener("click", () => {
      btnText.classList.add("active");
      btnText.classList.replace("btn-secondary", "btn-primary");
      btnFile.classList.remove("active");
      btnFile.classList.replace("btn-primary", "btn-secondary");
      cFile.style.display = "none";
      cText.style.display = "block";
      uploadBase64Data = null;
      document.getElementById("upload-preview-wrapper").style.display = "none";
      document.getElementById("upload-preview-wrapper").innerHTML = "";
    });
  }
}

// ====================================================
// DRAG & DROP AND FILE SELECTION UTILITY
// ====================================================
function setupFileUploader() {
  const dropzone = document.getElementById("file-dropzone");
  const fileInput = document.getElementById("submission-file");
  const previewWrapper = document.getElementById("upload-preview-wrapper");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      fileInput.files = files;
      handleFileSelected(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (fileInput.files.length) {
      handleFileSelected(fileInput.files[0]);
    }
  });

  function handleFileSelected(file) {
    if (!file.type.startsWith('image/')) {
      showToast("이미지 형식의 파일만 업로드할 수 있습니다.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("파일 크기는 최대 5MB를 초과할 수 없습니다.", "error");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      uploadBase64Data = reader.result;

      previewWrapper.innerHTML = `
        <div class="preview-container">
          <img class="preview-image" src="${uploadBase64Data}" alt="업로드 이미지 시안">
          <button type="button" class="remove-preview-btn" aria-label="삭제">&times;</button>
        </div>
      `;
      previewWrapper.style.display = "block";
      dropzone.style.display = "none";

      previewWrapper.querySelector(".remove-preview-btn").addEventListener("click", () => {
        uploadBase64Data = null;
        fileInput.value = "";
        previewWrapper.innerHTML = "";
        previewWrapper.style.display = "none";
        dropzone.style.display = "flex";
      });
    };
  }
}

function setupAudioUploader() {
  const dropzone = document.getElementById("file-dropzone");
  const fileInput = document.getElementById("submission-file");
  const previewWrapper = document.getElementById("upload-preview-wrapper");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      fileInput.files = files;
      handleFileSelected(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (fileInput.files.length) {
      handleFileSelected(fileInput.files[0]);
    }
  });

  function handleFileSelected(file) {
    const isAudio = file.type.startsWith('audio/') || 
                    file.name.endsWith('.mp3') || 
                    file.name.endsWith('.wav') || 
                    file.name.endsWith('.m4a');
    if (!isAudio) {
      showToast("오디오 형식의 파일(.mp3, .wav, .m4a 등)만 업로드할 수 있습니다.", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("음악 파일 크기는 최대 10MB를 초과할 수 없습니다.", "error");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      uploadBase64Data = reader.result;

      previewWrapper.innerHTML = `
        <div class="preview-container audio-preview-container" style="border: 1px solid var(--border-color); padding: 12px; background: var(--bg-tertiary); display: flex; flex-direction: column; align-items: center; gap: 10px; position: relative;">
          <div style="font-weight: bold; font-size: 0.85rem; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 85%; text-align: center;">
            🎵 ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)
          </div>
          <audio src="${uploadBase64Data}" controls style="width: 100%; max-width: 320px;"></audio>
          <button type="button" class="remove-preview-btn" aria-label="삭제" style="position: absolute; right: 10px; top: 10px; background: none; border: none; font-size: 20px; color: var(--text-secondary); cursor: pointer;">&times;</button>
        </div>
      `;
      previewWrapper.style.display = "block";
      dropzone.style.display = "none";

      previewWrapper.querySelector(".remove-preview-btn").addEventListener("click", () => {
        uploadBase64Data = null;
        fileInput.value = "";
        previewWrapper.innerHTML = "";
        previewWrapper.style.display = "none";
        dropzone.style.display = "flex";
      });
    };
  }
}

async function generateAICalligraphyCard() {
  const titleInput = document.getElementById("sub-calli-title");
  const authorInput = document.getElementById("sub-calli-author");
  const textInput = document.getElementById("sub-calli-text");
  const themeSelect = document.getElementById("sub-calli-theme");
  const fontSelect = document.getElementById("sub-calli-font");
  const previewWrapper = document.getElementById("calli-preview-wrapper");
  const imageContainer = document.getElementById("calli-image-container");
  const validationError = document.getElementById("calli-validation-error");

  if (!titleInput || !authorInput || !textInput || !themeSelect || !fontSelect) return;

  // Reset errors
  document.querySelectorAll("#submission-form .form-group").forEach(g => g.classList.remove("has-error"));
  if (validationError) validationError.style.display = "none";

  let hasError = false;
  if (!titleInput.value.trim()) {
    titleInput.parentElement.classList.add("has-error");
    hasError = true;
  }
  if (!authorInput.value.trim()) {
    authorInput.parentElement.classList.add("has-error");
    hasError = true;
  }
  if (!textInput.value.trim()) {
    textInput.parentElement.classList.add("has-error");
    hasError = true;
  }

  if (hasError) {
    showToast("필수 입력 항목을 작성해 주세요.", "error");
    return;
  }

  // Show loading indicator
  previewWrapper.style.display = "block";
  imageContainer.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 40px; color: var(--text-secondary); width:100%;">
      <div class="spinner"></div>
      <p style="margin-top: 12px; font-weight:bold; color:var(--text-primary);">선택한 테마의 프리미엄 AI 이미지를 로딩하고 있습니다...</p>
    </div>
  `;

  const userText = textInput.value.trim();
  const selectedThemeKey = themeSelect.value; // "sky", "forest", "ocean", "room", "paper"
  const selectedFont = fontSelect.value;
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  // Select a beautiful random image from the pre-bundled 100 background assets!
  const themeImages = CALLIGRAPHY_THEMES_IMAGES[selectedThemeKey] || CALLIGRAPHY_THEMES_IMAGES.sky;
  const randomIndex = Math.floor(Math.random() * themeImages.length);
  const selectedImageUrl = themeImages[randomIndex];

  const img = new Image();
  img.crossOrigin = "anonymous"; // Enable canvas to export without security sandbox violations
  
  img.onload = async () => {
    try {
      // Ensure the selected font is fully loaded in the browser before drawing to Canvas
      try {
        // Extract the pure primary font family name without quotes or fallbacks (e.g., "'East Sea Dokdo', sans-serif" -> "East Sea Dokdo")
        const primaryFontFamily = selectedFont.split(',')[0].replace(/['"]/g, "").trim();
        console.log(`Loading webfont: "${primaryFontFamily}" (raw value: ${selectedFont})...`);
        
        await document.fonts.load(`44px "${primaryFontFamily}"`);
        await document.fonts.ready;
        
        // Polling check: wait up to 1500ms until document.fonts.check returns true for this specific web font
        let attempts = 0;
        while (!document.fonts.check(`44px "${primaryFontFamily}"`) && attempts < 15) {
          console.log(`Webfont "${primaryFontFamily}" is still downloading, waiting 100ms... (attempt ${attempts + 1}/15)`);
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        // Final fallback micro-delay to let the font engine register it in canvas context
        await new Promise(resolve => setTimeout(resolve, 150));
        console.log(`Webfont "${primaryFontFamily}" is ready to render!`);
      } catch (fontErr) {
        console.warn("Font loading failed, falling back to system font:", fontErr);
      }

      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");

      // Draw background
      ctx.drawImage(img, 0, 0, 800, 600);

      // Dark Overlay for typography readability
      ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
      ctx.fillRect(0, 0, 800, 600);

      // Draw paper border effect
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, 760, 560);

      // Draw Book Info Header
      ctx.font = "italic 20px 'Noto Sans KR', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(`📖 ${title} (${author})`, 400, 70);

      // Divider Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(300, 95);
      ctx.lineTo(500, 95);
      ctx.stroke();

      // Draw Calligraphy main text with glowing shadow
      ctx.font = `44px ${selectedFont}`;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      wrapText(ctx, userText, 400, 300, 680, 65);

      // Reset shadow for footer
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw Footer
      ctx.font = "14px 'Noto Sans KR', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText("🎨 SORO ART GALLERY | 캘리그라피 엽서", 400, 545);

      // Export base64
      const resultData = canvas.toDataURL("image/png");
      uploadBase64Data = resultData;

      imageContainer.innerHTML = `
        <img src="${resultData}" style="max-width:100%; border: 1px solid var(--border-color); box-shadow: 0 4px 20px rgba(0,0,0,0.5); display:block;" alt="완성된 캘리그라피 엽서">
      `;
      showToast("캘리그라피 엽서가 성공적으로 완성되었습니다! ✨", "success");
    } catch (e) {
      console.error(e);
      drawFallbackCanvas(selectedThemeKey);
    }
  };

  img.onerror = (err) => {
    console.error("Image loading failed:", err);
    drawFallbackCanvas(selectedThemeKey);
  };

  // Selected images are local assets, so CORS is never an issue and no bypass query param is needed
  img.src = selectedImageUrl;

  // 2차 폴백: 로딩 실패 시 감성 그라디언트 엽서로 대체 작성
  function drawFallbackCanvas(theme) {
    showToast("로컬 이미지 로드 실패. 테마별 감성 배경으로 대체 작성합니다.", "warning");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");

      // Draw beautiful theme-specific gradients
      if (theme === "sky") {
        const grad = ctx.createLinearGradient(0, 0, 0, 600);
        grad.addColorStop(0, "#0b0c10"); // Near black
        grad.addColorStop(1, "#1f2833"); // Dark steel blue
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);

        // Twinkling stars
        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < 40; i++) {
          const x = Math.random() * 800;
          const y = Math.random() * 450;
          const r = Math.random() * 1.5;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme === "forest") {
        const grad = ctx.createLinearGradient(0, 0, 0, 600);
        grad.addColorStop(0, "#0a2f1d"); // Forest green
        grad.addColorStop(1, "#134e5e"); // Teal
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);
      } else if (theme === "ocean") {
        const grad = ctx.createLinearGradient(0, 0, 0, 600);
        grad.addColorStop(0, "#f857a6"); // Pink sunset
        grad.addColorStop(1, "#ff5858"); // Coral
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);
      } else if (theme === "room") {
        const grad = ctx.createLinearGradient(0, 0, 800, 600);
        grad.addColorStop(0, "#2c3e50"); // Midnight blue
        grad.addColorStop(1, "#000000"); // Charcoal black
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 800, 600);
        grad.addColorStop(0, "#e8d5b5"); // Vintage paper
        grad.addColorStop(1, "#c0a080"); // Aged parchment
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);
      }

      // Draw inner border line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, 760, 560);

      // Draw Book Info Header
      ctx.font = "italic 20px 'Noto Sans KR', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.textAlign = "center";
      ctx.fillText(`📖 ${title} (${author})`, 400, 70);

      // Divider Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(300, 95);
      ctx.lineTo(500, 95);
      ctx.stroke();

      // Draw Calligraphy
      ctx.font = `44px ${selectedFont}`;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      wrapText(ctx, userText, 400, 300, 680, 65);

      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw Footer
      ctx.font = "14px 'Noto Sans KR', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText("🎨 SORO ART GALLERY | 캘리그라피 엽서", 400, 545);

      const resultData = canvas.toDataURL("image/png");
      uploadBase64Data = resultData;

      imageContainer.innerHTML = `
        <img src="${resultData}" style="max-width:100%; border: 1px solid var(--border-color);" alt="완성된 캘리그라피 엽서">
      `;
    } catch (err) {
      console.error(err);
      showToast("엽서 제작에 실패했습니다. 입력값을 확인해 주세요.", "error");
    }
  }

  // Word Wrapping Helper function
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let lines = [];

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + " ";
      let metrics = context.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    let startY = y - ((lines.length - 1) * lineHeight) / 2;
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i].trim(), x, startY + (i * lineHeight));
    }
  }
}

// ====================================================
// PIXEL ART INTERACTIVE EDITOR (30x30 Grid)
// ====================================================
function initPixelArtEditor() {
  const GRID_SIZE = 30;
  const board = document.getElementById("pixel-grid-board");
  if (!board) return;

  const totalCells = GRID_SIZE * GRID_SIZE;
  let pixelData = Array(totalCells).fill("");
  let activeBuffer = pixelData; // Double-buffering target pointer for shape previews
  
  // Photoshop Style Swatch Color State
  let primaryColor = "#111111";
  let secondaryColor = "#ffffff";
  let currentColor = primaryColor; // default fallback
  let activeColorSlot = "primary"; // "primary" or "secondary"
  
  let activeSpecialShape = "rect-outline"; // Default special shape
  const SPECIAL_SHAPES = [
    { id: "line", name: "직선", icon: `<line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" stroke-width="2"/>` },
    { id: "rect-outline", name: "사각형 테두리", icon: `<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "rect-fill", name: "채운 사각형", icon: `<rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor"/>` },
    { id: "circle-outline", name: "원 테두리", icon: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "circle-fill", name: "채운 원", icon: `<circle cx="12" cy="12" r="9" fill="currentColor"/>` },
    
    { id: "triangle-up-outline", name: "삼각형 테두리(▲)", icon: `<polygon points="12 3 2 21 22 21" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "triangle-up-fill", name: "채운 삼각형(▲)", icon: `<polygon points="12 3 2 21 22 21" fill="currentColor"/>` },
    { id: "triangle-down-outline", name: "삼각형 테두리(▼)", icon: `<polygon points="12 21 2 3 22 3" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "triangle-down-fill", name: "채운 삼각형(▼)", icon: `<polygon points="12 21 2 3 22 3" fill="currentColor"/>` },
    
    { id: "right-triangle-tl-outline", name: "직각삼각형(↖)", icon: `<polygon points="3 3 21 3 3 21" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "right-triangle-tl-fill", name: "채운 직각삼각형(↖)", icon: `<polygon points="3 3 21 3 3 21" fill="currentColor"/>` },
    { id: "right-triangle-br-outline", name: "직각삼각형(↘)", icon: `<polygon points="21 21 3 21 21 3" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "right-triangle-br-fill", name: "채운 직각삼각형(↘)", icon: `<polygon points="21 21 3 21 21 3" fill="currentColor"/>` },
    
    { id: "diamond-outline", name: "마름모 테두리", icon: `<polygon points="12 2 22 12 12 22 2 12" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "diamond-fill", name: "채운 마름모", icon: `<polygon points="12 2 22 12 12 22 2 12" fill="currentColor"/>` },
    
    { id: "heart-outline", name: "하트 테두리", icon: `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "heart-fill", name: "채운 하트", icon: `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>` },
    
    { id: "star-outline", name: "별 테두리", icon: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "star-fill", name: "채운 별", icon: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" fill="currentColor"/>` },
    
    { id: "cross-outline", name: "십자가 테두리", icon: `<polygon points="9 3 15 3 15 9 21 9 21 15 15 15 15 21 9 21 9 15 3 15 3 9 9 9" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "cross-fill", name: "채운 십자가", icon: `<polygon points="9 3 15 3 15 9 21 9 21 15 15 15 15 21 9 21 9 15 3 15 3 9 9 9" fill="currentColor"/>` },
    
    { id: "arrow-up-outline", name: "화살표(↑) 테두리", icon: `<polygon points="12 3 4 11 9 11 9 21 15 21 15 11 20 11" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "arrow-up-fill", name: "채운 화살표(↑)", icon: `<polygon points="12 3 4 11 9 11 9 21 15 21 15 11 20 11" fill="currentColor"/>` },
    { id: "arrow-down-outline", name: "화살표(↓) 테두리", icon: `<polygon points="12 21 4 13 9 13 9 3 15 3 15 13 20 13" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "arrow-down-fill", name: "채운 화살표(↓)", icon: `<polygon points="12 21 4 13 9 13 9 3 15 3 15 13 20 13" fill="currentColor"/>` },
    
    { id: "hexagon-outline", name: "육각형 테두리", icon: `<polygon points="12 2 22 7.5 22 18.5 12 24 2 18.5 2 7.5" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "hexagon-fill", name: "채운 육각형", icon: `<polygon points="12 2 22 7.5 22 18.5 12 24 2 18.5 2 7.5" fill="currentColor"/>` },
    { id: "pentagon-outline", name: "오각형 테두리", icon: `<polygon points="12 2 22 9.5 18 22 6 22 2 9.5" stroke="currentColor" stroke-width="2" fill="none"/>` },
    { id: "pentagon-fill", name: "채운 오각형", icon: `<polygon points="12 2 22 9.5 18 22 6 22 2 9.5" fill="currentColor"/>` }
  ];
  
  let currentBrushSize = 1;
  let currentTool = "pencil";
  let isDrawing = false;
  let startIndex = null;
  let undoStack = [];
  let redoStack = [];
  let currentColorForDraw = primaryColor; // color used for active stroke

  board.innerHTML = "";
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "pixel-cell";
    cell.dataset.index = i;
    board.appendChild(cell);
  }

  function xy(index) {
    return { x: index % GRID_SIZE, y: Math.floor(index / GRID_SIZE) };
  }

  function idx(x, y) {
    return y * GRID_SIZE + x;
  }

  function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < GRID_SIZE && y < GRID_SIZE;
  }

  function pushUndo() {
    undoStack.push([...pixelData]);
    if (undoStack.length > 60) undoStack.shift();
    redoStack = [];
  }

  // ==== Load Draft (Local Backup First) ====
  if (currentUser) {
    const draftKey = `soro_pixelart_draft_${currentUser.userKey}`;
    const draftData = localStorage.getItem(draftKey);
    if (draftData) {
      try {
        const parsed = JSON.parse(draftData);
        if (Array.isArray(parsed) && parsed.length === totalCells) {
          pixelData = parsed;
          activeBuffer = pixelData;
        }
      } catch (e) {}
    }
  }

  function renderGrid(buffer = pixelData) {
    board.querySelectorAll(".pixel-cell").forEach((cell, index) => {
      cell.style.backgroundColor = buffer[index] || "";
    });
  }

  // Swatch Elements & Controls
  const primarySwatchEl = document.getElementById("pixel-primary-swatch");
  const secondarySwatchEl = document.getElementById("pixel-secondary-swatch");
  const swapBtn = document.getElementById("pixel-swatch-swap");
  const resetBtn = document.getElementById("pixel-swatch-reset");
  const customPicker = document.getElementById("pixel-custom-color");

  function updateSwatchUI() {
    if (primarySwatchEl) {
      primarySwatchEl.style.backgroundColor = primaryColor;
      primarySwatchEl.classList.toggle("active", activeColorSlot === "primary");
    }
    if (secondarySwatchEl) {
      secondarySwatchEl.style.backgroundColor = secondaryColor;
      secondarySwatchEl.classList.toggle("active", activeColorSlot === "secondary");
    }
    if (customPicker) {
      customPicker.value = activeColorSlot === "primary" ? primaryColor : secondaryColor;
    }
  }

  if (primarySwatchEl) {
    primarySwatchEl.addEventListener("click", () => {
      activeColorSlot = "primary";
      updateSwatchUI();
      updatePaletteHighlight();
    });
  }
  if (secondarySwatchEl) {
    secondarySwatchEl.addEventListener("click", () => {
      activeColorSlot = "secondary";
      updateSwatchUI();
      updatePaletteHighlight();
    });
  }

  function swapColors() {
    const temp = primaryColor;
    primaryColor = secondaryColor;
    secondaryColor = temp;
    updateSwatchUI();
    updatePaletteHighlight();
  }

  function resetColors() {
    primaryColor = "#111111";
    secondaryColor = "#ffffff";
    activeColorSlot = "primary";
    updateSwatchUI();
    updatePaletteHighlight();
  }

  if (swapBtn) swapBtn.addEventListener("click", (e) => { e.stopPropagation(); swapColors(); });
  if (resetBtn) resetBtn.addEventListener("click", (e) => { e.stopPropagation(); resetColors(); });

  // Keyboard Shortcuts (X and D)
  const handleKeyboardShortcuts = (e) => {
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;
    const container = document.getElementById("pixel-draw-container");
    if (!container || container.style.display === "none") return;

    if (e.code === "KeyX") {
      e.preventDefault();
      swapColors();
    } else if (e.code === "KeyD") {
      e.preventDefault();
      resetColors();
    }
  };
  document.removeEventListener("keydown", handleKeyboardShortcuts); // prevent duplicate binding
  document.addEventListener("keydown", handleKeyboardShortcuts);

  // Palette Row Highlighting and Left/Right click selection
  function updatePaletteHighlight() {
    const activeColor = activeColorSlot === "primary" ? primaryColor : secondaryColor;
    document.querySelectorAll(".color-chip").forEach(chip => {
      chip.classList.toggle("active", chip.dataset.color.toLowerCase() === activeColor.toLowerCase());
    });
  }

  document.querySelectorAll(".color-chip").forEach(chip => {
    // Left click color selection (Primary)
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      const color = chip.dataset.color;
      primaryColor = color;
      activeColorSlot = "primary";
      updateSwatchUI();
      updatePaletteHighlight();
      if (currentTool === "eraser") setTool("pencil");
    });
    
    // Right click color selection (Secondary)
    chip.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const color = chip.dataset.color;
      secondaryColor = color;
      activeColorSlot = "secondary";
      updateSwatchUI();
      updatePaletteHighlight();
      if (currentTool === "eraser") setTool("pencil");
    });
  });

  if (customPicker) {
    customPicker.addEventListener("input", (e) => {
      const color = e.target.value;
      if (activeColorSlot === "primary") {
        primaryColor = color;
      } else {
        secondaryColor = color;
      }
      updateSwatchUI();
      updatePaletteHighlight();
    });
  }

  // Brush Size Button Group
  document.querySelectorAll(".pixel-size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pixel-size-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentBrushSize = parseInt(btn.dataset.size) || 1;
    });
  });

  // Dynamic Size Draw Math
  function getBrushOffsets(size) {
    const offsets = [];
    const start = -Math.floor((size - 1) / 2);
    const end = Math.floor(size / 2);
    for (let dy = start; dy <= end; dy++) {
      for (let dx = start; dx <= end; dx++) {
        offsets.push([dx, dy]);
      }
    }
    return offsets;
  }

  function setPixel(x, y, color = currentColorForDraw) {
    if (!inBounds(x, y)) return;
    activeBuffer[idx(x, y)] = color;
  }

  function setPixelWithSize(x, y, color) {
    const offsets = getBrushOffsets(currentBrushSize);
    offsets.forEach(([dx, dy]) => {
      setPixel(x + dx, y + dy, color);
    });
  }

  function drawLine(x0, y0, x1, y1, color) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      setPixelWithSize(x0, y0, color);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }

  function drawRect(x0, y0, x1, y1, fill, color) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (fill) {
          setPixel(x, y, color);
        } else {
          if (x === minX || x === maxX || y === minY || y === maxY) {
            setPixelWithSize(x, y, color);
          }
        }
      }
    }
  }

  function drawCircle(x0, y0, x1, y1, fill, color) {
    const cx = Math.round((x0 + x1) / 2);
    const cy = Math.round((y0 + y1) / 2);
    const rx = Math.max(1, Math.abs(x1 - x0) / 2);
    const ry = Math.max(1, Math.abs(y1 - y0) / 2);
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const value = ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2);
        if (fill) {
          if (value <= 1) setPixel(x, y, color);
        } else {
          if (Math.abs(value - 1) < 0.18) setPixelWithSize(x, y, color);
        }
      }
    }
  }

  function floodFill(start, replacement) {
    const target = activeBuffer[start] || "";
    if (target === replacement) return;
    const stack = [start];
    while (stack.length) {
      const current = stack.pop();
      if ((activeBuffer[current] || "") !== target) continue;
      activeBuffer[current] = replacement;
      const { x, y } = xy(current);
      [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach(([nx, ny]) => {
        if (inBounds(nx, ny)) stack.push(idx(nx, ny));
      });
    }
  }

  function isShapeTool(tool) {
    return ["line", "rect-outline", "rect-fill", "circle-outline", "circle-fill", "triangle-outline", "triangle-fill", "right-triangle-outline", "right-triangle-fill", "diamond-outline", "diamond-fill", "special-shape"].includes(tool);
  }

  function drawTriangle(x0, y0, x1, y1, direction, fill, color) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    const midX = Math.round((x0 + x1) / 2);
    
    if (fill) {
      const height = maxY - minY + 1;
      for (let y = minY; y <= maxY; y++) {
        let progress;
        if (direction === "up") {
          progress = height > 1 ? (y - minY) / (height - 1) : 1;
        } else {
          progress = height > 1 ? (maxY - y) / (height - 1) : 1;
        }
        const width = Math.round((maxX - minX) * progress);
        const startX = midX - Math.floor(width / 2);
        const endX = startX + width - 1;
        for (let x = startX; x <= endX; x++) {
          setPixel(x, y, color);
        }
      }
    } else {
      const peakY = direction === "up" ? minY : maxY;
      const baseY = direction === "up" ? maxY : minY;
      drawLine(midX, peakY, minX, baseY, color);
      drawLine(midX, peakY, maxX, baseY, color);
      drawLine(minX, baseY, maxX, baseY, color);
    }
  }

  function drawRightTriangle(x0, y0, x1, y1, corner, fill, color) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    const w = maxX - minX;
    const h = maxY - minY;
    
    if (fill) {
      for (let y = minY; y <= maxY; y++) {
        const dy = y - minY;
        const progress = h > 0 ? dy / h : 1;
        if (corner === "tl") {
          const endX = minX + Math.round(w * (1 - progress));
          for (let x = minX; x <= endX; x++) {
            setPixel(x, y, color);
          }
        } else {
          const startX = minX + Math.round(w * (1 - progress));
          for (let x = startX; x <= maxX; x++) {
            setPixel(x, y, color);
          }
        }
      }
    } else {
      if (corner === "tl") {
        drawLine(minX, minY, maxX, minY, color);
        drawLine(minX, minY, minX, maxY, color);
        drawLine(maxX, minY, minX, maxY, color);
      } else {
        drawLine(minX, maxY, maxX, maxY, color);
        drawLine(maxX, minY, maxX, maxY, color);
        drawLine(minX, maxY, maxX, minY, color);
      }
    }
  }

  function drawDiamond(x0, y0, x1, y1, fill, color) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    const midX = Math.round((x0 + x1) / 2);
    const midY = Math.round((y0 + y1) / 2);
    
    if (fill) {
      const halfH = midY - minY;
      for (let y = minY; y <= maxY; y++) {
        const dy = Math.abs(y - midY);
        const progress = halfH > 0 ? (1 - dy / halfH) : 1;
        const width = Math.round((maxX - minX) * progress);
        const startX = midX - Math.floor(width / 2);
        const endX = startX + width - 1;
        for (let x = startX; x <= endX; x++) {
          setPixel(x, y, color);
        }
      }
    } else {
      drawLine(midX, minY, minX, midY, color);
      drawLine(midX, minY, maxX, midY, color);
      drawLine(midX, maxY, minX, midY, color);
      drawLine(midX, maxY, maxX, midY, color);
    }
  }

  function drawHeart(x0, y0, x1, y1, fill, color) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    const w = maxX - minX;
    const h = maxY - minY;
    
    if (w === 0 || h === 0) {
      setPixel(x0, y0, color);
      return;
    }
    
    const cx = (minX + maxX) / 2;
    const cy = minY + h * 0.38;
    
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const nx = ((x - cx) / (w / 2)) * 1.25;
        const ny = (((cy - y) / (h / 2)) * 1.2) + 0.15;
        const equation = (nx*nx + ny*ny - 1)**3 - nx*nx * ny*ny*ny;
        
        if (fill) {
          if (equation <= 0) {
            setPixel(x, y, color);
          }
        } else {
          if (equation <= 0) {
            let isBorder = false;
            const neighbors = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
            for (const [nx_n, ny_n] of neighbors) {
              if (nx_n < minX || nx_n > maxX || ny_n < minY || ny_n > maxY) {
                isBorder = true;
                break;
              }
              const nnx = ((nx_n - cx) / (w / 2)) * 1.25;
              const nny = (((cy - ny_n) / (h / 2)) * 1.2) + 0.15;
              const n_eq = (nnx*nnx + nny*nny - 1)**3 - nnx*nnx * nny*nny*nny;
              if (n_eq > 0) {
                isBorder = true;
                break;
              }
            }
            if (isBorder) {
              setPixelWithSize(x, y, color);
            }
          }
        }
      }
    }
  }

  function drawStar(x0, y0, x1, y1, fill, color) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    const w = maxX - minX;
    const h = maxY - minY;
    
    if (w === 0 || h === 0) {
      setPixel(x0, y0, color);
      return;
    }
    
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const nx = Math.abs(x - cx) / (w / 2);
        const ny = Math.abs(y - cy) / (h / 2);
        const value = Math.sqrt(nx) + Math.sqrt(ny);
        
        if (fill) {
          if (value <= 1.0) {
            setPixel(x, y, color);
          }
        } else {
          if (value <= 1.0) {
            let isBorder = false;
            const neighbors = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
            for (const [nx_n, ny_n] of neighbors) {
              if (nx_n < minX || nx_n > maxX || ny_n < minY || ny_n > maxY) {
                isBorder = true;
                break;
              }
              const nnx = Math.abs(nx_n - cx) / (w / 2);
              const nny = Math.abs(ny_n - cy) / (h / 2);
              const n_val = Math.sqrt(nnx) + Math.sqrt(nny);
              if (n_val > 1.0) {
                isBorder = true;
                break;
              }
            }
            if (isBorder) {
              setPixelWithSize(x, y, color);
            }
          }
        }
      }
    }
  }

  function drawCross(x0, y0, x1, y1, fill, color) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    const w = maxX - minX;
    const h = maxY - minY;
    
    const cx = Math.round((minX + maxX) / 2);
    const cy = Math.round((minY + maxY) / 2);
    
    const thickX = Math.max(1, Math.round(w / 3));
    const thickY = Math.max(1, Math.round(h / 3));
    
    const xStart = cx - Math.floor(thickX / 2);
    const xEnd = xStart + thickX - 1;
    const yStart = cy - Math.floor(thickY / 2);
    const yEnd = yStart + thickY - 1;
    
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const inVertBar = (x >= xStart && x <= xEnd);
        const inHorizBar = (y >= yStart && y <= yEnd);
        const inside = inVertBar || inHorizBar;
        
        if (fill) {
          if (inside) setPixel(x, y, color);
        } else {
          if (inside) {
            let isBorder = false;
            const neighbors = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
            for (const [nx_n, ny_n] of neighbors) {
              if (nx_n < minX || nx_n > maxX || ny_n < minY || ny_n > maxY) {
                isBorder = true;
                break;
              }
              const n_inVert = (nx_n >= xStart && nx_n <= xEnd);
              const n_inHoriz = (ny_n >= yStart && ny_n <= yEnd);
              if (!(n_inVert || n_inHoriz)) {
                isBorder = true;
                break;
              }
            }
            if (isBorder) {
              setPixelWithSize(x, y, color);
            }
          }
        }
      }
    }
  }

  function drawArrow(x0, y0, x1, y1, direction, fill, color) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    const w = maxX - minX;
    const h = maxY - minY;
    
    const cx = Math.round((minX + maxX) / 2);
    const headHeight = Math.max(2, Math.round(h * 0.5));
    const shaftWidth = Math.max(1, Math.round(w / 3));
    const shaftStart = cx - Math.floor(shaftWidth / 2);
    const shaftEnd = shaftStart + shaftWidth - 1;
    
    function isInside(x, y) {
      if (x < minX || x > maxX || y < minY || y > maxY) return false;
      
      if (direction === "up") {
        if (y < minY + headHeight) {
          const dy = y - minY;
          const progress = headHeight > 1 ? dy / (headHeight - 1) : 1;
          const halfW = Math.round((w / 2) * progress);
          return (x >= cx - halfW && x <= cx + halfW);
        }
        return (x >= shaftStart && x <= shaftEnd);
      } else {
        if (y > maxY - headHeight) {
          const dy = maxY - y;
          const progress = headHeight > 1 ? dy / (headHeight - 1) : 1;
          const halfW = Math.round((w / 2) * progress);
          return (x >= cx - halfW && x <= cx + halfW);
        }
        return (x >= shaftStart && x <= shaftEnd);
      }
    }
    
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const inside = isInside(x, y);
        if (fill) {
          if (inside) setPixel(x, y, color);
        } else {
          if (inside) {
            let isBorder = false;
            const neighbors = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
            for (const [nx_n, ny_n] of neighbors) {
              if (!isInside(nx_n, ny_n)) {
                isBorder = true;
                break;
              }
            }
            if (isBorder) {
              setPixelWithSize(x, y, color);
            }
          }
        }
      }
    }
  }

  function drawHexagon(x0, y0, x1, y1, fill, color) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    const w = maxX - minX;
    const h = maxY - minY;
    
    if (w === 0 || h === 0) {
      setPixel(x0, y0, color);
      return;
    }
    
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    
    function isInside(x, y) {
      if (x < minX || x > maxX || y < minY || y > maxY) return false;
      const dy = Math.abs(y - cy) / (h / 2);
      const limitW = w * (1 - dy * 0.5);
      return Math.abs(x - cx) <= limitW / 2;
    }
    
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const inside = isInside(x, y);
        if (fill) {
          if (inside) setPixel(x, y, color);
        } else {
          if (inside) {
            let isBorder = false;
            const neighbors = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
            for (const [nx_n, ny_n] of neighbors) {
              if (!isInside(nx_n, ny_n)) {
                isBorder = true;
                break;
              }
            }
            if (isBorder) {
              setPixelWithSize(x, y, color);
            }
          }
        }
      }
    }
  }

  function drawPentagon(x0, y0, x1, y1, fill, color) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    const w = maxX - minX;
    const h = maxY - minY;
    
    if (w === 0 || h === 0) {
      setPixel(x0, y0, color);
      return;
    }
    
    const cx = (minX + maxX) / 2;
    const splitY = minY + h * 0.4;
    
    function isInside(x, y) {
      if (x < minX || x > maxX || y < minY || y > maxY) return false;
      if (y < splitY) {
        const progress = (y - minY) / (splitY - minY || 1);
        const limitW = w * progress;
        return Math.abs(x - cx) <= limitW / 2;
      }
      return true;
    }
    
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const inside = isInside(x, y);
        if (fill) {
          if (inside) setPixel(x, y, color);
        } else {
          if (inside) {
            let isBorder = false;
            const neighbors = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
            for (const [nx_n, ny_n] of neighbors) {
              if (!isInside(nx_n, ny_n)) {
                isBorder = true;
                break;
              }
            }
            if (isBorder) {
              setPixelWithSize(x, y, color);
            }
          }
        }
      }
    }
  }

  function applyPoint(index, color) {
    const { x, y } = xy(index);
    if (currentTool === "pencil" || currentTool === "brush") {
      setPixelWithSize(x, y, color);
    } else if (currentTool === "eraser") {
      setPixelWithSize(x, y, "");
    } else if (currentTool === "bucket") {
      floodFill(index, color);
    } else if (currentTool === "eyedropper") {
      const picked = activeBuffer[index] || "#ffffff";
      if (activeColorSlot === "primary") {
        primaryColor = picked;
      } else {
        secondaryColor = picked;
      }
      updateSwatchUI();
      updatePaletteHighlight();
    }
  }

  function commitShape(endIndex, color) {
    if (startIndex === null) return;
    const a = xy(startIndex);
    const b = xy(endIndex);
    
    const shape = activeSpecialShape;
    
    if (shape === "line") drawLine(a.x, a.y, b.x, b.y, color);
    else if (shape === "rect-outline") drawRect(a.x, a.y, b.x, b.y, false, color);
    else if (shape === "rect-fill") drawRect(a.x, a.y, b.x, b.y, true, color);
    else if (shape === "circle-outline") drawCircle(a.x, a.y, b.x, b.y, false, color);
    else if (shape === "circle-fill") drawCircle(a.x, a.y, b.x, b.y, true, color);
    
    else if (shape === "triangle-up-outline") drawTriangle(a.x, a.y, b.x, b.y, "up", false, color);
    else if (shape === "triangle-up-fill") drawTriangle(a.x, a.y, b.x, b.y, "up", true, color);
    else if (shape === "triangle-down-outline") drawTriangle(a.x, a.y, b.x, b.y, "down", false, color);
    else if (shape === "triangle-down-fill") drawTriangle(a.x, a.y, b.x, b.y, "down", true, color);
    
    else if (shape === "right-triangle-tl-outline") drawRightTriangle(a.x, a.y, b.x, b.y, "tl", false, color);
    else if (shape === "right-triangle-tl-fill") drawRightTriangle(a.x, a.y, b.x, b.y, "tl", true, color);
    else if (shape === "right-triangle-br-outline") drawRightTriangle(a.x, a.y, b.x, b.y, "br", false, color);
    else if (shape === "right-triangle-br-fill") drawRightTriangle(a.x, a.y, b.x, b.y, "br", true, color);
    
    else if (shape === "diamond-outline") drawDiamond(a.x, a.y, b.x, b.y, false, color);
    else if (shape === "diamond-fill") drawDiamond(a.x, a.y, b.x, b.y, true, color);
    
    else if (shape === "heart-outline") drawHeart(a.x, a.y, b.x, b.y, false, color);
    else if (shape === "heart-fill") drawHeart(a.x, a.y, b.x, b.y, true, color);
    
    else if (shape === "star-outline") drawStar(a.x, a.y, b.x, b.y, false, color);
    else if (shape === "star-fill") drawStar(a.x, a.y, b.x, b.y, true, color);
    
    else if (shape === "cross-outline") drawCross(a.x, a.y, b.x, b.y, false, color);
    else if (shape === "cross-fill") drawCross(a.x, a.y, b.x, b.y, true, color);
    
    else if (shape === "arrow-up-outline") drawArrow(a.x, a.y, b.x, b.y, "up", false, color);
    else if (shape === "arrow-up-fill") drawArrow(a.x, a.y, b.x, b.y, "up", true, color);
    else if (shape === "arrow-down-outline") drawArrow(a.x, a.y, b.x, b.y, "down", false, color);
    else if (shape === "arrow-down-fill") drawArrow(a.x, a.y, b.x, b.y, "down", true, color);
    
    else if (shape === "hexagon-outline") drawHexagon(a.x, a.y, b.x, b.y, false, color);
    else if (shape === "hexagon-fill") drawHexagon(a.x, a.y, b.x, b.y, true, color);
    
    else if (shape === "pentagon-outline") drawPentagon(a.x, a.y, b.x, b.y, false, color);
    else if (shape === "pentagon-fill") drawPentagon(a.x, a.y, b.x, b.y, true, color);
  }

  function setTool(tool) {
    currentTool = tool;
    document.querySelectorAll(".pixel-tool-btn[data-tool]").forEach(btn => btn.classList.toggle("active", btn.dataset.tool === tool));
    const labelBottom = document.getElementById("pixel-tool-label-bottom");
    const labelTop = document.getElementById("pixel-tool-label");
    if (labelBottom) labelBottom.textContent = tool.toUpperCase();
    if (labelTop) labelTop.textContent = tool.toUpperCase();
  }

  document.querySelectorAll(".pixel-tool-btn[data-tool]").forEach(btn => {
    btn.addEventListener("click", () => {
      const tool = btn.dataset.tool;
      setTool(tool);
    });
  });

  function cellFromEvent(e) {
    const point = e.touches?.[0] || e.changedTouches?.[0] || e;
    if (typeof point.clientX !== "number" || typeof point.clientY !== "number") return null;
    const el = document.elementFromPoint(point.clientX, point.clientY);
    return el?.classList.contains("pixel-cell") ? el : null;
  }

  function startDraw(e) {
    const cell = cellFromEvent(e);
    if (!cell) return;
    e.preventDefault();
    pushUndo();
    isDrawing = true;
    startIndex = Number(cell.dataset.index);

    if (e.button === 2) {
      currentColorForDraw = secondaryColor;
    } else {
      currentColorForDraw = primaryColor;
    }

    if (["eyedropper"].includes(currentTool)) {
      activeColorSlot = e.button === 2 ? "secondary" : "primary";
    }

    if (isShapeTool(currentTool)) return;
    applyPoint(startIndex, currentColorForDraw);
    renderGrid();
  }

  function moveDraw(e) {
    const cell = cellFromEvent(e);
    if (!cell) return;
    const index = Number(cell.dataset.index);
    const { x, y } = xy(index);
    const coords = document.getElementById("pixel-coords");
    if (coords) coords.textContent = `X: ${x}, Y: ${y}`;
    if (!isDrawing) return;
    e.preventDefault();

    if (isShapeTool(currentTool)) {
      const tempBuffer = [...pixelData];
      activeBuffer = tempBuffer;
      commitShape(index, currentColorForDraw);
      renderGrid(tempBuffer);
      activeBuffer = pixelData;
    } else if (["bucket", "eyedropper"].includes(currentTool)) {
      return;
    } else {
      applyPoint(index, currentColorForDraw);
      renderGrid();
    }
  }

  function endDraw(e) {
    if (!isDrawing) return;
    const cell = cellFromEvent(e) || document.querySelector(`.pixel-cell[data-index="${startIndex}"]`);
    const index = Number(cell.dataset.index);
    if (isShapeTool(currentTool)) {
      activeBuffer = pixelData;
      commitShape(index, currentColorForDraw);
      renderGrid();
    }
    isDrawing = false;
    startIndex = null;
  }

  board.addEventListener("mousedown", startDraw);
  board.addEventListener("mouseover", moveDraw);
  document.addEventListener("mouseup", endDraw);
  board.addEventListener("contextmenu", (e) => e.preventDefault()); // Prevent browser default right click

  board.addEventListener("touchstart", (e) => {
    currentColorForDraw = primaryColor;
    startDraw(e);
  }, { passive: false });
  board.addEventListener("touchmove", moveDraw, { passive: false });
  board.addEventListener("touchend", endDraw, { passive: false });

  document.getElementById("pixel-undo")?.addEventListener("click", () => {
    if (!undoStack.length) return;
    redoStack.push([...pixelData]);
    pixelData = undoStack.pop();
    renderGrid();
  });
  document.getElementById("pixel-redo")?.addEventListener("click", () => {
    if (!redoStack.length) return;
    undoStack.push([...pixelData]);
    pixelData = redoStack.pop();
    renderGrid();
  });
  document.getElementById("pixel-grid-toggle")?.addEventListener("click", () => board.classList.toggle("no-grid"));
  document.getElementById("pixel-clear")?.addEventListener("click", () => {
    if (!confirm("도트 그림판을 전체 지우시겠습니까?")) return;
    pushUndo();
    pixelData = Array(totalCells).fill("");
    renderGrid();
  });

  // ==== Save Draft to 구글 클라우드 & 로컬 백업 ====
  const saveDraftBtn = document.getElementById("pixel-save-draft");
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener("click", async () => {
      if (!currentUser) return;

      // 1. Local backup first
      const draftKey = `soro_pixelart_draft_${currentUser.userKey}`;
      localStorage.setItem(draftKey, JSON.stringify(pixelData));

      // 2. Remote sheets database cloud sync
      if (GOOGLE_SHEET_API_URL) {
        showToast("임시저장 파일을 클라우드에 안전하게 보관하고 있습니다...", "info");
        const draftId = `pixelart_draft_${currentUser.userKey}`;
        
        // delete previous draft first
        const delPayload = {
          action: "deleteSubmission",
          id: draftId
        };

        try {
          await fetch(GOOGLE_SHEET_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(delPayload)
          });

          // save new draft
          const newDraftEntry = {
            id: draftId,
            contestId: "pixelart_draft",
            contestTitle: "픽셀아트 임시저장",
            studentUsername: currentUser.userKey,
            studentName: currentUser.name,
            studentGrade: currentUser.grade,
            studentClass: currentUser.classNum,
            studentNumber: currentUser.number,
            timestamp: new Date().toLocaleString("ko-KR"),
            data: {
              type: "pixel_draft",
              pixelData: pixelData
            }
          };

          const savePayload = {
            action: "submitContest",
            entry: newDraftEntry
          };

          const response = await fetch(GOOGLE_SHEET_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(savePayload)
          });
          const result = await response.json();
          if (result.status === "success") {
            showToast("픽셀아트 작업 내역이 클라우드에 보관 완료되었습니다! ☁️💾", "success");
            setTimeout(() => {
              document.getElementById("pixel-close-editor")?.click();
            }, 300);
          } else {
            showToast("클라우드 임시저장에 실패했습니다. 브라우저 보관본을 유지합니다.", "error");
          }
        } catch (e) {
          console.error("Cloud save draft error:", e);
          showToast("네트워크 지연으로 임시저장에 실패했습니다. 브라우저 보관본을 유지합니다.", "error");
        }
      } else {
        showToast("픽셀아트 작업 내역이 로컬 저장소에 임시 저장되었습니다. 💾", "success");
        setTimeout(() => {
          document.getElementById("pixel-close-editor")?.click();
        }, 300);
      }
    });
  }

  // ==== Load Draft from Cloud quietly in the background ====
  async function loadCloudDraft() {
    if (!currentUser || !GOOGLE_SHEET_API_URL) return;
    const payload = {
      action: "getSubmissions",
      studentUsername: currentUser.userKey
    };
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        const cloudDraft = result.data.find(entry => entry.id === `pixelart_draft_${currentUser.userKey}`);
        if (cloudDraft && cloudDraft.data && Array.isArray(cloudDraft.data.pixelData)) {
          pixelData = cloudDraft.data.pixelData;
          renderGrid();
          // update local backup
          const draftKey = `soro_pixelart_draft_${currentUser.userKey}`;
          localStorage.setItem(draftKey, JSON.stringify(pixelData));
          showToast("클라우드에서 이전 작업 내역을 동기화했습니다. ☁️✨", "success");
        }
      }
    } catch (err) {
      console.error("Cloud draft load failed:", err);
    }
  }

  // Initial updates
  updateSwatchUI();
  updatePaletteHighlight();
  renderGrid();

  // Load cloud draft quietly after load
  setTimeout(loadCloudDraft, 400);

  // Initialize Special Shapes Grid in Right Panel
  const shapesGrid = document.getElementById("pixel-special-shapes-grid");
  if (shapesGrid) {
    shapesGrid.innerHTML = SPECIAL_SHAPES.map(shape => `
      <div class="pixel-shape-item${activeSpecialShape === shape.id ? ' active' : ''}" data-shape="${shape.id}" title="${shape.name}">
        <svg viewBox="0 0 24 24">${shape.icon}</svg>
      </div>
    `).join("");
    
    shapesGrid.querySelectorAll(".pixel-shape-item").forEach(item => {
      item.addEventListener("click", () => {
        activeSpecialShape = item.dataset.shape;
        shapesGrid.querySelectorAll(".pixel-shape-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        setTool("special-shape");
      });
    });
  }
}

// Exports the pixel art grid to a base64 PNG string
function exportPixelArtToBase64() {
  const board = document.getElementById("pixel-grid-board");
  const canvas = document.getElementById("pixel-export-canvas");
  if (!board || !canvas) return null;

  const GRID_SIZE = 30;
  const CELL_SIZE = 10; // Each pixel = 10px in the exported image (300x300)
  canvas.width = GRID_SIZE * CELL_SIZE;
  canvas.height = GRID_SIZE * CELL_SIZE;
  const ctx = canvas.getContext("2d");

  // Clear with white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cells = board.querySelectorAll(".pixel-cell");
  let hasContent = false;
  cells.forEach((cell, index) => {
    const bg = cell.style.backgroundColor;
    if (bg) {
      hasContent = true;
      ctx.fillStyle = bg;
      const col = index % GRID_SIZE;
      const row = Math.floor(index / GRID_SIZE);
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  });

  if (!hasContent) return null;
  return canvas.toDataURL("image/png");
}

function setupEventListeners() {
  document.getElementById("contest-drawer-overlay").addEventListener("click", closeContestDrawer);
  document.getElementById("contest-drawer-close").addEventListener("click", closeContestDrawer);
  
  // Drawer Tab Switcher Event Listeners
  document.getElementById("drawer-tab-guide").addEventListener("click", () => switchDrawerTab("guide"));
  document.getElementById("drawer-tab-criteria").addEventListener("click", () => switchDrawerTab("criteria"));
  document.getElementById("drawer-tab-gallery").addEventListener("click", () => switchDrawerTab("gallery"));

  // Gallery Filter Badges Event Listeners (Context-aware for keyring vs generic/other contests)
  document.querySelectorAll(".gallery-filter-badge").forEach(badge => {
    badge.addEventListener("click", (e) => {
      document.querySelectorAll(".gallery-filter-badge").forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      const grade = e.currentTarget.getAttribute("data-grade");
      if (activeContest && activeContest.id !== "keyring") {
        renderLibraryGallery(grade);
      } else {
        renderGallery2025(grade);
      }
    });
  });

  document.getElementById("auth-trigger-btn").addEventListener("click", () => openAuthDrawer("login"));
  document.getElementById("auth-redirect-btn").addEventListener("click", () => {
    closeContestDrawer();
    openAuthDrawer("login");
  });

  document.getElementById("auth-drawer-overlay").addEventListener("click", closeAuthDrawer);
  document.getElementById("auth-drawer-close").addEventListener("click", closeAuthDrawer);

  document.getElementById("tab-login-btn").addEventListener("click", () => switchAuthTab("login"));
  document.getElementById("tab-signup-btn").addEventListener("click", () => switchAuthTab("signup"));

  document.getElementById("logout-btn").addEventListener("click", executeLogout);

  const lookupDrawer = document.getElementById("lookup-drawer");
  document.getElementById("lookup-toggle-btn").addEventListener("click", () => {
    lookupDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    executeLoggedInLookup();
  });
  document.getElementById("lookup-drawer-overlay").addEventListener("click", closeLookupDrawer);
  document.getElementById("lookup-drawer-close").addEventListener("click", closeLookupDrawer);

  function closeLookupDrawer() {
    lookupDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Handle Login submission
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      const grade = document.getElementById("login-grade").value;
      const classNum = document.getElementById("login-class").value.trim();
      const number = document.getElementById("login-number").value.trim();
      const name = document.getElementById("login-name").value.trim();
      const pass = document.getElementById("login-password").value;
      handleLogin(grade, classNum, number, name, pass);
    }
  });

  // Handle Reset Password click
  const resetBtn = document.getElementById("auth-reset-pw-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const grade = document.getElementById("login-grade");
      const classNum = document.getElementById("login-class");
      const number = document.getElementById("login-number");
      const name = document.getElementById("login-name");
      const passwordGroup = document.getElementById("login-confirm-password-group");
      const passwordInput = document.getElementById("login-password");
      const confirmInput = document.getElementById("login-confirm-password");
      const passwordLabel = document.querySelector("label[for='login-password']");
      const loginSubmitBtn = document.querySelector("#login-form button[type='submit']");

      // 1. 비밀번호 확인 입력창이 아직 안 보이는 상태 (초기화 모드 진입 시점)
      if (passwordGroup.style.display === "none" || !passwordGroup.style.display) {
        // 첫 번째 비밀번호 필드에 변경할 비밀번호가 올바르게 들어갔는지와 무관하게 무조건 노출
        passwordGroup.style.display = "flex";
        if (passwordLabel) passwordLabel.textContent = "새 비밀번호 설정";
        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = true;
          loginSubmitBtn.style.opacity = "0.5";
        }
        
        // 비밀번호 초기화 버튼 라벨 및 클래스 동적 액티브 변경
        resetBtn.innerHTML = "🔑 비밀번호 초기화 완료";
        resetBtn.classList.remove("btn-secondary");
        resetBtn.classList.add("btn-primary");
        
        passwordInput.value = "";
        confirmInput.value = "";
        passwordInput.focus();
        showToast("새로 지정할 비밀번호를 입력하고, 그 밑에 한번 더 확인 입력한 후 초기화 완료 버튼을 눌러주세요.", "info");
      } 
      // 2. 비밀번호 확인 입력창이 이미 보이고 있는 상태 (실제 초기화 완료 실행 시점)
      else {
        // 모든 필드 에러 상태 청소
        document.querySelectorAll("#login-form .form-group").forEach(g => g.classList.remove("has-error"));

        let isValid = true;
        if (!grade.value) {
          grade.parentElement.classList.add("has-error");
          isValid = false;
        }
        if (!classNum.value || classNum.value < 1) {
          classNum.parentElement.classList.add("has-error");
          isValid = false;
        }
        if (!number.value || number.value < 1) {
          number.parentElement.classList.add("has-error");
          isValid = false;
        }
        if (!name.value.trim()) {
          name.parentElement.classList.add("has-error");
          isValid = false;
        }

        if (!isValid) {
          showToast("비밀번호 초기화를 위해 학년, 반, 번호, 이름을 먼저 모두 정확히 선택/입력해 주세요.", "error");
          return;
        }

        let pwValid = true;
        if (!passwordInput.value || passwordInput.value.length < 4) {
          passwordInput.parentElement.classList.add("has-error");
          pwValid = false;
        }
        if (passwordInput.value !== confirmInput.value) {
          confirmInput.parentElement.classList.add("has-error");
          pwValid = false;
        }

        if (!pwValid) {
          showToast("새 비밀번호는 최소 4자 이상이어야 하며 두 칸의 입력값이 동일해야 합니다.", "error");
          return;
        }

        handleResetPassword(grade.value, classNum.value.trim(), number.value.trim(), name.value.trim(), passwordInput.value);
      }
    });
  }

  // Handle Signup submission
  const signupForm = document.getElementById("signup-form");
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateSignupForm()) {
      const grade = document.getElementById("signup-grade").value;
      const classNum = document.getElementById("signup-class").value.trim();
      const number = document.getElementById("signup-number").value.trim();
      const name = document.getElementById("signup-name").value.trim();
      const pass = document.getElementById("signup-password").value;
      handleSignUp(grade, classNum, number, name, pass);
    }
  });

  const subForm = document.getElementById("submission-form");
  subForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateSubmissionForm()) {
      executeSubmit();
    }
  });

  initDIDExhibition();
}

// ====================================================
// FORM VALIDATIONS (LOGIN, SIGNUP, SUBMISSIONS)
// ====================================================
function validateLoginForm() {
  let isValid = true;

  const grade = document.getElementById("login-grade");
  const classNum = document.getElementById("login-class");
  const number = document.getElementById("login-number");
  const name = document.getElementById("login-name");
  const pass = document.getElementById("login-password");

  document.querySelectorAll("#login-form .form-group").forEach(g => g.classList.remove("has-error"));

  if (!grade.value) {
    grade.parentElement.classList.add("has-error");
    isValid = false;
  }
  if (!classNum.value || classNum.value < 1) {
    classNum.parentElement.classList.add("has-error");
    isValid = false;
  }
  if (!number.value || number.value < 1) {
    number.parentElement.classList.add("has-error");
    isValid = false;
  }
  if (!name.value.trim()) {
    name.parentElement.classList.add("has-error");
    isValid = false;
  }
  if (!pass.value) {
    pass.parentElement.classList.add("has-error");
    isValid = false;
  }

  return isValid;
}

function validateSignupForm() {
  let isValid = true;

  const grade = document.getElementById("signup-grade");
  const classNum = document.getElementById("signup-class");
  const number = document.getElementById("signup-number");
  const name = document.getElementById("signup-name");
  const pass = document.getElementById("signup-password");

  document.querySelectorAll("#signup-form .form-group").forEach(g => g.classList.remove("has-error"));

  if (!grade.value) {
    grade.parentElement.classList.add("has-error");
    isValid = false;
  }
  if (!classNum.value || classNum.value < 1) {
    classNum.parentElement.classList.add("has-error");
    isValid = false;
  }
  if (!number.value || number.value < 1) {
    number.parentElement.classList.add("has-error");
    isValid = false;
  }
  if (!name.value.trim()) {
    name.parentElement.classList.add("has-error");
    isValid = false;
  }
  if (!pass.value || pass.value.length < 4) {
    pass.parentElement.classList.add("has-error");
    isValid = false;
  }

  return isValid;
}

function validateSubmissionForm() {
  let isValid = true;
  document.querySelectorAll("#submission-form .form-group").forEach(g => g.classList.remove("has-error"));

  if (activeContest.submissionType === "image" && activeContest.id === "pixelart") {
    const isDrawActive = document.getElementById("toggle-pixel-draw")?.classList.contains("active");
    if (isDrawActive) {
      const testExport = exportPixelArtToBase64();
      if (!testExport) {
        const editorContainer = document.querySelector(".pixel-editor-shell");
        if (editorContainer) editorContainer.parentElement.classList.add("has-error");
        isValid = false;
      }
    } else {
      if (!uploadBase64Data) {
        const dropzone = document.getElementById("file-dropzone");
        if (dropzone) dropzone.parentElement.classList.add("has-error");
        isValid = false;
      }
    }
  } else if (activeContest.submissionType === "image") {
    if (!uploadBase64Data) {
      const dropzone = document.getElementById("file-dropzone");
      dropzone.parentElement.classList.add("has-error");
      isValid = false;
    }
  }

  else if (activeContest.submissionType === "audio") {
    if (!uploadBase64Data) {
      const dropzone = document.getElementById("file-dropzone");
      if (dropzone) dropzone.parentElement.classList.add("has-error");
      isValid = false;
    }
    const desc = document.getElementById("sub-audio-description");
    if (desc && !desc.value.trim()) {
      desc.parentElement.classList.add("has-error");
      isValid = false;
    }
  }

  else if (activeContest.submissionType === "calligraphy") {
    if (!uploadBase64Data) {
      const errEl = document.getElementById("calli-validation-error");
      if (errEl) errEl.style.display = "block";
      isValid = false;
    }
  }

  else if (activeContest.submissionType === "text_fields") {
    activeContest.textFields.forEach(field => {
      const element = document.getElementById(`sub-${field.id}`);
      if (!element.value.trim()) {
        element.parentElement.classList.add("has-error");
        isValid = false;
      }
    });
  }

  else if (activeContest.submissionType === "image_or_text") {
    const isFileActive = document.getElementById("toggle-method-file").classList.contains("active");
    if (isFileActive) {
      if (!uploadBase64Data) {
        const dropzone = document.getElementById("file-dropzone");
        dropzone.parentElement.classList.add("has-error");
        isValid = false;
      }
    } else {
      const textVal = document.getElementById("sub-transcribe-text");
      if (!textVal.value.trim() || textVal.value.trim().length < 10) {
        textVal.parentElement.classList.add("has-error");
        isValid = false;
      }
    }
  }

  return isValid;
}

// ====================================================
// EXECUTE CONTEST SUBMISSION ACTION
// ====================================================
async function executeSubmit() {
  if (!currentUser) return;

  const contestId = document.getElementById("form-contest-id").value;
  const entryId = `${activeContest.id}_${Date.now()}`;

  const newEntry = {
    id: entryId,
    contestId: contestId,
    contestTitle: activeContest.title,
    studentUsername: currentUser.userKey,
    studentName: currentUser.name,
    studentGrade: currentUser.grade,
    studentClass: currentUser.classNum,
    studentNumber: currentUser.number,
    timestamp: new Date().toLocaleString("ko-KR"),
    data: {}
  };

  if (activeContest.submissionType === "image" && activeContest.id === "pixelart") {
    const isDrawActive = document.getElementById("toggle-pixel-draw")?.classList.contains("active");
    if (isDrawActive) {
      newEntry.data.type = "pixel_draw";
      newEntry.data.image = exportPixelArtToBase64();
    } else {
      newEntry.data.type = "image";
      newEntry.data.image = uploadBase64Data;
    }
  } else if (activeContest.submissionType === "image") {
    newEntry.data.image = uploadBase64Data;
  }

  else if (activeContest.submissionType === "audio") {
    newEntry.data.audio = uploadBase64Data;
    newEntry.data.description = document.getElementById("sub-audio-description").value.trim();
  }

  else if (activeContest.submissionType === "calligraphy") {
    newEntry.data.image = uploadBase64Data;
    newEntry.data.type = "calligraphy";
    newEntry.data["book-title"] = document.getElementById("sub-calli-title").value.trim();
    newEntry.data["book-author"] = document.getElementById("sub-calli-author").value.trim();
    newEntry.data["book-text"] = document.getElementById("sub-calli-text").value.trim();
  }

  else if (activeContest.submissionType === "text_fields") {
    activeContest.textFields.forEach(field => {
      newEntry.data[field.id] = document.getElementById(`sub-${field.id}`).value.trim();
    });
  }

  else if (activeContest.submissionType === "image_or_text") {
    const isFileActive = document.getElementById("toggle-method-file").classList.contains("active");
    if (isFileActive) {
      newEntry.data.type = "image";
      newEntry.data.image = uploadBase64Data;
    } else {
      newEntry.data.type = "text";
      newEntry.data.text = document.getElementById("sub-transcribe-text").value.trim();
    }
  }

  const submitBtn = document.getElementById("submit-btn");
  let originalBtnText = "작품 제출 완료하기";
  if (submitBtn) {
    originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "클라우드에 접수 중...";
  }

  if (GOOGLE_SHEET_API_URL) {
    showToast("작품을 클라우드에 업로드 중...", "info");
    const payload = {
      action: "submitContest",
      entry: newEntry
    };
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.status === "error") {
        showToast(result.message, "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
        return;
      }

      showToast(`${activeContest.title} 대회의 작품 접수가 성공적으로 클라우드에 기록되었습니다! 🎨`, "success");
      closeContestDrawer();
      updateLiveCounters();
    } catch (e) {
      console.error(e);
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  } else {
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  }
}

// ====================================================
// LOOKUP SUBMISSIONS FROM REMOTE OR LOCAL DB
// ====================================================
async function executeLoggedInLookup() {
  if (!currentUser) return;

  const container = document.getElementById("results-container");
  container.innerHTML = `<div class="empty-results">내역을 안전하게 불러오고 있습니다...</div>`;

  let mySubmissions = [];

  if (GOOGLE_SHEET_API_URL) {
    const payload = {
      action: "getSubmissions",
      studentUsername: currentUser.userKey
    };
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.status === "success") {
        mySubmissions = result.data;
        
        // Clean up localStorage for this student: if a non-draft submission is not in the remote list, remove it
        const remoteIds = new Set(mySubmissions.map(s => s.id));
        const allSubmissions = JSON.parse(localStorage.getItem("soro_submissions") || "[]");
        const cleanedSubmissions = allSubmissions.filter(entry => {
          if (entry.studentUsername.toLowerCase() !== currentUser.userKey.toLowerCase()) return true;
          if (entry.contestId === "pixelart_draft") return true;
          return remoteIds.has(entry.id);
        });
        localStorage.setItem("soro_submissions", JSON.stringify(cleanedSubmissions));
      } else {
        showToast(result.message || "데이터를 불러오는 중 오류가 발생했습니다.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
      GOOGLE_SHEET_API_URL_error = true;
    }
  } else {
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    GOOGLE_SHEET_API_URL_error = true;
  }

  // 임시저장 본은 제출 목록 리스트에서 제외
  mySubmissions = mySubmissions.filter(entry => entry.contestId !== "pixelart_draft");

  // === [신설] 게이미피케이션 레벨링 시스템 렌더링 ===
  const levelContainer = document.getElementById("lookup-level-container");
  if (levelContainer) {
    const completedContests = new Set();
    mySubmissions.forEach(entry => {
      completedContests.add(entry.contestId);
    });
    
    const completedCount = completedContests.size;
    const totalCount = CONTESTS_DATA.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    const levels = [
      { title: "소로 새싹 🌱", desc: "도전을 준비하는 파릇파릇한 새싹 단계입니다. 공모전에 참여해 첫 작품을 등록해 보세요!", icon: "🌱" },
      { title: "도전 시작 🚀", desc: "첫 걸음을 떼었습니다! 계속해서 상상의 나래를 펼쳐 다른 미션도 완료해 보세요.", icon: "🚀" },
      { title: "꿈꾸는 크리에이터 ✨", desc: "멋진 창의성으로 벌써 두 개의 미션을 완료하셨네요! 자신만의 작품 세계를 구축 중입니다.", icon: "✨" },
      { title: "창작 탐험가 🗺️", desc: "세 개의 미션 클리어! 새로운 한계를 뛰어넘어 창작의 진정한 묘미를 알아가는 중입니다.", icon: "🗺️" },
      { title: "아이디어 발전기 ⚡", desc: "네 개의 미션 클리어! 반짝이는 아이디어가 쉴 새 없이 샘솟는 학급 대표 창의력 대장!", icon: "⚡" },
      { title: "디지털 마스터 🎓", desc: "다섯 개의 미션 완료! 다양한 디지털 창작 도구를 완벽에 가깝게 다루는 디지털 마스터 수준입니다.", icon: "🎓" },
      { title: "전설의 크리에이터 🏆", desc: "경배하라! 6개의 모든 공모전 미션을 완벽 정복한 청주소로초 최고의 크리에이티브 히어로!", icon: "🏆" }
    ];

    const currentLevelInfo = levels[completedCount] || levels[0];
    const nextLevelInfo = levels[completedCount + 1] || null;

    let stageBadgesHtml = CONTESTS_DATA.map(contest => {
      const isCompleted = completedContests.has(contest.id);
      return `
        <div class="stage-badge ${isCompleted ? 'completed' : 'locked'}">
          <div class="badge-icon">${contest.icon}</div>
          <div class="badge-title" title="${contest.title}">${contest.title}</div>
          <div class="badge-status">${isCompleted ? '완료 🟢' : '대기 중 🔒'}</div>
        </div>
      `;
    }).join("");

    let nextLevelMessage = nextLevelInfo 
      ? `다음 레벨 <strong>[${nextLevelInfo.title}]</strong>까지 미션 <strong>1개</strong> 더 완료하기!`
      : `🎉 모든 공모전 미션을 정복하여 최고 레벨에 도달했습니다!`;

    levelContainer.innerHTML = `
      <div class="level-card">
        <div class="level-card-header">
          <div class="level-info">
            <span class="level-badge">LV.${completedCount}</span>
            <h3 class="level-title">${currentLevelInfo.title}</h3>
            <span class="student-grade-name">(${currentUser.grade}학년 ${currentUser.classNum}반 ${currentUser.name})</span>
          </div>
          <div class="level-desc">${currentLevelInfo.desc}</div>
        </div>
        
        <div class="level-xp-section">
          <div class="level-xp-label">
            <span>미션 진행도 (XP)</span>
            <span>${completedCount} / ${totalCount} (${progressPercent}%)</span>
          </div>
          <div class="xp-bar-container">
            <div class="xp-bar-fill" id="xp-bar-fill-dynamic" style="width: 0%;"></div>
          </div>
          <div class="level-next-tip">${nextLevelMessage}</div>
        </div>
        
        <div class="level-stages-grid">
          <div class="stages-grid-title">미션 달성 보드 (Mission Board)</div>
          <div class="stages-grid-container">
            ${stageBadgesHtml}
          </div>
        </div>
      </div>
    `;

    // Trigger width animation after rendering
    setTimeout(() => {
      const bar = document.getElementById("xp-bar-fill-dynamic");
      if (bar) bar.style.width = `${progressPercent}%`;
    }, 100);
  }

  container.innerHTML = "";

  if (mySubmissions.length === 0) {
    container.innerHTML = `
      <div class="empty-results">
        😢 아직 본 계정으로 응모 및 접수된 공모 작품이 없습니다.<br>
        진행 중인 대회를 확인하시고 소중한 첫 작품을 접수해보세요!
      </div>
    `;
    return;
  }

  mySubmissions.forEach(entry => {
    const card = document.createElement("div");
    card.className = "submitted-card";
    card.setAttribute("id", `entry-${entry.id}`);

    let contentHtml = "";

    // Parse data structure depending on how it was stored
    let entryData = {};
    try {
      entryData = typeof entry.data === "string" ? JSON.parse(entry.data) : (entry.data || {});
    } catch (err) {
      console.error("Error parsing entry data:", err, entry.data);
      if (entry.data) {
        entryData = { image: entry.data };
      }
    }

    if (entryData && entryData.image) {
      const isDrive = entryData.image.includes("drive.google.com");
      const displayUrl = isDrive ? getGoogleDriveDirectLink(entryData.image) : entryData.image;
      const driveId = isDrive ? extractDriveId(entryData.image) : "";
      const downloadUrl = isDrive ? `https://drive.google.com/uc?export=download&id=${driveId}` : entryData.image;

      contentHtml += `
        <div style="margin-top: 10px;"><strong>제출한 이미지 시안:</strong></div>
        <div class="submitted-media-preview-container" style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
          <div style="border: 1px solid var(--border-color); padding: 6px; background: var(--bg-tertiary); display: flex; justify-content: center; overflow: hidden; max-height: 180px;">
            <img class="submission-thumbnail" src="${displayUrl}" alt="제출 이미지" style="max-width: 100%; max-height: 160px; object-fit: contain; border: 1px solid var(--border-color);">
          </div>
          <div>
            <a href="${downloadUrl}" target="_blank" download="submission_art.png" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 0; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); text-decoration: none; cursor: pointer; transition: all var(--transition-fast);">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
              </svg>
              제출 이미지 다운로드
            </a>
          </div>
        </div>
      `;
    }

    else if (entryData && entryData.audio) {
      contentHtml += `
        <div class="submitted-media-preview-container audio-submission-preview" style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
          <div style="border: 1px solid var(--border-color); padding: 10px; background: var(--bg-tertiary); display: flex; flex-direction: column; align-items: center; gap: 8px; border-radius: 6px;">
            <div style="font-size: 1.2rem;">🎵</div>
            <audio src="${entryData.audio}" controls style="width: 100%; max-width: 280px;"></audio>
            ${entryData.description ? `
              <div style="margin-top: 6px; font-size: 0.8rem; color: var(--text-secondary); width: 100%; text-align: left; background: var(--bg-primary); padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                <strong>곡 소개 및 제작 의도:</strong>
                <p style="margin: 2px 0 0 0; white-space: pre-wrap; color: var(--text-primary); line-height: 1.3;">${entryData.description}</p>
              </div>
            ` : ''}
          </div>
          <div>
            <a href="${entryData.audio}" download="소로사운드앨범_${currentUser ? currentUser.name : '학생'}.mp3" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); text-decoration: none; cursor: pointer; transition: all var(--transition-fast);">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
              </svg>
              곡 파일 다운로드
            </a>
          </div>
        </div>
      `;
    }
    else if (entryData && entryData["book-title"]) {
      contentHtml += `
        <div><strong>추천 도서:</strong> ${entryData["book-title"]} (${entryData["book-author"] || "저자 미상"})</div>
        <div><strong>추천 사유 & 평점:</strong> "${entryData["book-review"]}"</div>
      `;
    }

    else if (entryData && entryData.type === "text") {
      contentHtml += `
        <div><strong>필사 텍스트 구절:</strong></div>
        <div style="font-family: serif; white-space: pre-line; background: var(--bg-tertiary); padding: 12px; border-radius: 6px; margin-top: 4px; border: 1px solid var(--border-color); color: var(--text-primary);">
          ${entryData.text}
        </div>
      `;
    }

    const isPrizeDelivered = entryData && entryData.prizeStatus === "delivered";
    const prizeBadgeHtml = isPrizeDelivered
      ? `<span class="prize-badge delivered">🎁 사은품 수령 완료!</span>`
      : `<span class="prize-badge waiting">📦 사은품 지급 대기 중 (교무실에서 받아가세요)</span>`;

    card.innerHTML = `
      <div class="submitted-card-header">
        <div class="submitted-card-title-group">
          <h4>${entry.contestTitle}</h4>
          <div class="submitted-card-date">제출 시각: ${entry.timestamp}</div>
          ${prizeBadgeHtml}
        </div>
      </div>
      <div class="submitted-card-body">
        <div><strong>소속 인적 사항:</strong> ${entry.studentGrade}학년 ${entry.studentClass}반 ${entry.studentNumber}번</div>
        ${contentHtml}
      </div>
      <div class="submitted-card-footer">
        <button class="delete-entry-btn" onclick="confirmDeleteEntry('${entry.id}')">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
          접수 취소하기 (영구 삭제)
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Global deletion call (Supports Remote/Local)
window.confirmDeleteEntry = async function (entryId) {
  if (confirm("정말 이 작품의 접수를 취소하고 삭제하시겠습니까? 한 번 지워진 접수 데이터는 복구할 수 없습니다.")) {
    if (GOOGLE_SHEET_API_URL) {
      showToast("클라우드에서 접수를 파기하고 있습니다...", "info");
      const payload = {
        action: "deleteSubmission",
        id: entryId
      };
      try {
        const response = await fetch(GOOGLE_SHEET_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.status === "error") {
          showToast(result.message, "error");
          return;
        }

        const element = document.getElementById(`entry-${entryId}`);
        if (element) {
          element.style.transition = "all 0.3s ease";
          element.style.opacity = "0";
          element.style.transform = "translateY(15px)";
          setTimeout(() => {
            element.remove();

            const container = document.getElementById("results-container");
            if (container.children.length === 0) {
              container.innerHTML = `
                <div class="empty-results">
                  ✨ 모든 접수 취소가 처리되었습니다.
                </div>
              `;
            }
          }, 300);
        }

        showToast("작품 접수 정보가 성공적으로 취소 및 삭제 처리되었습니다.", "success");
        updateLiveCounters();
      } catch (e) {
        console.error(e);
        showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
      }
    } else {
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    }
  }
};

// ====================================================
// COUNTERS & TOAST NOTIFICATION UTILITIES
// ====================================================
async function updateLiveCounters() {
  let count = 0;

  if (currentUser) {
    if (GOOGLE_SHEET_API_URL) {
      // Quietly query count from Google Sheets
      const payload = {
        action: "getSubmissions",
        studentUsername: currentUser.userKey
      };
      try {
        const response = await fetch(GOOGLE_SHEET_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.status === "success") {
          const filtered = result.data.filter(entry => entry.contestId !== "pixelart_draft");
          count = filtered.length;
          document.getElementById("stat-my-submissions").textContent = `${count}개`;
          return;
        }
      } catch (e) {
        // Fallback silently to local
      }
    }

    const allSubmissions = JSON.parse(localStorage.getItem("soro_submissions") || "[]");
    const mySubmissions = allSubmissions.filter(entry =>
      entry.studentUsername.toLowerCase() === currentUser.userKey.toLowerCase() &&
      entry.contestId !== "pixelart_draft"
    );
    count = mySubmissions.length;
    document.getElementById("stat-my-submissions").textContent = `${count}개`;
  } else {
    document.getElementById("stat-my-submissions").textContent = "0개";
  }
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconHtml = "ℹ️";
  if (type === "success") iconHtml = "✨";
  if (type === "error") iconHtml = "⚠️";

  toast.innerHTML = `
    <span style="font-size: 1.25rem;">${iconHtml}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ====================================================
// SORO PLATFORM INTEGRATED ADMINISTRATOR CENTER LOGIC
// ====================================================


// Safe Korean local format date parser
function parseKoreanDate(dateStr) {
  if (!dateStr) return new Date();
  
  // Try standard parse first
  const stdParsed = Date.parse(dateStr);
  if (!isNaN(stdParsed)) return new Date(stdParsed);
  
  try {
    const cleanStr = dateStr.replace(/\s+/g, " ");
    const parts = cleanStr.match(/(\d+)\.\s*(\d+)\.\s*(\d+)\.?\s*(오전|오후)?\s*(\d+):(\d+):?(\d+)?/);
    if (parts) {
      const year = parseInt(parts[1], 10);
      const month = parseInt(parts[2], 10) - 1;
      const day = parseInt(parts[3], 10);
      const ampm = parts[4];
      let hour = parseInt(parts[5], 10);
      const minute = parseInt(parts[6], 10);
      const second = parts[7] ? parseInt(parts[7], 10) : 0;
      
      if (ampm === "오후" && hour < 12) hour += 12;
      if (ampm === "오전" && hour === 12) hour = 0;
      
      return new Date(year, month, day, hour, minute, second);
    }
  } catch (e) {
    console.error("parseKoreanDate error for: " + dateStr, e);
  }
  
  const fallbackDate = new Date(dateStr);
  if (isNaN(fallbackDate.getTime())) {
    // 혹시 숫자만 모여있는지 검사 (예: 20260527)
    const onlyNums = dateStr.replace(/\D/g, "");
    if (onlyNums.length >= 8) {
      const y = parseInt(onlyNums.substring(0, 4), 10);
      const m = parseInt(onlyNums.substring(4, 6), 10) - 1;
      const d = parseInt(onlyNums.substring(6, 8), 10);
      return new Date(y, m, d);
    }
    return new Date(); // 최후의 보루: 에러 억제를 위해 현재 날짜 반환
  }
  return fallbackDate;
}



let adminAllSubmissions = [];
let adminCurrentContestFilter = "all";
let adminCurrentGradeFilter = "all";
let adminCurrentClassOnlyFilter = "all"; // "all" | "1" | "2" | "3"
let adminSearchQuery = "";
let adminStarFilter = "all"; // "all" | "starred"
let adminPrizeFilter = "all"; // "all" | "waiting" | "delivered"

// 1. Initialize Event Listeners
function initAdminPanel() {
  const triggerBtn = document.getElementById("admin-panel-trigger-btn");
  const closeBtn = document.getElementById("admin-drawer-close");
  const overlay = document.getElementById("admin-drawer-overlay");
  const syncBtn = document.getElementById("admin-sync-btn");
  const exportBtn = document.getElementById("admin-export-csv-btn");
  const searchInput = document.getElementById("admin-search-input");
  
  if (triggerBtn) triggerBtn.addEventListener("click", openAdminDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeAdminDrawer);
  if (overlay) overlay.addEventListener("click", closeAdminDrawer);
  if (syncBtn) syncBtn.addEventListener("click", fetchAndRenderAdminData);
  if (exportBtn) exportBtn.addEventListener("click", exportSubmissionsToCSV);
  
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      adminSearchQuery = e.target.value.trim().toLowerCase();
      adminGalleryCurrentLimit = 24;
      renderAdminSubmissionsTable();
    });
  }

  // Star filter chips
  const starFilters = document.getElementById("admin-star-filters");
  if (starFilters) {
    starFilters.querySelectorAll(".admin-filter-chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        starFilters.querySelectorAll(".admin-filter-chip").forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        adminStarFilter = e.target.dataset.filter;
        adminGalleryCurrentLimit = 24;
        renderAdminSubmissionsTable();
      });
    });
  }

  // Prize filter chips
  const prizeFilters = document.getElementById("admin-prize-filters");
  if (prizeFilters) {
    prizeFilters.querySelectorAll(".admin-filter-chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        prizeFilters.querySelectorAll(".admin-filter-chip").forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        adminPrizeFilter = e.target.dataset.filter;
        adminGalleryCurrentLimit = 24;
        renderAdminSubmissionsTable();
      });
    });
  }

  // Two-Tier Grade Selector
  const gradeSelector = document.getElementById("admin-grade-selector");
  if (gradeSelector) {
    gradeSelector.querySelectorAll(".admin-capsule").forEach(capsule => {
      capsule.addEventListener("click", (e) => {
        gradeSelector.querySelectorAll(".admin-capsule").forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        
        adminCurrentGradeFilter = e.target.dataset.grade;
        adminCurrentClassOnlyFilter = "all";
        adminGalleryCurrentLimit = 24;
        
        renderAdminClassSelector();
        renderAdminSubmissionsTable();
      });
    });
  }
}

// 2. Open / Close Admin Drawer
function openAdminDrawer() {
  const isAdmin = currentUser && 
                  parseInt(currentUser.grade, 10) === 5 && 
                  parseInt(currentUser.classNum, 10) === 1 && 
                  parseInt(currentUser.number, 10) === 27 && 
                  currentUser.name === "김태호";
  if (!isAdmin) {
    showToast("관리자 권한이 없습니다. 접근이 거부되었습니다.", "error");
    return;
  }

  const drawer = document.getElementById("admin-drawer");
  if (drawer) {
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    adminCurrentGradeFilter = "all";
    adminCurrentClassOnlyFilter = "all";
    
    // Reset grade active tabs
    const gradeSelector = document.getElementById("admin-grade-selector");
    if (gradeSelector) {
      gradeSelector.querySelectorAll(".admin-capsule").forEach(c => c.classList.remove("active"));
      const allBtn = gradeSelector.querySelector('[data-grade="all"]');
      if (allBtn) allBtn.classList.add("active");
    }
    
    renderAdminClassSelector();
    initAdminCollapsiblePanel();
    setAdminTabMode(adminCurrentTabMode || "contest");
  }
}

function closeAdminDrawer() {
  const drawer = document.getElementById("admin-drawer");
  if (drawer) {
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

// 3. Render Two-Tier Class Selector (Sub-Tier)
function renderAdminClassSelector() {
  const container = document.getElementById("admin-class-selector");
  if (!container) return;

  if (adminCurrentGradeFilter === "all") {
    container.style.display = "none";
    container.innerHTML = "";
    return;
  }

  container.style.display = "flex";
  let html = `<button class="admin-capsule active" data-class="all">전체 반</button>`;
  for (let classNum = 1; classNum <= 3; classNum++) {
    html += `<button class="admin-capsule" data-class="${classNum}">${classNum}반</button>`;
  }
  container.innerHTML = html;

  container.querySelectorAll(".admin-capsule").forEach(capsule => {
    capsule.addEventListener("click", (e) => {
      container.querySelectorAll(".admin-capsule").forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");
      adminCurrentClassOnlyFilter = e.target.dataset.class;
      adminGalleryCurrentLimit = 24;
      renderAdminSubmissionsTable();
    });
  });
}

// 4. Calculate and Render Real-time KPI Dashboards
function renderAdminKPIs() {
  const totalEl = document.getElementById("admin-stat-total");
  const studentsEl = document.getElementById("admin-stat-students");
  const starredEl = document.getElementById("admin-stat-starred");
  const prizesEl = document.getElementById("admin-stat-prizes");
  const metricsContainer = document.getElementById("admin-grade-metrics-container");
  
  const deduped = deduplicateSubmissions(adminAllSubmissions);
  
  // Update numbers
  if (totalEl) totalEl.textContent = adminAllSubmissions.length;
  if (studentsEl) studentsEl.textContent = deduped.length;
  
  let starredCount = 0;
  deduped.forEach(entry => {
    if (entry.data && entry.data.isStarred) starredCount++;
  });
  if (starredEl) starredEl.textContent = starredCount;

  // Prizes statistics
  let prizesDeliveredCount = 0;
  adminAllSubmissions.forEach(entry => {
    if (entry.data && entry.data.prizeStatus === "delivered") {
      prizesDeliveredCount++;
    }
  });
  if (prizesEl) {
    prizesEl.textContent = `${prizesDeliveredCount}/${adminAllSubmissions.length}`;
  }

  // Grade participation gauges
  if (metricsContainer) {
    const grades = [3, 4, 5, 6];
    let gradeCounts = { 3: 0, 4: 0, 5: 0, 6: 0 };
    
    // Count per grade (based on unique students)
    deduped.forEach(entry => {
      const g = parseInt(entry.studentGrade, 10);
      if (grades.includes(g)) {
        gradeCounts[g]++;
      }
    });

    const maxCount = Math.max(...Object.values(gradeCounts), 1);
    
    let html = "";
    grades.forEach(g => {
      const count = gradeCounts[g];
      const pct = Math.round((count / maxCount) * 100);
      html += `
        <div class="admin-grade-bar-item" onclick="selectAdminGradeFilter(${g})" style="cursor: pointer;">
          <div class="admin-grade-bar-label">
            <span>${g}학년</span>
            <span>${count}명 (${pct}%)</span>
          </div>
          <div class="admin-grade-bar-track">
            <div class="admin-grade-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    });
    metricsContainer.innerHTML = html;
  }
}

// 4-1. Collapsible Panel State Initializer
function initAdminCollapsiblePanel() {
  const isCollapsed = localStorage.getItem("soro_admin_panel_collapsed") !== "false";
  const grid = document.getElementById("admin-contest-cards");
  const btn = document.getElementById("admin-panel-toggle-btn");
  if (grid && btn) {
    if (isCollapsed) {
      grid.classList.add("collapsed");
      btn.classList.remove("active");
    } else {
      grid.classList.remove("collapsed");
      btn.classList.add("active");
    }
  }
}

// 4-2. Toggle Accordion for Admin Contest Cards Panel
window.toggleAdminContestPanel = function() {
  const grid = document.getElementById("admin-contest-cards");
  const btn = document.getElementById("admin-panel-toggle-btn");
  if (!grid || !btn) return;

  const isCollapsed = grid.classList.toggle("collapsed");
  localStorage.setItem("soro_admin_panel_collapsed", isCollapsed ? "true" : "false");
  btn.classList.toggle("active", !isCollapsed);
};

// Toggle Accordion for Admin Filter Bar (Grade/Class Selector)
window.toggleAdminFilterAccordion = function() {
  const accordion = document.getElementById("admin-detail-filters-accordion");
  const btn = document.getElementById("admin-filter-accordion-btn");
  if (!accordion || !btn) return;

  const isCollapsed = accordion.classList.toggle("collapsed");
  btn.textContent = isCollapsed ? "🔍 상세필터 🔽" : "🔍 상세필터 🔼";
  btn.classList.toggle("active", !isCollapsed);
};

// Sidebar grade metrics selection handler (Syncs with filters accordion)
window.selectAdminGradeFilter = function(grade) {
  const accordion = document.getElementById("admin-detail-filters-accordion");
  const accordionBtn = document.getElementById("admin-filter-accordion-btn");
  if (accordion) {
    accordion.classList.remove("collapsed");
  }
  if (accordionBtn) {
    accordionBtn.classList.add("active");
    accordionBtn.textContent = "🔍 상세필터 🔼";
  }

  const gradeSelector = document.getElementById("admin-grade-selector");
  if (gradeSelector) {
    gradeSelector.querySelectorAll(".admin-capsule").forEach(c => {
      if (c.dataset.grade === String(grade)) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });
  }

  adminCurrentGradeFilter = String(grade);
  adminCurrentClassOnlyFilter = "all";

  renderAdminClassSelector();
  
  if (adminCurrentViewMode === "gallery") {
    renderAdminSubmissionsGallery();
  } else {
    renderAdminSubmissionsTable();
  }
  
  showToast(`${grade}학년 필터가 적용되었습니다.`, "info");
};

// 4-3. View Mode Switcher (Table vs Gallery)
let adminCurrentViewMode = "gallery";
let adminGalleryCurrentLimit = 24;
window.setAdminViewMode = function(mode) {
  adminCurrentViewMode = mode;
  const tableView = document.getElementById("admin-table-view-wrapper");
  const galleryView = document.getElementById("admin-gallery-view-wrapper");
  const btnTable = document.getElementById("btn-view-table");
  const btnGallery = document.getElementById("btn-view-gallery");

  if (mode === "table") {
    if (tableView) tableView.style.display = "block";
    if (galleryView) galleryView.style.display = "none";
    if (btnTable) btnTable.classList.add("active");
    if (btnGallery) btnGallery.classList.remove("active");
    renderAdminSubmissionsTable();
  } else {
    if (tableView) tableView.style.display = "none";
    if (galleryView) galleryView.style.display = "block";
    if (btnTable) btnTable.classList.remove("active");
    if (btnGallery) btnGallery.classList.add("active");
    renderAdminSubmissionsGallery();
  }
};

// 5. Fetch All Submissions (Bulk & Fallback Hybrid Acceleration)
async function fetchAndRenderAdminData() {
  if (typeof adminCurrentTabMode !== "undefined" && adminCurrentTabMode === "zepquiz") {
    fetchZepQuizDataAndRender();
    return;
  }

  const galleryList = document.getElementById("admin-gallery-list");
  if (!galleryList) return;

  galleryList.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: var(--text-secondary);">
      <div class="spinner" style="margin: 0 auto 12px auto;"></div>
      <p style="font-weight: 800; color: var(--text-primary);">원격 공모전 데이터를 실시간 수집하는 중...</p>
    </div>
  `;

  if (!GOOGLE_SHEET_API_URL) {
    galleryList.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--error-color); font-weight: 800;">
        ⚠️ 원격 API 주소가 설정되지 않았습니다.
      </div>
    `;
    return;
  }

  const activeContestIds = ["keyring", "cuttoon", "library", "transcription", "pixelart", "sound_album"];
  
  try {
    let isBulkSuccess = false;
    
    // Step 1: 선제적 1회 일괄 조회 (Bulk Fetch) 시도
    try {
      console.log("[Bulk Fetch] Requesting all contest data...");
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify({ action: "getAllSubmissions", contestId: "all" })
      });
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        adminAllSubmissions = result.data;
        isBulkSuccess = true;
        console.log(`[Bulk Fetch] Successfully loaded ${adminAllSubmissions.length} entries.`);
      }
    } catch (bulkErr) {
      console.warn("[Bulk Fetch] Not supported or failed. Falling back to parallel query:", bulkErr);
    }

    // Step 2: 일괄 조회 실패/구버전일 시 6회 개별 병렬 조회로 폴백 구동
    if (!isBulkSuccess) {
      console.log("[Fallback] Requesting parallel individual queries for 6 contests...");
      const fetchPromises = activeContestIds.map(async (cId) => {
        try {
          const response = await fetch(GOOGLE_SHEET_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify({ action: "getAllSubmissions", contestId: cId })
          });
          const result = await response.json();
          if (result.status === "success" && Array.isArray(result.data)) {
            return result.data.map(d => ({ ...d, contestId: cId }));
          }
        } catch (err) {
          console.error(`Admin fetch failed for ${cId}:`, err);
        }
        return [];
      });

      const results = await Promise.all(fetchPromises);
      adminAllSubmissions = results.flat();
    }
    
    adminAllSubmissions.forEach(entry => {
      if (entry && entry.data && typeof entry.data === "string") {
        try { entry.data = JSON.parse(entry.data); } catch (e) { entry.data = {}; }
      } else if (entry && !entry.data) {
        entry.data = {};
      }
    });

    showToast(isBulkSuccess ? "원격 동기화 가속 완료 (1회 일괄 조회 성공)!" : "원격 동기화 완료 (구버전 호환 우회 적용)", "success");
    
    renderAdminKPIs();
    renderAdminContestCards();
    
    // 현재 스위처 뷰 모드에 따라 렌더링 분기
    if (adminCurrentViewMode === "gallery") {
      renderAdminSubmissionsGallery();
    } else {
      renderAdminSubmissionsTable();
    }
  } catch (globalErr) {
    console.error("Global admin fetch error:", globalErr);
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    
    // Reset to empty
    adminAllSubmissions = [];
    renderAdminKPIs();
    renderAdminContestCards();
    
    if (adminCurrentViewMode === "gallery") {
      renderAdminSubmissionsGallery();
    } else {
      renderAdminSubmissionsTable();
    }
  }
}

// 6. Deduplicate helper: returns latest 1 per student per contest
function deduplicateSubmissions(submissions) {
  const map = new Map();
  submissions.forEach(entry => {
    const studentKey = entry.studentUsername ? entry.studentUsername.toLowerCase() : (entry.studentName ? entry.studentName.toLowerCase() : "");
    const key = `${studentKey}_${entry.contestId}`;
    if (studentKey) {
      const existing = map.get(key);
      if (!existing || parseKoreanDate(entry.timestamp) > parseKoreanDate(existing.timestamp)) {
        map.set(key, entry);
      }
    } else {
      map.set(entry.id, entry);
    }
  });
  return Array.from(map.values());
}

// 7. Render Contest Control Cards (1x6 Grid Layout & Simple Switch)
function renderAdminContestCards() {
  const container = document.getElementById("admin-contest-cards");
  if (!container) return;

  const locks = contestLocks;
  const deduped = deduplicateSubmissions(adminAllSubmissions);
  const contestEmojis = { keyring: "🔑", cuttoon: "📰", library: "📚", transcription: "✍️", pixelart: "🎮", sound_album: "🎵" };
  
  // Custom colors and glows
  const brandGlows = {
    keyring: { color: "rgba(59, 130, 246, 0.4)", rgb: "59, 130, 246" },
    cuttoon: { color: "rgba(16, 185, 129, 0.4)", rgb: "16, 185, 129" },
    library: { color: "rgba(139, 92, 246, 0.4)", rgb: "139, 92, 246" },
    transcription: { color: "rgba(245, 158, 11, 0.4)", rgb: "245, 158, 11" },
    pixelart: { color: "rgba(236, 72, 153, 0.4)", rgb: "236, 72, 153" },
    sound_album: { color: "rgba(168, 85, 247, 0.4)", rgb: "168, 85, 247" }
  };

  let html = "";
  const contestIds = ["keyring", "cuttoon", "library", "transcription", "pixelart", "sound_album"];
  contestIds.forEach(cId => {
    const contest = CONTESTS_DATA.find(c => c.id === cId);
    const count = deduped.filter(s => s.contestId === cId).length;
    
    // 오직 수동 잠금(locks[cId] === true) 여부에 의해서만 마감(locked) 스타일 결정
    const isLocked = locks[cId] === true;

    const isSelected = adminCurrentContestFilter === cId;
    const glow = brandGlows[cId] || { color: "rgba(255,255,255,0.08)", rgb: "255,255,255" };
    const ledColor = `rgb(${glow.rgb})`;
    html += `
      <div class="admin-contest-card ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}" 
           data-contest="${cId}" 
           style="--glow-color: ${glow.color}; --glow-rgb: ${glow.rgb}; display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 6px 10px; gap: 6px; min-width: 0;">
        <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; min-width: 0; flex-grow: 1;">
          <span class="admin-led-dot ${!isLocked ? 'active' : ''}" style="--led-color: ${ledColor};"></span>
          <span style="font-weight: 700; font-size: 0.75rem; display: flex; align-items: center; gap: 3px; min-width: 0; color: var(--text-primary, #ffffff);">
            <span style="flex-shrink: 0;">${contestEmojis[cId] || ''}</span>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${contest ? contest.title.substring(0, 6) : cId}</span>
          </span>
          <span style="font-size: 0.68rem; color: var(--text-secondary, #909099); font-weight: 600; flex-shrink: 0;">
            (${count})
          </span>
        </div>
        <button class="admin-btn-status-control ${!isLocked ? 'active' : 'locked'}" 
                onclick="event.stopPropagation(); toggleContestLock('${cId}')"
                style="flex-shrink: 0;">
          ${!isLocked ? '🟢 접수중' : '🔒 마감됨'}
        </button>
      </div>
    `;
  });

  container.innerHTML = html;

  // Add click to card -> filter toggle
  container.querySelectorAll(".admin-contest-card").forEach(card => {
    card.addEventListener("click", () => {
      const targetContest = card.dataset.contest;
      if (adminCurrentContestFilter === targetContest) {
        adminCurrentContestFilter = "all"; // toggle off
      } else {
        adminCurrentContestFilter = targetContest;
      }
      renderAdminContestCards();
      
      if (adminCurrentViewMode === "gallery") {
        renderAdminSubmissionsGallery();
      } else {
        renderAdminSubmissionsTable();
      }
    });
  });
}

// 8. Toggle Contest Lock (Manual Locking)
window.toggleContestLock = async function(cId) {
  const nextStatus = !contestLocks[cId];
  showToast("접수 상태 변경 중...", "info");
  
  if (GOOGLE_SHEET_API_URL) {
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify({
          action: "updateContestLock",
          contestId: cId,
          isLocked: nextStatus
        })
      });
      const result = await response.json();
      if (result.status === "success") {
        contestLocks[cId] = nextStatus;
        showToast("공모전 접수 제어 상태가 실시간 연계 변경되었습니다.", "success");
      } else {
        showToast("제어 상태 변경에 실패했습니다: " + result.message, "error");
        return;
      }
    } catch (e) {
      console.error(e);
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
      return;
    }
  } else {
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    return;
  }

  // Refresh Admin Grid
  renderAdminContestCards();
  
  if (adminCurrentViewMode === "gallery") {
    renderAdminSubmissionsGallery();
  } else {
    renderAdminSubmissionsTable();
  }
  
  if (typeof renderContestGrid === "function") {
    renderContestGrid();
  }
};

// 8-3. Render Data Gallery
function renderAdminSubmissionsGallery() {
  const container = document.getElementById("admin-gallery-list");
  if (!container) return;

  // Filter logic (same as Table View)
  let filtered = deduplicateSubmissions(adminAllSubmissions);

  // Contest filter
  if (adminCurrentContestFilter !== "all") {
    filtered = filtered.filter(entry => entry.contestId === adminCurrentContestFilter);
  }

  // Two-Tier Class/Grade filter
  if (adminCurrentGradeFilter !== "all") {
    filtered = filtered.filter(entry => parseInt(entry.studentGrade, 10) === parseInt(adminCurrentGradeFilter, 10));
    if (adminCurrentClassOnlyFilter !== "all") {
      filtered = filtered.filter(entry => parseInt(entry.studentClass, 10) === parseInt(adminCurrentClassOnlyFilter, 10));
    }
  }

  // Search filter
  if (adminSearchQuery !== "") {
    filtered = filtered.filter(entry => {
      const name = entry.studentName ? entry.studentName.toLowerCase() : "";
      const username = entry.studentUsername ? entry.studentUsername.toLowerCase() : "";
      const textVal = (entry.data && entry.data.text) ? entry.data.text.toLowerCase() : "";
      const descVal = (entry.data && entry.data.description) ? entry.data.description.toLowerCase() : "";
      return name.includes(adminSearchQuery) || username.includes(adminSearchQuery) || textVal.includes(adminSearchQuery) || descVal.includes(adminSearchQuery);
    });
  }

  // Star filter
  if (adminStarFilter === "starred") {
    filtered = filtered.filter(entry => entry.data && entry.data.isStarred === true);
  }

  // Prize filter
  if (adminPrizeFilter === "waiting") {
    filtered = filtered.filter(entry => !entry.data || entry.data.prizeStatus !== "delivered");
  } else if (adminPrizeFilter === "delivered") {
    filtered = filtered.filter(entry => entry.data && entry.data.prizeStatus === "delivered");
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--text-secondary);">
        조건에 맞는 제출 작품이 없습니다.
      </div>
    `;
    
    // Clean up "load more" button if any
    const existingMore = document.getElementById("admin-gallery-more-btn-wrapper");
    if (existingMore) existingMore.remove();
    return;
  }

  const totalCount = filtered.length;
  filtered = filtered.slice(0, adminGalleryCurrentLimit);

  const contestEmojis = { keyring: "🔑", cuttoon: "📰", library: "📚", transcription: "✍️", pixelart: "🎮", sound_album: "🎵" };
  const contestColors = {
    keyring: "#3b82f6",
    cuttoon: "#10b981",
    library: "#8b5cf6",
    transcription: "#f59e0b",
    pixelart: "#ec4899",
    sound_album: "#a855f7"
  };

  let html = "";
  filtered.forEach(entry => {
    const isStarred = entry.data && entry.data.isStarred === true;
    const color = contestColors[entry.contestId] || "#ffffff";
    const emoji = contestEmojis[entry.contestId] || "🎨";
    
    // Resolve Image URL & Convert Google Drive Links (Fix broken alt image issue)
    let imageUrl = entry.data && entry.data.image ? entry.data.image : "";
    if (imageUrl && imageUrl.includes("drive.google.com")) {
      imageUrl = getGoogleDriveDirectLink(imageUrl);
    }

    // Media preview resolver
    let thumbHtml = "";
    let isImage = false;
    if (imageUrl) {
      thumbHtml = `<img class="admin-gallery-thumb" src="${imageUrl}" alt="${entry.studentName} 작품" loading="lazy">`;
      isImage = true;
    } else if (entry.data && entry.data.text) {
      thumbHtml = `<div class="admin-gallery-text-placeholder">"${entry.data.text}"</div>`;
    } else if (entry.contestId === "sound_album") {
      thumbHtml = `
        <div class="admin-gallery-audio-placeholder">
          <span class="admin-gallery-audio-icon">🎵</span>
          <span style="font-size:0.65rem; color: #a855f7; font-weight:800;">오디오 앨범 출품작</span>
        </div>
      `;
    } else {
      thumbHtml = `
        <div class="admin-gallery-audio-placeholder" style="color: #606066;">
          <span style="font-size:1.5rem;">🎨</span>
          <span style="font-size:0.65rem;">미디어 없음</span>
        </div>
      `;
    }

    const titleText = (entry.data && entry.data.title) ? entry.data.title : "";
    const displayDesc = titleText || (entry.data && entry.data.text ? entry.data.text : (entry.data && entry.data.description ? entry.data.description : ""));
    const isPrizeDelivered = entry.data && entry.data.prizeStatus === "delivered";

    html += `
      <div class="admin-gallery-card ${isStarred ? 'starred' : ''}" data-id="${entry.id}">
        <div class="admin-gallery-thumb-wrapper" 
             ${isImage ? `onclick="openImageModal('${imageUrl}')" style="cursor: zoom-in;"` : 'style="cursor: default;"'}>
          ${thumbHtml}
        </div>
        <div class="admin-gallery-info">
          <div class="admin-gallery-meta-top">
            <span class="admin-gallery-contest-badge" style="border-left: 3px solid ${color};">
              ${emoji} ${entry.contestTitle || entry.contestId}
            </span>
            <span class="admin-gallery-date">${entry.timestamp ? entry.timestamp.substring(5, 16) : ''}</span>
          </div>
          <div class="admin-gallery-student">
            ${entry.studentName}
            <span>${entry.studentGrade}학년 ${entry.studentClass}반 ${entry.studentNumber}번</span>
          </div>
          
          ${displayDesc ? `<p style="margin:4px 0 0 0; font-size:0.68rem; color: var(--text-secondary); display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical; overflow:hidden; line-height:1.4;">${displayDesc}</p>` : ''}
          
          <div class="admin-gallery-actions">
            <!-- 사은품 지급 토글 -->
            <button class="action-btn prize-btn ${isPrizeDelivered ? 'active' : ''}" onclick="toggleAdminPrize('${entry.id}')" title="사은품 지급 토글" style="background: none; border: none; opacity: ${isPrizeDelivered ? '1' : '0.35'}; filter: ${isPrizeDelivered ? 'none' : 'grayscale(100%)'}; cursor: pointer; padding: 4px; font-size: 0.95rem; transition: all 0.2s ease; margin-right: 6px;">
              🎁
            </button>
            <!-- 별표 후보 등록 -->
            <button class="action-btn star-btn" onclick="toggleAdminStar('${entry.id}')" title="심사 후보 지정/해제" style="background: none; border: none; color: ${isStarred ? '#fbbf24' : '#606066'}; cursor: pointer; padding: 4px; font-size: 0.95rem;">
              ${isStarred ? '★' : '☆'}
            </button>
            <!-- 개별 평가 버튼 -->
            <button class="admin-btn-action" onclick="openAdminEvalModal('${entry.id}')" title="상세 평가" style="padding: 3px 6px; font-size: 0.65rem; border-radius: 4px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: white; cursor: pointer;">
              🔍 보기
            </button>
            <!-- 삭제 버튼 -->
            <button class="admin-btn-action" onclick="deleteSubmissionByAdmin('${entry.id}')" title="삭제" style="padding: 3px 6px; font-size: 0.65rem; border-radius: 4px; background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.2); color: #f43f5e; cursor: pointer;">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // 더보기 버튼 제어
  const wrapper = document.getElementById("admin-gallery-view-wrapper");
  if (wrapper) {
    const existingMore = document.getElementById("admin-gallery-more-btn-wrapper");
    if (existingMore) existingMore.remove();

    if (totalCount > adminGalleryCurrentLimit) {
      const moreBtnWrapper = document.createElement("div");
      moreBtnWrapper.id = "admin-gallery-more-btn-wrapper";
      moreBtnWrapper.style.display = "flex";
      moreBtnWrapper.style.justifyContent = "center";
      moreBtnWrapper.style.padding = "20px 0";
      moreBtnWrapper.innerHTML = `
        <button class="btn btn-secondary" onclick="loadMoreAdminGallery()" style="display: flex; align-items: center; gap: 6px; font-weight: 800; cursor: pointer; padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white;">
          더보기 ➕ (${filtered.length} / ${totalCount}개 노출 중)
        </button>
      `;
      wrapper.appendChild(moreBtnWrapper);
    }
  }
}

// 더보기 로드 함수
window.loadMoreAdminGallery = function() {
  adminGalleryCurrentLimit += 24;
  renderAdminSubmissionsGallery();
};

// 9. Toggle Star Marking
window.toggleAdminStar = async function(submissionId) {
  const entry = adminAllSubmissions.find(s => s.id === submissionId);
  if (!entry) return;

  if (!entry.data) entry.data = {};
  const nextStarred = !entry.data.isStarred;

  showToast("별표 상태 업데이트 중...", "info");

  if (GOOGLE_SHEET_API_URL) {
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify({
          action: "updateSubmissionStarStatus",
          id: submissionId,
          isStarred: nextStarred
        })
      });
      const result = await response.json();
      if (result.status === "success") {
        entry.data.isStarred = nextStarred;
        showToast("별표 상태가 업데이트되었습니다.", "success");
      } else {
        showToast("별표 업데이트 실패: " + result.message, "error");
        return;
      }
    } catch (e) {
      console.error(e);
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
      return;
    }
  } else {
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    return;
  }

  renderAdminKPIs(); // Refresh sidebar count
  if (adminCurrentViewMode === "gallery") {
    renderAdminSubmissionsGallery();
  } else {
    renderAdminSubmissionsTable();
  }
};

// 9-2. Toggle Prize Delivered Marking
window.toggleAdminPrize = async function(submissionId) {
  const entry = adminAllSubmissions.find(s => s.id === submissionId);
  if (!entry) return;

  if (!entry.data) entry.data = {};
  const currentStatus = entry.data.prizeStatus === "delivered" ? "waiting" : "delivered";
  
  showToast("사은품 상태 업데이트 중...", "info");

  if (GOOGLE_SHEET_API_URL) {
    const payload = {
      action: "updateSubmissionPrizeStatus",
      id: submissionId,
      prizeStatus: currentStatus
    };
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.status === "success") {
        entry.data.prizeStatus = currentStatus;
        showToast("사은품 지급 상태가 업데이트되었습니다.", "success");
      } else {
        showToast("업데이트 실패: " + result.message, "error");
        return;
      }
    } catch (err) {
      console.error("API prize update network error:", err);
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
      return;
    }
  } else {
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    return;
  }

  const cardEl = document.querySelector(`.admin-gallery-card[data-id="${submissionId}"]`);
  if (cardEl) {
    const btn = cardEl.querySelector(".prize-btn");
    if (btn) {
      btn.classList.add("active");
      setTimeout(() => btn.classList.remove("active"), 500);
    }
  }
  renderAdminKPIs();
  renderAdminSubmissionsGallery();
};

// 10. Render Submissions (Redirect function to maintain API compatibility)
function renderAdminSubmissionsTable() {
  renderAdminSubmissionsGallery();
}

// 11. Export to CSV (Deduplicated, correct URLs, Base64 filter protection, 7 Columns)
function exportSubmissionsToCSV() {
  let filtered = deduplicateSubmissions(adminAllSubmissions);

  // Contest filter
  if (adminCurrentContestFilter !== "all") {
    filtered = filtered.filter(entry => entry.contestId === adminCurrentContestFilter);
  }

  // Two-Tier Grade filter
  if (adminCurrentGradeFilter !== "all") {
    filtered = filtered.filter(entry => parseInt(entry.studentGrade, 10) === parseInt(adminCurrentGradeFilter, 10));
    if (adminCurrentClassOnlyFilter !== "all") {
      filtered = filtered.filter(entry => parseInt(entry.studentClass, 10) === parseInt(adminCurrentClassOnlyFilter, 10));
    }
  }

  // Star filter
  if (adminStarFilter === "starred") {
    filtered = filtered.filter(entry => entry.data && entry.data.isStarred === true);
  }

  // Prize filter
  if (adminPrizeFilter === "waiting") {
    filtered = filtered.filter(entry => !entry.data || entry.data.prizeStatus !== "delivered");
  } else if (adminPrizeFilter === "delivered") {
    filtered = filtered.filter(entry => entry.data && entry.data.prizeStatus === "delivered");
  }

  if (filtered.length === 0) {
    showToast("조건에 맞는 심사 데이터가 없습니다.", "error");
    return;
  }

  let csvContent = "";
  const headers = ["학년", "반", "번호", "이름", "공모전명", "작품URL", "상세내용/감상글", "사은품 지급"];
  csvContent += headers.map(h => `"${h}"`).join(",") + "\n";

  filtered.forEach(entry => {
    const contest = CONTESTS_DATA.find(c => c.id === entry.contestId);
    const contestTitle = contest ? contest.title : entry.contestId;
    
    // Choose correct submission media URL based on contest type
    let workUrl = "";
    let descriptionText = "";

    if (entry.contestId === "sound_album") {
      workUrl = entry.data && entry.data.audio ? entry.data.audio : "";
      descriptionText = entry.data && entry.data.description ? entry.data.description : "";
    } else {
      workUrl = entry.data && entry.data.image ? entry.data.image : "";
      
      // Map texts
      if (entry.contestId === "library") {
        descriptionText = entry.data ? `[도서명: ${entry.data["book-title"] || ""}] ${entry.data["comment"] || ""}` : "";
      } else if (entry.data && entry.data.text) {
        descriptionText = entry.data.text;
      }
    }

    // Google drive direct link convert
    if (workUrl && workUrl.includes("drive.google.com")) {
      workUrl = getGoogleDriveDirectLink(workUrl);
    }

    // Base64 explosion filter protection
    if (workUrl && workUrl.startsWith("data:")) {
      workUrl = "(로컬 백업 - 파일 URL 없음)";
    }

    const isPrizeDelivered = entry.data && entry.data.prizeStatus === "delivered";
    const row = [
      entry.studentGrade || "",
      entry.studentClass || "",
      entry.studentNumber || "",
      entry.studentName || "",
      contestTitle,
      workUrl,
      descriptionText,
      isPrizeDelivered ? "지급 완료" : "대기 중"
    ];

    csvContent += row.map(cell => `"${(cell || "").toString().replace(/"/g, '""').replace(/\r?\n/g, " ")}"`).join(",") + "\n";
  });

  const bom = "\ufeff";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const filename = `소로초_공모전_심사자료_${adminCurrentContestFilter}_${new Date().toLocaleDateString("ko-KR").replace(/\s/g, "")}.csv`;
  
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`${filtered.length}건의 고품격 심사 데이터가 내보내기 되었습니다!`, "success");
}

// 12. Download original file
window.downloadAdminPostcard = async function(url, filename) {
  if (!url) return;
  showToast("파일 다운로드를 시작합니다...", "info");
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error("CORS fetch failed");
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `소로_${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    showToast("파일이 성공적으로 다운로드되었습니다!", "success");
  } catch (err) {
    window.open(url, "_blank");
    showToast("브라우저 보안으로 인해 새 창에서 열었습니다. 마우스 우클릭으로 저장해 주세요.", "warning");
  }
};

// 13. Delete submission
window.deleteSubmissionByAdmin = async function(id, contestId) {
  if (!confirm("⚠️ 이 출품 작품을 정말로 영구 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) return;

  showToast("출품작 영구 삭제 처리 중...", "info");

  if (GOOGLE_SHEET_API_URL) {
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify({ action: "deleteSubmission", id: id })
      });
      const result = await response.json();

      if (result.status === "error") {
        showToast(result.message, "error");
        return;
      }

      // Remove from memory array
      const targetEntry = adminAllSubmissions.find(s => s.id === id);
      if (targetEntry) {
        const username = targetEntry.studentUsername;
        const cId = targetEntry.contestId;
        
        // Remove all submissions by this student for this contest
        adminAllSubmissions = adminAllSubmissions.filter(s => 
          !(s.studentUsername.toLowerCase() === username.toLowerCase() && s.contestId === cId)
        );
      } else {
        // Fallback: remove only by ID
        adminAllSubmissions = adminAllSubmissions.filter(s => s.id !== id);
      }



      renderAdminKPIs(); // Refresh stats
      renderAdminContestCards();
      renderAdminSubmissionsTable();
      showToast("출품작이 영구 삭제되었습니다.", "success");

    } catch (err) {
      console.error("Remote delete failed:", err);
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    }
  } else {
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
  }
};

// 젭퀴즈 대시보드 전역 상태 변수
let adminCurrentTabMode = "contest"; // "contest" | "zepquiz"
let zepQuizClassesData = null; // 원격에서 가져온 젭퀴즈 데이터 저장용
let currentDrilldownClassKey = null;

// 듀얼 모드 탭 전환 함수
window.setAdminTabMode = function(mode) {
  adminCurrentTabMode = mode;
  
  const tabContest = document.getElementById("btn-tab-contest");
  const tabZepQuiz = document.getElementById("btn-tab-zepquiz");
  
  const kpiContest = document.getElementById("admin-contest-kpi-section");
  const kpiZepQuiz = document.getElementById("admin-zepquiz-kpi-section");
  
  const metricsContest = document.getElementById("admin-contest-grade-metrics");
  const metricsZepQuiz = document.getElementById("admin-zepquiz-grade-metrics");
  
  const mainContest = document.getElementById("admin-contest-main-area");
  const mainZepQuiz = document.getElementById("admin-zepquiz-main-area");
  
  // 탭 버튼 active 스타일 전환
  if (mode === "contest") {
    if (tabContest) {
      tabContest.classList.add("active");
      tabContest.style.color = "white";
    }
    if (tabZepQuiz) {
      tabZepQuiz.classList.remove("active");
      tabZepQuiz.style.color = "#808088";
    }
    
    if (kpiContest) kpiContest.style.display = "block";
    if (kpiZepQuiz) kpiZepQuiz.style.display = "none";
    
    if (metricsContest) metricsContest.style.display = "block";
    if (metricsZepQuiz) metricsZepQuiz.style.display = "none";
    
    if (mainContest) mainContest.style.display = "block";
    if (mainZepQuiz) mainZepQuiz.style.display = "none";
    
    // 테마 속성 해제
    document.body.removeAttribute("data-admin-mode");
    
    // 기존 공모전 데이터 렌더링
    renderAdminKPIs();
    renderAdminContestCards();
    if (adminCurrentViewMode === "gallery") {
      renderAdminSubmissionsGallery();
    } else {
      renderAdminSubmissionsTable();
    }
  } else {
    if (tabContest) {
      tabContest.classList.remove("active");
      tabContest.style.color = "#808088";
    }
    if (tabZepQuiz) {
      tabZepQuiz.classList.add("active");
      tabZepQuiz.style.color = "white";
    }
    
    if (kpiContest) kpiContest.style.display = "none";
    if (kpiZepQuiz) kpiZepQuiz.style.display = "block";
    
    if (metricsContest) metricsContest.style.display = "none";
    if (metricsZepQuiz) metricsZepQuiz.style.display = "block";
    
    if (mainContest) mainContest.style.display = "none";
    if (mainZepQuiz) mainZepQuiz.style.display = "block";
    
    // 젭퀴즈 테마 속성 설정
    document.body.setAttribute("data-admin-mode", "zepquiz");
    
    // 젭퀴즈 데이터 로드 및 렌더링
    fetchZepQuizDataAndRender();
  }
};

// 젭퀴즈 데이터 로드 및 렌더러
async function fetchZepQuizDataAndRender() {
  const classGrid = document.getElementById("admin-zep-class-grid");
  if (!classGrid) return;
  
  classGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: var(--text-secondary);">
      <div class="spinner" style="margin: 0 auto 12px auto;"></div>
      <p style="font-weight: 800; color: var(--text-primary);">원격 젭퀴즈 달성 데이터를 수집하는 중...</p>
    </div>
  `;
  
  closeZepDrilldown();
  
  if (!GOOGLE_SHEET_API_URL) {
    classGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--error-color); font-weight: 800;">
        ⚠️ 원격 API 주소가 설정되지 않았습니다.
      </div>
    `;
    return;
  }
  
  try {
    const response = await fetch(GOOGLE_SHEET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify({ action: "getZepQuizStats", roundId: "zepquiz" })
    });
    
    const result = await response.json();
    if (result.status === "success" && result.classes) {
      zepQuizClassesData = result.classes;
      renderZepQuizKPIs();
      renderZepQuizGradeMetrics();
      renderZepQuizClassGrid();
      showToast("젭퀴즈 현황 원격 동기화 완료!", "success");
    } else {
      classGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--error-color); font-weight: 800;">
          ⚠️ 데이터 수집 실패: ${result.message || "알 수 없는 에러"}
        </div>
      `;
    }
  } catch (err) {
    console.error("fetchZepQuizDataAndRender error:", err);
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    classGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--error-color); font-weight: 800;">
        ⚠️ 네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.
      </div>
    `;
  }
}

function renderZepQuizKPIs() {
  if (!zepQuizClassesData) return;
  
  let totalSubmitted = 0;
  let totalStudents = 0;
  let completedClassesCount = 0;
  let totalClassesCount = 0;
  let deliveredCookiesClassesCount = 0;
  
  for (const classKey in zepQuizClassesData) {
    const cls = zepQuizClassesData[classKey];
    totalSubmitted += cls.completedCount;
    totalStudents += cls.totalStudents;
    totalClassesCount++;
    
    if (cls.totalStudents > 0 && cls.completedCount === cls.totalStudents) {
      completedClassesCount++;
    }
    
    if (cls.prizeStatus === "delivered") {
      deliveredCookiesClassesCount++;
    }
  }
  
  const pct = totalStudents > 0 ? Math.round((totalSubmitted / totalStudents) * 100) : 0;
  
  const totalEl = document.getElementById("admin-zep-stat-total");
  const ratioEl = document.getElementById("admin-zep-stat-ratio");
  const classesEl = document.getElementById("admin-zep-stat-classes");
  const cookiesEl = document.getElementById("admin-zep-stat-cookies");
  
  if (totalEl) totalEl.textContent = totalSubmitted;
  if (ratioEl) ratioEl.textContent = pct + "%";
  if (classesEl) classesEl.textContent = `${completedClassesCount}/${totalClassesCount}`;
  if (cookiesEl) cookiesEl.textContent = deliveredCookiesClassesCount;
}

function renderZepQuizGradeMetrics() {
  const container = document.getElementById("admin-zep-grade-metrics-container");
  if (!container || !zepQuizClassesData) return;
  
  const grades = [3, 4, 5, 6];
  let gradeSubmitted = { 3: 0, 4: 0, 5: 0, 6: 0 };
  let gradeStudents = { 3: 0, 4: 0, 5: 0, 6: 0 };
  
  for (const classKey in zepQuizClassesData) {
    const cls = zepQuizClassesData[classKey];
    const g = cls.grade;
    if (grades.includes(g)) {
      gradeSubmitted[g] += cls.completedCount;
      gradeStudents[g] += cls.totalStudents;
    }
  }
  
  let html = "";
  grades.forEach(g => {
    const sub = gradeSubmitted[g];
    const tot = gradeStudents[g];
    const pct = tot > 0 ? Math.round((sub / tot) * 100) : 0;
    
    html += `
      <div class="admin-grade-bar-item" style="cursor: default;">
        <div class="admin-grade-bar-label">
          <span>${g}학년</span>
          <span>${sub}/${tot}명 (${pct}%)</span>
        </div>
        <div class="admin-grade-bar-track" style="background: rgba(245, 158, 11, 0.15);">
          <div class="admin-grade-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #f59e0b, #d97706);"></div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function renderZepQuizClassGrid() {
  const classGrid = document.getElementById("admin-zep-class-grid");
  if (!classGrid || !zepQuizClassesData) return;
  
  let html = "";
  const sortedKeys = Object.keys(zepQuizClassesData).sort((a, b) => {
    const [aG, aC] = a.split("-").map(Number);
    const [bG, bC] = b.split("-").map(Number);
    if (aG !== bG) return aG - bG;
    return aC - bC;
  });
  
  sortedKeys.forEach(classKey => {
    const cls = zepQuizClassesData[classKey];
    const is100Pct = cls.totalStudents > 0 && cls.completedCount === cls.totalStudents;
    const isPrizeDelivered = cls.prizeStatus === "delivered";
    const pct = cls.totalStudents > 0 ? Math.round((cls.completedCount / cls.totalStudents) * 100) : 0;
    
    const cookieBtnClass = is100Pct ? "zep-cookie-btn active" : "zep-cookie-btn disabled";
    const cookieText = isPrizeDelivered ? "🍪 지급완료" : "🍪 지급하기";
    
    const cardBorderColor = isPrizeDelivered 
      ? "border: 1px solid rgba(236, 72, 153, 0.4); box-shadow: 0 4px 16px rgba(236, 72, 153, 0.08);" 
      : (is100Pct ? "border: 1px solid rgba(16, 185, 129, 0.4); box-shadow: 0 4px 16px rgba(16, 185, 129, 0.08);" : "");
      
    html += `
      <div class="admin-zep-class-card" onclick="openZepDrilldown('${cls.grade}', '${cls.classNum}')" style="${cardBorderColor}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: white;">${cls.grade}학년 ${cls.classNum}반</h3>
          <span style="font-size: 0.72rem; color: #a0a0aa; font-weight: 700;">
            ${cls.completedCount}/${cls.totalStudents}명 (${pct}%)
          </span>
        </div>
        
        <div class="zepquiz-gauge-track" style="margin-bottom: 16px;">
          <div class="zepquiz-gauge-fill" style="width: ${pct}%;"></div>
        </div>
        
        <div style="display: flex; justify-content: flex-end;">
          <button class="${cookieBtnClass} ${isPrizeDelivered ? 'delivered' : ''}" 
                  onclick="event.stopPropagation(); toggleZepClassCookie('${cls.grade}', '${cls.classNum}')" 
                  ${!is100Pct ? 'disabled' : ''}>
            ${cookieText}
          </button>
        </div>
      </div>
    `;
  });
  
  classGrid.innerHTML = html;
}

window.openZepDrilldown = function(grade, classNum) {
  const drilldownArea = document.getElementById("admin-zep-drilldown-area");
  const drilldownTitle = document.getElementById("admin-zep-drilldown-title");
  const drilldownList = document.getElementById("admin-zep-drilldown-list");
  
  if (!drilldownArea || !drilldownTitle || !drilldownList || !zepQuizClassesData) return;
  
  const classKey = `${grade}-${classNum}`;
  currentDrilldownClassKey = classKey;
  
  const cls = zepQuizClassesData[classKey];
  if (!cls) return;
  
  drilldownTitle.innerHTML = `
    <span>🍪 ${grade}학년 ${classNum}반 상세 현황</span>
    <span style="font-size: 0.72rem; color: #a0a0aa; font-weight: 600; margin-left: 8px;">
      (완료 ${cls.completedCount}명 / 미완료 ${cls.totalStudents - cls.completedCount}명)
    </span>
  `;
  
  let html = "";
  if (cls.students.length === 0) {
    html = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--text-secondary);">
        해당 반에 가입된 학생이 없습니다.
      </div>
    `;
  } else {
    cls.students.forEach(student => {
      const completed = student.completed;
      let imageUrl = student.image;
      if (imageUrl && imageUrl.includes("drive.google.com")) {
        imageUrl = getGoogleDriveDirectLink(imageUrl);
      }
      
      let mediaHtml = "";
      if (completed && imageUrl) {
        mediaHtml = `
          <div class="admin-zep-student-thumb-wrapper" onclick="event.stopPropagation(); openImageModal('${imageUrl}')" style="cursor: zoom-in; margin-top: 6px; width: 100%; height: 120px; overflow: hidden; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);">
            <img src="${imageUrl}" alt="인증샷" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        `;
      } else if (completed) {
        mediaHtml = `
          <div class="admin-zep-student-thumb-wrapper" style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); color: #808088; font-size: 0.65rem; border-radius: 6px; border: 1px dashed rgba(255,255,255,0.1); margin-top: 6px; width: 100%; height: 120px;">
            이미지 없음
          </div>
        `;
      }
      
      const badgeClass = completed ? "zep-badge completed" : "zep-badge missing";
      const badgeText = completed ? "✅ 완료" : "❌ 미제출";
      const timestampText = completed && student.timestamp ? student.timestamp.substring(5, 16) : "";
      
      const cardBg = completed ? "rgba(16, 185, 129, 0.03)" : "rgba(244, 63, 94, 0.02)";
      const cardBorder = completed ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.08)";
      
      html += `
        <div class="admin-zep-student-card" style="background: ${cardBg}; border: 1px solid ${cardBorder}; padding: 12px; border-radius: 8px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 800; color: white; font-size: 0.8rem;">
              ${student.number}번 ${student.name}
            </span>
            <span class="${badgeClass}">${badgeText}</span>
          </div>
          
          <div style="font-size: 0.68rem; color: #808088;">
            아이디: ${student.username}
          </div>
          
          ${mediaHtml}
          
          ${timestampText ? `
            <div style="font-size: 0.62rem; color: #606066; text-align: right; margin-top: auto;">
              제출: ${timestampText}
            </div>
          ` : ''}
        </div>
      `;
    });
  }
  
  drilldownList.innerHTML = html;
  drilldownArea.style.display = "block";
  
  drilldownArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.closeZepDrilldown = function() {
  const drilldownArea = document.getElementById("admin-zep-drilldown-area");
  if (drilldownArea) {
    drilldownArea.style.display = "none";
  }
  currentDrilldownClassKey = null;
};

window.toggleZepClassCookie = async function(grade, classNum) {
  const classKey = `${grade}-${classNum}`;
  if (!zepQuizClassesData || !zepQuizClassesData[classKey]) return;
  
  const cls = zepQuizClassesData[classKey];
  const is100Pct = cls.totalStudents > 0 && cls.completedCount === cls.totalStudents;
  if (!is100Pct) {
    showToast("학급 인원 100% 완료 시에만 과자 지급 처리가 가능합니다.", "warning");
    return;
  }
  
  const currentStatus = cls.prizeStatus;
  const nextStatus = currentStatus === "delivered" ? "waiting" : "delivered";
  
  showToast("학급 과자 지급 상태 업데이트 중...", "info");
  
  if (GOOGLE_SHEET_API_URL) {
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: JSON.stringify({
          action: "updateClassPrizeStatus",
          roundId: "zepquiz",
          classKey: classKey,
          prizeStatus: nextStatus
        })
      });
      
      const result = await response.json();
      if (result.status === "success") {
        cls.prizeStatus = nextStatus;
        showToast(`${grade}학년 ${classNum}반 과자 지급 상태가 업데이트되었습니다.`, "success");
        
        if (nextStatus === "delivered") {
          spawnCookieParticles();
        }
        
        renderZepQuizKPIs();
        renderZepQuizClassGrid();
        
        if (currentDrilldownClassKey === classKey) {
          openZepDrilldown(grade, classNum);
        }
      } else {
        showToast("과자 지급 업데이트 실패: " + result.message, "error");
      }
    } catch (err) {
      console.error(err);
      showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
    }
  } else {
    showToast("네트워크 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.", "error");
  }
};

function spawnCookieParticles() {
  const emojis = ["🍪", "✨", "🎉", "🍪"];
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement("div");
    p.className = "cookie-particle";
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    p.style.left = Math.random() * window.innerWidth + "px";
    p.style.top = "-20px";
    p.style.animationDelay = Math.random() * 0.5 + "s";
    p.style.animationDuration = 1.0 + Math.random() * 0.8 + "s";
    
    document.body.appendChild(p);
    
    p.addEventListener("animationend", () => {
      p.remove();
    });
  }
}

/*
========================================================================
[원클릭 연동] GOOGLE APPS SCRIPT 백엔드 소스코드 가이드라인 (드라이브 이미지 저장 기능 강화)
========================================================================
구글 스프레드시트를 생성하고 [확장 프로그램] -> [Apps Script]를 클릭한 뒤,
기존 코드를 모두 삭제하고 아래 코드를 복사해서 붙여넣으세요!

1. 스프레드시트에 "Users" 시트와 "Submissions" 시트를 각각 새 탭으로 추가해 주세요.
2. 아래 코드를 붙여넣은 뒤, 상단의 [배포] -> [새 배포]를 클릭합니다.
3. 유형 선택에서 [웹 앱]을 선택합니다.
4. 설명에 "SORO DB API" 입력 후, [액세스 권한이 있는 사용자]를 [모든 사용자(Anyone)]로 설정하고 배포합니다.
5. 배포 완료 시 생성되는 "웹 앱 URL"을 복사하여 본 app.js 파일의 최상단 'GOOGLE_SHEET_API_URL'에 붙여넣으세요.
※ 이 스크립트는 학생들이 업로드한 대용량 그림 파일(Base64)을 자동으로 본인 구글 드라이브의 "SORO_Submissions" 폴더에 저장하고, 시트에는 해당 이미지의 다운로드/뷰어 링크만 깔끔하게 저장하여 구글 시트의 셀 용량 제한(5만자) 에러를 방지하고 편리하게 관리할 수 있게 해줍니다.

====================== 복사할 Apps Script 코드 시작 ======================

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

    // 2.5. 비밀번호 초기화 액션 (Users 시트 수정)
    else if (requestData.action === "resetPassword") {
      var sheet = ss.getSheetByName("Users");
      var updated = false;
      
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
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
    
    // 6. 전체 작품 조회 액션 (Submissions 시트 - 갤러리 로딩용)
    else if (requestData.action === "getAllSubmissions") {
      var sheet = ss.getSheetByName("Submissions");
      var results = [];
      var filterContestId = requestData.contestId;
      
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
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

    // 8. 공모전 잠금 상태 조회 액션 (Settings 시트)
    else if (requestData.action === "getContestLocks") {
      var sheet = ss.getSheetByName("Settings");
      var locks = {};
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          var key = data[i][0];
          if (key.indexOf("contest_lock_") === 0) {
            var contestId = key.substring(13);
            locks[contestId] = (data[i][1] === "true" || data[i][1] === true);
          }
        }
      }
      response = { status: "success", data: locks };
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
      for (var i = 1; i < data.length; i++) {
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
        for (var i = 1; i < data.length; i++) {
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
      
      // 1. Settings 시트에서 학급 과자 지급 상태 로드
      var classPrizes = {};
      if (settingsSheet) {
        var settingsData = settingsSheet.getDataRange().getValues();
        for (var i = 1; i < settingsData.length; i++) {
          var key = settingsData[i][0];
          if (key.indexOf("zep_prize_" + roundId + "_") === 0) {
            var classKey = key.substring(("zep_prize_" + roundId + "_").length);
            classPrizes[classKey] = settingsData[i][1];
          }
        }
      }
      
      // 2. Users 시트에서 가입된 모든 학생 리스트 로드
      var users = [];
      if (usersSheet) {
        var usersData = usersSheet.getDataRange().getValues();
        for (var i = 1; i < usersData.length; i++) {
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
        for (var i = 1; i < subsData.length; i++) {
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
      
      // 4. 학급별 빈 통계 뼈대 생성 (3~6학년, 1~3반)
      var classes = {};
      for (var g = 3; g <= 6; g++) {
        for (var c = 1; c <= 3; c++) {
          var classKey = g + "-" + c;
          classes[classKey] = {
            grade: g,
            classNum: c,
            totalStudents: 0,
            completedCount: 0,
            prizeStatus: classPrizes[classKey] || "waiting",
            students: []
          };
        }
      }
      
      // 5. 학생 매칭
      for (var i = 0; i < users.length; i++) {
        var u = users[i];
        var classKey = u.grade + "-" + u.classNum;
        
        if (classes[classKey]) {
          classes[classKey].totalStudents++;
          
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
      for (var i = 1; i < data.length; i++) {
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
    
  } catch (error) {
    response = { status: "error", message: error.toString() };
  }
  
  // CORS 우회 응답 설정
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

====================== 복사할 Apps Script 코드 끝 ======================
*/
