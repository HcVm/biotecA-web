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
import { useRouter } from "next/navigation"
import Link from "next/link"

const formSchema = z.object({
    email: z.string().email({
        message: "Por favor ingrese un email válido.",
    }),
    password: z.string().min(6, {
        message: "La contraseña debe tener al menos 6 caracteres.",
    }),
    full_name: z.string().min(2, "Ingrese su nombre completo"),
})

export function RegisterForm() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            full_name: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null)
        startTransition(async () => {
            const supabase = createClient()
            const { error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    data: {
                        full_name: values.full_name,
                        role: 'patient', // Explicitly role patient
                    },
                },
            })

            if (error) {
                setError(error.message)
                return
            }

            // Auto login or redirect to confirm
            // For dev/test environments without email confirm enabled, this logs them in.
            // If email confirm is on, it asks to check email.
            router.push('/portal')
            router.refresh()
        })
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-primary">Crear Cuenta</CardTitle>
                <CardDescription className="text-center">
                    Regístrese para acceder al Portal del Paciente
                </CardDescription>
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
                                    <FormControl>
                                        <Input placeholder="Juan Pérez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="paciente@ejemplo.com" {...field} />
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
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Creando cuenta..." : "Registrarse"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="justify-center">
                <div className="text-sm text-muted-foreground">
                    ¿Ya tiene cuenta?{" "}
                    <Link href="/login" className="text-primary underline hover:text-primary/90">
                        Ingresar
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
