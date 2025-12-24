# Web/JS → React 학습자료 (지금까지 진행한 내용 정리)

> 목표: **Vanilla JS로 직접 SPA를 만들며 개념을 익힌 뒤**, 같은 구조를 **React로 1:1 변환**해서 “왜 React가 필요한지”를 이해하고, 실무형 구조(라우팅/모달/공통 로딩·에러/훅)까지 완성한다.

---

## 0) 전체 그림 (현재까지 완성된 아키텍처)

### 백엔드 (FastAPI)
- REST API: `GET /tasks`, `POST /tasks`, `PUT /tasks/{id}`, `DELETE /tasks/{id}`
- SQLite 영속화(서버 재시작해도 유지)
- (최신 FastAPI 권장) `lifespan`에서 DB 초기화

### 프론트엔드
- `frontend/` : Vanilla JS 버전(보존)
- `frontend-react/` : React + Vite 버전(추가)

---

## 1) React로 넘어오며 새로 추가/학습한 핵심 요점

### 1.1 npm / Node / Vite
- **Node.js**: 브라우저 밖에서 JS 실행 가능한 런타임(빌드 도구 실행에 필요)
- **npm**: JS 패키지 매니저 (C++의 vcpkg/conan 유사)
- **Vite**: 프론트 빌드/개발 서버(5173), JSX/모듈 번들링을 빠르게 처리

**명령어**
```bash
npm create vite@latest frontend-react -- --template react
cd frontend-react
npm install
npm run dev
```

### 1.2 React 컴포넌트와 JSX
- 컴포넌트 = “UI를 만드는 함수”
- JSX = JS 안에서 HTML-like 문법을 쓰는 UI DSL
- 핵심 사고: **UI = f(state)**

### 1.3 useState 문법
```js
const [title, setTitle] = useState('');
```
- `useState`는 `[값, setter]` 배열 반환
- 배열 구조분해 할당으로 꺼내 쓰는 문법
- `title`은 직접 대입 금지, 반드시 `setTitle()`로 변경해야 UI가 갱신됨

### 1.4 useEffect(초기 로딩)
```js
useEffect(() => {
  loadTasks();
}, []);
```
- `[]` 의존성 배열: “마운트 후 딱 한 번 실행”
- 서버 데이터 로딩(fetch)은 렌더 중이 아닌 effect에서 수행

### 1.5 useReducer(도메인 상태 승격)
- 도메인 상태(업무 로직): `tasks`, `loading`, `error`, `editingTask` 등
- UI 로컬 상태: 입력창 값(`title`) 같은 것은 보통 `useState`로 유지

**핵심**
- 상태 변경을 `dispatch(action)`로 통일 → 디버깅/추적 쉬움
- (초반엔) `useState` + (규모 커지면) `useReducer`가 자연스러운 흐름

### 1.6 React Router
- URL을 상태처럼 다룬다
- `path="stats"` 는 **파일 경로가 아니라 URL 규칙**(부모 `/` 아래 상대 경로 → `/stats`)
- `<Link to="/stats" />` 로 이동(새로고침 없이)

### 1.7 중첩 라우팅(Layout Route)
- 공통 레이아웃(네비게이션 등)을 부모 Route에 두고 자식 Route를 `<Outlet />`로 렌더
- “레이아웃은 유지하고, 내용만 교체”하는 구조

### 1.8 페이지별 데이터 로딩 분리
- Router/App가 아니라 **각 Page가 자기 데이터 로딩 책임**
- 페이지 전환 시 필요한 데이터만 로드 → 성능/구조/유지보수 개선

### 1.9 공통 로딩/에러 + useAsync 훅
- 로딩/에러 UX를 Layout로 통일
- `useAsync`로 `try/catch/loading/error` 반복 제거

---

## 2) React 프로젝트 구조(권장)

```text
frontend-react/
  index.html
  src/
    api/
      api.js
    hooks/
      useAsync.js
    layouts/
      MainLayout.jsx
    router/
      AppRouter.jsx
    pages/
      TasksPage.jsx
      StatsPage.jsx
      SettingsPage.jsx
    components/
      Navbar.jsx
      TaskList.jsx
      TaskItem.jsx
      EditTaskModal.jsx
      Loading.jsx
      ErrorView.jsx
    main.jsx
```

