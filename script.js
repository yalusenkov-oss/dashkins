const yes = document.querySelector('#yesButton');
const no = document.querySelector('#noButton');
const reaction = document.querySelector('#reaction');
const cards = Array.from(document.querySelectorAll('.card'));
const nextPhoto = document.querySelector('#nextPhoto');
const letter = document.querySelector('#letter');
const letterYes = document.querySelector('#letterYes');
const letterNo = document.querySelector('#letterNo');
const letterReaction = document.querySelector('#letterReaction');
const letterFinale = document.querySelector('#letterFinale');
let tries = 0;
let letterTries = 0;
let photoIndex = 0;
let tourMoving = false;

function startJourney() {
  yes.classList.add('autopick');
  reaction.textContent = 'вот, так-то лучше ✦';
  document.body.classList.remove('intro');
  setTimeout(() => {
    document.querySelector('.hero').classList.add('completed');
    document.querySelector('#memories').scrollIntoView({ behavior: 'smooth' });
  }, 650);
}

function flee(event) {
  event.preventDefault();
  if (tries >= 4) return;
  tries += 1;
  const messages = ['ты ахуела что ли?', 'аууу, успокойся', 'НАЖМИ ДА', 'ладно, я сам'];
  reaction.textContent = messages[tries - 1];
  if (tries === 4) {
    no.style.visibility = 'hidden';
    startJourney();
    return;
  }
  no.classList.add('fleeing');
  const padding = 20;
  const maxX = Math.max(padding, window.innerWidth - no.offsetWidth - padding);
  const maxY = Math.max(padding, window.innerHeight - no.offsetHeight - padding);
  no.style.left = `${padding + Math.random() * (maxX - padding)}px`;
  no.style.top = `${padding + Math.random() * (maxY - padding)}px`;
  no.style.transform = `rotate(${(Math.random() - .5) * 18}deg)`;
}

function showNextPhoto() {
  if (tourMoving) return;
  tourMoving = true;
  nextPhoto.disabled = true;
  cards[photoIndex].classList.remove('active');
  photoIndex += 1;
  if (photoIndex >= cards.length) {
    nextPhoto.style.display = 'none';
    letter.classList.add('unlocked');
    requestAnimationFrame(() => letter.scrollIntoView({ behavior: 'smooth' }));
    setTimeout(() => letter.classList.add('visible'), 450);
    tourMoving = false;
    return;
  }
  const nextCard = cards[photoIndex];
  nextCard.classList.add('revealed', 'active');
  const cardTop = nextCard.getBoundingClientRect().top + window.scrollY;
  const centeredTop = cardTop - Math.max(24, (window.innerHeight - nextCard.offsetHeight) / 2);
  window.scrollTo({ top: Math.max(window.scrollY, centeredTop), behavior: 'smooth' });
  if (photoIndex === cards.length - 1) nextPhoto.innerHTML = 'Перейти к письму <span>→</span>';
  setTimeout(() => {
    tourMoving = false;
    nextPhoto.disabled = false;
  }, 560);
}

yes.addEventListener('click', startJourney);
nextPhoto.addEventListener('click', showNextPhoto);
no.addEventListener('pointerdown', flee);
no.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') flee(event); });

function fleeLetter(event) {
  event.preventDefault();
  letterTries += 1;
  const messages = ['неа, так не пойдёт', 'давай без этого', 'НАЖМИ ДА', 'вот, так и знал'];
  letterReaction.textContent = messages[Math.min(letterTries, 4) - 1];
  if (letterTries >= 4) {
    letterNo.style.visibility = 'hidden';
    letterYes.classList.add('autopick');
    setTimeout(completeLetter, 450);
    return;
  }
  letterNo.classList.add('fleeing');
  const padding = 20;
  const maxX = Math.max(padding, window.innerWidth - letterNo.offsetWidth - padding);
  const maxY = Math.max(padding, window.innerHeight - letterNo.offsetHeight - padding);
  letterNo.style.left = `${padding + Math.random() * (maxX - padding)}px`;
  letterNo.style.top = `${padding + Math.random() * (maxY - padding)}px`;
}

function completeLetter() {
  letterReaction.textContent = 'конечно, договорились ✦';
  letterFinale.classList.add('visible');
}

letterYes.addEventListener('click', completeLetter);
letterNo.addEventListener('pointerdown', fleeLetter);
letterNo.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') fleeLetter(event); });

new IntersectionObserver((entries, observer) => {
  if (entries[0].isIntersecting) {
    letter.classList.add('visible');
    observer.disconnect();
  }
}, { threshold: .2 }).observe(letter);
