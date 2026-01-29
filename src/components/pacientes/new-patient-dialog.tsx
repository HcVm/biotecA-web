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
import { Plus, User, Phone, CreditCard } from "lucide-react"
import { patientSchema, PatientFormValues } from "@/lib/validations"
import { createPatient } from "@/lib/actions/patients"
import { useRouter } from "next/navigation"

export function NewPatientDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            address: "",
            insurance_provider: "",
            insurance_number: "",
            notes: "",
        },
    })

    async function onSubmit(data: PatientFormValues) {
        startTransition(async () => {
            try {
                await createPatient(data)
                setOpen(false)
                form.reset()
                router.refresh()
                alert("Paciente creado exitosamente")
            } catch (error) {
                console.error(error)
                alert("Error al crear paciente")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Paciente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
                    <DialogDescription>
                        Complete la información básica del paciente. Click en guardar cuando termine.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Datos Personales */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center border-b pb-1">
                                <User className="mr-2 h-4 w-4" /> Datos Personales
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Juan" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apellido *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pérez" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="date_of_birth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Nacimiento</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="w-full md:w-1/2" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Contacto */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center border-b pb-1">
                                <Phone className="mr-2 h-4 w-4" /> Contacto & Ubicación
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="juan@ejemplo.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+34 600 ..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dirección</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Calle Principal 123" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Seguro & Otros */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center border-b pb-1">
                                <CreditCard className="mr-2 h-4 w-4" /> Información Médica
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="insurance_provider"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Aseguradora</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Sanitas, Adeslas..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="insurance_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nº Póliza</FormLabel>
                                            <FormControl>
                                                <Input placeholder="12345678" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notas Iniciales</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Observaciones clínicas, alergias..." className="min-h-[80px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isPending} className="bg-teal-600 hover:bg-teal-700">
                                {isPending ? "Guardando..." : "Guardar Paciente"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
