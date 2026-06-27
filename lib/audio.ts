class SoundSynth {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Bold single-oscillator speedcube turn click. ~80ms total.
  playClick(muted: boolean) {
    if (muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Single triangle wave: starts at 210 Hz and drops to 60 Hz over 60ms.
    // Triangle is warmer than sine, less buzzy than sawtooth — feels solid.
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(210, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.06);

    // Attack: 4ms linear rise so it doesn't click/pop on start
    // Decay: exponential drop — punchy not sustained
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.65, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  }

  // Scramble whoosh
  playWhoosh(muted: boolean) {
    if (muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.25);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  }

  // Solve success chime
  playChime(muted: boolean) {
    if (muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    gain.connect(ctx.destination);

    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);
      osc.connect(gain);
      osc.start(t + idx * 0.06);
      osc.stop(t + 0.8);
      osc.onended = () => {
        osc.disconnect();
        if (idx === freqs.length - 1) gain.disconnect();
      };
    });
  }

  // UI button tick
  playTick(muted: boolean) {
    if (muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.setValueAtTime(1200, t + 0.01);

    gain.gain.setValueAtTime(0.02, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.02);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  }
}

export const audio = new SoundSynth();