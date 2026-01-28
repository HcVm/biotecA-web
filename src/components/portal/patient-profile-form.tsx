"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updatePatientProfile } from "@/lib/actions/patient-profile"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

const profileSchema = z.object({
    first_name: z.string().min(2, "Minimo 2 caracteres"),
    last_name: z.string().min(2, "Minimo 2 caracteres"),
    email: z.string().email().readonly(), // Email usually managed by auth
    phone: z.string().optional(),
    date_of_birth: z.string().optional(), // YYYY-MM-DD
    address: z.string().optional(),
    city: z.string().optional(),
    allergies: z.string().optional(),
    medical_conditions: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface PatientProfileFormProps {
    initialData: any
}

export function PatientProfileForm({ initialData }: PatientProfileFormProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: initialData.first_name || "",
            last_name: initialData.last_name || "",
            email: initialData.email || "",
            phone: initialData.phone || "",
            date_of_birth: initialData.date_of_birth || "",
            address: initialData.address || "",
            city: initialData.city || "",
            allergies: initialData.allergies || "",
            medical_conditions: initialData.medical_conditions || "",
        },
    })

    function onSubmit(data: ProfileFormValues) {
        startTransition(async () => {
            try {
                await updatePatientProfile(data)
                alert("Perfil actualizado correctamente")
            } catch (e: any) {
                alert("Error al actualizar: " + e.message)
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Datos Personales</CardTitle>
                        <CardDescription>Información básica de contacto e identidad.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellidos</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (No editable)</FormLabel>
                                    <FormControl><Input {...field} disabled /></FormControl>
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
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date_of_birth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de Nacimiento</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Dirección</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Información Médica (Opcional)</CardTitle>
                        <CardDescription>Mantenga informados a los doctores sobre sus condiciones.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="allergies"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alergias</FormLabel>
                                    <FormControl><Textarea placeholder="Ej: Penicilina, Látex..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="medical_conditions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Condiciones Médicas</FormLabel>
                                    <FormControl><Textarea placeholder="Ej: Diabetes, Hipertensión..." {...field} /></FormControl>
                                    <FormDescription>Esta información es privada y solo visible por su doctor.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Guardar Cambios
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}
