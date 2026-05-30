import { motion } from 'motion/react';
import {
  fadeUpVariants,
  staggerContainerVariants,
  viewportOnce,
} from '@/constants/motion';

export function MotionStagger({
  children,
  className = '',
  variants = staggerContainerVariants,
  viewport = viewportOnce,
  ...props
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({
  children,
  className = '',
  variants = fadeUpVariants,
  ...props
}) {
  return (
    <motion.div className={className} variants={variants} {...props}>
      {children}
    </motion.div>
  );
}
