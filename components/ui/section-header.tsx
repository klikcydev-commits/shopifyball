import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeader({ eyebrow, title, subtitle, align = "center", className }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl mb-12", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <span className="text-xs uppercase tracking-[0.2em] text-gold mb-3 block">{eyebrow}</span>}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-4">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-lg leading-relaxed text-pretty">{subtitle}</p>}
    </div>
  )
}
