"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftRight } from "lucide-react"
import * as z from "zod"
import { createInventoryMovement } from "@/lib/actions/inventory-movements"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Combobox } from "@/components/ui/combobox"

// Schema
const movementSchema = z.object({
    product_id: z.string().min(1, "Seleccione producto"),
    movement_type: z.enum(['purchase', 'sale', 'adjustment', 'return']),
    quantity: z.coerce.number().min(1, "Cantidad mínima 1"),
    unit_price: z.coerce.number().optional(),
    notes: z.string().optional(),
})
type MovementFormValues = z.infer<typeof movementSchema>


export function NewMovementDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [products, setProducts] = useState<{ label: string, value: string }[]>([])

    const form = useForm<MovementFormValues>({
        resolver: zodResolver(movementSchema),
        defaultValues: {
            movement_type: 'purchase',
            quantity: 1,
            unit_price: 0
        },
    })

    useEffect(() => {
        const fetchProducts = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('products').select('id, name, sku, stock_quantity')
            if (data) {
                setProducts(data.map(p => ({
                    label: `${p.name} (Stock: ${p.stock_quantity})`,
                    value: p.id
                })))
            }
        }
        if (open) fetchProducts()
    }, [open])

    async function onSubmit(data: MovementFormValues) {
        startTransition(async () => {
            try {
                await createInventoryMovement(data)
                setOpen(false)
                form.reset()
                router.refresh()
                alert("Movimiento registrado")
            } catch (error) {
                console.error(error)
                alert("Error al registrar movimiento")
            }
        })
    }

    const type = form.watch('movement_type')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <ArrowLeftRight className="mr-2 h-4 w-4" /> Registrar Movimiento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Movimiento de Inventario</DialogTitle>
                    <DialogDescription>
                        Registre entradas, salidas o ajustes manuales.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="product_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Producto</FormLabel>
                                    <Combobox
                                        items={products}
                                        value={field.value}
                                        onSelect={field.onChange}
                                        placeholder="Buscar producto..."
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="movement_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo Movimiento</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="purchase">Compra (Entrada)</SelectItem>
                                                <SelectItem value="return">Devolución (Entrada)</SelectItem>
                                                <SelectItem value="sale">Venta (Salida)</SelectItem>
                                                <SelectItem value="adjustment">Ajuste (Salida)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cantidad Items</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {type === 'purchase' && (
                            <FormField
                                control={form.control}
                                name="unit_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Costo Unitario (€)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">Opcional. Actualizará el costo promedio futuro.</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo / Notas</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Ej: Pedido #1234..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Guardando..." : "Confirmar Movimiento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
