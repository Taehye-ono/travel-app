# GitHub 업로드 전 보안 점검

점검일: 2026-09-28

## 결과

현재 업로드 대상인 소스·설정·데이터·문서 24개에서 공개를 막아야 할 비밀정보는 발견되지 않았다. 이는 아래 항목에 대한 파일 내용 검토와 정형 패턴 검사의 결과이며, 모든 종류의 비밀정보나 애플리케이션 취약점이 없다는 보장은 아니다.

- Supabase 키·JWT, GitHub 토큰, OpenAI/Stripe 키, AWS 액세스 키, Google API 키, npm/Slack 토큰, PEM 형식 개인키: 검출 없음.
- 문자열로 직접 지정한 API 키·토큰·비밀번호, 인증정보가 포함된 연결 URL, Bearer 토큰: 검출 없음.
- 업로드 대상의 이메일 주소, 한국 휴대전화 번호, 개인 홈 디렉터리 절대 경로: 검출 없음.
- `.env` 계열 파일이나 인증정보·개인키 파일: 현재 프로젝트에서 발견되지 않음.
- 생성물·로그의 텍스트 파일 275개도 대표적인 키·토큰·개인키 패턴을 검사했고 검출 없음.
- 최종 확인 시 프로젝트에는 Git 저장소가 있으나, 커밋과 추적 중인 파일은 없음. 점검할 기존 커밋 이력은 없었음.

전체 검사 대상 텍스트는 약 26 MB다. 설치된 외부 패키지(`node_modules`), 빌드·패키지 바이너리 캐시, 이미지·폰트 등 바이너리, Git 내부 데이터, 점검 작업용 `.local` 폴더는 내용 검사에서 제외했다. 이들은 업로드 대상에서도 제외된다. 의존성 취약점 진단, 외부 GitHub 저장소 및 프로젝트 폴더 밖에 저장된 키는 이번 점검 범위가 아니다.

## 적용한 수정

`.gitignore`에 아래 규칙을 보완했다. `.vercelignore`에도 해당 민감 파일·로컬 산출물 제외 규칙을 추가했다.

| 제외 대상 | 이유 |
| --- | --- |
| `.env*`, `.npmrc`, `.netrc`, `.auth/`, `.aws/`, `.ssh/`, `.vercel/` | 환경변수, 패키지 인증, 로그인 세션 또는 개인 계정 설정이 들어갈 수 있음 |
| `*.pem`, `*.key`, `*.p12`, `*.pfx`, 기본 SSH 개인키 이름 | 개인키나 개인키를 포함한 인증서 묶음이 들어갈 수 있음 |
| `credentials.json`, `credentials.*.json`, `service-account*.json`, `*-service-account.json` | 서비스 계정 및 인증정보 파일 |
| `backups/`, `dumps/`, `*.bak`, `*.db`, `*.sqlite`, `*.sqlite3` | 데이터·설정의 로컬 백업 |
| ZIP·7z·RAR·tar 계열 압축파일 | 내부에 제외 대상 파일이 함께 들어갈 수 있음 |
| `.idea/`, `.vscode/`, OS 메타데이터 | 개인 개발환경 설정 |
| `node_modules/`, `.next/`, `out/`, `dist/`, 캐시, 로그, 테스트 결과, 커버리지 | 재생성 가능한 로컬 산출물 |

`.env.example`은 기존 정책대로 예외다. 현재는 이 파일이 없으며, 나중에 만들 경우 실제 키 없이 변수명과 빈 값·명확한 예시 값만 넣어야 한다. 파일 이름만으로 모든 인증정보를 찾을 수는 없으므로 다른 이름의 파일에 비밀값을 넣지 않는다.

Git의 `check-ignore`로 민감 파일 예시가 제외되는지 확인했고, `git ls-files --others --exclude-standard`로 실제 업로드 후보에 `.next`, `.npm-cache`, `node_modules`, `test-results`, `.local`이 포함되지 않는 것도 확인했다. 추적 중인 파일은 없다.

## 올릴 파일

- `app/`, `components/`, `lib/`, `scripts/`, `tests/`
- `britroute_places.json`, `britroute_places.csv`
- `package.json`, **`package-lock.json`**, Next.js·PostCSS·Playwright 설정 파일
- `.gitignore`, `.vercelignore`, `README.md`
- `AGENTS.md`, `CLAUDE.md`, 이 점검 문서에는 비밀정보가 발견되지 않았다.
- PRD와 `BRITROUTE_PLAN.md`에도 비밀정보가 발견되지 않았다. 다만 공개 저장소에 포함하면 기획 내용 역시 공개된다. 앱 실행에 꼭 필요한 파일은 아니므로 기획 공개 여부에 따라 선택한다.

## 업로드할 때

Git 또는 GitHub Desktop으로 올릴 때는 `.gitignore`를 함께 포함한다. 웹 화면에서 직접 파일을 선택하거나 폴더를 압축해서 올릴 때도 제외 대상이 들어가지 않게 직접 확인한다. `.vercelignore`는 Vercel 배포용이며 GitHub 업로드 제외는 `.gitignore`가 담당한다.

이후 이미 커밋한 파일에 비밀값을 넣었다면 `.gitignore`에 추가하는 것만으로 추적이나 과거 기록이 사라지지 않는다. [GitHub 파일 제외 안내](https://docs.github.com/en/get-started/git-basics/ignoring-files)

만약 실제 키가 공개된 경우에는 해당 키를 먼저 폐기·재발급하고 저장소 기록 정리를 진행한다. [GitHub 민감정보 제거 안내](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

이번 작업에서는 GitHub 업로드, 커밋, 원격 저장소 생성 또는 기존 파일 삭제를 진행하지 않았다.
