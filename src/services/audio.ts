/**
 * All sound is synthesised at runtime with the Web Audio API — no audio files, so nothing to
 * license. The AudioContext is created only inside a user gesture, so nothing ever autoplays.
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: { stop: () => void } | null = null;

  get running() {
    return this.ctx?.state === 'running' && this.ambient !== null;
  }

  /** Must be called from a click or key handler. */
  async start() {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
    }
    await this.ctx.resume();
    if (!this.ambient) this.ambient = this.createAmbient();
    this.master!.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master!.gain.linearRampToValueAtTime(0.9, this.ctx.currentTime + 2.5);
  }

  stop() {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + 0.6);
    const amb = this.ambient;
    this.ambient = null;
    window.setTimeout(() => {
      amb?.stop();
      void this.ctx?.suspend();
    }, 700);
  }

  /** A slow, evolving pad: detuned low sines through a breathing low-pass filter and a echo. */
  private createAmbient() {
    const ctx = this.ctx!;
    const out = ctx.createGain();
    out.gain.value = 0.07;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    filter.Q.value = 0.7;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.035;
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(filter.frequency);

    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.9;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.42;
    delay.connect(feedback).connect(delay);

    filter.connect(out);
    filter.connect(delay);
    delay.connect(out);
    out.connect(this.master!);

    // A minor-ninth voicing on A, low and soft.
    const oscs = [55, 82.41, 110.0, 130.81, 164.81].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.value = f;
      o.detune.value = (i % 2 ? 1 : -1) * (3 + i * 2);
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : 0.22;
      o.connect(g).connect(filter);
      o.start();
      return o;
    });
    lfo.start();

    return {
      stop: () => {
        oscs.forEach((o) => o.stop());
        lfo.stop();
        out.disconnect();
      },
    };
  }

  /** A filtered-noise sweep for camera flights. */
  whoosh(duration = 1.6) {
    if (!this.running) return;
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.2;
    const t = ctx.currentTime;
    bp.frequency.setValueAtTime(180, t);
    bp.frequency.exponentialRampToValueAtTime(1400, t + duration * 0.5);
    bp.frequency.exponentialRampToValueAtTime(220, t + duration);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + duration * 0.4);
    g.gain.linearRampToValueAtTime(0, t + duration);
    src.connect(bp).connect(g).connect(this.master!);
    src.start();
  }

  /** A soft interface blip. */
  blip(pitch = 880) {
    if (!this.running) return;
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const t = ctx.currentTime;
    o.type = 'sine';
    o.frequency.setValueAtTime(pitch, t);
    o.frequency.exponentialRampToValueAtTime(pitch * 1.5, t + 0.08);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.04, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g).connect(this.master!);
    o.start(t);
    o.stop(t + 0.2);
  }
}

export const audio = new AudioEngine();
