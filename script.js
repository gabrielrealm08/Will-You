// Personalize: Vava's name is set below. Edit further details if you want.
const herName = "Vava"; // Vava's name
const personalHint = "how you smile"; // small personal detail you can change

// Helpers
const $ = sel => document.querySelector(sel);
const openBtn = $('#openBtn');
const cover = $('#cover');
const story = $('#story');
const typingEl = $('#typing');
const extras = $('#extras');
const yesBtn = $('#yesBtn');
const noBtn = $('#noBtn');
const result = $('#result');
const confettiContainer = $('#confetti-container');
const title = $('#title');

// Set title personalization
if (title) title.textContent = `For You, ${herName}`;

// Typing sequence (editable)
const messages = [
  `Hi ${herName} there's something I want to say.`,
  `From the small jokes to the late conversations, you make days warmer.`,
  `You make ordinary moments extraordinary.`,
  `I care about you a lot.`,
  `So I have a question...`
].map(s => s.replace(`[a small personal detail — e.g., "smile when it's raining"]`, personalHint));

// Simple typist
function typeMessages(messages, el, cb){
  let i=0;
  function next(){
    if(i>=messages.length){ cb && cb(); return; }
    typeOne(messages[i], el, () => {
      i++;
      setTimeout(next, 700);
    });
  }
  next();
}

function typeOne(text, el, done){
  el.textContent = '';
  let idx=0;
  const t = setInterval(()=>{
    el.textContent += text[idx++];
    if(idx===text.length){ clearInterval(t); done && done(); }
  }, 30);
}

// Open button event
openBtn.addEventListener('click', () => {
  cover.classList.add('hidden');
  story.classList.remove('hidden');
  typingEl.textContent = '';
  typeMessages(messages, typingEl, () => {
    extras.classList.remove('hidden');
  });
});

// No button behavior: playful but respectful
let noHoverCount = 0;
noBtn.addEventListener('mouseenter', () => {
  // Each time she hovers, move it randomly (not off-screen)
  noHoverCount++;
  const parentRect = noBtn.parentElement.getBoundingClientRect();
  const containerRect = document.body.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  // compute a new x offset relative to parent
  const maxX = Math.max(0, containerRect.width - btnRect.width - 24);
  const maxY = Math.max(0, containerRect.height - btnRect.height - 24);
  const newLeft = Math.random() * maxX;
  const newTop = Math.random() * maxY;
  noBtn.style.position = 'fixed';
  noBtn.style.left = `${newLeft}px`;
  noBtn.style.top = `${newTop}px`;

  // After a few attempts, let it be clickable to avoid pressure
  if(noHoverCount >= 5){
    noBtn.textContent = "Okay...";
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.position = '';
    noBtn.style.opacity = '0.95';
  }
});

// When she clicks Yes
yesBtn.addEventListener('click', async () => {
  showResult(true);
  playWinMelody();
  launchConfetti();
});

// When she clicks No
noBtn.addEventListener('click', () => {
  showResult(false);
});

function showResult(ok){
  extras.classList.add('hidden');
  result.classList.remove('hidden');
  if(ok){
    result.innerHTML = `<h3>Yes! 💖</h3>
    <p>Thank you — I'm so happy. I promise to always try my best for you.</p>
    <p style="margin-top:8px">Want to celebrate? I picked a little place: <strong>[suggest a place]</strong></p>`;
  }else{
    result.innerHTML = `<h3>Thank you for being honest.</h3>
    <p>I respect your feelings and your choice. I value you a lot — no pressure, ever. If you want to talk, I'm here.</p>`;
  }
}

// Simple confetti
function launchConfetti(){
  const count = 70;
  for(let i=0;i<count;i++){
    const conf = document.createElement('div');
    conf.className = 'confetti';
    const size = Math.random()*10 + 6;
    conf.style.position = 'absolute';
    conf.style.width = `${size}px`;
    conf.style.height = `${size*0.6}px`;
    conf.style.left = `${Math.random()*100}%`;
    conf.style.top = `-10%`;
    conf.style.background = randomColor();
    conf.style.opacity = 0.95;
    conf.style.transform = `rotate(${Math.random()*360}deg)`;
    conf.style.borderRadius = '2px';
    conf.style.willChange = 'transform, top, left, opacity';
    conf.style.zIndex = 2001;
    confettiContainer.appendChild(conf);

    // animate
    const fallDuration = 2000 + Math.random()*1600;
    const horiz = (Math.random()-0.5) * 200;
    const rotate = Math.random()*720;
    conf.animate([
      { transform: `translate3d(0,0,0) rotate(0deg)`, opacity:1 },
      { transform: `translate3d(${horiz}px, ${window.innerHeight + 200}px,0) rotate(${rotate}deg)`, opacity:0.9 }
    ], {
      duration: fallDuration,
      easing: 'cubic-bezier(.2,.6,.2,1)'
    });

    // remove later
    setTimeout(()=> conf.remove(), fallDuration + 400);
  }
}

function randomColor(){
  const colors = ['#ff6b81','#ffd86f','#6be3ff','#9bffb3','#b892ff','#ff9aa2'];
  return colors[Math.floor(Math.random()*colors.length)];
}

// Tiny melody using WebAudio
function playWinMelody(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    let now = ctx.currentTime;
    notes.forEach((n,i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = n;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now + i*0.18);
      g.gain.exponentialRampToValueAtTime(0.2, now + i*0.18 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i*0.18 + 0.16);
      o.stop(now + i*0.18 + 0.2);
    });
  }catch(e){
    // audio not supported or blocked; ignore
    console.log('Audio unavailable', e);
  }
}

// Accessibility: allow keyboard to trigger open
openBtn.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' || e.key === ' ') openBtn.click();
});