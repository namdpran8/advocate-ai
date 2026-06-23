let audioCtx = null;
let isMuted = false;

// Attempt to read previous sound preference from localStorage
try {
  const savedMute = localStorage.getItem("advocate_sound_muted");
  if (savedMute !== null) {
    isMuted = savedMute === "true";
  }
} catch (e) {
  console.warn("Storage read warning:", e);
}

export function getMuteState() {
  return isMuted;
}

export function setMuteState(muted) {
  isMuted = muted;
  try {
    localStorage.setItem("advocate_sound_muted", String(muted));
  } catch (e) {
    console.warn("Storage write warning:", e);
  }
}

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Modern, elegant, luxury-grade chime chord when analysis completes.
 * Subtle, warm, low-amplitude sine-wave tones that decay gracefully.
 */
export function playCompletionSound() {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Play an upscale soft dual chord (E5 [~659.25 Hz] + A5 [~880.00 Hz])
    const freqs = [659.25, 880.00];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      
      // Delay the second note slightly for a soft arpeggiated entry
      const startOffset = idx * 0.05;
      
      // Gentle attack and slow exponential decay
      gainNode.gain.setValueAtTime(0, now + startOffset);
      gainNode.gain.linearRampToValueAtTime(0.04, now + startOffset + 0.06); // Soft 4% volume
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + 0.9);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + startOffset);
      osc.stop(now + startOffset + 0.95);
    });
  } catch (err) {
    console.warn("Could not execute dialectic audio completion: ", err);
  }
}

/**
 * Short, high-quality organic acoustic tick/pop when numeric indicators rise.
 */
export function playCounterSound() {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    // Rapid micro-pitch slide mimicking a soft tactile tap
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.04);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.02, now + 0.004); // Extremely quiet 2% volume
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (err) {
    console.warn("Could not execute counter sound play: ", err);
  }
}
