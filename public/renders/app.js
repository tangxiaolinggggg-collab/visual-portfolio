const works = [
  '编织线.jpg','冰激凌机.jpg','冰桶.jpg','充电宝.jpg','充电宝1.jpg','充电宝2.jpg','充电宝3.jpg','吹风机A.jpg','吹风机B.jpg','大口径慢榨机.jpg','电源.jpg','电源1.jpg','多士炉主图--黑色.jpg','多士炉主图.jpg','耳机迷你.jpg','耳机套.jpg','硅胶手机壳.jpg','硅胶透明壳.jpg','滑雪包.jpg','划船机.jpg','划船机2.jpg','划船机爆炸图.jpg','划船机背面.jpg','划船机配件.jpg','划船机水箱.jpg','划船机头部.jpg','划船机小型.jpg','划船机小型1.jpg','划船机座垫.jpg','卷管器.jpg','咖啡机.jpg','空炸.jpg','垃圾处理.jpg','懒人车.jpg','懒人车内部.jpg','懒人车配件.jpg','亮面耳机.jpg','亮面耳机1.jpg','露营床.jpg','灭蚊灯.jpg','磨砂耳机.jpg','曲线耳机.jpg','曲线耳机1.jpg','手持搅拌机.jpg','水阻划船机.jpg','水阻划船机1.jpg','水阻划船机2.jpg','水阻划船机3.jpg','水阻划船机4.jpg','四炉多士炉.jpg','透明壳.jpg','椭圆机.jpg','椭圆机1.jpg','椭圆机2.jpg','音箱.jpg','银色动感单车.jpg','转接器.jpg','走步机.jpg','走步机1.jpg','X型单车.jpg'
];

const grid = document.querySelector('#gallery-grid');
const viewer = document.querySelector('#viewer');
const viewerImage = document.querySelector('#viewer-image');
const viewerTitle = document.querySelector('#viewer-title');
const stage = document.querySelector('#viewer-stage');
const viewerTip = document.querySelector('#viewer-tip');
const autoScroll = { paused: false, hoverPaused: false, pointerPaused: false, lastTimestamp: null, position: null, resumeAt: 0, direction: 1, speed: 87.36 };
const usesTouchScroll = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
const srcFor = name => `assets/${encodeURIComponent(name.replace(/\.[^.]+$/, '.webp'))}`;
const titleFor = name => name.replace(/\.jpg$/i, '').replace(/([A-Z])(?=\d)/g, '$1 ');

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const coffeeIndex = works.indexOf('咖啡机.jpg');
const iceCreamMakerIndex = works.indexOf('冰激凌机.jpg');
[works[coffeeIndex], works[iceCreamMakerIndex]] = [works[iceCreamMakerIndex], works[coffeeIndex]];
const exerciseBikeIndex = works.indexOf('X型单车.jpg');
const powerBankIndex = works.indexOf('充电宝.jpg');
[works[exerciseBikeIndex], works[powerBankIndex]] = [works[powerBankIndex], works[exerciseBikeIndex]];
const walkingPadIndex = works.indexOf('走步机1.jpg');
const ellipticalIndex = works.indexOf('椭圆机1.jpg');
[works[walkingPadIndex], works[ellipticalIndex]] = [works[ellipticalIndex], works[walkingPadIndex]];
const bikeForIceCreamIndex = works.indexOf('X型单车.jpg');
const iceCreamForBikeIndex = works.indexOf('冰激凌机.jpg');
[works[bikeForIceCreamIndex], works[iceCreamForBikeIndex]] = [works[iceCreamForBikeIndex], works[bikeForIceCreamIndex]];
const powerBankDeskIndex = works.indexOf('充电宝1.jpg');
const braidedCableIndex = works.indexOf('编织线.jpg');
[works[powerBankDeskIndex], works[braidedCableIndex]] = [works[braidedCableIndex], works[powerBankDeskIndex]];
const bikeForCoffeeIndex = works.indexOf('X型单车.jpg');
const coffeeForBikeIndex = works.indexOf('咖啡机.jpg');
[works[bikeForCoffeeIndex], works[coffeeForBikeIndex]] = [works[coffeeForBikeIndex], works[bikeForCoffeeIndex]];
const iceCreamForEarbudsIndex = works.indexOf('冰激凌机.jpg');
const glossyEarbudsIndex = works.indexOf('亮面耳机.jpg');
[works[iceCreamForEarbudsIndex], works[glossyEarbudsIndex]] = [works[glossyEarbudsIndex], works[iceCreamForEarbudsIndex]];
const mosquitoLampIndex = works.indexOf('灭蚊灯.jpg');
const siliconeCaseIndex = works.indexOf('硅胶手机壳.jpg');
[works[mosquitoLampIndex], works[siliconeCaseIndex]] = [works[siliconeCaseIndex], works[mosquitoLampIndex]];
const iceCreamForHoseReelIndex = works.indexOf('冰激凌机.jpg');
const hoseReelIndex = works.indexOf('卷管器.jpg');
[works[iceCreamForHoseReelIndex], works[hoseReelIndex]] = [works[hoseReelIndex], works[iceCreamForHoseReelIndex]];
const powerBankForSpeakerIndex = works.indexOf('充电宝.jpg');
const speakerForPowerBankIndex = works.indexOf('音箱.jpg');
[works[powerBankForSpeakerIndex], works[speakerForPowerBankIndex]] = [works[speakerForPowerBankIndex], works[powerBankForSpeakerIndex]];

document.querySelector('#work-count').textContent = `${String(works.length).padStart(2, '0')} SELECTED WORKS`;

