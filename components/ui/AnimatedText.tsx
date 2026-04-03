"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  type?: "words" | "chars";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  yOffset?: number;
}

export function AnimatedText({
  text,
  type = "words",
  className = "",
  delay = 0,
  stagger = 0.05,
  once = true,
  yOffset = 25
}: AnimatedTextProps) {
  const elements = type === "words" ? text.split(" ") : text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  };

  const item = {
    hidden: {
      opacity: 0,
      y: yOffset,
      filter: "blur(12px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-5% 0px -5% 0px" }}
      className={className}
      style={{ display: className.includes('block') ? 'block' : 'inline-block' }}
    >
      {elements.map((el, i) => (
        <motion.span
          key={i}
          variants={item as any}
          className="inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {el}{type === "words" && i !== elements.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.div>
  );
}
