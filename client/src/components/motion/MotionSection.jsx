import { fadeUpVariants, viewportOnce } from '@/constants/motion';
import { motion } from 'motion/react';

function MotionSection({
  children,
  className = '',
  variants = fadeUpVariants,
  viewport = viewportOnce,
  ...props
}) {
  return (
    <motion.section
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export default MotionSection;
