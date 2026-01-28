"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateProfile } from "@/lib/actions/users"
import { Loader2 } from "lucide-react"

export function StaffProfileForm({ profile }: { profile: any }) {
    const [isPending, startTransition] = useTransition()

    const form = useForm({
        defaultValues: {
            full_name: profile.full_name || "",
            specialty: profile.specialty || "",
            license_number: profile.license_number || "",
            bio: profile.bio || "",
            color: profile.color || "#3b82f6"
        }
    })

    function onSubmit(data: any) {
        startTransition(async () => {
            try {
                await updateProfile(profile.id, {
                    ...data,
                    role: profile.role // Prevent role change here
                })
                alert("Perfil actualizado")
            } catch (e: any) {
                alert("Error: " + e.message)
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información Profesional</CardTitle>
                <CardDescription>Datos visibles en el sistema y para los pacientes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Completo</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="specialty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Especialidad</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="license_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nº Colegiado</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Biografía / Presentación</FormLabel>
                                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color de Calendario</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input type="color" className="w-16 p-1 h-10" {...field} />
                                        </FormControl>
                                        <span className="text-sm text-muted-foreground self-center">Identificativo en citas</span>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
