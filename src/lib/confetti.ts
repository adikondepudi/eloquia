import confettiLib from 'canvas-confetti';

export const triggerConfetti = (options = {}) => {
  return confettiLib({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    ...options
  });
};

export { confettiLib as confetti };