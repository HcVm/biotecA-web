"use client"

import { useState, useTransition } from "react"
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
import { Plus, Package, Layers, CircleDollarSign, AlertTriangle } from "lucide-react"
import { productSchema, ProductFormValues } from "@/lib/validations-inventory"
import { createProduct } from "@/lib/actions/inventory"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NewProductDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            sku: "",
            price: 0,
            cost: 0,
            stock_quantity: 0,
            min_stock_level: 5,
            category: "Consumible",
            supplier: "",
            is_active: true
        },
    })

    async function onSubmit(data: ProductFormValues) {
        startTransition(async () => {
            try {
                await createProduct(data)
                setOpen(false)
                form.reset()
                router.refresh()
                alert("Producto creado exitosamente")
            } catch (error) {
                console.error(error)
                alert("Error al crear producto")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Registrar Nuevo Producto</DialogTitle>
                    <DialogDescription>
                        Ingrese los detalles para añadir un item al inventario.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">

                        {/* Datos Básicos */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center border-b border-slate-100 pb-2">
                                <Package className="mr-2 h-4 w-4 text-blue-600" /> Información del Producto
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Nombre del Producto *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Vendas Elásticas 10cm" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sku"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SKU / Código</FormLabel>
                                            <FormControl>
                                                <Input placeholder="COD-001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoría</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Consumible">Consumible</SelectItem>
                                                    <SelectItem value="Ortopedia">Ortopedia</SelectItem>
                                                    <SelectItem value="Medicamento">Medicamento</SelectItem>
                                                    <SelectItem value="Equipo">Equipo</SelectItem>
                                                    <SelectItem value="Venta">Producto de Venta</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="supplier"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Proveedor</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre del proveedor principal" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center border-b border-slate-100 pb-2">
                                <Layers className="mr-2 h-4 w-4 text-indigo-600" /> Control de Stock
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="stock_quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Inicial</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="min_stock_level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1">
                                                Stock Mínimo
                                                <AlertTriangle className="h-3 w-3 text-orange-400" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Finanzas */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center border-b border-slate-100 pb-2">
                                <CircleDollarSign className="mr-2 h-4 w-4 text-emerald-600" /> Finanzas
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="cost"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Costo Unitario (€)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Precio Venta (€)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Descripción / Notas</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Detalles adicionales..."
                                                    {...field}
                                                    className="min-h-[80px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                                {isPending ? "Registrando..." : "Guardar Producto"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
