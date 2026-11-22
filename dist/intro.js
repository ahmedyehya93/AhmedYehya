(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) return;

  const key = 'ay-portfolio-intro';
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, 'seen');
  } catch {
    return;
  }

  const arabic = document.documentElement.lang === 'ar';
  const logo = new URL('assets/seo-lens.svg', document.currentScript.src).href;
  const intro = document.createElement('div');
  intro.className = 'site-intro';
  intro.setAttribute('aria-hidden', 'true');
  intro.innerHTML = `
    <div class="intro-panel">
      <div class="intro-chart">
        <div class="intro-legend"><span>${arabic ? 'النقرات' : 'Clicks'}</span><span>${arabic ? 'مرات الظهور' : 'Impressions'}</span></div>
        <svg viewBox="0 0 400 150" fill="none" aria-hidden="true">
          <path class="intro-grid" d="M10 24H390 M10 64H390 M10 104H390 M10 144H390 M10 24V144 M86 24V144 M162 24V144 M238 24V144 M314 24V144 M390 24V144"/>
          <path class="intro-trend intro-impressions" pathLength="1" d="M10 137 L58 130 L105 132 L153 114 L200 103 L248 106 L295 85 L343 78 L390 54"/>
          <path class="intro-trend intro-clicks" pathLength="1" d="M10 123 L58 119 L105 102 L153 108 L200 79 L248 82 L295 55 L343 61 L390 28"/>
        </svg>
      </div>
      <div class="intro-signature">
        <img src="${logo}" width="120" height="120" alt="">
        <strong>${arabic ? 'أحمد يحيى' : 'Ahmed Yehya'}</strong>
      </div>
    </div>`;

  function dismiss() {
    intro.remove();
    window.removeEventListener('keydown', dismiss);
    window.removeEventListener('pagehide', dismiss);
  }

  intro.addEventListener('animationend', event => {
    if (event.target === intro) dismiss();
  });
  intro.addEventListener('pointerdown', dismiss, {once: true});
  window.addEventListener('keydown', dismiss, {once: true});
  window.addEventListener('pagehide', dismiss, {once: true});
  window.setTimeout(dismiss, 2400);
  document.body.prepend(intro);
})();
