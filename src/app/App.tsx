import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { GuideBubble } from '@/components/characters/GuideBubble';
import { MiniMap } from '@/components/navigation/MiniMap';
import { TourProgress } from '@/components/navigation/TourProgress';
import { useScrollJourney } from '@/hooks/useScrollJourney';
import { Navigation } from '@/components/navigation/Navigation';
import { HeroAbout } from '@/components/panels/HeroAbout';
import { ProjectPanel } from '@/components/panels/ProjectPanel';
import { RegionPanel } from '@/components/panels/RegionPanel';
import { TextView } from '@/components/panels/TextView';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { hasWebGL } from '@/utils/device';

// The 3D world is split into its own chunk so the HTML interface paints first.
const GalaxyCanvas = lazy(() => import('@/scenes/GalaxyCanvas'));

function SceneFallback({ retry }: { retry: () => void }) {
  return (
    <div
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md glass rounded-2xl p-4 text-sm"
      role="alert"
    >
      <p className="mb-3 text-ink">
        The 3D galaxy could not start on this device. All content is still available.
      </p>
      <button
        type="button"
        onClick={() => useGalaxyStore.getState().setTextMode(true)}
        className="mr-2 rounded-full bg-accent px-4 py-1.5 text-void"
      >
        Open text view
      </button>
      <button
        type="button"
        onClick={retry}
        className="rounded-full border border-line px-4 py-1.5 text-ink hover:border-accent-2"
      >
        Try again
      </button>
    </div>
  );
}

export default function App() {
  const webglAvailable = useGalaxyStore((s) => s.webglAvailable);
  const setWebglAvailable = useGalaxyStore((s) => s.setWebglAvailable);
  const finishIntro = useGalaxyStore((s) => s.finishIntro);
  const region = useGalaxyStore((s) => s.region);
  const textMode = useGalaxyStore((s) => s.textMode);
  const setPreference = useGalaxyStore((s) => s.setPreference);
  useScrollJourney();

  useEffect(() => {
    setWebglAvailable(hasWebGL());
  }, [setWebglAvailable]);

  // Follow the operating-system reduced-motion setting if it changes while the page is open.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPreference('reducedMotion', mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setPreference]);

  if (!webglAvailable) {
    return (
      <main id="content">
        <TextView />
      </main>
    );
  }

  return (
    <>
      <a href="#content" className="sr-only-focusable fixed top-3 left-3 z-[60] rounded bg-panel px-3 py-2">
        Skip to content
      </a>

      {/* The canvas stays mounted (hidden and paused) in text view, so switching back is instant. */}
      <div hidden={textMode}>
        <ErrorBoundary fallback={(retry) => <SceneFallback retry={retry} />}>
          <Suspense fallback={null}>
            <GalaxyCanvas />
          </Suspense>
        </ErrorBoundary>
      </div>

      {!textMode && <LoadingScreen onSkip={finishIntro} />}

      {textMode ? (
        <main id="content">
          <TextView />
        </main>
      ) : (
        <>
          <main
            id="content"
            className="pointer-events-none relative z-10 flex min-h-full items-start p-3 pt-20 sm:items-center sm:p-10 sm:pb-40"
          >
            <AnimatePresence mode="wait">{region === 'gateway' && <HeroAbout key="hero" />}</AnimatePresence>
          </main>

          <Navigation />
          <MiniMap />
          <TourProgress />
          <ProjectPanel />
          <RegionPanel />
          <GuideBubble />
        </>
      )}
    </>
  );
}
