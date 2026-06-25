class SoundSynth {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      // Safe initialization of AudioContext on client
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    // Resume context if suspended (browser security)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Synthesize a natural "plastic turn click" (~50ms)
  playClick(muted: boolean) {
    if (muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // 1. Core pop frequency (triangle wave)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.05);

    // 2. High-frequency click noise
    const bufferSize = ctx.sampleRate * 0.02; // 20ms of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    // Filter noise to high click frequencies
    filter.type = 'bandpass';
    filter.frequency.value = 2200;
    filter.Q.value = 4;

    // Envelope
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    // Connections
    osc.connect(gain);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Start & Stop
    osc.start(time);
    osc.stop(time + 0.05);
    noise.start(time);
    noise.stop(time + 0.05);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
    noise.onended = () => {
      noise.disconnect();
      filter.disconnect();
    };
  }

  // Synthesize a quick "whoosh" sweep for scrambles
  playWhoosh(muted: boolean) {
    if (muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.25);

    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.25);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  // Synthesize a soft chime for solving success
  playChime(muted: boolean) {
    if (muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const time = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
    gain.connect(ctx.destination);

    // Play a Major Third harmony (C5: 523.25Hz, E5: 659.25Hz, G5: 783.99Hz)
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time + idx * 0.06); // Arpeggiated entry
      osc.connect(gain);
      osc.start(time + idx * 0.06);
      osc.stop(time + 0.8);

      osc.onended = () => {
        osc.disconnect();
        if (idx === freqs.length - 1) {
          gain.disconnect();
        }
      };
    });
  }

  // UI button click
  playTick(muted: boolean) {
    if (muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, time);
    osc.frequency.setValueAtTime(1200, time + 0.01);

    gain.gain.setValueAtTime(0.02, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.02);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }
}

export const audio = new SoundSynth();
