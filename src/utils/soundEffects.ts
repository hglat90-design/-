import { AdhanVoiceId } from '../types';

let audioCtx: AudioContext | null = null;
let currentAdhanAudio: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * High-quality wooden Tasbeeh bead tactile acoustic click
 */
export function playTasbeehClick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    console.debug('Audio click silent fallback', e);
  }
}

/**
 * Harmonious completion chime for when Tasbeeh reaches 33 or 99
 */
export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  } catch (e) {
    console.debug('Chime silent fallback', e);
  }
}

/**
 * Triggers device haptic vibration if supported
 */
export function triggerHaptic(durationMs = 25) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(durationMs);
    } catch {
      // ignore
    }
  }
}

// Authentic High-Fidelity Adhan Recordings with Verified Cloudflare CDN and Global CORS
export const AUTHENTIC_ADHAN_URLS: Record<AdhanVoiceId, string> = {
  makkah: 'https://praytimes.org/audio/adhan/Sunni/Adhan%20Makkah.mp3',
  abdulbasit: 'https://praytimes.org/audio/adhan/Sunni/Abdul-Basit.mp3',
  abdulghaffar: 'https://praytimes.org/audio/adhan/Sunni/Abdul-Ghaffar.mp3',
  abdulhakam: 'https://praytimes.org/audio/adhan/Sunni/Abdul-Hakam.mp3',
  egypt: 'https://praytimes.org/audio/adhan/Sunni/Adhan%20Egypt.mp3',
};

/**
 * Plays authentic Adhan audio recording.
 */
export function playAdhan(
  voice: AdhanVoiceId = 'makkah',
  onEnd?: () => void
): () => void {
  // Stop any currently playing adhan
  stopAdhan();

  const url = AUTHENTIC_ADHAN_URLS[voice] || AUTHENTIC_ADHAN_URLS.makkah;
  const audio = new Audio(url);
  audio.preload = 'auto';
  audio.crossOrigin = 'anonymous';
  currentAdhanAudio = audio;

  audio.addEventListener('ended', () => {
    stopAdhan();
    if (onEnd) onEnd();
  });

  audio.addEventListener('error', (err) => {
    console.warn('Adhan stream fallback error:', err);
    // If network fails, try the alternative Makkah track
    if (voice !== 'makkah') {
      playAdhan('makkah', onEnd);
    } else if (onEnd) {
      onEnd();
    }
  });

  audio.play().catch((err) => {
    console.info('Adhan auto-play or playback notice:', err);
  });

  return () => {
    stopAdhan();
  };
}

export function stopAdhan() {
  if (currentAdhanAudio) {
    try {
      currentAdhanAudio.pause();
      currentAdhanAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAdhanAudio = null;
  }
}

export function isAdhanPlaying(): boolean {
  return currentAdhanAudio !== null && !currentAdhanAudio.paused;
}
