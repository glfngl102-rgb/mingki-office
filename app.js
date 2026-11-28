/* ============================================================
   Mingki Office · app.js
   ============================================================ */
(function () {
  'use strict';

  const STORE = {
    memo: 'mingki-office.memo',
    todo: 'mingki-office.todo',
    tab: 'mingki-office.tab',
    motion: 'mingki-office.motion'
  };

  /* ─────────── 유틸 ─────────── */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, '0');
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ─────────── 날짜 · D-day ─────────── */
  const OSAKA = new Date(2027, 2, 11); // 2027-03-11

  function ddayText() {
    const now = new Date();
    const a = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const b = Date.UTC(OSAKA.getFullYear(), OSAKA.getMonth(), OSAKA.getDate());
    const diff = Math.round((b - a) / 86400000);
    if (diff > 0) return 'D-' + diff;
    if (diff === 0) return 'D-DAY';
    return 'D+' + Math.abs(diff);
  }

  function shortDate() {
    const now = new Date();
    return (now.getMonth() + 1) + '.' + now.getDate() + ' (' + WEEK[now.getDay()] + ')';
  }

  const agendaDate = $('#agendaDate');
  if (agendaDate) agendaDate.textContent = shortDate();

  const boardDate = $('#boardDate');
  if (boardDate) {
    const now = new Date();
    boardDate.textContent = now.getFullYear() + '.' + pad(now.getMonth() + 1) + '.' + pad(now.getDate()) + ' 기준';
  }

  const ddayEl = $('#osakaDday');
  const statDday = $('#statDday');
  function paintDday() {
    const t = ddayText();
    if (ddayEl) ddayEl.textContent = t;
    if (statDday) statDday.textContent = t;
  }
  paintDday();

  /* ─────────── 파트 데이터 ─────────── */
  const PARTS = {
    hq: {
      name: '지휘실',
      sub: '망두 · 총괄',
      emoji: '🧸',
      tone: 'sky',
      status: '대기 3',
      statusType: 'wait',
      avatar: '🐻‍❄️',
      desc: '망두가 앉아 있는 메인 데스크예요. 오늘 할 일과 결정할 것들을 여기서 모아 봐요.',
      items: [
        '오늘 안건 3건 — 구디백 테스트 · 제작물 검토 · 글 발행',
        '가동 중인 파트 4곳, 대기 중인 결정 3건',
        '모션 ON이면 맵 위 핀과 캐릭터가 살짝 움직여요'
      ],
      actions: [
        { type: 'tab', label: '회의실 열기', tab: 'meeting' },
        { type: 'tab', label: '작업실 보기', tab: 'work' }
      ]
    },
    golf: {
      name: '골프 스튜디오',
      sub: '시바 · 골프 파트',
      emoji: '⛳',
      tone: 'green',
      status: '2 발행',
      statusType: 'ok',
      avatar: '🐶',
      desc: '퍼팅 매트와 스크린이 있는 연습방이에요. 레슨 나가기 전 몸을 풀고, 스윙을 확인하는 곳.',
      items: [
        '드라이버 슬라이스 글 발행 완료',
        '탑볼 글 발행 완료',
        '어프로치 · 유틸리티 글 임시저장 2건',
        '애드포스트 검수는 보류 중'
      ],
      actions: [
        { type: 'link', label: '골프 블로그 ↗', href: 'https://blog.naver.com/glfngl102' },
        { type: 'link', label: '밍끼골프 유튜브 ↗', href: 'https://www.youtube.com/@mingkipro__s2' }
      ]
    },
    blog: {
      name: '블로그·클립실',
      sub: '토끼 · 블로그 파트',
      emoji: '🖥️',
      tone: 'pink',
      status: '4 발행',
      statusType: 'ok',
      avatar: '🐰',
      desc: '듀얼 모니터와 링라이트가 있는 작업실. 글 쓰고 사진 고르고, 릴스·클립까지 여기서 만들어요.',
      items: [
        '일상 블로그 4편 발행 — 겨울 보습템 · 175cm 데이트룩 · 의정부 · 대학로',
        '다음 맛집 회차 글감 준비 중',
        '클립 @mingkipro_ 연동',
        '전자책·툰 샘플 검토 대기 · 이모티콘 112컷 완성'
      ],
      actions: [
        { type: 'link', label: '일상 블로그 ↗', href: 'https://blog.naver.com/myminjiday' },
        { type: 'link', label: '네이버 클립 ↗', href: 'https://clip.naver.com/@mingkipro_' }
      ]
    },
    design: {
      name: '디자인·굿즈',
      sub: '곰돌이 · 디자인 파트',
      emoji: '🧵',
      tone: 'amber',
      status: '심사 20',
      statusType: 'wait',
      avatar: '🐻',
      desc: '파스텔 작업대와 미싱이 있는 공방. 미리캔버스 요소를 만들고, 직접 그린 캐릭터로 이모티콘을 뽑고, 구디백 샘플을 재보는 곳이에요.',
      reportLead: '이모티콘 4종 풀세트 112컷 완성 — 제출 준비',
      emoticons: true,
      items: [
        '이모티콘 제출 준비 — OGQ 크리에이터 가입·정산 계좌 연결',
        '미리캔버스 손그림 20종 심사 대기 중 · 캐릭터 27종 제출 예정',
        '구디백 v2 구성 확정 — 볼마커 · 볼타월 · 티 · 파우치',
        '단가표 완료, 소량 테스트 결정 대기'
      ],
      actions: [
        { type: 'tab', label: '작업실에서 보기', tab: 'work' }
      ]
    },
    lounge: {
      name: '오사카 라운지',
      sub: '밍끼 · 휴식',
      emoji: '☕',
      tone: 'sky',
      status: 'D-day',
      statusType: 'sky',
      avatar: '🐇',
      desc: '포근한 소파와 커피 테이블, 여행 핀 보드가 있는 라운지. 오사카 항공을 같이 보고 수다 떠는 곳.',
      items: [
        '오사카 여행 2027.03.11 – 03.14 · 2인',
        '인천 출발 50~60만 원대 특가 추적 중',
        '항공 확보 후 숙소 · 일정 정리'
      ],
      actions: [
        { type: 'tab', label: '작업실에서 보기', tab: 'work' }
      ]
    }
  };

  const PART_ORDER = ['hq', 'golf', 'blog', 'design', 'lounge'];

  function statusText(key) {
    const p = PARTS[key];
    return key === 'lounge' ? ddayText() : p.status;
  }

  /* ─────────── 탭 ─────────── */
  const tabs = $$('.tab');
  const panels = {
    office: $('#panel-office'),
    meeting: $('#panel-meeting'),
    work: $('#panel-work'),
    status: $('#panel-status'),
    memo: $('#panel-memo')
  };

  function activateTab(name, opts) {
    if (!panels[name]) return;
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    Object.keys(panels).forEach((k) => {
      const on = k === name;
      panels[k].classList.toggle('is-active', on);
      panels[k].hidden = !on;
    });
    write(STORE.tab, name);
    if (!opts || !opts.silent) {
      const bar = $('.tabs');
      const y = bar ? bar.getBoundingClientRect().top + window.pageYOffset - 6 : 0;
      if (window.pageYOffset > y) window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  tabs.forEach((t) => t.addEventListener('click', () => activateTab(t.dataset.tab)));

  const tabBar = $('.tabs');
  if (tabBar) {
    tabBar.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(document.activeElement);
      if (idx < 0) return;
      let next = null;
      if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      tabs[next].focus();
      activateTab(tabs[next].dataset.tab);
    });
  }

  /* ─────────── 파트 목록 · 보고 카드 ─────────── */
  const partList = $('#partList');
  if (partList) {
    partList.innerHTML = PART_ORDER.map((key) => {
      const p = PARTS[key];
      return '<li>' +
        '<button class="part-row" type="button" data-part="' + key + '">' +
          '<span class="part-avatar part-avatar--' + p.tone + '" aria-hidden="true">' + p.avatar + '</span>' +
          '<span class="part-body"><strong>' + p.name + '</strong><span>' + p.sub + '</span></span>' +
          '<span class="part-status part-status--' + p.statusType + '">' + statusText(key) + '</span>' +
        '</button>' +
      '</li>';
    }).join('');
  }

  const reportList = $('#reportList');
  if (reportList) {
    reportList.innerHTML = PART_ORDER.map((key) => {
      const p = PARTS[key];
      const lead = p.reportLead ? [p.reportLead] : [];
      const lines = lead.concat(p.items || []).slice(0, 3);
      return '<button class="report-card" type="button" data-part="' + key + '">' +
        '<span class="report-top">' +
          '<span class="part-avatar part-avatar--' + p.tone + '" aria-hidden="true">' + p.avatar + '</span>' +
          '<span class="report-name">' + p.name + '</span>' +
          '<span class="part-status part-status--' + p.statusType + '">' + statusText(key) + '</span>' +
        '</span>' +
        '<ul>' + lines.map((l) => '<li>' + l + '</li>').join('') + '</ul>' +
      '</button>';
    }).join('');
  }

  /* ─────────── 파트 상세 시트 ─────────── */
  const backdrop = $('#sheetBackdrop');
  const sheetTitle = $('#sheetTitle');
  const sheetSub = $('#sheetSub');
  const sheetEmoji = $('#sheetEmoji');
  const sheetDesc = $('#sheetDesc');
  const sheetList = $('#sheetList');
  const sheetEt = $('#sheetEt');
  const sheetActions = $('#sheetActions');
  const sheetClose = $('#sheetClose');
  let lastFocus = null;

  function openPart(key) {
    const p = PARTS[key];
    if (!p || !backdrop) return;
    lastFocus = document.activeElement;

    const items = (p.items || []).slice();
    if (key === 'lounge') items.push('여행 D-day — ' + ddayText());

    sheetEmoji.textContent = p.emoji;
    sheetTitle.textContent = p.name;
    sheetSub.textContent = p.sub;
    sheetDesc.textContent = p.desc;
    sheetList.innerHTML = items.map((item) => '<li>' + item + '</li>').join('');

    if (sheetEt) {
      const etSrc = $('#etList');
      if (p.emoticons && etSrc) {
        sheetEt.innerHTML =
          '<div class="et-head"><strong>캐릭터 이모티콘 4종</strong><span>4종 112컷 완성</span></div>' +
          '<ul class="et-list">' + etSrc.innerHTML + '</ul>' +
          '<p class="et-note">토끼·모모 24컷, 루루·빼꼼이 32컷 전부 완성 — 시트와 제출용 파일은 채팅에서 보낸 그대로예요.</p>';
        sheetEt.hidden = false;
      } else {
        sheetEt.innerHTML = '';
        sheetEt.hidden = true;
      }
    }
    sheetActions.innerHTML = (p.actions || []).map((a) => {
      if (a.type === 'link') {
        return '<a href="' + a.href + '" target="_blank" rel="noopener">' + a.label + '</a>';
      }
      return '<button type="button" data-goto="' + a.tab + '">' + a.label + '</button>';
    }).join('');

    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    sheetClose.focus({ preventScroll: true });
  }

  function closeSheet() {
    if (!backdrop || backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  if (backdrop) {
    sheetClose.addEventListener('click', closeSheet);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeSheet();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSheet();
    });
    sheetActions.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-goto]');
      if (!btn) return;
      closeSheet();
      activateTab(btn.dataset.goto);
    });
  }

  $$('.pin, .part-row, .report-card').forEach((el) => {
    el.addEventListener('click', () => openPart(el.dataset.part));
  });

  $$('[data-open]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openPart(el.dataset.open);
    });
  });

  /* ─────────── 모션 토글 ─────────── */
  const mapStage = $('#mapStage');
  const motionBtn = $('#motionToggle');
  const motionLabel = $('#motionLabel');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let motionOn = read(STORE.motion, null);
  if (typeof motionOn !== 'boolean') motionOn = !reduceMotion;

  function paintMotion() {
    if (mapStage) mapStage.classList.toggle('is-motion', motionOn);
    if (motionBtn) {
      motionBtn.classList.toggle('is-on', motionOn);
      motionBtn.setAttribute('aria-pressed', motionOn ? 'true' : 'false');
    }
    if (motionLabel) motionLabel.textContent = motionOn ? '모션 ON' : '모션 OFF';
  }
  paintMotion();

  if (motionBtn) {
    motionBtn.addEventListener('click', () => {
      motionOn = !motionOn;
      write(STORE.motion, motionOn);
      paintMotion();
      if (!motionOn) hideBubble();
    });
  }

  /* ─────────── 캐릭터 한마디 ─────────── */
  const sayBubble = $('#sayBubble');
  const sayWho = $('#sayWho');
  const sayText = $('#sayText');
  let bubbleTimer = null;

  const LINES = {
    mangdu: {
      who: '망두',
      lines: [
        '오늘 안건 3건 정리해뒀어 ㅁ',
        '구디백 테스트, 할까 말까? ㅁ',
        '어프로치 글 발행 준비됐어 ㅁ',
        '핀을 누르면 파트 현황이 열려 ㅁ',
        '부르면 언제든 달려갈게 ㅁ'
      ]
    },
    mingki: {
      who: '밍끼',
      lines: [
        '레슨 다녀왔어~',
        '오사카 특가 보고 있었어',
        '커피 한 잔 하면서 생각 중~',
        '이번 주 글은 뭐로 할까?',
        '라운지에서 잠깐 쉬는 중이야'
      ]
    }
  };

  function hideBubble() {
    if (sayBubble) sayBubble.hidden = true;
    window.clearTimeout(bubbleTimer);
  }

  function speak(who, mascotEl) {
    if (!sayBubble || !mascotEl) return;
    const data = LINES[who];
    const text = pick(data.lines);
    const stage = mapStage.getBoundingClientRect();
    const box = mascotEl.getBoundingClientRect();
    const cx = ((box.left + box.width / 2) - stage.left) / stage.width * 100;
    const cy = ((box.top + box.height / 2) - stage.top) / stage.height * 100;
    const x = Math.min(84, Math.max(16, cx));

    sayBubble.hidden = false;
    sayBubble.classList.toggle('is-mingki', who === 'mingki');
    sayBubble.classList.remove('is-below');
    sayWho.textContent = data.who;
    sayText.textContent = text;

    // 위쪽 공간이 좁으면 캐릭터 아래로
    const below = cy < 18;
    if (below) sayBubble.classList.add('is-below');
    sayBubble.style.setProperty('--bx', x + '%');
    sayBubble.style.setProperty('--by', (below ? cy + 13 : cy - 9) + '%');

    // 말풍선이 화면 밖으로 밀리면 꼬리를 캐릭터 쪽으로 이동
    const bw = sayBubble.offsetWidth || 1;
    const centerPx = cx / 100 * stage.width;
    const leftPx = x / 100 * stage.width - bw / 2;
    const tail = Math.min(88, Math.max(12, (centerPx - leftPx) / bw * 100));
    sayBubble.style.setProperty('--tail', tail + '%');
    sayBubble.style.animation = 'none';
    void sayBubble.offsetWidth;
    sayBubble.style.animation = '';

    window.clearTimeout(bubbleTimer);
    bubbleTimer = window.setTimeout(hideBubble, 3800);
  }

  [['mangdu', '#mascotMangdu'], ['mingki', '#mascotMingki']].forEach(([who, sel]) => {
    const el = $(sel);
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      el.classList.remove('is-hop');
      void el.offsetWidth;
      el.classList.add('is-hop');
      window.setTimeout(() => el.classList.remove('is-hop'), 540);
      speak(who, el);
    });
  });

  document.addEventListener('click', (e) => {
    if (!sayBubble || sayBubble.hidden) return;
    if (e.target.closest('.mascot') || e.target.closest('.say-bubble')) return;
    hideBubble();
  });

  /* ─────────── 메모 ─────────── */
  const memoBox = $('#memoBox');
  const memoState = $('#memoState');
  const memoCount = $('#memoCount');
  const memoClear = $('#memoClear');
  let memoTimer = null;

  function stamp() {
    const d = new Date();
    return pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function renderMemoCount() {
    if (memoBox && memoCount) memoCount.textContent = memoBox.value.length + '자';
  }

  if (memoBox) {
    const saved = read(STORE.memo, '');
    memoBox.value = typeof saved === 'string' ? saved : '';
    renderMemoCount();

    memoBox.addEventListener('input', () => {
      renderMemoCount();
      memoState.textContent = '저장 중…';
      memoState.classList.add('is-saving');
      window.clearTimeout(memoTimer);
      memoTimer = window.setTimeout(() => {
        write(STORE.memo, memoBox.value);
        memoState.textContent = '저장됨 ' + stamp();
        memoState.classList.remove('is-saving');
      }, 450);
    });

    if (memoClear) {
      memoClear.addEventListener('click', () => {
        if (!memoBox.value.length) return;
        if (!window.confirm('메모를 모두 지울까요? 되돌릴 수 없어요.')) return;
        memoBox.value = '';
        write(STORE.memo, '');
        renderMemoCount();
        memoState.textContent = '비웠어요';
        memoState.classList.remove('is-saving');
        memoBox.focus();
      });
    }
  }

  /* ─────────── 체크리스트 ─────────── */
  const todoForm = $('#todoForm');
  const todoInput = $('#todoInput');
  const todoList = $('#todoList');
  const todoEmpty = $('#todoEmpty');
  const listState = $('#listState');
  let todos = read(STORE.todo, []);
  if (!Array.isArray(todos)) todos = [];

  function saveTodos() { write(STORE.todo, todos); }

  function renderTodos() {
    todoList.innerHTML = todos.map((t) => {
      return '<li class="todo-item' + (t.done ? ' is-done' : '') + '" data-id="' + t.id + '">' +
        '<button class="todo-check" type="button" role="checkbox" aria-checked="' + (t.done ? 'true' : 'false') + '" aria-label="' + (t.done ? '완료 취소' : '완료') + '"></button>' +
        '<span class="todo-text">' + escapeHtml(t.text) + '</span>' +
        '<button class="todo-del" type="button" aria-label="삭제">✕</button>' +
        '</li>';
    }).join('');

    const done = todos.filter((t) => t.done).length;
    if (listState) listState.textContent = done + ' / ' + todos.length;
    if (todoEmpty) todoEmpty.hidden = todos.length > 0;
  }

  function addTodo(text) {
    const value = String(text || '').trim();
    if (!value) return;
    if (todos.some((t) => t.text === value)) return;
    todos.unshift({ id: 't' + Date.now() + Math.floor(Math.random() * 999), text: value, done: false });
    saveTodos();
    renderTodos();
  }

  if (todoForm) {
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addTodo(todoInput.value);
      todoInput.value = '';
      todoInput.focus();
    });

    todoList.addEventListener('click', (e) => {
      const item = e.target.closest('.todo-item');
      if (!item) return;
      const id = item.dataset.id;
      const entry = todos.find((t) => t.id === id);
      if (!entry) return;

      if (e.target.closest('.todo-check') || e.target.closest('.todo-text')) {
        entry.done = !entry.done;
        saveTodos();
        renderTodos();
      } else if (e.target.closest('.todo-del')) {
        todos = todos.filter((t) => t.id !== id);
        saveTodos();
        renderTodos();
      }
    });

    $$('#todoSuggest .chip').forEach((chip) => {
      chip.addEventListener('click', () => addTodo(chip.dataset.todo));
    });

    renderTodos();
  }

  /* ─────────── 시작 탭 복원 ─────────── */
  const savedTab = read(STORE.tab, 'office');
  if (savedTab && panels[savedTab]) activateTab(savedTab, { silent: true });

  /* ─────────── 복귀 시 갱신 ─────────── */
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) paintDday();
  });
})();
