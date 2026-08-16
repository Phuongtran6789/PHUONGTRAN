// Web Audio API Sound Synthesizer for Kids Education
class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Âm thanh chúc mừng MẠNH MẼ, HOÀNH TRÁNG (Fanfare / Trumpet Victory)
  playMajesticSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Chord progression notes (C5, E5, G5, C6, E6, G6 fanfare)
    const notes = [
      { freq: 523.25, time: 0, dur: 0.12 },     // C5
      { freq: 659.25, time: 0.12, dur: 0.12 },  // E5
      { freq: 783.99, time: 0.24, dur: 0.12 },  // G5
      { freq: 1046.50, time: 0.36, dur: 0.35 }, // C6
      { freq: 1318.51, time: 0.50, dur: 0.45 }, // E6
      { freq: 1567.98, time: 0.70, dur: 0.65 }, // G6 triumph climax
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Brass-like rich tone (sawtooth + triangle)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      // Attack and decay envelope
      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.28, now + time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });

    // Add bright sparkle high notes
    const sparkleNotes = [1760, 2093, 2637];
    sparkleNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.75 + idx * 0.08);

      gain.gain.setValueAtTime(0.15, now + 0.75 + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + 0.75 + idx * 0.08);
      osc.stop(now + 1.15);
    });
  }

  // Âm thanh NHẸ NHÀNG ĐỘNG VIÊN, KHÍCH LỆ HỌC SINH (Warm soothing chime/harp)
  playEncouragingGentle() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Soothing warm pentatonic notes (F4, A4, C5, D5)
    const notes = [
      { freq: 349.23, time: 0, dur: 0.3 },     // F4
      { freq: 440.00, time: 0.15, dur: 0.35 }, // A4
      { freq: 523.25, time: 0.3, dur: 0.4 },   // C5
      { freq: 587.33, time: 0.45, dur: 0.6 },  // D5
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      // Smooth soft attack
      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.18, now + time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  }
}

export const soundFx = new SoundEffects();
