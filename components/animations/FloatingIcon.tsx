"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FloatingIcon({ 
  children, 
  className = "",
  delay = 0,
  yOffset = 15,
  duration = 4
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-yOffset, yOffset, -yOffset] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
