const track = document.querySelector('#track');
const player = document.querySelector('#player');
const video = document.querySelector('#video');
const videoTitle = document.querySelector('#video-title');
const closePlayer = document.querySelector('#player-close');
const cards = [];
const works = [
  { title: '笔记本电脑', image: 'assets/laptop.jpg', video: 'assets/laptop.mp4' },
  { title: '耳夹式耳机', image: 'assets/clip-earbuds.jpg', video: 'assets/clip-earbuds.mp4' },
  { title: '高尔夫球包', image: 'assets/golf-bag.png', video: 'assets/golf-bag.mp4' },
  { title: '猫爬架', image: 'assets/cat-tree.jpg', video: 'assets/cat-tree.mp4' },
  { title: '头戴式耳机', image: 'assets/headphones.jpg', video: 'assets/headphones.mp4' },
  { title: '自动喂食器', image: 'assets/feeder.jpg', video: 'assets/feeder.mp4' }
];
let position = 0;
let velocity = 0;
let target = null;
let dragging = false;
let lastX = 0;
let tapped = null;
let lastTime = performance.now();
let resumeAt = 0;

function makeCard(index) {
  const card = document.createElement('button');
  card.className = 'card';
  card.type = 'button';
  card.setAttribute('aria-label', `播放${works[index].title}视频`);
  card.innerHTML = `<span class="window"><img src="${works[index].image}" alt="${works[index].title}"></span>`;
  card.addEventListener('click', () => {
    if (!dragging && Math.abs(relative(index)) < .35) openPlayer(index);
    else target = nearest(index);
  });
  track.append(card);
  return card;
}
for (let index = 0; index < works.length; index += 1) cards.push(makeCard(index));

function openPlayer(index) {
  const work = works[index];
  videoTitle.textContent = work.title;
  video.src = work.video;
  player.showModal();
  video.play().catch(() => {});
}

function stopPlayer() {
  video.pause();
  video.removeAttribute('src');
  video.load();
  player.close();
}

closePlayer.addEventListener('click', stopPlayer);
player.addEventListener('click', event => { if (event.target === player) stopPlayer(); });
player.addEventListener('close', () => { video.pause(); });

function relative(index) {
  let value = index - position;
  const half = works.length / 2;
  while (value > half) value -= works.length;
  while (value < -half) value += works.length;
  return value;
}
function nearest(index) {
  const base = Math.round((position - index) / works.length) * works.length + index;
  return [base - works.length, base, base + works.length].reduce((best, item) => Math.abs(item - position) < Math.abs(best - position) ? item : best);
}
function windowWidth() { return Math.min(360, Math.max(112, window.innerWidth * .21)); }
function draw() {
  const width = windowWidth();
  const gap = 20;
  // Equal arc lengths keep neighbouring windows 20px apart at the front of the ring.
  const step = 32;
  const radius = (width + gap) / (2 * Math.sin((step * Math.PI) / 360));
  cards.forEach((card, index) => {
    const r = relative(index), a = Math.abs(r);
    const angle = r * step;
    const radians = (angle * Math.PI) / 180;
    const x = radius * Math.sin(radians);
    const z = radius * (Math.cos(radians) - 1);
    const opacity = Math.max(0, 1 - Math.max(0, a - 1) * .28);
    card.style.width = `${width}px`;
    card.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${-angle}deg)`;
    card.style.opacity = opacity;
    card.style.zIndex = String(30 - Math.round(a * 5));
    card.style.filter = `brightness(${1 - Math.min(.58, a * .17)}) saturate(${1 - Math.min(.42, a * .12)})`;
    card.querySelector('.window').style.clipPath = 'none';
    card.classList.toggle('is-center', a < .35);
  });
}
function frame(now) {
  const dt = Math.min(.05, (now - lastTime) / 1000); lastTime = now;
  if (target !== null) { position += (target - position) * Math.min(1, dt * 10); if (Math.abs(target - position) < .002) { position = target; target = null; } }
  else if (!dragging && now > resumeAt) position += dt / 3.2;
  if (!dragging && Math.abs(velocity) > .0008) { position += velocity * dt; velocity *= Math.exp(-3.4 * dt); }
  draw(); requestAnimationFrame(frame);
}
track.addEventListener('pointerdown', event => { dragging = true; target = null; velocity = 0; lastX = event.clientX; tapped = event.target.closest('.card'); resumeAt = performance.now() + 4800; track.setPointerCapture(event.pointerId); });
track.addEventListener('pointermove', event => { if (!dragging) return; const delta = event.clientX - lastX; lastX = event.clientX; if (Math.abs(delta) > 1) tapped = null; position -= delta / windowWidth(); velocity = velocity * .45 - (delta / windowWidth()) * 13; });
function release() { if (!dragging) return; dragging = false; if (tapped && Math.abs(velocity) < .15) { const index = cards.indexOf(tapped); if (Math.abs(relative(index)) < .35) openPlayer(index); else target = nearest(index); } tapped = null; }
track.addEventListener('pointerup', release); track.addEventListener('pointercancel', release);
track.addEventListener('wheel', event => { if (Math.abs(event.deltaY) < 4) return; event.preventDefault(); resumeAt = performance.now() + 4800; velocity += Math.sign(event.deltaY) * .70; }, { passive: false });
window.addEventListener('resize', draw); draw(); requestAnimationFrame(frame);
