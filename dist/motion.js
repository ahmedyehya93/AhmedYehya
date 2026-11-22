(()=>{const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#site-nav');if(menu&&nav){menu.onclick=()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)};nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}})}if(!reduce&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.section-head,.service-card,.steps>div,.timeline article,.service-overview,.scope-grid article,.delivery,.service-proof,.faq').forEach(el=>{el.classList.add('reveal');io.observe(el)})}const track=document.querySelector('#projects');if(track){const prev=document.querySelector('#project-prev'),next=document.querySelector('#project-next'),status=document.querySelector('#carousel-status');const rtl = document.documentElement.dir === 'rtl';
const direction = rtl ? -1 : 1;
const autoplay = document.querySelector('#project-autoplay');
const rotationDelay = 10_000;
let rotationEnabled = !reduce;
let timer;
let targetIndex = null;
let settleTimer;
let inView = !('IntersectionObserver' in window);
let hovering = false;
let pointerActive = false;
const behavior = reduce ? 'instant' : 'smooth';
const endReached = () => Math.abs(track.scrollLeft) + track.clientWidth >= track.scrollWidth - 3;
function cardOffset(card) {
  const viewport = track.getBoundingClientRect();
  const bounds = card.getBoundingClientRect();
  return rtl ? bounds.right - viewport.right : bounds.left - viewport.left;
}
function nearestCard(cards) {
  return cards.reduce((best, card, index) =>
    Math.abs(cardOffset(card)) < Math.abs(cardOffset(cards[best])) ? index : best, 0);
}
function update() {
  prev.disabled = next.disabled = track.childElementCount < 2;
  updateDots();
  scheduleRotation();
}
function move(step) {
  const cards = [...track.children];
  if (cards.length < 2) return;
  const index = targetIndex ?? currentCard(cards);
  go((index + step + cards.length) % cards.length);
  scheduleRotation();
}
prev.onclick = () => move(-1);
next.onclick = () => move(1);
track.addEventListener('keydown', event => {
  if (event.target === track && ['ArrowRight', 'ArrowLeft'].includes(event.key)) {
    event.preventDefault();
    move(direction * (event.key === 'ArrowRight' ? 1 : -1));
  }
});
track.addEventListener('scroll', () => {
  if (targetIndex !== null) waitForScrollToSettle();
  update();
}, {passive:true});
new ResizeObserver(update).observe(track);
new MutationObserver(() => {
  clearScrollTarget();
  track.scrollTo({left: 0, behavior: 'instant'});
  buildDots();
  update();
}).observe(track, {childList:true});
const dots=document.createElement('div');dots.className='carousel-dots';dots.setAttribute('role','group');dots.setAttribute('aria-label',rtl?'اختر دراسة حالة':'Choose a case study');track.after(dots);
let gesture=null,suppressUntil=0;
function go(index) {
  const cards = [...track.children];
  if (!cards.length) return;
  const nextIndex = Math.max(0, Math.min(cards.length - 1, index));
  const left = track.scrollLeft + cardOffset(cards[nextIndex]);
  targetIndex = nextIndex;
  track.scrollTo({left, behavior});
  waitForScrollToSettle();
}

function clearScrollTarget() {
  clearTimeout(settleTimer);
  targetIndex = null;
}

function waitForScrollToSettle() {
  clearTimeout(settleTimer);
  settleTimer = setTimeout(clearScrollTarget, 180);
}
function buildDots() {
  dots.replaceChildren();
  [...track.children].forEach((card, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', (rtl ? 'اعرض مشروع ' : 'Show ') + card.querySelector('h3').textContent);
    button.onclick = () => go(index);
    dots.append(button);
  });
}
function currentCard(cards) {
  return endReached() ? Math.max(0, cards.length - 1) : nearestCard(cards);
}

function scheduleRotation() {
  clearTimeout(timer);
  if (!rotationEnabled || !inView || document.hidden || hovering || pointerActive ||
      track.contains(document.activeElement) || track.childElementCount < 2) return;
  timer = setTimeout(() => move(1), rotationDelay);
}

function updateAutoplayButton() {
  autoplay.textContent = rotationEnabled
    ? (rtl ? 'إيقاف العرض التلقائي' : 'Pause autoplay')
    : (rtl ? 'تشغيل العرض التلقائي' : 'Start autoplay');
}

autoplay.hidden = false;
autoplay.addEventListener('click', () => {
  rotationEnabled = !rotationEnabled;
  updateAutoplayButton();
  scheduleRotation();
});
updateAutoplayButton();
track.addEventListener('pointerenter', event => {
  if (event.pointerType === 'mouse') {
    hovering = true;
    scheduleRotation();
  }
});
track.addEventListener('pointerleave', () => { hovering = false; scheduleRotation(); });
track.addEventListener('pointerdown', () => {
  clearScrollTarget();
  pointerActive = true;
  scheduleRotation();
});
track.addEventListener('wheel', clearScrollTarget, {passive:true});
function releasePointer() {
  pointerActive = false;
  scheduleRotation();
}
window.addEventListener('pointerup', releasePointer);
window.addEventListener('pointercancel', releasePointer);
window.addEventListener('blur', releasePointer);
track.addEventListener('focusin', scheduleRotation);
track.addEventListener('focusout', () => queueMicrotask(scheduleRotation));
document.addEventListener('visibilitychange', scheduleRotation);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    scheduleRotation();
  }, {threshold: .2}).observe(track);
}

