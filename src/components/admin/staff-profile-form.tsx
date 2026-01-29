"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateProfile } from "@/lib/actions/users"
import { Loader2, User, Award, FileText, Palette, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
        <Card className="shadow-sm border border-slate-200">
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">Información Profesional</CardTitle>
                        <CardDescription>Gestione su ficha pública y detalles administrativos.</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        Perfil Público
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Name & Title */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-slate-600">
                                            <User className="w-4 h-4" /> Nombre Completo
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="specialty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-slate-600">
                                            <Award className="w-4 h-4" /> Especialidad
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Ej. Cardiología" className="bg-slate-50 border-slate-200 focus:bg-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* License & Color */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="license_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-slate-600">
                                            <FileText className="w-4 h-4" /> Nº Colegiado
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-slate-600">
                                            <Palette className="w-4 h-4" /> Color de Agenda
                                        </FormLabel>
                                        <div className="flex items-center gap-3 p-1 bg-slate-50 border border-slate-200 rounded-md">
                                            <FormControl>
                                                <Input
                                                    type="color"
                                                    className="w-12 h-10 p-1 border-0 bg-transparent cursor-pointer"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="text-sm text-slate-500 font-mono">{field.value}</div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Bio */}
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-slate-600">
                                        <FileText className="w-4 h-4" /> Biografía Profesional
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="min-h-[120px] bg-slate-50 border-slate-200 focus:bg-white resize-none"
                                            placeholder="Breve descripción de su experiencia y enfoque..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <Button type="submit" disabled={isPending} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[150px]">
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> Actualizar Perfil
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
