"use client"

import { useState, useMemo } from "react"
import { 
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem 
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Briefcase, Zap, Shield, GraduationCap } from "lucide-react"
import { PriceTicker } from "./PriceTicker"

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (id: string) => void
  onAddToWatchlist?: (symbol: string) => void
  assets: {
    stocks: any[]
    mutualFunds: any[]
    sips: any[]
    crypto: any[]
    bonds: any[]
  }
  livePrices: Record<string, number>
}

export function GlobalSearch({ isOpen, onClose, onSelect, onAddToWatchlist, assets, livePrices }: GlobalSearchProps) {
  const allAssets = useMemo(() => {
    return [
      ...assets.stocks.map(a => ({ ...a, type: 'stocks', icon: TrendingUp })),
      ...assets.mutualFunds.map(a => ({ ...a, type: 'mutual-funds', icon: Briefcase })),
      ...assets.sips.map(a => ({ ...a, name: a.name, symbol: a.name, type: 'sips', icon: Shield })),
      ...assets.crypto.map(a => ({ ...a, type: 'crypto', icon: Zap })),
      ...assets.bonds.map(a => ({ ...a, type: 'bonds', icon: GraduationCap })),
    ]
  }, [assets])

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Search stocks, crypto, funds... (e.g. BTC, NVDA)" />
      <CommandList className="max-h-[70vh]">
        <CommandEmpty>No financial assets found.</CommandEmpty>
        
        <CommandGroup heading="Stocks">
          {allAssets.filter(a => a.type === 'stocks').slice(0, 10).map(a => (
            <SearchItem key={a.symbol} asset={a} price={livePrices[a.symbol] || a.price} onSelect={onSelect} onAdd={onAddToWatchlist} />
          ))}
        </CommandGroup>
        
        <CommandGroup heading="Crypto">
          {allAssets.filter(a => a.type === 'crypto').map(a => (
            <SearchItem key={a.symbol} asset={a} price={livePrices[a.symbol] || a.price} onSelect={onSelect} onAdd={onAddToWatchlist} />
          ))}
        </CommandGroup>

        <CommandGroup heading="Investment Funds">
          {allAssets.filter(a => a.type === 'mutual-funds').map(a => (
            <SearchItem key={a.symbol} asset={a} price={livePrices[a.symbol] || a.nav} onSelect={onSelect} onAdd={onAddToWatchlist} />
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

function SearchItem({ asset, price, onSelect, onAdd }: any) {
  return (
    <div className="relative group">
      <CommandItem 
        value={`${asset.symbol} ${asset.name}`}
        onSelect={() => onSelect(asset.type)}
        className="flex items-center justify-between p-3 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
            <asset.icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm">{asset.symbol}</p>
            <p className="text-[10px] text-muted-foreground">{asset.name}</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-3">
          <div className="text-right">
            <PriceTicker value={price} prefix="$" className="text-xs font-mono" />
            <Badge variant="outline" className="text-[8px] h-4 uppercase">{asset.type.replace("-", " ")}</Badge>
          </div>
        </div>
      </CommandItem>
      {onAdd && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd(asset.symbol);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
        >
          <Search className="h-3 w-3 rotate-45" /> {/* Use search as a mock plus icon if Plus isn't imported, but wait I have Search */}
          <span className="sr-only">Add to Watchlist</span>
        </button>
      )}
    </div>
  )
}
