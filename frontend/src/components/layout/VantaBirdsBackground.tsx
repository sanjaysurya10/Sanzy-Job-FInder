import { useEffect, useRef } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    VANTA: any;
  }
}

function VantaBirdsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<any>(null);

  useEffect(() => {
    let attempts = 0;

    const init = () => {
      if (window.VANTA?.BIRDS && containerRef.current) {
        effectRef.current = window.VANTA.BIRDS({
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x07192f,
          backgroundAlpha: 1,
          color1: 0xff0000,
          color2: 0x00d1ff,
          colorMode: 'varianceGradient',
          quantity: 5,
          birdSize: 1.0,
          wingSpan: 30.0,
          speedLimit: 5.0,
          separation: 20.0,
          alignment: 20.0,
          cohesion: 20.0,
        });
      } else if (attempts < 30) {
        attempts++;
        setTimeout(init, 200);
      }
    };

    init();

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

export default VantaBirdsBackground;
