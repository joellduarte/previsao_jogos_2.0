import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateConfidenceInterval(values: number[], confidenceLevel: number): [number, number] {
  const sorted = [...values].sort((a, b) => a - b)
  const alpha = 1 - confidenceLevel / 100
  const lowerIndex = Math.floor((alpha / 2) * sorted.length)
  const upperIndex = Math.floor((1 - alpha / 2) * sorted.length)
  
  return [sorted[lowerIndex], sorted[upperIndex]]
}

export function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function mode(values: number[]): number {
  const counts = new Map<number, number>()
  let maxCount = 0
  let modeValue = values[0]

  for (const value of values) {
    const count = (counts.get(value) || 0) + 1
    counts.set(value, count)
    if (count > maxCount) {
      maxCount = count
      modeValue = value
    }
  }

  return modeValue
}
