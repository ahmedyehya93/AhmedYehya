// Scroll-linked and number animations. Loads after motion.js on every page.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('header');
  const story = document.querySelector('.case-story');
  const timeline = document.querySelector('.timeline');
  const timelineItems = timeline ? [...timeline.querySelectorAll('article')] : [];

  // Colour metrics by what they measure: blue for clicks, violet for impressions.
  const kind = text => /growth/i.test(text) ? 'up' : /click/i.test(text) ? 'clicks' : /impression/i.test(text) ? 'impr' : '';
  document.querySelectorAll('.result-strip > div').forEach(d => {
    const k = kind(d.querySelector('span')?.textContent || '');
    if (k) d.dataset.metric = k;
  });
  document.querySelectorAll('.case-library strong').forEach(s => {
    const k = kind(s.querySelector('small')?.textContent || '');
    if (k) s.dataset.metric = k;
  });

  // Stagger grouped reveals so a row arrives in order rather than all at once.
  document.querySelectorAll('.service-grid, .steps, .timeline, .scope-grid').forEach(group => {
    [...group.children].forEach((child, i) => child.style.setProperty('--delay', `${i * 110}ms`));
  });

  // Header state, case-study reading progress and the timeline line all follow the scroll.
  let queued = false;
  function onScroll() {
    queued = false;
    const vh = innerHeight;
    header?.classList.toggle('is-scrolled', scrollY > 8);
    if (story && header) {
      const r = story.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.35 - r.top) / r.height));
      header.style.setProperty('--read', p.toFixed(4));
    }
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.7 - r.top) / r.height));
      timeline.style.setProperty('--p', p.toFixed(4));
      timelineItems.forEach(a => a.classList.toggle('is-passed', reduce || a.getBoundingClientRect().top < vh * 0.7));
    }
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // Count numbers up when they come into view. Screen readers get the final text only.
  const NUM = /\d+(?:\.\d+)?/g;
  function countUp(el) {
    const node = [...el.childNodes].find(n => n.nodeType === 3 && /\d/.test(n.nodeValue));
    if (!node) return;
    const final = node.nodeValue;
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = final;
    const shown = document.createElement('span');
    shown.setAttribute('aria-hidden', 'true');
    shown.textContent = final;
    node.replaceWith(sr, shown);
    if (reduce) return;
    const values = final.match(NUM) || [];
    const from = el.dataset.from && values.length === 1 ? parseFloat(el.dataset.from) : 0;
    const duration = 1500;
    const frame = (start, now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 4);
      shown.textContent = final.replace(NUM, m => {
        const decimals = (m.split('.')[1] || '').length;
        return (from + (parseFloat(m) - from) * e).toFixed(decimals);
      });
      if (t < 1) requestAnimationFrame(n => frame(start, n));
    };
    shown.textContent = final.replace(NUM, m => from.toFixed((m.split('.')[1] || '').length));
    setTimeout(() => requestAnimationFrame(n => frame(n, n)), +(el.dataset.delay || 0));
  }

  const targets = '.perf-num, .project-result strong, .result-strip strong, .case-library strong';
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { io.unobserve(e.target); countUp(e.target); }
  }), { threshold: 0.5 }) : null;
  function scan() {
    document.querySelectorAll(targets).forEach(el => {
      if (el.dataset.watched) return;
      el.dataset.watched = '1';
      // A rank counting upwards reads as getting worse, so positions stay still.
      if (/position/i.test(el.parentElement.textContent.replace(el.textContent, ''))) return;
      io ? io.observe(el) : countUp(el);
    });
  }
  scan();
  const projects = document.querySelector('#projects');
  if (projects) new MutationObserver(scan).observe(projects, { childList: true });

  // Case-study contents: mark the section being read.
  const links = [...document.querySelectorAll('.case-toc a[href^="#"]')];
  if (links.length && io) {
    const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
      const link = byId.get(e.target.id);
      if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'location'); }
    }), { rootMargin: '-30% 0px -60% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }
})();
