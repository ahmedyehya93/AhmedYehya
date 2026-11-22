const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const controls = carousel.querySelector('.carousel-controls');
  const previous = controls.querySelector('[data-step="-1"]');
  const next = controls.querySelector('[data-step="1"]');
  const status = controls.querySelector('output');

  function slideOffsets() {
    const slides = [...track.children];
    const start = slides[0]?.offsetLeft ?? 0;
    const max = track.scrollWidth - track.clientWidth;
    return [...new Set(slides.map(slide => Math.min(max, slide.offsetLeft - start)))];
  }

  function update() {
    const offsets = slideOffsets();
    const index = offsets.findIndex(offset => offset >= track.scrollLeft - 2);
    const label = offsets.length ? `${index < 0 ? offsets.length : index + 1} / ${offsets.length}` : '';
    if (status.value !== label) status.value = label;
    controls.hidden = offsets.length < 2;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  }

  function move(direction) {
    const offsets = slideOffsets();
    const target = direction > 0
      ? offsets.find(offset => offset > track.scrollLeft + 2)
      : offsets.reverse().find(offset => offset < track.scrollLeft - 2);
    if (target !== undefined) {
      track.scrollTo({ left: target, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(track);
  new MutationObserver(() => {
    track.scrollTo({ left: 0, behavior: 'instant' });
    update();
  }).observe(track, { childList: true });
  update();
});
