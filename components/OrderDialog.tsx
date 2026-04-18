"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PriceTicker } from "./PriceTicker"
import { Shield, Zap, TrendingUp, Wallet, ArrowRight } from "lucide-react"

interface OrderDialogProps {
  isOpen: boolean
  onClose: () => void
  asset: {
    symbol: string
    name: string
    price: number
    type: 'stock' | 'crypto' | 'mf' | 'sip' | 'bond'
  }
  balance: number
  onExecute: (order: {
    symbol: string
    qty: number
    price: number
    type: 'buy' | 'sell'
    orderType: 'market' | 'limit'
    assetType: 'stock' | 'crypto' | 'mf' | 'sip' | 'bond'
  }) => void
}

export function OrderDialog({ isOpen, onClose, asset, balance, onExecute }: OrderDialogProps) {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [execType, setExecType] = useState<'market' | 'limit'>('market')
  const [qty, setQty] = useState<string>("1")
  const [limitPrice, setLimitPrice] = useState<string>(asset.price.toString())
  const [stopLoss, setStopLoss] = useState<string>("")
  const [takeProfit, setTakeProfit] = useState<string>("")

  const numericQty = parseFloat(qty) || 0
  const effectivePrice = execType === 'market' ? asset.price : (parseFloat(limitPrice) || 0)
  const totalValue = numericQty * effectivePrice
  const canAfford = orderType === 'sell' || totalValue <= balance

  useEffect(() => {
    if (isOpen) {
      setLimitPrice(asset.price.toString())
      setQty("1")
    }
  }, [isOpen, asset.price])

  const handleExecute = () => {
    onExecute({
      symbol: asset.symbol,
      qty: numericQty,
      price: effectivePrice,
      type: orderType,
      orderType: execType,
      assetType: asset.type
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 glass border-primary/20 bg-background/80 backdrop-blur-xl">
        <div className={`h-1.5 w-full ${orderType === 'buy' ? 'bg-success' : 'bg-destructive'}`} />
        
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  {asset.symbol} <span className="text-sm font-normal text-muted-foreground">{asset.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Professional Order Execution System
                </DialogDescription>
              </div>
              <div className="text-right">
                <PriceTicker value={asset.price} prefix="$" className="text-lg font-bold" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Real-time Feed</p>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="buy" onValueChange={(v) => setOrderType(v as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">BUY</TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">SELL</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            <RadioGroup defaultValue="market" onValueChange={(v) => setExecType(v as any)} className="flex gap-4 p-1 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 px-3 py-1">
                <RadioGroupItem value="market" id="market" />
                <Label htmlFor="market" className="text-xs">Market</Label>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1">
                <RadioGroupItem value="limit" id="limit" />
                <Label htmlFor="limit" className="text-xs">Limit</Label>
              </div>
            </RadioGroup>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity</Label>
                <Input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(e.target.value)} 
                  className="bg-background/50 border-primary/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {execType === 'market' ? 'Est. Price' : 'Limit Price'}
                </Label>
                <Input 
                  type="number" 
                  value={execType === 'market' ? asset.price.toFixed(2) : limitPrice} 
                  disabled={execType === 'market'}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="bg-background/50 border-primary/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed">
               <div className="space-y-2">
                 <Label className="text-xs text-muted-foreground">Target Price (Optional)</Label>
                 <Input 
                    placeholder="Profit" 
                    value={takeProfit} 
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="h-8 text-xs bg-success/5 border-success/10" 
                 />
               </div>
               <div className="space-y-2">
                 <Label className="text-xs text-muted-foreground">Stop Loss (Optional)</Label>
                 <Input 
                    placeholder="Risk" 
                    value={stopLoss} 
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="h-8 text-xs bg-destructive/5 border-destructive/10" 
                 />
               </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-xl space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Order Value</span>
                 <span className="font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between text-xs">
                 <span className="text-muted-foreground">Available Balance</span>
                 <span className={balance < totalValue && orderType === 'buy' ? "text-destructive" : "text-muted-foreground"}>
                   ${balance.toLocaleString()}
                 </span>
               </div>
            </div>

            <Button 
              className={`w-full py-6 text-lg font-bold shadow-lg transition-all active:scale-95 ${
                orderType === 'buy' ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'
              }`}
              disabled={!canAfford || numericQty <= 0}
              onClick={handleExecute}
            >
              {orderType === 'buy' ? <Zap className="mr-2 h-5 w-5" /> : <Shield className="mr-2 h-5 w-5" />}
              EXECUTE {orderType.toUpperCase()}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
              Secured by CoreVault Quantum Encryption
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
