import { motion } from 'framer-motion';
import { cn } from '../../utils/formatters';

export default function Card({ children, className, hover = false, glow = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn('glass-card p-6', glow && 'neon-glow', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
