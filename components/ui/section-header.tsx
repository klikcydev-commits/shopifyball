import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  /** When "dark", title and subtitle use primary-foreground (for use on dark backgrounds). */
  variant?: "default" | "dark"
  className?: string
}

export function SectionHeader({ eyebrow, title, subtitle, align = "center", variant = "default", className }: SectionHeaderProps) {
  const isDark = variant === "dark"
  return (
    <div className={cn("max-w-2xl mb-12", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <span className="text-xs uppercase tracking-[0.2em] text-gold mb-3 block">{eyebrow}</span>}
      <h2 className={cn("text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-4", isDark && "text-primary-foreground")}>{title}</h2>
      {subtitle && <p className={cn("text-lg leading-relaxed text-pretty", isDark ? "text-primary-foreground/80" : "text-muted-foreground")}>{subtitle}</p>}
    </div>
  )
}
