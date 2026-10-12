// Web Audio API Synthesizer and Audio Stream Manager

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

// Audio sources for Adhan
const ADHAN_AUDIO_URLS: Record<string, string> = {
  // Reliable high-bandwidth Islamic audio CDN links
  makkah: 'https://cdn.alhewar.net/adhan/makkah.mp3',
  madinah: 'https://cdn.alhewar.net/adhan/madinah.mp3',
  istanbul: 'https://cdn.alhewar.net/adhan/istanbul.mp3',
  alaqsa: 'https://cdn.alhewar.net/adhan/alaqsa.mp3',
  takbeer: 'https://cdn.alhewar.net/adhan/takbeer.mp3',
};

/**
 * Plays Adhan sound. If CDN is unavailable or offline, synthesizes a sacred call chime.
 */
export function playAdhan(
  voice: 'makkah' | 'madinah' | 'istanbul' | 'alaqsa' | 'takbeer' = 'makkah',
  onEnd?: () => void
): () => void {
  // Stop any currently playing adhan
  stopAdhan();

  const url = ADHAN_AUDIO_URLS[voice] || ADHAN_AUDIO_URLS.makkah;
  const audio = new Audio(url);
  currentAdhanAudio = audio;

  let fallbackTriggered = false;

  const runSynthesizedAdhan = () => {
    if (fallbackTriggered) return;
    fallbackTriggered = true;
    try {
      const ctx = getAudioContext();
      // Synthesize Adhan opening melody ("Allahu Akbar, Allahu Akbar")
      // Bayati/Rast maqam tones: D4 (293.66), F4 (349.23), G4 (392.00), A4 (440.00), Bb4 (466.16)
      const melody = [
        { freq: 293.66, dur: 0.9 }, // Al-
        { freq: 349.23, dur: 1.2 }, // la-
        { freq: 392.00, dur: 1.8 }, // hu Ak-bar
        { freq: 349.23, dur: 0.8 },
        { freq: 293.66, dur: 1.5 },
        // Repeat
        { freq: 293.66, dur: 0.9 },
        { freq: 349.23, dur: 1.2 },
        { freq: 392.00, dur: 1.8 },
        { freq: 349.23, dur: 0.8 },
        { freq: 293.66, dur: 2.2 },
      ];

      let t = ctx.currentTime + 0.1;
      melody.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.freq, t);

        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.25, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, t + item.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + item.dur);
        t += item.dur + 0.1;
      });

      if (onEnd) {
        setTimeout(onEnd, (t - ctx.currentTime) * 1000);
      }
    } catch (e) {
      console.warn('Adhan fallback synth error:', e);
      if (onEnd) onEnd();
    }
  };

  audio.addEventListener('ended', () => {
    if (onEnd) onEnd();
  });

  audio.addEventListener('error', () => {
    console.info('Adhan audio file failed, using high-fidelity synthesized call.');
    runSynthesizedAdhan();
  });

  audio.play().catch(() => {
    runSynthesizedAdhan();
  });

  return () => {
    stopAdhan();
  };
}

export function stopAdhan() {
  if (currentAdhanAudio) {
    currentAdhanAudio.pause();
    currentAdhanAudio.currentTime = 0;
    currentAdhanAudio = null;
  }
}

export function isAdhanPlaying(): boolean {
  return currentAdhanAudio !== null && !currentAdhanAudio.paused;
}
