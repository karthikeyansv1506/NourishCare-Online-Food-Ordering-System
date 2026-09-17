export const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const audioCtx = new AudioContext();
    
    const playTone = (freq, startTime, duration) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine'; // Smooth bell-like sound
        oscillator.frequency.value = freq;
        
        // Envelope generator
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05); // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    };

    // Play a pleasant double ding (E5 followed by G#5)
    playTone(659.25, audioCtx.currentTime, 0.2); 
    playTone(830.61, audioCtx.currentTime + 0.15, 0.4); 
    
  } catch (e) {
    console.error("Audio playback blocked by browser. User must click first.", e);
  }
};
