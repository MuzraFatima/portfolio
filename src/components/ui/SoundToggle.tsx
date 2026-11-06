import { useEffect } from 'react';
import { audio } from '@/services/audio';
import { useGalaxyStore } from '@/store/useGalaxyStore';

/**
 * Mute / unmute. Audio is off on every visit and only starts from this button, so there is never
 * unsolicited playback. While on, flights whoosh and selections blip.
 */
export function SoundToggle() {
  const soundOn = useGalaxyStore((s) => s.soundOn);
  const setPreference = useGalaxyStore((s) => s.setPreference);

  useEffect(() => {
    if (!soundOn) return;
    let lastRegion = useGalaxyStore.getState().region;
    let lastProject = useGalaxyStore.getState().selectedProject;
    return useGalaxyStore.subscribe((s) => {
      if (s.region !== lastRegion || s.selectedProject !== lastProject) {
        if (s.selectedProject && s.selectedProject !== lastProject) audio.blip(660);
        audio.whoosh();
        lastRegion = s.region;
        lastProject = s.selectedProject;
      }
    });
  }, [soundOn]);

  // Stop cleanly if the component unmounts.
  useEffect(() => () => audio.stop(), []);

  return (
    <button
      type="button"
      aria-pressed={soundOn}
      onClick={async () => {
        if (soundOn) {
          audio.stop();
          setPreference('soundOn', false);
        } else {
          try {
            await audio.start();
            setPreference('soundOn', true);
            audio.blip();
          } catch {
            setPreference('soundOn', false);
          }
        }
      }}
      className="glass rounded-full px-4 py-2 text-sm text-white"
      title={soundOn ? 'Mute ambient sound' : 'Play ambient sound'}
    >
      {soundOn ? 'Sound on' : 'Sound off'}
    </button>
  );
}
