# 🧸 Mingki Office · 밍끼 오피스

민지 님(밍끼프로) 전용 모바일·웹 오피스 웹앱입니다. 순수 HTML / CSS / JavaScript만으로
만들었기 때문에 서버나 빌드 과정 없이 어떤 정적 호스팅에도 그대로 올릴 수 있습니다.

3D 미니어처 디오라마 스타일의 오피스 맵 위에서 다섯 공간(지휘실 · 골프 스튜디오 ·
블로그·클립실 · 디자인·굿즈 · 오사카 라운지)과 담당자들을 탭해 바로 현황을 확인합니다.

## 파일 구성

```
mingki-office/
├── index.html            화면 구조 (헤더 · 5개 탭 · 파트 상세 시트)
├── style.css             디자인 (크림 + 딥네이비, 3D 미니어처 오피스, 반응형)
├── app.js                탭 전환 · 구역 핀/캐릭터 말풍선 · 모션 토글 · 메모 저장
├── manifest.json         홈 화면 추가용(PWA) 설정 — 앱 이름·아이콘·테마색
├── robots.txt            검색엔진 수집 차단 (Disallow: /)
└── assets/
    ├── office-map.png    오피스 3D 미니어처 맵 (원본 PNG, 1254×1254)
    ├── office-map.webp   같은 이미지의 가벼운 버전(약 1/14 용량, 자동 우선 사용)
    ├── icon-180.png      아이폰 홈 화면 아이콘
    ├── icon-192.png / icon-512.png / icon-1024.png
    └── icon-maskable-512.png
```

> `index.html`의 `<head>`에 `<meta name="robots" content="noindex, nofollow">`가 들어 있어
> 검색 결과에 노출되지 않습니다. `robots.txt`도 함께 두었습니다.

## 기능

| 탭 | 내용 |
|---|---|
| 오피스 | 3D 미니어처 맵 · 구역 핀 5개(누르면 파트 상세) · 망두·밍끼 캐릭터를 누르면 말풍선 · `모션 ON/OFF` 토글(핀과 캐릭터가 살짝 떠다님) · 파트 현황 5줄 |
| 회의실 | 오늘의 안건 3건 + 파트별 보고(탭하면 상세 시트) |
| 작업실 | 진행 중인 6개 프로젝트 보드 (발행 완료 / 임시저장 / 심사 대기 / 결정 대기) · 오사카 D-day 자동 계산 |
| 현황 | 발행 6 · 임시저장 2 · 심사 대기 2 · 오사카 D-day + 채널 바로가기 6개 |
| 메모 | 퀵 메모 + 오늘의 체크리스트 — 브라우저 `localStorage`에 자동 저장 |

## 로컬에서 열기

- 파일을 그냥 더블클릭해도 대부분 동작합니다. (Safari/Chrome에서 `index.html` 열기)
- 폰에서 보려면 폴더째로 열 수 없기 때문에, 아래처럼 정적 호스팅에 올리는 방법이 가장 간단합니다.

## 배포 (GitHub Pages)

1. 이 폴더의 파일들을 저장소(`glfngl102-rgb/mingki-office`)에 올립니다.
2. Settings → Pages → Source를 `Deploy from a branch` → `main` / `/ (root)`로 저장.
3. 1~2분 뒤 `https://glfngl102-rgb.github.io/mingki-office/` 로 열립니다.

> 아이폰 사파리에서 주소를 연 뒤 **공유 → 홈 화면에 추가**를 누르면 앱처럼 전체 화면으로 열리고,
> 아이콘과 이름은 `manifest.json` + `apple-touch-icon` 설정을 따라갑니다.

## 메모 저장에 대해

- 메모와 체크리스트는 **그 브라우저에만** 저장됩니다(서버 전송 없음). 기기를 바꾸거나 브라우저 데이터를 지우면 사라집니다.
- 사파리 시크릿 모드에서는 저장이 되지 않을 수 있습니다.

## 디자인 토큰

| 이름 | 값 | 쓰임 |
|---|---|---|
| cream | `#F7F3EC` | 배경 |
| paper | `#FFFEFB` | 카드 |
| navy | `#2B3440` | 모션 ON·강조 알약, 핀 라벨 |
| green | `#2FA96B` | LIVE·완료 |
| sky | `#9FD3EC` / `#4E8CA9` | 망두·진행 |
| pink | `#F3BCCB` / `#B4657C` | 일상·블로그 |
| amber | `#C98A4B` | 대기·검토 |

폰트는 별도 다운로드 없이 기기 기본 한글 폰트(Pretendard → Apple SD Gothic Neo → 맑은 고딕)를 사용합니다.
