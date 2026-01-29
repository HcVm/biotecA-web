"use client"

import { useTransition, useState } from "react"
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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { User, Stethoscope, Lock } from "lucide-react"

const formSchema = z.object({
    email: z.string().email({
        message: "Email no válido.",
    }),
    password: z.string().min(6, {
        message: "Mínimo 6 caracteres.",
    }),
})

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const defaultType = searchParams.get("type") === "staff" ? "staff" : "patient"

    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [loginType, setLoginType] = useState<"patient" | "staff">(defaultType)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null)
        startTransition(async () => {
            const supabase = createClient()
            const { data, error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            })

            if (error) {
                setError("Credenciales incorrectas.")
                return
            }

            // Role Check Validation
            if (data.user) {
                // Fetch latest profile to be sure, or trust metadata
                // Trusting metadata for speed, but fallback to profile if needed check
                // For simplicity, we assume metadata 'role' is present or we check profile

                // Let's do a quick client-side check if possible, otherwise just let middleware handle
                // But user requested "Differentiation", so showing an error if wrong portal is good.

                const role = data.user.user_metadata?.role

                if (loginType === 'patient' && role && role !== 'patient') {
                    await supabase.auth.signOut()
                    setError("Cuenta de personal detectada. Por favor use la pestaña 'Personal'.")
                    return
                }

                if (loginType === 'staff' && role === 'patient') {
                    await supabase.auth.signOut()
                    setError("Cuenta de paciente detectada. Por favor use la pestaña 'Pacientes'.")
                    return
                }
            }

            // Direct explicit redirection to bypass middleware home check loop if any
            if (data.user) {
                const finalRole = data.user.user_metadata?.role || 'patient'
                if (finalRole === 'patient') {
                    router.push('/portal')
                } else {
                    router.push('/dashboard')
                }
            } else {
                router.push('/')
            }

            router.refresh()
        })
    }

    return (
        <div className="w-full max-w-md mx-auto fade-in slide-in-from-bottom-4 duration-500">
            <Card className={`shadow-xl border-t-4 ${loginType === 'patient' ? 'border-t-teal-500' : 'border-t-slate-800'}`}>
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        {loginType === 'patient' ? (
                            <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                                <User className="h-6 w-6" />
                            </div>
                        ) : (
                            <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">
                                <Lock className="h-6 w-6" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {loginType === 'patient' ? 'Portal del Paciente' : 'Acceso Corporativo'}
                    </CardTitle>
                    <CardDescription>
                        {loginType === 'patient'
                            ? 'Gestiona tu salud y tus citas en línea.'
                            : 'Plataforma administrativa y clínica de Biotec Activa.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correo Electrónico</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-11"
                                                placeholder={loginType === 'patient' ? "paciente@ejemplo.com" : "usuario@biotec.com"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <Input className="h-11" type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm font-medium text-center animate-in fade-in zoom-in-95">{error}</div>}
                            <Button
                                type="submit"
                                className={`w-full h-11 text-base ${loginType === 'patient' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                                disabled={isPending}
                            >
                                {isPending ? "Verificando..." : "Iniciar Sesión"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 justify-center bg-slate-50/50 p-6">
                    {loginType === 'patient' && (
                        <div className="w-full text-center space-y-2">
                            <div className="text-sm text-slate-600">
                                ¿No tienes una cuenta?
                            </div>
                            <Link href="/register">
                                <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800">
                                    Registrarme como Paciente
                                </Button>
                            </Link>
                        </div>
                    )}

                    <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t w-full justify-center">
                        <Link href="/forgot-password" className="hover:underline">
                            Recuperar contraseña
                        </Link>
                        <span>•</span>
                        {loginType === 'patient' ? (
                            <Link href="/login?type=staff" onClick={() => setLoginType('staff')} className="hover:underline text-slate-800 font-medium">
                                Acceso Personal
                            </Link>
                        ) : (
                            <Link href="/login?type=patient" onClick={() => setLoginType('patient')} className="hover:underline text-teal-700 font-medium">
                                Soy Paciente
                            </Link>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
