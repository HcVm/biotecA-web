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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Profile } from "@/types/profile"
import { updateProfile } from "@/lib/actions/users"
import * as z from "zod"
import { Pencil } from "lucide-react"

const profileSchema = z.object({
    full_name: z.string().min(2),
    role: z.enum(['admin', 'doctor', 'receptionist']),
    specialty: z.string().optional(),
    license_number: z.string().optional(),
    color: z.string().optional(),
    bio: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface EditUserDialogProps {
    user: Profile
}

export function EditUserDialog({ user }: EditUserDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: user.full_name,
            role: user.role,
            specialty: user.specialty || "",
            license_number: user.license_number || "",
            color: user.color || "#3b82f6",
            bio: user.bio || "",
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        startTransition(async () => {
            try {
                await updateProfile(user.id, data)
                setOpen(false)
                // toast success
            } catch (error) {
                console.error(error)
                // toast error
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>
                        Modificar datos del perfil y roles.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Completo</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rol (Permisos)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione rol" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="doctor">Doctor</SelectItem>
                                            <SelectItem value="receptionist">Recepción / Staff</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                        <FormControl>
                                            <Input placeholder="Podología General" {...field} />
                                        </FormControl>
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
                                        <FormControl>
                                            <Input placeholder="12345" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color (Calendario)</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input type="color" className="w-12 h-10 p-1" {...field} />
                                        </FormControl>
                                        <Input {...field} className="flex-1" placeholder="#RRGGBB" />
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Guardando..." : "Actualizar Usuario"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
