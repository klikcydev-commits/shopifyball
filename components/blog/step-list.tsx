import type { ReactNode } from 'react'

interface StepListProps {
  title?: string
  steps: ReactNode[]
}

/**
 * Ordered step-by-step list with consistent spacing and numbers.
 */
export function StepList({ title, steps }: StepListProps) {
  const list = Array.isArray(steps) ? steps : []
  return (
    <div className="step-list not-prose">
      {title && (
        <h3 className="text-base font-semibold text-foreground mb-4">{title}</h3>
      )}
      <ol className="space-y-4 list-none pl-0">
        {list.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span
              className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/15 text-gold-dark dark:text-gold-light font-semibold text-sm flex items-center justify-center"
              aria-hidden
            >
              {i + 1}
            </span>
            <span className="text-[0.9375rem] leading-relaxed text-foreground pt-0.5">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
