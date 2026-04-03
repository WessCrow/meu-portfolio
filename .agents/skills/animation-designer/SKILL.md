---
name: animation-designer
description: Smooth, professional web animations using Framer Motion and CSS with production-ready patterns. Covers UI animations, scroll animations, micro-interactions, loading states, and accessibility.
---

# Animation Designer Skill

I help you create smooth, professional animations for web applications using Framer Motion and CSS.

## What I Do

**UI Animations:**
- Page transitions
- Component enter/exit animations
- Hover effects, button interactions
- Loading animations

**Scroll Animations:**
- Parallax effects
- Scroll-triggered animations
- Progress indicators

**Micro-interactions:**
- Button press feedback
- Form field focus states
- Success/error animations
- Drag and drop feedback

## Framer Motion Basics

### Installation

```bash
npm install framer-motion
```

### Basic Animation

```typescript
import { motion } from 'framer-motion'

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

---

## Common Animation Patterns

### Pattern 1: Fade In on Mount

```typescript
import { motion } from 'framer-motion'

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="p-6 bg-white rounded-lg shadow"
    >
      {children}
    </motion.div>
  )
}
```

---

### Pattern 2: Staggered List Animation

```typescript
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function List({ items }: { items: string[] }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
    >
      {items.map((text, i) => (
        <motion.li key={i} variants={item}>
          {text}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

---

### Pattern 3: Button Hover Animation

```typescript
import { motion } from 'framer-motion'

export function AnimatedButton({ children, onClick }: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg"
    >
      {children}
    </motion.button>
  )
}
```

---

### Pattern 4: Modal / Dialog Animation

```typescript
import { motion, AnimatePresence } from 'framer-motion'

export function Modal({ isOpen, onClose, children }: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

### Pattern 5: Page Transition

```typescript
'use client'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

---

## Scroll Animations

### Scroll-Triggered Animation

```typescript
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  )
}
```

### Parallax Effect

```typescript
import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  return (
    <div className="relative h-screen overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src="/background.jpg" alt="" className="w-full h-full object-cover" />
      </motion.div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white">Parallax Effect</h1>
      </div>
    </div>
  )
}
```

### Scroll Progress Indicator

```typescript
import { motion, useScroll } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
    />
  )
}
```

---

## Loading Animations

### Spinner

```typescript
import { motion } from 'framer-motion'

export function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
    />
  )
}
```

### Skeleton Loader

```typescript
import { motion } from 'framer-motion'

export function SkeletonLoader() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className="bg-gray-200 rounded h-4 w-full"
    />
  )
}
```

### Pulsing Dots

```typescript
import { motion } from 'framer-motion'

const dotVariants = {
  start: { scale: 0.8, opacity: 0.5 },
  end: { scale: 1.2, opacity: 1 }
}

export function PulsingDots() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={dotVariants}
          animate="end"
          initial="start"
          transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', delay: i * 0.2 }}
          className="w-3 h-3 bg-blue-600 rounded-full"
        />
      ))}
    </div>
  )
}
```

---

## Animation Best Practices

### 1. Performance

```typescript
// ✅ Good: Animate transform and opacity (GPU accelerated)
<motion.div animate={{ x: 100, opacity: 0.5 }} />

// ❌ Bad: Animate width, height (triggers layout)
<motion.div animate={{ width: '100%', height: '200px' }} />
```

### 2. Duration

```typescript
// Sweet spot: 200-400ms for most UI animations
<motion.div animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
```

### 3. Easing

```typescript
// Natural motion: easeOut (starts fast, ends slow)
<motion.div animate={{ y: 0 }} transition={{ ease: 'easeOut' }} />

// Bouncy: spring
<motion.button whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400 }} />
```

### 4. Reduce Motion (Accessibility)

```typescript
import { useReducedMotion } from 'framer-motion'

export function AccessibleAnimation({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
    >
      {children}
    </motion.div>
  )
}
```

---

## Complex Animations

### Animated Number Counter

```typescript
import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 })
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{display}</motion.span>
}
```
