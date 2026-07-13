// ============ NAV: scroll state + mobile toggle ============
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function onScroll(){
  if (window.scrollY > 40) nav.classList.add('is-scrolled');
  else nav.classList.remove('is-scrolled');
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('is-open'));
});

// ============ SIGNATURE ELEMENT: pen-drawn ink dividers ============
// Each divider gets a wandering hand-drawn line (like a pen stroke across
// the page) plus a small ink blot, which "writes" itself in when scrolled
// into view — echoing the fountain pen / journal artwork used across the site.
const dividers = document.querySelectorAll('[data-ink]');

function buildInkSVG(seed){
  const w = 1200, h = 90;
  // simple deterministic wander so it still looks hand-drawn but is stable
  const amp = 18 + (seed % 3) * 6;
  const y1 = h/2 + amp, y2 = h/2 - amp, y3 = h/2 + amp/1.5, y4 = h/2;
  const path = `M -20 ${y1} C ${w*0.2} ${y2}, ${w*0.35} ${y3}, ${w*0.5} ${y4} S ${w*0.8} ${y1}, ${w+20} ${y2}`;
  const blotX = w * (0.15 + (seed % 4) * 0.2);
  const blotY = h/2 + (seed % 2 === 0 ? 10 : -10);
  return `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path class="ink-path" d="${path}"></path>
      <g class="ink-blot" transform="translate(${blotX}, ${blotY})">
        <circle r="3.2" cx="0" cy="0"></circle>
        <circle r="1.4" cx="10" cy="6"></circle>
        <circle r="0.8" cx="17" cy="10"></circle>
      </g>
    </svg>`;
}

dividers.forEach((el, i) => {
  el.innerHTML = buildInkSVG(i);
  const blot = el.querySelector('.ink-blot');
  const isLight = el.classList.contains('ink-divider-light');
  blot.querySelectorAll('circle').forEach(c => {
    c.setAttribute('fill', isLight ? 'var(--oxblood)' : 'var(--gold)');
  });
});

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('is-drawn');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

dividers.forEach(el => io.observe(el));

// ============ Reveal-on-scroll for cards (subtle, respects reduced motion) ============
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced){
  const revealTargets = document.querySelectorAll(
    '.objective-card, .challenge-card, .team-card, .program-item, .fact'
  );
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.animation = 'fadeUp .7s ease forwards';
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    revealIO.observe(el);
  });

  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes fadeUp{ from{ opacity:0; transform: translateY(18px);} to{ opacity:1; transform:none;} }`;
  document.head.appendChild(styleTag);
}
