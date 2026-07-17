# DTPLab website

부산대학교 Digital Twin Physical AI Laboratory의 정적 멀티페이지 홈페이지입니다. 기존 Google Sites의 내용을 `Home / People / Projects / Publications / Seminars / Gallery`로 이전했으며, 별도 프레임워크나 빌드 단계 없이 GitHub Pages에 배포됩니다.

## 공개 페이지

- `site/index.html`: 모집 안내, 4대 연구분야, 전체 뉴스
- `site/people.html`: 교수, 박사과정, 석사과정, 학부연구생, 졸업생
- `site/projects.html`: 수행·종료 과제와 산학/R&D/인재 필터
- `site/publications.html`: Journal/Conference/Patent 실적
- `site/seminars.html`: 연도별 세미나 아코디언
- `site/gallery.html`: 행사별 기록과 이미지 라이트박스
- `site/archive.html`: 기존 archive URL의 호환 리다이렉트

## 데이터

콘텐츠는 `site/data/` 아래의 JSON으로 관리합니다. 이미지 필드는 현재 비어 있으며, 추후 로컬 파일만 추가합니다. 외부 Google Sites 이미지 URL은 사용하지 않습니다.

- `home.json`: 모집 안내
- `news.json`: 48건의 연구실 뉴스
- `research.json`: 4대 연구분야
- `people.json`: 연구원 프로필
- `projects.json`: 구조화된 18개 프로젝트
- `publications.json`: 구조화된 논문·학술발표·특허 84건
- `citations.json`: Semantic Scholar 인용수 캐시
- `seminars.json`: 73건의 세미나
- `gallery.json`: 9건의 행사와 이미지 배열

## 로컬 확인

브라우저의 `file://` 경로에서는 JSON 로딩이 제한되므로 로컬 서버를 사용합니다.

```powershell
python -m http.server 8765 --directory site
```

검증 명령:

```powershell
node tools/test-refresh-citations.mjs
node tools/refresh-citations.mjs
node tools/validate-content.mjs
node tools/check-links.mjs
```

## 배포

`main` 브랜치 push 또는 매주 월요일 예약 실행 시 GitHub Actions가 인용수 캐시 갱신, 데이터 검증, 내부 링크 검사를 순서대로 수행합니다. 어느 단계라도 실패하면 새 Pages 배포가 진행되지 않아 마지막 정상 배포가 유지됩니다. Semantic Scholar ID 또는 DOI가 없는 실적은 인용수 항목을 표시하지 않습니다.

상세한 콘텐츠 수정 방법은 [CONTENT_UPDATE_GUIDE.md](CONTENT_UPDATE_GUIDE.md)를 참고하십시오.
