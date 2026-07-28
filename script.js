// Smooth scroll helper
function scrollToSection(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}

// Fade-in on scroll
const fadeEls = document.querySelectorAll('.fade-in');
function handleScroll(){
  const trigger = window.innerHeight * 0.9;
  fadeEls.forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < trigger) el.classList.add('visible');
  });
}
window.addEventListener('load', handleScroll);
window.addEventListener('scroll', handleScroll);

// Intro animation trigger
(function runIntro(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.documentElement.classList.add('intro-start');
    fadeEls.forEach(el => el.classList.add('visible'));
    return;
  }

  function start() {
    setTimeout(() => {
      document.documentElement.classList.add('intro-start');
    }, 80);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

// Keyboard activation for buttons
document.addEventListener('keydown', function(e){
  if ((e.key === 'Enter' || e.key === ' ') &&
      document.activeElement &&
      document.activeElement.classList.contains('btn')) {
    e.preventDefault();
    document.activeElement.click();
  }
});

function openProject(url) {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = url;
  }, 500);
}

// Fix: when returning to this page via swipe-back, the phone's back button,
// or browser back/forward, mobile browsers often restore this exact page
// from cache (bfcache) instead of reloading it — including the "fade-out"
// class added right before we navigated away, which left it stuck at
// opacity:0 (looking like a blank page). "pageshow" fires on that restore
// too, so we clear the class every time to guarantee the page is visible.
window.addEventListener('pageshow', function(event){
  document.body.classList.remove('fade-out');
});

// Tagline animation for "Building. Testing. Breaking. Learning. Improving."
// Desktop: types the full line left-to-right in place, pauses, clears, repeats.
// Phone (<=600px): no typing/cursor movement — words fade in one at a time,
// held static on the left, then fade out and the next word fades in. Loops.
(function initTaglineAnimation(){
  const textEl = document.getElementById('tagline-text');
  if (!textEl) return;

  const fullText = "Building. Testing. Breaking. Learning. Improving.";
  const words = ["Building.", "Testing.", "Breaking.", "Learning.", "Improving."];

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = window.matchMedia('(max-width: 600px)'); // phone breakpoint

  let stopCurrent = null;

  // Desktop / tablet: character-by-character typewriter loop
  function runDesktopTypewriter(){
    const typingSpeed = 70;         // ms per character while typing
    const pauseAfterTyping = 1600;  // ms to hold the full line before clearing
    const pauseBeforeRetype = 300;  // ms blank pause before typing starts again
    const startDelay = 900;         // ms wait so the intro fade-up finishes first

    let charIndex = 0;
    let cancelled = false;
    let timer = null;

    function typeStep(){
      if (cancelled) return;
      charIndex++;
      textEl.textContent = fullText.slice(0, charIndex);
      if (charIndex < fullText.length) {
        timer = setTimeout(typeStep, typingSpeed);
      } else {
        timer = setTimeout(() => {
          if (cancelled) return;
          textEl.textContent = '';
          charIndex = 0;
          timer = setTimeout(typeStep, pauseBeforeRetype);
        }, pauseAfterTyping);
      }
    }

    timer = setTimeout(typeStep, startDelay);

    return function stop(){
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }

  // Phone: static-position typewriter — types one word, pauses, deletes it,
  // then types the next word in the exact same spot. Loops through all words.
  function runMobileWordTypewriter(){
    const typingSpeed = 70;       // ms per character while typing a word
    const deletingSpeed = 40;     // ms per character while deleting a word
    const holdMs = 900;           // ms to hold the finished word before deleting
    const pauseBeforeNext = 250;  // ms blank pause before the next word starts typing
    const startDelay = 900;       // ms wait so the intro fade-up finishes first

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let cancelled = false;
    let timer = null;

    function tick(){
      if (cancelled) return;
      const currentWord = words[wordIndex];

      if (!deleting) {
        charIndex++;
        textEl.textContent = currentWord.slice(0, charIndex);
        if (charIndex === currentWord.length) {
          timer = setTimeout(() => { deleting = true; tick(); }, holdMs);
        } else {
          timer = setTimeout(tick, typingSpeed);
        }
      } else {
        charIndex--;
        textEl.textContent = currentWord.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timer = setTimeout(tick, pauseBeforeNext);
        } else {
          timer = setTimeout(tick, deletingSpeed);
        }
      }
    }

    timer = setTimeout(tick, startDelay);

    return function stop(){
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }

  function start(){
    if (stopCurrent) { stopCurrent(); stopCurrent = null; }
    textEl.textContent = '';

    if (prefersReduced) {
      textEl.textContent = fullText;
      return;
    }

    stopCurrent = mobileQuery.matches ? runMobileWordTypewriter() : runDesktopTypewriter();
  }

  function begin(){ start(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', begin);
  } else {
    begin();
  }

  // Re-evaluate if the viewport crosses the phone breakpoint (resize/rotate)
  mobileQuery.addEventListener('change', start);
})();