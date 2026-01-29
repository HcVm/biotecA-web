"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2, User, Mail, Key, Shield } from "lucide-react"
import { createUser } from "@/lib/actions/users"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    full_name: z.string().min(2, "Nombre requerido"),
    role: z.enum(["admin", "doctor", "receptionist"], {
        message: "Seleccione un rol válido",
    }),
})

export function CreateUserDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            full_name: "",
            role: "doctor",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            const result = await createUser(values)
            if (result?.error) {
                alert("Error: " + result.error)
            } else {
                setOpen(false)
                form.reset()
                router.refresh()
                alert("Usuario creado exitosamente")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader className="border-b pb-4 mb-4">
                    <DialogTitle className="text-xl">Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                        Añada un nuevo miembro al equipo. Se enviará un correo de confirmación.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-slate-500 flex items-center mb-2">
                                <User className="w-4 h-4 mr-2" /> Datos Personales
                            </h4>
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre Completo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dr. Juan Pérez" {...field} className="bg-slate-50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Credentials */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-slate-500 flex items-center mb-2">
                                <Key className="w-4 h-4 mr-2" /> Credenciales de Acceso
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Corporativo</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                                    <Input placeholder="nombre@clinica.com" {...field} className="pl-9 bg-slate-50" />
                                                </div>
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
                                            <FormLabel>Contraseña Inicial</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                                    <Input type="password" placeholder="••••••••" {...field} className="pl-9 bg-slate-50" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-slate-500 flex items-center mb-2">
                                <Shield className="w-4 h-4 mr-2" /> Roles y Permisos
                            </h4>
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rol Asignado</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-50">
                                                    <SelectValue placeholder="Seleccione un rol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="doctor">Doctor (Agenda y Pacientes)</SelectItem>
                                                <SelectItem value="receptionist">Recepción (Agenda y Pagos)</SelectItem>
                                                <SelectItem value="admin">Administrador (Acceso Total)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4 border-t mt-4">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isPending} className="bg-slate-900">
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Crear Cuenta"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