---

## 3) 지금까지 만든 주요 기능들(React)

### 3.1 CRUD
- Create: 입력 후 Add
- Toggle: Done/Undo
- Delete: Delete 버튼
- Edit: Edit 버튼 → 모달 → Save

### 3.2 Edit 모달(React 방식)
- Vanilla: DOM 생성/삭제(openModal)
- React: `editingTask` 상태로 모달의 존재를 표현
  - `editingTask !== null`이면 `<EditTaskModal />` 렌더
  - Save → API 호출 → 리스트 reload → `editingTask = null`

---

## 4) Vite(5173) vs FastAPI(8000) 접속 정리

### 개발 중(권장)
- UI(React dev server): `http://localhost:5173`
- API(FastAPI): `http://localhost:8000`

### 배포(통합) 시
- React 빌드 결과를 FastAPI가 서빙 → `http://localhost:8000` 하나로 통합 가능

---

## 5) VS Code 디버깅 요약 (React/Vite)

### 브라우저 디버깅 연결(Chrome 예시)
`.vscode/launch.json`
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React (Vite + Chrome)",
      "type": "pwa-chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend-react"
    }
  ]
}
```

### 강제 중단(문제 원인 추적)
```js
debugger;
```

---

## 6) 학습 포인트 “요점 정리”(React에서 특히 중요)

### A. 상태 설계
- “이 값이 여러 곳에서 공유되나?” → 공유면 reducer/전역 상태 후보
- “이 값이 한 입력창에만 필요한가?” → 로컬(useState)로 둔다

### B. 렌더링 모델
- Vanilla: `state 변경 + render()`를 개발자가 책임
- React: `setState/dispatch`만 하면 React가 재렌더링을 자동 수행

### C. 사이드 이펙트(네트워크)
- render 중에 fetch 금지
- `useEffect` 또는 `useAsync(run)`로 처리
- 페이지 단위로 “필요할 때만” 로딩

### D. 라우팅
- URL path는 파일 시스템과 무관
- 중첩 라우팅으로 공통 레이아웃을 안정적으로 구성

### E. 공통 UX
- 로딩/에러/빈 상태 UI를 Layout로 통일하면 제품 품질이 급상승

---

## 7) 현재까지의 “완성 상태 체크리스트”
- [ ] React 앱에서 `/`, `/stats`, `/settings` 이동 가능
- [ ] Tasks CRUD 정상
- [ ] Edit 모달 정상
- [ ] 페이지별 데이터 로딩(useEffect 분리) 적용
- [ ] 중첩 라우팅(Layout + Outlet) 적용
- [ ] 공통 로딩/에러 UI 적용
- [ ] useAsync로 비동기 패턴 통일
- [ ] VSCode에서 React 디버깅 가능(브레이크포인트/Variables 확인)

---

## 8) 다음으로 추가 진행하면 좋은 것들(추천 로드맵)

### 8.1 (강력 추천) 404 / NotFound + Error Boundary
- 라우팅에서 미매칭 URL 처리
- React Error Boundary로 런타임 렌더 에러 UI 통일

### 8.2 (강력 추천) 배포 통합: `npm run build` → FastAPI 정적 서빙
- 개발(5173/8000)과 배포(8000 단일) 차이를 체득
- 실제 서비스 구조 완성

### 8.3 Auth Layout (로그인/비로그인 레이아웃 분리)
- `/login`은 Navbar 없음
- 보호된 라우트(Protected Route) 도입

### 8.4 상태 전역화(선택)
- Context + useReducer 또는 Zustand
- 앱이 더 커지면 페이지 간 상태 공유를 깔끔하게 처리

### 8.5 테스트(실무 감각)
- React Testing Library로 컴포넌트/상호작용 테스트
- API mocking(MSW 등)으로 네트워크 테스트

---

## 부록: 자주 헷갈리는 포인트
- `path="stats"`는 **URL 규칙**이지 폴더 경로가 아님
- `useEffect(..., [])`는 “처음 1번” (StrictMode에서 개발 중 2번처럼 보일 수 있음)
- `useState`의 `const`는 “바인딩 고정”이지 값이 불변이란 뜻이 아님(값 변경은 setTitle로)

---
