"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { ShopProduct, createShopOrder } from "@/lib/actions/shop"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

type CartItem = ShopProduct & {
    quantity: number
}

export function ShopContainer({ products }: { products: ShopProduct[] }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const addToCart = (product: ShopProduct) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id)
            if (existing) {
                if (existing.quantity >= product.stock_quantity) return prev // Max stock reached
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
            }
            return [...prev, { ...product, quantity: 1 }]
        })
        setIsOpen(true) // Open cart on add
    }

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(p => p.id !== id))
    }

    const updateQty = (id: string, delta: number) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) {
                const newQty = p.quantity + delta
                if (newQty < 1) return p
                if (newQty > p.stock_quantity) return p
                return { ...p, quantity: newQty }
            }
            return p
        }))
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const handleCheckout = () => {
        startTransition(async () => {
            try {
                await createShopOrder(cart.map(i => ({ productId: i.id, quantity: i.quantity })))
                setCart([])
                setIsOpen(false)
                alert("¡Pedido realizado con éxito! Puede ver su factura en 'Mis Finanzas' o Citas.")
                router.refresh()
            } catch (error: any) {
                alert("Error: " + error.message)
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm sticky top-20 z-10">
                <h2 className="text-xl font-semibold">Productos Disponibles</h2>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="relative">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Tu Cesta
                            {cart.length > 0 && (
                                <Badge className="absolute -top-2 -right-2 px-1.5 min-w-[20px] h-5 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs">
                                    {cart.reduce((a, b) => a + b.quantity, 0)}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Cesta de Compra</SheetTitle>
                        </SheetHeader>
                        <div className="mt-8 space-y-4 max-h-[70vh] overflow-y-auto">
                            {cart.length === 0 ? (
                                <div className="text-center text-muted-foreground py-10">
                                    Su cesta está vacía.
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-start border-b pb-4">
                                        <div className="flex-1">
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-sm text-muted-foreground">{item.price.toFixed(2)} €</div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQty(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                                                <span className="w-4 text-center text-sm">{item.quantity}</span>
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQty(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                                            </div>
                                            <Button size="icon" variant="destructive" className="h-6 w-6" onClick={() => removeFromCart(item.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {cart.length > 0 && (
                            <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
                                <div className="w-full space-y-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{total.toFixed(2)} €</span>
                                    </div>
                                    <Button className="w-full" onClick={handleCheckout} disabled={isPending}>
                                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {isPending ? "Procesando..." : "Confirmar Pedido"}
                                    </Button>
                                </div>
                            </SheetFooter>
                        )}
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
                        <div className="aspect-square bg-muted/50 flex items-center justify-center text-muted-foreground">
                            {/* Placeholder for real image */}
                            <span className="text-4xl select-none">📦</span>
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                {product.description || "Sin descripción disponible."}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t">
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold">{product.price.toFixed(2)} €</span>
                                    <span className="text-xs text-muted-foreground">Stock: {product.stock_quantity}</span>
                                </div>
                                <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock_quantity <= 0}>
                                    {product.stock_quantity > 0 ? "Añadir" : "Agotado"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
