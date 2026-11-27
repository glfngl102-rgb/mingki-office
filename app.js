/* ============================================================
   밍끼 오피스 · app.js
   ============================================================ */
(function () {
  'use strict';

  const STORE = {
    memo: 'mingki-office.memo',
    todo: 'mingki-office.todo',
    tab: 'mingki-office.tab'
  };

  /* ─────────── 유틸 ─────────── */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, '0');
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

  /* ─────────── 헤더: 시계 · 날짜 ─────────── */
  const clockText = $('#clockText');
  const todayBadge = $('#todayBadge');
  const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

  function renderClock() {
    const now = new Date();
    clockText.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  }
  function renderToday() {
    const now = new Date();
    todayBadge.textContent = now.getFullYear() + '.' + pad(now.getMonth() + 1) + '.' + pad(now.getDate()) + ' ' + WEEK[now.getDay()];
  }
  renderClock();
  renderToday();
  setInterval(renderClock, 1000);
  setInterval(renderToday, 60000);

  /* ─────────── 오사카 D-day ─────────── */
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
  const ddayEl = $('#osakaDday');
  if (ddayEl) ddayEl.textContent = ddayText();

  const boardDate = $('#boardDate');
  if (boardDate) {
    const now = new Date();
    boardDate.textContent = now.getFullYear() + '.' + pad(now.getMonth() + 1) + '.' + pad(now.getDate()) + ' 기준';
  }

  /* ─────────── 탭 ─────────── */
  const tabs = $$('.tab');
  const panels = {
    map: $('#panel-map'),
    board: $('#panel-board'),
    links: $('#panel-links'),
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
      const tabsTop = document.querySelector('.tabs');
      const y = tabsTop ? tabsTop.getBoundingClientRect().top + window.pageYOffset - 6 : 0;
      if (window.pageYOffset > y) window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  tabs.forEach((t) => t.addEventListener('click', () => activateTab(t.dataset.tab)));

  // 키보드 ← → 로 탭 이동
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

  /* ─────────── 방 데이터 ─────────── */
  const ROOMS = {
    golf: {
      no: 1,
      emoji: '⛳',
      name: '골프 스튜디오실',
      sub: '1번 방 · 레슨 준비 & 스윙 체크',
      desc: '따뜻한 우드 바닥 위에 퍼팅 매트와 스크린 존을 둔 방이에요. 레슨 나가기 전 몸을 풀고, 스윙 영상을 찍어 확인하는 곳.',
      list: [
        '퍼팅 매트 — 짧은 퍼터 감각 체크',
        '스크린 존 — 스윙·드라이버 거리 확인',
        '골프백 — 레슨 장비 대기 중'
      ],
      actions: [
        { type: 'link', label: '⛳ 골프 블로그 ↗', href: 'https://blog.naver.com/glfngl102' },
        { type: 'link', label: '▶️ 밍끼골프 유튜브 ↗', href: 'https://www.youtube.com/@mingkipro__s2' }
      ]
    },
    studio: {
      no: 2,
      emoji: '🖥️',
      name: '블로그·인스타 작업실',
      sub: '2번 방 · 글쓰기 & 편집',
      desc: '듀얼 모니터와 링라이트, 카메라 삼각대가 있는 방. 글 쓰고 사진 고르고, 릴스 편집까지 여기서 해요.',
      list: [
        '어프로치·유틸리티 글 임시저장 확인',
        '일상 블로그 다음 맛집 회차 준비',
        '전자책·이모티콘·인스타 툰 샘플 검토'
      ],
      actions: [
        { type: 'link', label: '🌿 일상 블로그 ↗', href: 'https://blog.naver.com/myminjiday' },
        { type: 'link', label: '📸 인스타 @glfngl102 ↗', href: 'https://www.instagram.com/glfngl102/' }
      ]
    },
    craft: {
      no: 3,
      emoji: '🧵',
      name: '디자인·굿즈 공방',
      sub: '3번 방 · 요소 제작 & 샘플',
      desc: '파스텔 작업대와 미싱이 있는 방. 미리캔버스에 올릴 요소를 만들고, 구디백 샘플을 재보는 곳이에요.',
      list: [
        '미리캔버스 손그림 20종 심사 대기 중',
        '캐릭터 27종 제출 예정',
        '구디백 v2 — 볼마커·볼타월·티·파우치 단가표 완료',
        '소량 테스트 결정 대기'
      ],
      actions: [
        { type: 'tab', label: '📋 프로젝트 보드 보기', tab: 'board' }
      ]
    },
    lounge: {
      no: 4,
      emoji: '☕',
      name: '오사카 & 수다 라운지',
      sub: '4번 방 · 여행 & 수다',
      desc: '포근한 파스텔 소파와 커피바, 벽면 여행 보드가 있는 방. 오사카 항공을 같이 보고, 수다 떠는 곳.',
      list: [
        '오사카 여행 2027.03.11 – 03.14 · 2인',
        '인천 출발 50~60만 원대 특가 추적 중',
        '여행 D-day — ' + ddayText()
      ],
      actions: [
        { type: 'tab', label: '📋 프로젝트 보드 보기', tab: 'board' }
      ]
    }
  };

  /* ─────────── 방 상세 시트 ─────────── */
  const backdrop = $('#sheetBackdrop');
  const sheetTitle = $('#sheetTitle');
  const sheetSub = $('#sheetSub');
  const sheetEmoji = $('#sheetEmoji');
  const sheetDesc = $('#sheetDesc');
  const sheetList = $('#sheetList');
  const sheetActions = $('#sheetActions');
  const sheetClose = $('#sheetClose');
  let lastFocus = null;

  function openRoom(key) {
    const room = ROOMS[key];
    if (!room) return;
    lastFocus = document.activeElement;

    sheetEmoji.textContent = room.emoji;
    sheetTitle.textContent = room.name;
    sheetSub.textContent = room.sub;
    sheetDesc.textContent = room.desc;
    sheetList.innerHTML = room.list.map((item) => '<li>' + item + '</li>').join('');
    sheetActions.innerHTML = room.actions.map((a) => {
      if (a.type === 'link') {
        return '<a href="' + a.href + '" target="_blank" rel="noopener">' + a.label + '</a>';
      }
      return '<button type="button" data-goto="' + a.tab + '">' + a.label + '</button>';
    }).join('');

    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    sheetClose.focus({ preventScroll: true });
  }

  function closeRoom() {
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  sheetClose.addEventListener('click', closeRoom);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeRoom();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeRoom();
  });
  sheetActions.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-goto]');
    if (btn) {
      closeRoom();
      activateTab(btn.dataset.goto);
    }
  });

  $$('.room, .room-chip').forEach((el) => {
    el.addEventListener('click', () => openRoom(el.dataset.room));
  });

  $$('[data-open]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openRoom(el.dataset.open);
    });
  });

  /* ─────────── 캐릭터 산책 ─────────── */
  const SPOTS = {
    golf:   { mangdu: { x: 30, y: 25 }, mingki: { x: 44, y: 29 } },
    studio: { mangdu: { x: 60, y: 25 }, mingki: { x: 72, y: 29 } },
    craft:  { mangdu: { x: 62, y: 90 }, mingki: { x: 78, y: 93 } },
    lounge: { mangdu: { x: 40, y: 90 }, mingki: { x: 26, y: 93 } }
  };

  const LINES = {
    mangdu: {
      golf: ['퍼팅 매트 정리해뒀어 ㅁ', '스윙 영상 찍어둘까?', '드라이버 글 반응 좋아 ㅁ', '스크린 존 비어 있어!'],
      studio: ['어프로치 초안 잡아둘게 ㅁ', '링라이트 각도 괜찮아?', '다음 맛집 글 준비 중 ㅁ', '사진 정리하다 왔어'],
      craft: ['손그림 20종 심사 중이야 ㅁ', '구디백 단가표 완성!', '캐릭터 27종도 금방이야 ㅁ', '리본 색 추천해줄까?'],
      lounge: ['오사카 특가 보고 있었어 ㅁ', '커피 한 잔 하자~', '2인 50만 원대 찾는 중!', '여행 보드에 핀 꽂을까?'],
      any: ['부르면 달려갈게 ㅁ', '오늘도 화이팅!', '뭐 도와줄까 ㅁ?']
    },
    mingki: {
      golf: ['레슨 전에 몸 푸는 중~', '이 퍼팅 라인 좋다!', '유틸리티 연습 좀 더 하자', '우리 스튜디오 최고야~'],
      studio: ['블로그 사진 골라야 해~', '톤 맞춰서 편집 중!', '다음 글 뭐로 할까?', '릴스 하나 찍어볼까?'],
      craft: ['미싱 소리 좋다~', '이 파우치 마음에 들어', '이모티콘 흰선 다시 봐야지', '구디백 샘플 만드는 중'],
      lounge: ['오사카 가고 싶다~', '여기서 수다가 제일 좋아', '커피 한 잔 마시고 갈까?', '대학로 다음은 어디 갈까?'],
      any: ['안녕! 나는 밍끼야~', '오늘도 열심히!', '레슨 1:1로 50분이야~']
    }
  };

  const chars = {
    mangdu: {
      el: $('#charMangdu'),
      bubble: $('#bubbleMangdu'),
      room: 'lounge',
      timer: null
    },
    mingki: {
      el: $('#charMingki'),
      bubble: $('#bubbleMingki'),
      room: 'golf',
      timer: null
    }
  };

  const mapNow = $('#mapNow');
  const ROOM_NAMES = { golf: '골프 스튜디오실', studio: '작업실', craft: '공방', lounge: '라운지' };

  function placeChar(who, roomKey, animate) {
    const c = chars[who];
    const spot = SPOTS[roomKey] && SPOTS[roomKey][who];
    if (!c || !spot) return;
    const x = spot.x;
    const y = spot.y;
    const prevLeft = parseFloat(c.el.style.left || '0');
    if (!animate) c.el.style.transition = 'none';

    c.el.style.left = x + '%';
    c.el.style.top = y + '%';
    c.el.classList.toggle('is-below', y < 50);

    if (animate) {
      c.el.classList.add('is-walking');
      const svg = c.el.querySelector('.char-body');
      if (svg) svg.classList.toggle('is-flip', x < prevLeft - 1);
      window.clearTimeout(c._walkEnd);
      c._walkEnd = window.setTimeout(() => c.el.classList.remove('is-walking'), 2350);
    } else {
      c.el.classList.remove('is-walking');
      requestAnimationFrame(() => { c.el.style.transition = ''; });
    }

    c.room = roomKey;
    updateMapNow();
  }

  let bubbleSeq = 0;
  function say(who, text) {
    const c = chars[who];
    if (!c) return;
    const token = ++bubbleSeq;
    const node = c.bubble.querySelector('.say');
    // 좁은 화면에서는 한 번에 한 말풍선만 (맵이 복잡해지지 않게)
    if (window.innerWidth < 640) {
      const other = who === 'mangdu' ? chars.mingki : chars.mangdu;
      if (other) other.bubble.classList.add('is-hiding');
    }
    c.bubble.classList.add('is-hiding');
    window.setTimeout(() => {
      if (token !== bubbleSeq) return;
      if (node) node.textContent = text;
      c.bubble.classList.remove('is-hiding');
    }, 260);
  }

  function roomLine(who, roomKey) {
    const table = LINES[who];
    const arr = table[roomKey] || table.any;
    let text = pick(arr);
    if (text === chars[who].lastLine && arr.length > 1) {
      text = arr[(arr.indexOf(text) + 1) % arr.length];
    }
    chars[who].lastLine = text;
    return text;
  }

  function updateMapNow() {
    if (!mapNow) return;
    mapNow.textContent = '지금 망두는 ' + ROOM_NAMES[chars.mangdu.room] + ', 밍끼는 ' + ROOM_NAMES[chars.mingki.room] + '에 있어요.';
  }

  function wander(who) {
    const c = chars[who];
    if (!c) return;
    const keys = Object.keys(SPOTS).filter((k) => k !== c.room);
    let target;
    const other = who === 'mangdu' ? chars.mingki : chars.mangdu;
    if (other.room !== c.room && Math.random() < 0.34) {
      target = other.room; // 가끔 만나러 감
    } else {
      target = pick(keys);
    }
    placeChar(who, target, true);
    window.setTimeout(() => say(who, roomLine(who, target)), 700);
  }

  function scheduleWander(who) {
    const c = chars[who];
    if (!c) return;
    window.clearTimeout(c.timer);
    c.timer = window.setTimeout(() => {
      if (!document.hidden) wander(who);
      scheduleWander(who);
    }, 5200 + Math.random() * 3200);
  }

  // 초기 배치
  placeChar('mangdu', 'lounge', false);
  placeChar('mingki', 'golf', false);
  chars.mangdu.bubble.querySelector('.say').textContent = '안녕! 나는 망두야 ㅁ';
  chars.mingki.bubble.querySelector('.say').textContent = '레슨 갈 준비 중이야~';
  chars.mangdu.bubble.classList.remove('is-hiding');
  chars.mingki.bubble.classList.remove('is-hiding');
  if (window.innerWidth < 640) chars.mingki.bubble.classList.add('is-hiding');
  updateMapNow();

  scheduleWander('mangdu');
  scheduleWander('mingki');

  ['mangdu', 'mingki'].forEach((who) => {
    const c = chars[who];
    c.el.addEventListener('click', () => {
      c.el.classList.remove('is-hop');
      void c.el.offsetWidth;
      c.el.classList.add('is-hop');
      window.setTimeout(() => c.el.classList.remove('is-hop'), 460);
      const text = roomLine(who, c.room);
      c.bubble.classList.remove('is-hiding');
      const node = c.bubble.querySelector('.say');
      if (node) node.textContent = text;
    });
  });

  /* ─────────── 메모장 ─────────── */
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
    memoCount.textContent = memoBox.value.length + '자';
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

  /* ─────────── 체크리스트 ─────────── */
  const todoForm = $('#todoForm');
  const todoInput = $('#todoInput');
  const todoList = $('#todoList');
  const todoEmpty = $('#todoEmpty');
  const listState = $('#listState');
  let todos = read(STORE.todo, []);
  if (!Array.isArray(todos)) todos = [];

  function saveTodos() {
    write(STORE.todo, todos);
  }

  function renderTodos() {
    todoList.innerHTML = todos.map((t) => {
      return '<li class="todo-item' + (t.done ? ' is-done' : '') + '" data-id="' + t.id + '">' +
        '<button class="todo-check" type="button" role="checkbox" aria-checked="' + (t.done ? 'true' : 'false') + '" aria-label="' + (t.done ? '완료 취소' : '완료') + '"></button>' +
        '<span class="todo-text">' + escapeHtml(t.text) + '</span>' +
        '<button class="todo-del" type="button" aria-label="삭제">✕</button>' +
        '</li>';
    }).join('');

    const done = todos.filter((t) => t.done).length;
    listState.textContent = done + ' / ' + todos.length;
    todoEmpty.hidden = todos.length > 0;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function addTodo(text) {
    const value = String(text || '').trim();
    if (!value) return;
    const dup = todos.some((t) => t.text === value);
    if (dup) return;
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
  const savedTab = read(STORE.tab, 'map');
  if (savedTab && panels[savedTab]) activateTab(savedTab, { silent: true });

  /* ─────────── 페이지 복귀 시 시계 갱신 ─────────── */
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      renderClock();
      renderToday();
      if (ddayEl) ddayEl.textContent = ddayText();
    }
  });
})();
