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
import { Plus } from "lucide-react"
import { treatmentSchema, TreatmentFormValues } from "@/lib/validations-treatment"
import { createTreatment } from "@/lib/actions/treatments"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NewTreatmentDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<TreatmentFormValues>({
        resolver: zodResolver(treatmentSchema),
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
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Tratamiento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Tratamiento</DialogTitle>
                    <DialogDescription>
                        Agregue un nuevo tratamiento al catálogo de servicios.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Tratamiento *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Quiropodia Completa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                        </div>

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoría</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione categoría" />
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Detalles del procedimiento..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Guardando..." : "Guardar Tratamiento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
