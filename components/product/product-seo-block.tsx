"use client"

import Link from "next/link"

interface ProductSeoBlockProps {
  title: string
  handle: string
}

export function ProductSeoBlock({ title, handle }: ProductSeoBlockProps) {
  const isFrame =
    /frame|lenticular|flip|dual|wall art|poster|print/i.test(title) ||
    /frame|lenticular|flip|wall-art|poster/i.test(handle)

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-6 mb-8 text-muted-foreground text-sm space-y-3">
      <p>
        <strong className="text-foreground">{title}</strong> is part of our football gifts collection. We deliver
        across Dubai and the UAE. Gift-ready packaging available.
      </p>
      {isFrame && (
        <p>
          This piece is designed as premium football wall art. The image can change with viewing angle, giving a
          unique look — ideal for football room decor in Dubai and the UAE.
        </p>
      )}
      <p>
        Perfect as a gift for football fans, teens, or as football bedroom decor. Browse more{" "}
        <Link href="/football-gifts-dubai" className="font-medium text-foreground underline underline-offset-2">
          football gifts Dubai
        </Link>
        ,{" "}
        <Link href="/football-gifts-for-teens-dubai" className="font-medium text-foreground underline underline-offset-2">
          gifts for teens
        </Link>
        , or our{" "}
        <Link href="/shop" className="font-medium text-foreground underline underline-offset-2">
          full shop
        </Link>
        .
      </p>
      <p className="text-xs text-muted-foreground pt-2">
        <Link href="/sitemap.xml" className="underline underline-offset-2 hover:text-foreground">
          Sitemap
        </Link>
      </p>
    </div>
  )
}
