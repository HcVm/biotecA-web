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
import { Plus, Trash2 } from "lucide-react"
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
        resolver: zodResolver(invoiceSchema),
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

    // Calculate total on the fly for display
    const items = form.watch('items')
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Nueva Factura
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Generar Nueva Factura</DialogTitle>
                    <DialogDescription>
                        Complete los detalles de facturación.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="patient_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Paciente</FormLabel>
                                    <Combobox
                                        items={patients}
                                        value={field.value}
                                        onSelect={field.onChange}
                                        placeholder="Seleccionar paciente..."
                                        searchPlaceholder="Buscar paciente..."
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione estado" />
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

                        <Separator className="my-4" />
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium">Conceptos / Ítems</h4>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}>
                                <Plus className="h-4 w-4 mr-1" /> Agregar
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Descripción..." {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem className="w-20">
                                                <FormControl>
                                                    <Input type="number" placeholder="Cant." {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.unit_price`}
                                        render={({ field }) => (
                                            <FormItem className="w-24">
                                                <FormControl>
                                                    <Input type="number" placeholder="€" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                            {form.formState.errors.items && <p className="text-sm text-destructive">{form.formState.errors.items.message}</p>}
                        </div>

                        <div className="flex justify-end pt-2">
                            <p className="font-bold text-lg">Total Estimado: {total.toFixed(2)} € + IVA</p>
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Notas adicionales..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Generando..." : "Generar Factura"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
