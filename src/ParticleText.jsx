import { useEffect, useRef } from 'react';
import './ParticleText.css';

const hexToRgb = hex => {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
};

const mixRgb = (from, to, amount) => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount)
});

const rgbToCss = rgb => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

const resolveFontSize = (value, container, fontWeight, fontFamily) => {
  if (typeof value === 'number') return value;

  const probe = document.createElement('span');
  probe.textContent = 'M';
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.fontSize = value;
  probe.style.fontWeight = String(fontWeight);
  probe.style.fontFamily = fontFamily;
  container.appendChild(probe);
  const size = parseFloat(window.getComputedStyle(probe).fontSize) || 96;
  probe.remove();
  return size;
};

const waitForFonts = async font => {
  if (!('fonts' in document)) return;

  try {
    await document.fonts.load(font);
  } catch {}

  await document.fonts.ready;
};

const roundedRect = (context, x, y, width, height, radius) => {
  if (typeof context.roundRect === 'function') {
    context.roundRect(x, y, width, height, radius);
  } else {
    context.rect(x, y, width, height);
  }
};

const drawIcon = (context, icon, x, y, size) => {
  if (!icon) return;

  context.save();
  context.fillStyle = '#ffffff';
  context.strokeStyle = '#ffffff';
  context.lineJoin = 'round';
  context.lineCap = 'round';

  if (icon === 'person') {
    context.beginPath();
    context.arc(x + size * 0.5, y + size * 0.25, size * 0.18, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    roundedRect(context, x + size * 0.12, y + size * 0.5, size * 0.76, size * 0.3, size * 0.15);
    context.fill();
  }

  if (icon === 'phone') {
    const left = x + size * 0.24;
    const top = y + size * 0.05;
    const width = size * 0.52;
    const height = size * 0.9;
    context.beginPath();
    roundedRect(context, left, top, width, height, size * 0.08);
    context.fill();
    context.globalCompositeOperation = 'destination-out';
    context.fillRect(left + size * 0.07, top + size * 0.12, width - size * 0.14, height - size * 0.3);
    context.globalCompositeOperation = 'source-over';
    context.beginPath();
    context.arc(x + size * 0.5, y + size * 0.82, size * 0.04, 0, Math.PI * 2);
    context.fill();
  }

  if (icon === 'mail') {
    const left = x + size * 0.06;
    const top = y + size * 0.22;
    const width = size * 0.88;
    const height = size * 0.58;
    context.beginPath();
    roundedRect(context, left, top, width, height, size * 0.06);
    context.fill();
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = Math.max(1, size * 0.075);
    context.beginPath();
    context.moveTo(left + size * 0.06, top + size * 0.08);
    context.lineTo(x + size * 0.5, top + height * 0.62);
    context.lineTo(left + width - size * 0.06, top + size * 0.08);
    context.stroke();
  }

  context.restore();
};

const ParticleText = ({
  text = 'React Bits',
  icon = null,
  fullScreenScatter = false,
  particleShape = 'auto',
  maxParticles = 3600,
  particleSize = 2,
  density = 4,
  color = '#ffffff',
  highlightColor = '#8b5cf6',
  scatter = 180,
  gatherDuration = 1600,
  stagger = 420,
  pointerRepel = 40,
  repelRadius = 120,
  idleDrift = 0.7,
  trigger = 'mount',
  scatterDuration = 1400,
  fontSize = 'clamp(3rem, 12vw, 8rem)',
  fontWeight = 800,
  fontFamily = 'inherit',
  glow = true,
  className = '',
  onClick,
  onScatterComplete,
  style
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let particles = [];
    let animationFrame = null;
    let resizeFrame = null;
    let buildId = 0;
    let gathering = false;
    let gatherStart = 0;
    let scattering = false;
    let scatterStart = 0;
    let scatterStarted = false;
    let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0
    };
    const repelRadiusSquared = repelRadius * repelRadius;

    const fullCanvasScatterPosition = particle => {
      const edge = Math.min(3, Math.floor(particle.seed * 4));
      const along = (particle.seed * 997 + particle.depth * 37) % 1;
      const inset = 0.04 + ((particle.seed * 613 + particle.depth * 19) % 1) * 0.42;

      if (edge === 0) return { x: along * width, y: inset * height };
      if (edge === 1) return { x: width * (1 - inset), y: along * height };
      if (edge === 2) return { x: along * width, y: height * (1 - inset) };
      return { x: inset * width, y: along * height };
    };

    const startGather = (fromScatter = true) => {
      if (!particles.length) return;

      const now = performance.now();
      const spread = reducedMotion ? 0 : scatter;

      particles.forEach(particle => {
        if (fromScatter) {
          if (fullScreenScatter) {
            const start = fullCanvasScatterPosition(particle);
            particle.x = start.x;
            particle.y = start.y;
          } else {
            const angle = particle.seed * Math.PI * 2;
            const distance = spread * (0.35 + particle.depth * 0.75);
            particle.x = particle.targetX + Math.cos(angle) * distance + (particle.depth - 0.5) * spread * 0.55;
            particle.y = particle.targetY + Math.sin(angle) * distance + (particle.seed - 0.5) * spread * 0.55;
          }
        }

        particle.startX = particle.x;
        particle.startY = particle.y;
        particle.delay = reducedMotion ? 0 : particle.seed * stagger;
      });

      gatherStart = now;
      gathering = true;
    };

    const startScatter = () => {
      if (!particles.length || scatterStarted) return;

      const centerX = width / 2;
      const centerY = height / 2;

      particles.forEach(particle => {
        const side = particle.targetX < centerX ? -1 : 1;
        const edgeDistance = width * (0.62 + particle.seed * 0.56);
        const verticalSpread = (particle.seed - 0.5) * height * 1.35;

        particle.startX = particle.x;
        particle.startY = particle.y;
        // Match the reference transition: the title separates into two soft,
        // expanding particle clouds before both clouds leave the viewport.
        particle.scatterX = centerX + side * edgeDistance;
        particle.scatterY = centerY + verticalSpread;
      });

      gathering = false;
      scattering = true;
      scatterStarted = true;
      scatterStart = performance.now();
    };

    const drawParticle = particle => {
      const size = particle.size;
      ctx.fillStyle = particle.color;

      if (particleShape !== 'circle' && size <= 3) {
        ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);
        return;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = now => {
      ctx.clearRect(0, 0, width, height);

      if (glow && !reducedMotion && particles.length <= 2200) {
        ctx.shadowBlur = particleSize * 1.8;
        ctx.shadowColor = highlightColor;
      } else {
        ctx.shadowBlur = 0;
      }

      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.32;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.32;

      let complete = true;

      particles.forEach(particle => {
        let baseX = particle.targetX;
        let baseY = particle.targetY;
        let progress = 1;

        if (scattering) {
          // Intentionally linear: every particle travels at a constant speed.
          progress = clamp((now - scatterStart) / Math.max(1, scatterDuration), 0, 1);
          baseX = particle.startX + (particle.scatterX - particle.startX) * progress;
          baseY = particle.startY + (particle.scatterY - particle.startY) * progress;
          if (progress < 1) complete = false;
        } else if (gathering) {
          const local = (now - gatherStart - particle.delay) / Math.max(1, reducedMotion ? 1 : gatherDuration);
          progress = clamp(local, 0, 1);
          const eased = easeOutCubic(progress);
          baseX = particle.startX + (particle.targetX - particle.startX) * eased;
          baseY = particle.startY + (particle.targetY - particle.startY) * eased;
          if (progress < 1) complete = false;
        } else if (!reducedMotion && idleDrift > 0) {
          const driftTime = now * 0.001;
          baseX += Math.sin(driftTime * 0.9 + particle.seed * 10) * idleDrift * particle.depth;
          baseY += Math.cos(driftTime * 0.75 + particle.depth * 10) * idleDrift * particle.depth;
        }

        if (!scattering && pointer.active && !reducedMotion && pointerRepel > 0 && repelRadius > 0) {
          const dx = baseX - pointer.smoothX;
          const dy = baseY - pointer.smoothY;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared > 0 && distanceSquared < repelRadiusSquared) {
            const distance = Math.sqrt(distanceSquared);
            const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel;
            baseX += (dx / distance) * force;
            baseY += (dy / distance) * force;
          }
        }

        const follow = scattering || reducedMotion ? 1 : 0.34;
        particle.x += (baseX - particle.x) * follow;
        particle.y += (baseY - particle.y) * follow;

        ctx.globalAlpha = clamp(0.35 + progress * 0.65, 0, 1);
        drawParticle(particle);
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (gathering && complete) {
        gathering = false;
      }

      if (scattering && complete) {
        scattering = false;
        onScatterComplete?.();
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const ensureRenderLoop = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const sampleText = async () => {
      const currentBuild = ++buildId;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);

      if (width <= 0 || height <= 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const computed = window.getComputedStyle(container);
      const resolvedFamily = fontFamily === 'inherit' ? computed.fontFamily || 'sans-serif' : fontFamily;
      let resolvedSize = resolveFontSize(fontSize, container, fontWeight, resolvedFamily);
      let font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;

      await waitForFonts(font);
      if (currentBuild !== buildId) return;

      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      const content = String(text || ' ');
      const maxTextWidth = width * 0.92;
      offCtx.font = font;
      let metrics = offCtx.measureText(content);
      let iconAdvance = icon ? resolvedSize * 1.12 : 0;
      const measuredWidth = Math.max(1, metrics.width + iconAdvance);
      if (measuredWidth > maxTextWidth) {
        resolvedSize = Math.max(18, resolvedSize * (maxTextWidth / measuredWidth));
        font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;
        await waitForFonts(font);
        if (currentBuild !== buildId) return;
        offCtx.font = font;
        metrics = offCtx.measureText(content);
        iconAdvance = icon ? resolvedSize * 1.12 : 0;
      }

      const left = Math.ceil(metrics.actualBoundingBoxLeft || 0);
      const right = Math.ceil(metrics.actualBoundingBoxRight || metrics.width);
      const ascent = Math.ceil(metrics.actualBoundingBoxAscent || resolvedSize * 0.78);
      const descent = Math.ceil(metrics.actualBoundingBoxDescent || resolvedSize * 0.22);
      const padding = Math.max(12, Math.ceil(resolvedSize * 0.08));
      const textWidth = Math.max(1, left + right);
      const textHeight = Math.max(1, ascent + descent);
      const iconSize = icon ? Math.min(textHeight, resolvedSize * 0.9) : 0;
      const iconGap = icon ? Math.max(8, resolvedSize * 0.22) : 0;

      offscreen.width = textWidth + iconSize + iconGap + padding * 2;
      offscreen.height = textHeight + padding * 2;
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      offCtx.font = font;
      offCtx.textAlign = 'left';
      offCtx.textBaseline = 'alphabetic';
      offCtx.fillStyle = '#ffffff';
      drawIcon(offCtx, icon, padding, padding + (textHeight - iconSize) / 2, iconSize);
      offCtx.fillText(content, padding - left + iconSize + iconGap, padding + ascent);

      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const targets = [];
      const step = Math.max(2, Math.floor(density));

      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const alpha = imageData.data[(y * offscreen.width + x) * 4 + 3];
          if (alpha > 40) {
            targets.push({
              x: width / 2 - offscreen.width / 2 + x,
              y: height / 2 - offscreen.height / 2 + y,
              alpha: alpha / 255
            });
          }
        }
      }

      const particleLimit = Math.max(900, Math.min(6000, Math.floor(maxParticles)));
      const maxParticleCount = Math.max(900, Math.min(particleLimit, Math.floor((width * height) / 135)));
      const stride = Math.max(1, Math.ceil(targets.length / maxParticleCount));
      const baseRgb = hexToRgb(color);
      const highlightRgb = hexToRgb(highlightColor);
      const selected = targets.filter((_, index) => index % stride === 0);

      particles = selected.map((target, index) => {
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
        const blend = baseRgb && highlightRgb ? clamp(target.x / Math.max(1, width) + (seed - 0.5) * 0.35, 0, 1) : 0;
        const particleColor = baseRgb && highlightRgb ? rgbToCss(mixRgb(baseRgb, highlightRgb, blend)) : color;
        const angle = seed * Math.PI * 2;
        const distance = (reducedMotion ? 0 : scatter) * (0.35 + depth * 0.75);
        const start = fullScreenScatter
          ? fullCanvasScatterPosition({ seed, depth })
          : {
              x: target.x + Math.cos(angle) * distance + (seed - 0.5) * scatter * 0.45,
              y: target.y + Math.sin(angle) * distance + (depth - 0.9) * scatter * 0.45
            };
        const startX = reducedMotion ? target.x : start.x;
        const startY = reducedMotion ? target.y : start.y;

        return {
          x: reducedMotion ? target.x : startX,
          y: reducedMotion ? target.y : startY,
          startX,
          startY,
          targetX: target.x,
          targetY: target.y,
          size: Math.max(0.6, particleSize * (0.75 + target.alpha * 0.45)),
          color: particleColor,
          seed,
          depth,
          delay: seed * stagger
        };
      });

      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;

      if (reducedMotion) {
        particles.forEach(particle => {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
          particle.startX = particle.targetX;
          particle.startY = particle.targetY;
          particle.delay = 0;
        });
        gathering = false;
      } else {
        startGather(false);
      }

      ensureRenderLoop();
    };

    const queueSample = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(sampleText);
    };

    const handlePointerMove = event => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handlePointerEnter = event => {
      handlePointerMove(event);
      if (trigger === 'hover') startGather(true);
    };

    const handleClick = () => {
      if (trigger === 'click') startGather(true);
      if (trigger === 'scatter') startScatter();
      onClick?.();
    };

    const reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handleReduceMotionChange = event => {
      reducedMotion = event.matches;
      sampleText();
    };

    reduceMotionQuery?.addEventListener('change', handleReduceMotionChange);
    canvas.addEventListener('pointerenter', handlePointerEnter);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);
    // Some mobile in-app browsers do not synthesize a click for canvas taps.
    // Listen to touch directly so the full-screen entry always remains usable.
    canvas.addEventListener('touchstart', handleClick, { passive: true });

    const resizeObserver = new ResizeObserver(queueSample);
    resizeObserver.observe(container);
    sampleText();

    return () => {
      buildId += 1;
      resizeObserver.disconnect();
      reduceMotionQuery?.removeEventListener('change', handleReduceMotionChange);
      canvas.removeEventListener('pointerenter', handlePointerEnter);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleClick);

      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    };
  }, [
    text,
    icon,
    fullScreenScatter,
    particleShape,
    maxParticles,
    particleSize,
    density,
    color,
    highlightColor,
    scatter,
    gatherDuration,
    stagger,
    pointerRepel,
    repelRadius,
    idleDrift,
    trigger,
    scatterDuration,
    fontSize,
    fontWeight,
    fontFamily,
    glow,
    onClick,
    onScatterComplete
  ]);

  return (
    <div ref={containerRef} className={`particle-text ${className}`} style={style} aria-label={text}>
      <canvas ref={canvasRef} className="particle-text__canvas" aria-hidden="true" />
      <span className="particle-text__sr">{text}</span>
    </div>
  );
};

export default ParticleText;
