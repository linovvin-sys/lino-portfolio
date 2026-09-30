/**
 * Synthesized mechanical-keyboard keycap click, played on hover.
 * No audio file: a short filtered noise burst (the "clack") layered with
 * a quick low sine thump (the "body"), generated with the Web Audio API.
 */

const STORAGE_KEY = 'hover-sound-enabled';
export const HOVER_SOUND_EVENT = 'hover-sound-toggle';

let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

type AudioContextCtor = typeof AudioContext;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctor: AudioContextCtor | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  return audioCtx;
}

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    const length = Math.round(ctx.sampleRate * 0.03);
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

/** Unlocks the audio context; call from an early, genuine user gesture (pointerdown/keydown). */
export function primeHoverSound() {
  const ctx = getContext();
  if (ctx && ctx.state === 'suspended') void ctx.resume();
}

export function playKeyClick() {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  const now = ctx.currentTime;

  // The "clack": a short burst of noise through a bandpass filter.
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 2800 + Math.random() * 700;
  bandpass.Q.value = 1.1;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.45, now + 0.002);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
  noise.connect(bandpass).connect(noiseGain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.05);

  // The "body": a quick, low pitched thump underneath the clack.
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(190, now);
  osc.frequency.exponentialRampToValueAtTime(95, now + 0.03);
  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.0001, now);
  oscGain.gain.exponentialRampToValueAtTime(0.16, now + 0.002);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
  osc.connect(oscGain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);
}

export function isHoverSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === '1';
  } catch {
    return true;
  }
}

export function setHoverSoundEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
  } catch {
    /* storage unavailable — preference just won't persist across visits */
  }
  window.dispatchEvent(new CustomEvent(HOVER_SOUND_EVENT, { detail: enabled }));
}