function updateDots() {
  const cards = [...track.children];
  const index = currentCard(cards);
  status.textContent = rtl ? `${index + 1} من ${cards.length}` : `${index + 1} / ${cards.length}`;
  [...dots.children].forEach((button, position) => {
    button.classList.toggle('is-active', position === index);
    button.setAttribute('aria-pressed', String(position === index));
  });
}
track.addEventListener('dragstart',e=>e.preventDefault());
track.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0)gesture={id:e.pointerId,x:e.clientX,y:e.clientY,left:track.scrollLeft,index:nearestCard([...track.children]),dragging:false};});
window.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;const dx=e.clientX-gesture.x;if(!gesture.dragging){if(Math.abs(dx)<7||Math.abs(dx)<Math.abs(e.clientY-gesture.y))return;gesture.dragging=true;track.classList.add('is-dragging');track.setPointerCapture(e.pointerId);}e.preventDefault();track.scrollLeft=gesture.left-dx;});
function finishDrag(e){if(!gesture||gesture.id!==e.pointerId)return;const g=gesture;gesture=null;if(!g.dragging)return;suppressUntil=performance.now()+450;const cs=[...track.children],dx=e.clientX-g.x;let n=g.index;if(Math.abs(dx)>=35){const step=(cs[0]?.getBoundingClientRect().width||track.clientWidth)+28;n+=direction*Math.sign(-dx)*Math.max(1,Math.round(Math.abs(dx)/step));}track.classList.remove('is-dragging');if(track.hasPointerCapture(e.pointerId))track.releasePointerCapture(e.pointerId);go(n);}
window.addEventListener('pointerup',finishDrag);window.addEventListener('pointercancel',finishDrag);
window.addEventListener('blur',()=>{if(gesture){track.classList.remove('is-dragging');gesture=null;}});
track.addEventListener('click',e=>{if(performance.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
buildDots();update();
}const service=new URLSearchParams(location.search).get('service');const message=document.querySelector('#contact-message');const names={'on-page-seo':'On-Page SEO','off-page-seo':'Off-Page SEO','technical-seo':'Technical SEO'};if(message&&names[service]){
  const arabicNames={'on-page-seo':'تحسين محتوى الصفحات','off-page-seo':'تحسين الحضور خارج الموقع','technical-seo':'تحسين الجوانب التقنية للموقع'};
  message.value=document.documentElement.lang==='ar' ? `أود التحدث معك بشأن ${arabicNames[service]}. ` : `I would like to discuss ${names[service]} for my website. `;
}})();
