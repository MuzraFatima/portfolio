import { lazy, Suspense, useEffect } from 'react';
import { ResumeDialog } from '@/components/resume/ResumeDialog';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Journey } from '@/journey/Journey';
import { BottomBar, EdgeFade, PlaceTitle, SideWash, TopBar } from '@/journey/ui/Chrome';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { hasWebGL } from '@/utils/device';

// The 3D world is split into its own chunk so the text paints first.
const GalaxyCanvas = lazy(() => import('@/scenes/GalaxyCanvas'));

/** Shown instead of the 3D galaxy if WebGL is missing or the scene fails: a still starry sky. */
function StaticSky() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 bg-void bg-cover bg-center opacity-60"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/textures/space/milkyway-2k.webp)` }}
    />
  );
}

export default function App() {
  const webglAvailable = useGalaxyStore((s) => s.webglAvailable);
  const setWebglAvailable = useGalaxyStore((s) => s.setWebglAvailable);
  const setReducedMotion = useGalaxyStore((s) => s.setReducedMotion);

  useEffect(() => {
    setWebglAvailable(hasWebGL());
  }, [setWebglAvailable]);

  // Follow the operating-system reduced-motion setting if it changes while the page is open.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setReducedMotion]);

  return (
    <>
      <a
        href="#content"
        className="sr-only-focusable fixed top-3 left-3 z-[60] bg-void px-3 py-2 font-mono text-xs"
      >
        Skip to content
      </a>

      {webglAvailable ? (
        <ErrorBoundary fallback={() => <StaticSky />}>
          <Suspense fallback={null}>
            <GalaxyCanvas />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <StaticSky />
      )}

      <SideWash />
      <TopBar />
      <PlaceTitle />
      <Journey />
      <EdgeFade />
      <BottomBar />
      <ResumeDialog />
    </>
  );
}
