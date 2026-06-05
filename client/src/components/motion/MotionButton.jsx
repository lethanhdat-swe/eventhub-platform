import { motion } from 'motion/react';
import {
  buttonHoverMotion,
  motionTransition,
  tapMotion,
} from '@/constants/motion';

function MotionButton({ children, className = '', ...props }) {
  return (
    <motion.div
      className={className}
      whileHover={buttonHoverMotion}
      whileTap={tapMotion}
      transition={motionTransition.fast}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default MotionButton;
