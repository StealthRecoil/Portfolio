(() => {
  'use strict';

  const bootProfiles = {
    home: [
      ['Gledhill Systems // portfolio', 'dim', 0],
      ['CPU: Ryzen workspace  [OK]', '', 160],
      ['GPU: RTX workspace  [OK]', '', 320],
      ['Mounting /portfolio...', 'acc', 500],
      ['Loading systems, software and data...', '', 680],
      ['Verifying experience: Rolls-Royce Motor Cars  [PASS]', '', 880],
      ['Degree status: final year  [READY]', '', 1060],
      ['> kgledhill.com — ready.', 'acc', 1240]
    ],
    cpu: [
      ['CPU_WORKSPACE // Logic World', 'dim', 0],
      ['DATA_WIDTH: 8-bit  [OK]', '', 160],
      ['ALU: ADD  [READY]', '', 320],
      ['RAM / REGISTERS / BUS  [SYNCED]', '', 480],
      ['Loading hardwired control...', '', 640],
      ['> Fibonacci execution workspace ready.', 'acc', 820]
    ],
    placement: [
      ['PLACEMENT_WORKSPACE // Rolls-Royce Motor Cars', 'dim', 0],
      ['Loading manufacturing systems...', '', 150],
      ['Oracle APEX / Python / Power BI  [OK]', '', 320],
      ['Operational delivery record  [MOUNTED]', '', 500],
      ['Placement grade: O+  [CONFIRMED]', '', 680],
      ['> placement overview ready.', 'acc', 840]
    ],
    asset: [
      ['ASSET_TRACKING // production case study', 'dim', 0],
      ['Oracle APEX application  [OK]', '', 150],
      ['QR workflow  [OK]', '', 300],
      ['Zebra REST / ZPL pipeline  [OK]', '', 450],
      ['Power BI reporting  [SYNCED]', '', 600],
      ['> public case study ready.', 'acc', 780]
    ],
    '404': [
      ['ROUTE_LOOKUP // kgledhill.com', 'dim', 0],
      ['Requested resource  [NOT FOUND]', 'err', 180],
      ['> returning control to user.', 'acc', 420]
    ]
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  const bootScreen = document.getElementById('boot');
  const bootLines = document.getElementById('boot-lines');
  const content = document.getElementById('main');

  // Desktop cursor
  if (cursor && ring && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', (event) => { mx = event.clientX; my = event.clientY; }, { passive: true });
    const animateCursor = () => {
      cursor.style.left = `${mx}px`; cursor.style.top = `${my}px`;
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);
  } else {
    if (cursor) cursor.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }

  const revealItems = [...document.querySelectorAll('.reveal')];
  const revealVisible = () => revealItems.forEach((item) => item.classList.add('visible'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealVisible();
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Active navigation: only local hash links participate.
  const navItems = [...document.querySelectorAll('.nav-item')];
  const localNav = navItems.filter((item) => item.getAttribute('href')?.startsWith('#'));
  if ('IntersectionObserver' in window && localNav.length) {
    const linkedSections = localNav.map((item) => document.querySelector(item.getAttribute('href'))).filter(Boolean);
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
        if (!active) return;
        localNav.forEach((item) => item.classList.remove('active'));
        active.classList.add('active');
      });
    }, { threshold: 0.55 });
    linkedSections.forEach((section) => navObserver.observe(section));
  }

  const showContent = () => {
    if (content) content.classList.add('visible');
    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 1.05) item.classList.add('visible');
    });
  };

  if (!bootScreen || !bootLines || !content || reduceMotion) {
    if (bootScreen) bootScreen.style.display = 'none';
    showContent();
    return;
  }

  let seen = false;
  try { seen = sessionStorage.getItem('kg-boot-seen') === '1'; } catch (_) {}

  const finishBoot = (delay = 180) => {
    window.setTimeout(() => {
      bootScreen.classList.add('fade-out');
      showContent();
      window.setTimeout(() => { bootScreen.style.display = 'none'; }, 650);
    }, delay);
  };

  if (seen) {
    const line = document.createElement('div');
    line.className = 'acc';
    line.textContent = '> workspace ready.';
    bootLines.appendChild(line);
    finishBoot(120);
    return;
  }

  const profile = document.body.dataset.bootProfile || 'home';
  const lines = bootProfiles[profile] || bootProfiles.home;
  let completed = 0;
  lines.forEach(([text, className, delay]) => {
    window.setTimeout(() => {
      const line = document.createElement('div');
      line.className = className;
      line.textContent = text;
      bootLines.appendChild(line);
      completed += 1;
      if (completed === lines.length) {
        try { sessionStorage.setItem('kg-boot-seen', '1'); } catch (_) {}
        finishBoot(320);
      }
    }, delay);
  });
})();
