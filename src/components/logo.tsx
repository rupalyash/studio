
"use client";

import { BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <BrainCircuit className="h-6 w-6 text-sidebar-primary" />
      </motion.div>
      <h2 className="text-lg font-semibold text-sidebar-foreground">Sales Buddy</h2>
    </div>
  );
}