works.forEach((name, index) => {
  const work = document.createElement('button');
  work.className = 'work';
  work.type = 'button';
  work.setAttribute('aria-label', `查看 ${titleFor(name)} 原图`);
  work.innerHTML = `<img loading="${index < 8 ? 'eager' : 'lazy'}" decoding="async" src="${srcFor(name)}" alt="${titleFor(name)}" />`;
  work.addEventListener('click', () => openViewer(name));
  work.addEventListener('mouseenter', () => {
    autoScroll.hoverPaused = true;
    autoScroll.lastTimestamp = null;
  });
  work.addEventListener('mouseleave', () => {
    autoScroll.hoverPaused = false;
    autoScroll.lastTimestamp = null;
  });
  grid.append(work);
});

function centerScroll() {
  stage.scrollTop = Math.max(0, (stage.scrollHeight - stage.clientHeight) / 2);
}

function setFitView(fit) {
  viewer.classList.toggle('fit-view', fit);
  viewerImage.setAttribute('aria-pressed', String(fit));
  viewerTip.textContent = fit
    ? '适应展示框 · 单击恢复原图 · ESC 关闭'
    : '原图尺寸 · 单击适应展示框 · ESC 关闭';
  if (!fit) requestAnimationFrame(() => requestAnimationFrame(centerScroll));
}

function openViewer(name) {
  setFitView(false);
  viewerImage.addEventListener('load', centerScroll, { once: true });
  viewerImage.src = srcFor(name);
  viewerImage.alt = titleFor(name);
  viewerTitle.textContent = titleFor(name);
  autoScroll.paused = true;
  document.body.classList.add('viewer-open');
  viewer.showModal();
  requestAnimationFrame(() => requestAnimationFrame(centerScroll));
}

document.querySelector('#viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
viewerImage.addEventListener('click', () => setFitView(!viewer.classList.contains('fit-view')));
viewerImage.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    setFitView(!viewer.classList.contains('fit-view'));
  }
});
viewer.addEventListener('close', () => {
  autoScroll.paused = false;
  autoScroll.lastTimestamp = null;
  autoScroll.position = null;
  document.body.classList.remove('viewer-open');
});

function keepScrolling(timestamp) {
  if (autoScroll.paused || autoScroll.hoverPaused || autoScroll.pointerPaused) {
    autoScroll.lastTimestamp = null;
    autoScroll.position = null;
  } else if (timestamp < autoScroll.resumeAt) {
    autoScroll.lastTimestamp = null;
  } else {
    if (autoScroll.lastTimestamp !== null && autoScroll.position !== null) {
      const elapsed = Math.min(timestamp - autoScroll.lastTimestamp, 100);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      autoScroll.position += autoScroll.direction * (autoScroll.speed * elapsed) / 1000;
      if (autoScroll.position >= maxScroll) {
        autoScroll.position = maxScroll;
        autoScroll.direction = -1;
      } else if (autoScroll.position <= 0) {
        autoScroll.position = 0;
        autoScroll.direction = 1;
      }
      window.scrollTo(0, autoScroll.position);
    } else {
      autoScroll.position = window.scrollY;
    }
    autoScroll.lastTimestamp = timestamp;
  }
  requestAnimationFrame(keepScrolling);
}

if (!usesTouchScroll) {
  window.addEventListener('wheel', () => {
    autoScroll.resumeAt = performance.now() + 120;
    requestAnimationFrame(() => {
      autoScroll.position = window.scrollY;
      autoScroll.lastTimestamp = null;
    });
  }, { passive: true });

  window.addEventListener('pointerdown', () => {
    autoScroll.pointerPaused = true;
    autoScroll.lastTimestamp = null;
  }, { passive: true });

  function resumeAfterPointer() {
    if (!autoScroll.pointerPaused) return;
    autoScroll.pointerPaused = false;
    autoScroll.position = window.scrollY;
    autoScroll.lastTimestamp = null;
  }

  window.addEventListener('pointerup', resumeAfterPointer, { passive: true });
  window.addEventListener('pointercancel', resumeAfterPointer, { passive: true });
  window.addEventListener('scroll', () => {
    if (autoScroll.pointerPaused) autoScroll.position = window.scrollY;
  }, { passive: true });
}

if (usesTouchScroll) {
  const pauseForTouch = () => {
    autoScroll.pointerPaused = true;
    autoScroll.lastTimestamp = null;
  };
  const resumeAfterTouch = () => {
    autoScroll.pointerPaused = false;
    autoScroll.position = window.scrollY;
    autoScroll.lastTimestamp = null;
    // Let native inertial scrolling finish before animation takes over again.
    autoScroll.resumeAt = performance.now() + 260;
  };

  window.addEventListener('touchstart', pauseForTouch, { passive: true });
  window.addEventListener('touchend', resumeAfterTouch, { passive: true });
  window.addEventListener('touchcancel', resumeAfterTouch, { passive: true });
  window.addEventListener('scroll', () => {
    const movedByVisitor = autoScroll.position === null || Math.abs(window.scrollY - autoScroll.position) > 1;
    if (movedByVisitor) {
      autoScroll.position = window.scrollY;
      autoScroll.lastTimestamp = null;
      autoScroll.resumeAt = performance.now() + 260;
    }
  }, { passive: true });
}

window.addEventListener('pageshow', () => {
  window.scrollTo(0, 0);
  autoScroll.position = 0;
  autoScroll.lastTimestamp = null;
}, { once: true });

window.addEventListener('load', () => {
  window.setTimeout(() => requestAnimationFrame(keepScrolling), 500);
}, { once: true });
