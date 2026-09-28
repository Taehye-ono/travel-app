# BritRoute

4개 도시의 40개 장소를 바탕으로, 취향에 맞는 1~3일 영국 여행 일정을 만드는 한국어 웹앱입니다.

## 실행하기

Node.js 20.9 이상이 필요합니다. 이 프로젝트는 Node.js 24에서 확인했습니다.

Windows PowerShell에서 프로젝트 폴더를 열고 실행합니다. PowerShell의 스크립트 실행 정책과 관계없이 사용할 수 있도록 `npm.cmd`로 표기했습니다.

```powershell
npm.cmd ci
npm.cmd run dev
```

브라우저에서 <http://localhost:3000>을 엽니다. 이미 패키지가 설치되어 있으면 `npm.cmd run dev`만 실행하면 됩니다. macOS/Linux에서는 `npm.cmd` 대신 `npm`을 사용합니다.

API 키, Supabase 프로젝트, 환경변수 설정은 필요하지 않습니다.

## 사용 방법

1. 런던·에든버러·글래스고·카디프 중 한 도시를 고릅니다.
2. 여행 일수와 관심사, 여행 강도를 선택합니다.
3. 필요하면 꼭 가고 싶은 등록 장소를 선택합니다.
4. ‘여행 일정 만들기’를 누르고 날짜별 결과를 확인합니다.
5. ‘조건 수정하기’로 입력을 유지한 채 일정을 다시 만듭니다.

입력과 결과는 브라우저 메모리에만 유지됩니다. 새로고침하면 초기화됩니다. 실제 운영시간·이동시간은 반영하지 않으며, 같은 지역명을 가진 장소를 가능한 한 함께 배치합니다. 장소가 부족하면 중복 없이 부분 일정과 자유 일정을 표시합니다.

## 구성

| 파일 | 역할 |
| --- | --- |
| `app/planner.jsx` | 조건 입력, 요약, 결과 화면 |
| `app/globals.css` | Tailwind 기반 전역 스타일과 반응형 레이아웃 |
| `components/city-art.jsx` | 외부 이미지 요청이 없는 도시별 SVG 일러스트 |
| `lib/planner.mjs` | 입력 검증, 후보 선정, 날짜별 일정 배치 |
| `britroute_places.json` | 앱에서 사용하는 장소 원본 |
| `britroute_places.csv` | 검토·교환용 데이터 |
| `BRITROUTE_PLAN.md` | 상세 기획안 |
| `tests/` | 추천 규칙 및 브라우저 사용 흐름 검증 |

기술 구성은 Next.js App Router, React, Tailwind CSS, Lucide 아이콘입니다. 설정은 [Next.js 설치 문서](https://nextjs.org/docs/app/getting-started/installation)와 [Tailwind Next.js 설치 문서](https://tailwindcss.com/docs/installation/framework-guides/nextjs)를 참고했습니다.

## 데이터 수정

기존 장소 정보는 유지하고 JSON·CSV에 고유 `id`를 추가했습니다. 기존 장소의 이름이 바뀌어도 `id`는 유지하세요. JSON 수정 후 아래 명령으로 신규 장소 ID와 CSV를 동기화할 수 있습니다.

```powershell
node scripts/prepare-data.mjs
```

이 명령은 JSON과 CSV를 다시 씁니다. CSV에서만 수정한 내용은 보존되지 않으므로 앱 데이터 변경은 JSON을 기준으로 합니다. 도시를 추가하려면 도시 목록과 일러스트, 지원 범위도 함께 수정해야 합니다.

## 검증

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run test:ui
```

추천 테스트는 4개 도시 × 3개 일수 × 3개 강도 × 31개 관심사 조합(1,116개)을 순회해 필수 장소 포함, 중복 방지, 도시·관심사 필터, 하루 한도와 결과 재현성을 확인합니다. 브라우저 테스트는 Windows에 설치된 Microsoft Edge를 사용합니다. 다른 환경에서는 `playwright.config.mjs`의 브라우저 채널과 실행 명령을 조정해야 합니다.

## 배포 준비

Vercel에서 이 폴더를 Next.js 프로젝트로 연결하고 기본 빌드 명령 `npm run build`를 사용하면 됩니다. 별도 환경변수는 없습니다. 이 작업에서는 외부 공개 배포를 진행하지 않았습니다.
