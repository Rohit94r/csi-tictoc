let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function tone(freq, start, duration, type = 'square', gain = 0.08) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

/** Short descending fail sting — plays on loss */
export function playLoseSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    tone(440, t, 0.18, 'sawtooth', 0.1);
    tone(330, t + 0.16, 0.22, 'sawtooth', 0.1);
    tone(220, t + 0.34, 0.35, 'square', 0.12);
    tone(110, t + 0.55, 0.5, 'square', 0.08);
  } catch {
    // autoplay / audio blocked — ignore
  }
}

export function playWinSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    tone(523, t, 0.12, 'square', 0.07);
    tone(659, t + 0.12, 0.12, 'square', 0.07);
    tone(784, t + 0.24, 0.25, 'square', 0.08);
  } catch {
    // ignore
  }
}
