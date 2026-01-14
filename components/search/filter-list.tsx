'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilterListProps {
  collections: Array<{ id: string; title: string; handle: string }>
  selectedCollection: string | null
  onCollectionChange: (handle: string | null) => void
}

export function FilterList({ collections, selectedCollection, onCollectionChange }: FilterListProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-background rounded-lg border border-border p-6">
      <h2 className="font-heading text-lg uppercase tracking-wider mb-4">Collections</h2>
      <div className="space-y-2">
        <button
          onClick={() => onCollectionChange(null)}
          className={cn(
            'w-full text-left px-4 py-2 rounded-md transition-colors',
            !selectedCollection
              ? 'bg-navy text-primary-foreground'
              : 'hover:bg-muted text-foreground'
          )}
        >
          All Products
        </button>
        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => onCollectionChange(collection.handle)}
            className={cn(
              'w-full text-left px-4 py-2 rounded-md transition-colors',
              selectedCollection === collection.handle
                ? 'bg-navy text-primary-foreground'
                : 'hover:bg-muted text-foreground'
            )}
          >
            {collection.title}
          </button>
        ))}
      </div>
    </div>
  )
}



