export const easeSmooth = 'linear';

export const motionTransition = {
  smooth: {
    duration: 0.72,
    ease: easeSmooth,
  },

  slow: {
    duration: 0.9,
    ease: easeSmooth,
  },

  fast: {
    duration: 0.35,
    ease: easeSmooth,
  },

  opacity: {
    duration: 0.35,
    ease: easeSmooth,
  },
};

export const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(2px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      y: motionTransition.smooth,
      filter: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};

export const fadeInVariants = {
  hidden: {
    opacity: 0,
    filter: 'blur(2px)',
  },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      filter: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};

export const scaleInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(2px)',
  },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      scale: motionTransition.smooth,
      filter: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};

export const staggerContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.16,
    },
  },
};

export const slowStaggerContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.22,
    },
  },
};

export const cardHoverMotion = {
  y: -6,
  scale: 1.01,
};

export const buttonHoverMotion = {
  y: -2,
  scale: 1.015,
};

export const tapMotion = {
  scale: 0.98,
};

export const viewportOnce = {
  once: true,
  amount: 0.2,
};

export const fadeLeftVariants = {
  hidden: {
    opacity: 0,
    x: 16,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      x: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};

export const fadeRightVariants = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      x: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};

export const fadeDownVariants = {
  hidden: {
    opacity: 0,
    y: -16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      y: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};
