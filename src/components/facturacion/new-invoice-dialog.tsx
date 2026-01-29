"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Plus, Trash2, User, Calendar, FileText } from "lucide-react"
import { invoiceSchema, InvoiceFormValues } from "@/lib/validations-billing"
import { createInvoice } from "@/lib/actions/billing"
import { useRouter } from "next/navigation"
import { Combobox } from "@/components/ui/combobox"
import { createClient } from "@/lib/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function NewInvoiceDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [patients, setPatients] = useState<{ label: string, value: string }[]>([])

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema) as any,
        defaultValues: {
            issue_date: new Date(),
            due_date: new Date(),
            status: 'pending',
            notes: '',
            items: [{ description: "Consulta General", quantity: 1, unit_price: 50 }]
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    })

    useEffect(() => {
        const fetchPatients = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('patients').select('id, first_name, last_name')
            if (data) {
                setPatients(data.map(p => ({ label: `${p.first_name} ${p.last_name}`, value: p.id })))
            }
        }
        if (open) fetchPatients()
    }, [open])

    async function onSubmit(data: InvoiceFormValues) {
        startTransition(async () => {
            try {
                await createInvoice(data)
                setOpen(false)
                form.reset()
                router.refresh()
                alert("Factura generada exitosamente")
            } catch (error) {
                console.error(error)
                alert("Error al generar factura")
            }
        })
    }

    // Calculate totals
    const items = form.watch('items')
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    const taxRate = 0.21
    const taxAmount = subtotal * taxRate
    const total = subtotal + taxAmount

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Nueva Factura
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Generar Nueva Factura</DialogTitle>
                    <DialogDescription>
                        Complete la información para emitir un nuevo documento de cobro.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">

                        {/* Cliente */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center border-b border-slate-100 pb-2">
                                <User className="mr-2 h-4 w-4 text-emerald-600" /> Datos del Cliente
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="patient_id"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Paciente *</FormLabel>
                                            <Combobox
                                                items={patients}
                                                value={field.value}
                                                onSelect={field.onChange}
                                                placeholder="Seleccionar paciente..."
                                                searchPlaceholder="Buscar por nombre..."
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado Inicial</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="paid">Pagada</SelectItem>
                                                    <SelectItem value="pending">Pendiente</SelectItem>
                                                    <SelectItem value="draft">Borrador</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Detalles */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center border-b border-slate-100 pb-2">
                                <Calendar className="mr-2 h-4 w-4 text-emerald-600" /> Fechas y Notas
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="issue_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha Emisión</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="due_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha Vencimiento</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Notas / Observaciones</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Información adicional para la factura..." {...field} className="h-20" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Conceptos */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                                    <FileText className="mr-2 h-4 w-4 text-emerald-600" /> Conceptos de Facturación
                                </h4>
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}>
                                    <Plus className="h-4 w-4 mr-1" /> Agregar Ítem
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                                    <div className="col-span-6">Descripción</div>
                                    <div className="col-span-2 text-center">Cant.</div>
                                    <div className="col-span-3 text-right">Precio Unit. (€)</div>
                                    <div className="col-span-1"></div>
                                </div>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-2 items-start group">
                                        <div className="col-span-6">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Consulta, Tratamiento..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type="number" min="1" className="text-center" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.unit_price`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type="number" step="0.01" className="text-right" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center pt-1">
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {fields.length === 0 && (
                                    <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground text-sm">
                                        No hay ítems agregados.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resume */}
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-100">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal:</span>
                                <span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>IVA (21%):</span>
                                <span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(taxAmount)}</span>
                            </div>
                            <Separator className="bg-slate-200 my-2" />
                            <div className="flex justify-between font-bold text-lg text-slate-900">
                                <span>Total a Pagar:</span>
                                <span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total)}</span>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                                {isPending ? "Procesando..." : "Emitir Factura"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
