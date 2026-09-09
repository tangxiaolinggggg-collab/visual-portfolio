import { useCallback, useEffect, useRef, useState } from 'react';
import ParticleText from './ParticleText';
import CatExperience from './CatExperience';
import { sitePath, siteRoot } from './sitePath';

export default function App() {
  const readView = () => new URLSearchParams(window.location.search).get('view');
  const [view, setView] = useState(readView);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const handoffTimerRef = useRef(null);
  const transitionVideoRef = useRef(null);
  const transitionStartedRef = useRef(false);

  const openCatExperience = useCallback(({ keepTransitionFrame = false } = {}) => {
    if (readView() !== 'cat') {
      window.history.pushState({ view: 'cat' }, '', `${sitePath()}?view=cat`);
    }
    if (!keepTransitionFrame) {
      setIsTransitioning(false);
      setIsVideoVisible(false);
    }
    setView('cat');
  }, []);

  const finishTransition = useCallback(() => {
    if (!isTransitioning) return;
    setIsVideoVisible(false);
    window.clearTimeout(handoffTimerRef.current);
    handoffTimerRef.current = window.setTimeout(() => setIsTransitioning(false), 260);
  }, [isTransitioning]);

  const startTransition = useCallback(() => {
    if (transitionStartedRef.current) return;
    transitionStartedRef.current = true;
    setIsTransitioning(true);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      transitionStartedRef.current = false;
      setIsTransitioning(false);
      setIsVideoVisible(false);
      setView(readView());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.clearTimeout(handoffTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isTransitioning || !transitionVideoRef.current) return undefined;

    const video = transitionVideoRef.current;
    let cancelled = false;
    const beginPlayback = () => {
      if (cancelled) return;
      video.currentTime = 0;
      video.playbackRate = 2;
      video.play().then(() => {
        if (!cancelled) setIsVideoVisible(true);
      }).catch(openCatExperience);
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) beginPlayback();
    else video.addEventListener('loadeddata', beginPlayback, { once: true });

    return () => {
      cancelled = true;
      video.removeEventListener('loadeddata', beginPlayback);
    };
  }, [isTransitioning, openCatExperience]);

  const isCatExperience = window.location.pathname === `${siteRoot}/cat` || window.location.pathname === `${siteRoot}/cat/` || view === 'cat';

  return (
    <>
      {isCatExperience ? <CatExperience onReady={finishTransition} /> : <main>
      <section
        className={`portfolio-hero${isTransitioning ? ' is-transitioning' : ''}`}
        aria-label="视觉设计作品集"
        onClick={startTransition}
        onTouchStart={startTransition}
        onPointerUp={startTransition}
        onTouchEnd={startTransition}
      >
        <div className="particle-stage">
          <ParticleText
            className="title-particle"
            text="视觉设计-作品集"
            fullScreenScatter
            particleShape="circle"
            maxParticles={5200}
            particleSize={2.2}
            density={3}
            color="#f8fafc"
            highlightColor="#8b5cf6"
            scatter={190}
            gatherDuration={1600}
            stagger={420}
            pointerRepel={42}
            repelRadius={120}
            idleDrift={0.8}
            trigger="mount"
            onClick={startTransition}
            fontSize="clamp(3.5rem, 13vw, 9rem)"
            fontWeight={800}
            fontFamily="inherit"
            glow
          />
        </div>

        <div className="particle-contact-stage">
          <ParticleText
            className="contact-particle"
            text="彭俊填"
            icon="person"
            particleSize={1.4}
            density={2}
            color="#f8fafc"
            highlightColor="#8b5cf6"
            scatter={90}
            gatherDuration={1600}
            stagger={420}
            pointerRepel={24}
            repelRadius={100}
            idleDrift={0.45}
            trigger="mount"
            fontSize="clamp(1.7rem, 2.5vw, 2.2rem)"
            fontWeight={350}
            fontFamily="inherit"
            glow={false}
          />
          <ParticleText
            className="contact-particle"
            text="15889784695"
            icon="phone"
            particleSize={1.4}
            density={2}
            color="#f8fafc"
            highlightColor="#8b5cf6"
            scatter={90}
            gatherDuration={1600}
            stagger={420}
            pointerRepel={24}
            repelRadius={100}
            idleDrift={0.45}
            trigger="mount"
            fontSize="clamp(1.3rem, 2vw, 1.7rem)"
            fontWeight={450}
            fontFamily="inherit"
            glow={false}
          />
          <ParticleText
            className="contact-particle"
            text="1256591205@qq.com"
            icon="mail"
            particleSize={1.4}
            density={2}
            color="#f8fafc"
            highlightColor="#8b5cf6"
            scatter={90}
            gatherDuration={1600}
            stagger={420}
            pointerRepel={24}
            repelRadius={100}
            idleDrift={0.45}
            trigger="mount"
            fontSize="clamp(1.3rem, 2vw, 1.7rem)"
            fontWeight={450}
            fontFamily="inherit"
            glow={false}
          />
        </div>
      </section>
      </main>}
      <div className={`video-transition${isTransitioning ? ' is-active' : ''}${isVideoVisible ? ' is-visible' : ''}`} aria-hidden="true">
        <video
          ref={transitionVideoRef}
          className="video-transition__media"
          src={sitePath('media/particle-to-cat.mp4')}
          muted
          playsInline
          preload="auto"
          defaultPlaybackRate={2}
          onEnded={() => openCatExperience({ keepTransitionFrame: true })}
          onError={openCatExperience}
        />
      </div>
    </>
  );
}
