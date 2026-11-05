import { lazy, Suspense, useEffect } from 'react';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { profile } from '@/data/profile';
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

  useEffect(() => {
    setWebglAvailable(hasWebGL());
  }, [setWebglAvailable]);

  return (
    <>
      <a href="#content" className="sr-only-focusable fixed top-3 left-3 z-[60] rounded bg-panel px-3 py-2">
        Skip to content
      </a>

      {webglAvailable && (
        <ErrorBoundary fallback={(retry) => <SceneFallback retry={retry} />}>
          <Suspense fallback={null}>
            <GalaxyCanvas />
          </Suspense>
        </ErrorBoundary>
      )}

      <LoadingScreen onSkip={finishIntro} />

      <main
        id="content"
        className="pointer-events-none relative z-10 flex min-h-full flex-col justify-end p-6 sm:p-10"
      >
        <div className="pointer-events-auto max-w-xl">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">{profile.name}</h1>
          <p className="mt-3 text-lg text-muted">
            {profile.headline} · {profile.roles.join(' · ')}
          </p>
        </div>
      </main>
    </>
  );
}
