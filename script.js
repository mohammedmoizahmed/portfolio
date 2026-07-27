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

// Typewriter loop for the tagline ("Building. Testing. Breaking. Learning. Improving.")
// Types the line left-to-right in place, pauses, clears, and repeats.
(function startTaglineTypewriter(){
  const textEl = document.getElementById('tagline-text');
  if (!textEl) return;

  const fullText = "Building. Testing. Breaking. Learning. Improving.";
  const typingSpeed = 70;         // ms per character while typing
  const pauseAfterTyping = 1600;  // ms to hold the full line before clearing
  const pauseBeforeRetype = 300;  // ms blank pause before typing starts again
  const startDelay = 900;         // ms wait so the intro fade-up finishes first

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    textEl.textContent = fullText;
    return;
  }

  let charIndex = 0;

  function typeStep(){
    charIndex++;
    textEl.textContent = fullText.slice(0, charIndex);
    if (charIndex < fullText.length) {
      setTimeout(typeStep, typingSpeed);
    } else {
      setTimeout(() => {
        textEl.textContent = '';
        charIndex = 0;
        setTimeout(typeStep, pauseBeforeRetype);
      }, pauseAfterTyping);
    }
  }

  function begin(){
    setTimeout(typeStep, startDelay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', begin);
  } else {
    begin();
  }
})();