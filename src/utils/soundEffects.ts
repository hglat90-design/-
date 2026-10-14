import { AdhanVoiceId } from '../types';

let audioCtx: AudioContext | null = null;
let currentAdhanAudio: HTMLAudioElement | null = null;
let wakeLockSentinel: any = null;

export function getAudioContext(): AudioContext {
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
 * Pre-unlocks audio context upon any user interaction so background audio can start smoothly
 */
export function unlockAudioContext() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch (e) {
    console.debug('AudioContext unlock notice:', e);
  }
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
 * Harmonious completion chime for when Tasbeeh reaches 33 or 99 or on periodic reminder
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

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.7);
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
 * Plays authentic Adhan audio recording with MediaSession lock-screen integration.
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

  // Request WakeLock to prevent screen lock sleep during Adhan
  if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
    (navigator as any).wakeLock.request('screen').then((sentinel: any) => {
      wakeLockSentinel = sentinel;
    }).catch(() => {});
  }

  // Setup OS Lock Screen Media Controls via MediaSession API
  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    const titles: Record<AdhanVoiceId, string> = {
      makkah: 'أذان الحرم المكي الشريف',
      abdulbasit: 'أذان الشيخ عبد الباسط عبد الصمد',
      abdulghaffar: 'أذان الشيخ عبد الغفار',
      abdulhakam: 'أذان الشيخ عبد الحكم',
      egypt: 'أذان جمهورية مصر العربية',
    };

    navigator.mediaSession.metadata = new MediaMetadata({
      title: titles[voice] || 'أذان الصلاة',
      artist: 'تطبيق «المسلم»',
      album: 'مواقيت الصلاة والأذان',
      artwork: [
        { src: './icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: './icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    });

    navigator.mediaSession.setActionHandler('stop', () => {
      stopAdhan();
      if (onEnd) onEnd();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      stopAdhan();
      if (onEnd) onEnd();
    });
  }

  audio.addEventListener('ended', () => {
    stopAdhan();
    if (onEnd) onEnd();
  });

  audio.addEventListener('error', (err) => {
    console.warn('Adhan stream fallback error:', err);
    // If primary network stream fails, fallback to Makkah or synthesize Takbeer
    if (voice !== 'makkah') {
      playAdhan('makkah', onEnd);
    } else {
      // Synthesize Takbeer audio if audio files are offline
      playSynthesizedTakbeer(onEnd);
    }
  });

  audio.play().catch((err) => {
    console.info('Adhan auto-play notice:', err);
    playSynthesizedTakbeer(onEnd);
  });

  return () => {
    stopAdhan();
  };
}

/**
 * Offline Synthesized Takbeer Melody via Web Audio API if network is unavailable
 */
export function playSynthesizedTakbeer(onEnd?: () => void) {
  try {
    const ctx = getAudioContext();
    // Notes approximating "Allahu Akbar": G3, C4, D4, E4, C4
    const notes = [196, 261.63, 293.66, 329.63, 261.63];
    const duration = 0.5;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * (duration + 0.05);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });

    setTimeout(() => {
      if (onEnd) onEnd();
    }, notes.length * (duration + 0.05) * 1000);
  } catch (e) {
    if (onEnd) onEnd();
  }
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

  if (wakeLockSentinel) {
    try {
      wakeLockSentinel.release();
    } catch {
      // ignore
    }
    wakeLockSentinel = null;
  }
}

export function isAdhanPlaying(): boolean {
  return currentAdhanAudio !== null && !currentAdhanAudio.paused;
}
