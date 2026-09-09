import { useCallback, useEffect, useRef, useState } from 'react';
import ParticleText from './ParticleText';
import CatExperience from './CatExperience';

export default function App() {
  const [isFading, setIsFading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionVideoRef = useRef(null);
  const transitionStartedRef = useRef(false);

  const openCatExperience = useCallback(() => {
    window.location.assign('/?view=cat');
  }, []);
  const startTransition = useCallback(() => {
    if (transitionStartedRef.current) return;
    transitionStartedRef.current = true;
    setIsFading(true);
    setIsTransitioning(true);
  }, []);

  useEffect(() => {
    if (!isTransitioning || !transitionVideoRef.current) return;

    const video = transitionVideoRef.current;
    video.currentTime = 0;
    video.playbackRate = 2;
    video.play().catch(openCatExperience);
  }, [isTransitioning, openCatExperience]);

  const isCatExperience =
    window.location.pathname === '/cat' ||
    window.location.pathname === '/cat/' ||
    new URLSearchParams(window.location.search).get('view') === 'cat';

  if (isCatExperience) {
    return <CatExperience />;
  }

  return (
    <main className={isFading ? 'is-fading' : ''}>
      {!isTransitioning && <section className="portfolio-hero" aria-label="视觉设计作品集">
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
      </section>}
      {isTransitioning && (
        <div className="video-transition" aria-hidden="true">
          <video
            ref={transitionVideoRef}
            className="video-transition__media"
            src="/media/particle-to-cat.mp4"
            muted
            playsInline
            preload="auto"
            defaultPlaybackRate={2}
            onEnded={openCatExperience}
            onError={openCatExperience}
          />
        </div>
      )}
    </main>
  );
}
