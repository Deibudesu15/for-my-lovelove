'use strict';
const intro = document.getElementById('intro');
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const question = document.getElementById('question');
const result = document.getElementById('result');
const noButton = document.getElementById('no');
const noMessage = document.getElementById('noMessage');
const confettiLayer = document.getElementById('confetti');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let isOpening = false;
let noDodges = 0;

function openLetter() {
  if (isOpening) return;
  isOpening = true;
  envelope.classList.add('open');
  const delay = reducedMotion ? 0 : 850;
  window.setTimeout(() => {
    intro.classList.add('leaving');
    window.setTimeout(() => {
      intro.hidden = true;
      letter.hidden = false;
      document.getElementById('yes').focus({preventScroll:true});
    }, reducedMotion ? 0 : 400);
  }, delay);
}

envelope.addEventListener('click', openLetter);

function celebrate() {
  const symbols = ['♥','💗','💕','🌸','💖'];
  const count = reducedMotion ? 12 : 65;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-heart';
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.fontSize = `${12 + Math.random() * 17}px`;
    piece.style.setProperty('--duration', `${2.2 + Math.random() * 2.6}s`);
    piece.style.setProperty('--delay', `${Math.random() * .7}s`);
    piece.style.setProperty('--drift', `${Math.random() * 170 - 85}px`);
    piece.style.setProperty('--spin', `${Math.random() * 800 - 400}deg`);
    confettiLayer.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove(), {once:true});
  }
  if (reducedMotion) window.setTimeout(() => confettiLayer.replaceChildren(), 200);
}

document.getElementById('yes').addEventListener('click', () => {
  question.hidden = true;
  result.hidden = false;
  celebrate();
});

// The NO button always stays visible INSIDE the pink letter.
// It dodges the mouse or touch, but never registers a NO choice.
const buttonArea = document.querySelector('.buttons');
let lastDodge = 0;

function dodgeNo(pointerX, pointerY) {
  if (question.hidden || letter.hidden) return;
  const now = performance.now();
  if (now - lastDodge < 140) return;

  const area = buttonArea.getBoundingClientRect();
  const noRect = noButton.getBoundingClientRect();
  const yesRect = document.getElementById('yes').getBoundingClientRect();
  const margin = 5;
  const maxX = Math.max(margin, area.width - noRect.width - margin);
  const maxY = Math.max(margin, area.height - noRect.height - margin);
  let best = null;

  for (let i = 0; i < 45; i++) {
    const x = margin + Math.random() * (maxX - margin);
    const y = margin + Math.random() * (maxY - margin);
    const cx = area.left + x + noRect.width / 2;
    const cy = area.top + y + noRect.height / 2;
    const cursorDistance = Math.hypot(cx - pointerX, cy - pointerY);
    const overlapYes = cx + noRect.width / 2 > yesRect.left - 7 &&
      cx - noRect.width / 2 < yesRect.right + 7 &&
      cy + noRect.height / 2 > yesRect.top - 7 &&
      cy - noRect.height / 2 < yesRect.bottom + 7;
    if (!overlapYes && cursorDistance > 75) {
      best = {x, y};
      break;
    }
  }
  if (!best) return;
  lastDodge = now;
  noButton.classList.add('is-running');
  noButton.style.left = `${best.x}px`;
  noButton.style.top = `${best.y}px`;
  noDodges++;
  noMessage.textContent = ['Bagal naman! 💗', 'Hulihin mo kasi! 🐈‍⬛', 'Try mo po yung isa 🥹💕'][Math.min(noDodges - 1, 2)];
}

document.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch' || question.hidden || letter.hidden) return;
  const rect = noButton.getBoundingClientRect();
  const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
  const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
  if (Math.hypot(dx, dy) < 65) dodgeNo(event.clientX, event.clientY);
}, {passive: true});

noButton.addEventListener('pointerdown', event => {
  event.preventDefault();
  dodgeNo(event.clientX, event.clientY);
});
noButton.addEventListener('click', event => {
  event.preventDefault();
  event.stopPropagation();
  const rect = noButton.getBoundingClientRect();
  dodgeNo(rect.left + rect.width / 2, rect.top + rect.height / 2);
});
noButton.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    const rect = noButton.getBoundingClientRect();
    dodgeNo(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
});

document.getElementById('again').addEventListener('click', () => {
  result.hidden = true;
  question.hidden = false;
  noDodges = 0;
  noMessage.textContent = 'Choose from your heart ♡';
  noButton.classList.remove('is-running');
  noButton.style.left = '';
  noButton.style.top = '';
  confettiLayer.replaceChildren();
  document.getElementById('yes').focus({preventScroll:true});
});

const hearts = document.getElementById('backgroundHearts');
for (let i = 0; i < (reducedMotion ? 8 : 20); i++) {
  const heart = document.createElement('span');
  heart.className = 'bg-heart';
  heart.textContent = '♥';
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.top = `${Math.random() * 100}%`;
  heart.style.fontSize = `${8 + Math.random() * 13}px`;
  heart.style.animationDelay = `${-Math.random() * 5}s`;
  hearts.appendChild(heart);
}
