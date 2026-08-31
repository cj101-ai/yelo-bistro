import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  animateBounce?: boolean;
}

export default function Logo({ className = "w-20 h-20", animateBounce = true }: LogoProps) {
  // Continuous smooth vertical animation with custom spring feel
  const bounceProps = animateBounce ? {
    transition: {
    y: [0, -5, 0],
    times: [0, 0.5, 1], // Added comma above, and changed 'transition' to 'times'
    duration: 1.6,
    repeat: Infinity,
    repeatType: "reverse" as const,

      ease: "easeInOut",
    }
  } : {};

  return (
    <motion.div
  {...bounceProps}
  whileHover={animateBounce ? { y: -3, scale: 1.08 } : {}}
  transition={{ type: "spring", stiffness: 400, damping: 10 }}
  className={`relative inline-block aspect-square overflow-hidden rounded-full select-none cursor-pointer ${className}`}
  id="yelo-logo-wrapper"
>

    
     {/* <svg
        
     */}
      <img
      src="/favicon.png"
      alt="Yelo Bistro & Cafe Logo"
      fetchPriority="high"
      className="w-full h-full aspect-square object-cover rounded-full overflow-hidden" 
/>
    </motion.div>
  );
}
