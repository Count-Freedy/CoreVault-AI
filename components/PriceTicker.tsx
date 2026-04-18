"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PriceTickerProps {
  value: number
  formatter?: (val: number) => string
  className?: string
  showIndicator?: boolean
  prefix?: string
}

export function PriceTicker({ 
  value, 
  formatter = (val) => val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  className = "",
  showIndicator = false,
  prefix = ""
}: PriceTickerProps) {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)
  const prevValue = useRef(value)

  useEffect(() => {
    if (value > prevValue.current) {
      setDirection('up')
      const timer = setTimeout(() => setDirection(null), 1000)
      return () => clearTimeout(timer)
    } else if (value < prevValue.current) {
      setDirection('down')
      const timer = setTimeout(() => setDirection(null), 1000)
      return () => clearTimeout(timer)
    }
    prevValue.current = value
  }, [value])

  return (
    <div className={`relative inline-flex items-center gap-1 ${className}`}>
      <motion.span
        key={value}
        initial={{ opacity: 0.8 }}
        animate={{ 
          opacity: 1,
          color: direction === 'up' ? 'var(--success)' : direction === 'down' ? 'var(--destructive)' : 'inherit',
          scale: direction ? [1, 1.05, 1] : 1
        }}
        transition={{ duration: 0.5 }}
        className="font-mono"
      >
        {prefix}{formatter(value)}
      </motion.span>
      
      {showIndicator && direction && (
         <motion.span
           initial={{ opacity: 0, y: direction === 'up' ? 5 : -5 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0 }}
           className={`text-[10px] font-bold ${direction === 'up' ? 'text-success' : 'text-destructive'}`}
         >
           {direction === 'up' ? '▲' : '▼'}
         </motion.span>
      )}

      {/* Background Flash Effect */}
      <AnimatePresence>
        {direction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-[-4px] rounded-md pointer-events-none ${direction === 'up' ? 'bg-success' : 'bg-destructive'}`}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
