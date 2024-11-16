import React from 'react';
import { motion } from 'framer-motion';
import './Chip.css';

function Chip() {
  return (
    <motion.div
      className="chip"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* コインのデザインはCSSで作成 */}
    </motion.div>
  );
}

export default Chip;
