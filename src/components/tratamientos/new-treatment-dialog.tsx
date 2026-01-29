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
import { Plus, Tag, CircleDollarSign } from "lucide-react"
import { treatmentSchema, TreatmentFormValues } from "@/lib/validations-treatment"
import { createTreatment } from "@/lib/actions/treatments"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NewTreatmentDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<TreatmentFormValues>({
        resolver: zodResolver(treatmentSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            duration: 30,
            price: 0,
            category: "General",
            is_active: true
        },
    })

    async function onSubmit(data: TreatmentFormValues) {
        startTransition(async () => {
            try {
                await createTreatment(data)
                setOpen(false)
                form.reset()
                router.refresh()
                alert("Tratamiento creado exitosamente")
            } catch (error) {
                console.error(error)
                alert("Error al crear tratamiento")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Tratamiento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Crear Nuevo Tratamiento</DialogTitle>
                    <DialogDescription>
                        Agregue un nuevo servicio al catálogo clínico.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">

                        {/* Información Básica */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center border-b border-slate-100 pb-2">
                                <Tag className="mr-2 h-4 w-4 text-teal-600" /> Información Básica
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Nombre del Servicio</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Quiropodia Completa" {...field} />
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
                                                    <SelectItem value="General">General</SelectItem>
                                                    <SelectItem value="Quiropodia">Quiropodia</SelectItem>
                                                    <SelectItem value="Ortopedia">Ortopedia</SelectItem>
                                                    <SelectItem value="Cirugía">Cirugía</SelectItem>
                                                    <SelectItem value="Exploración">Exploración</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col justify-end pb-2">
                                            <FormLabel className="mb-2">Estado Inicial</FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(val === 'true')}
                                                defaultValue={field.value ? 'true' : 'false'}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="true">Activo</SelectItem>
                                                    <SelectItem value="false">Inactivo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Detalles & Precio */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center border-b border-slate-100 pb-2">
                                <CircleDollarSign className="mr-2 h-4 w-4 text-emerald-600" /> Detalles & Precio
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duración (min)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
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
                                            <FormLabel>Precio (€)</FormLabel>
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
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Detalles del procedimiento (opcional)..."
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
                            <Button type="submit" disabled={isPending} className="bg-teal-600 hover:bg-teal-700">
                                {isPending ? "Guardando..." : "Guardar Tratamiento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
