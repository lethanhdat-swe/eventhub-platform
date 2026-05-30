import { motion } from 'motion/react';

import { motionTransition, staggerContainerVariants } from '@/constants/motion';

import ContactForm from './components/ContactForm/ContactForm';
import ContactInfo from './components/ContactInfo/ContactInfo';

const leftVariants = {
  hidden: {
    opacity: 0,
    x: -18,
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

const rightVariants = {
  hidden: {
    opacity: 0,
    x: 18,
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

function ContactSection() {
  return (
    <section className="container">
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="grid grid-cols-1 gap-10 pt-10 lg:grid-cols-2 lg:gap-20"
      >
        <motion.div variants={leftVariants}>
          <ContactForm />
        </motion.div>

        <motion.div variants={rightVariants}>
          <ContactInfo />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default ContactSection;
