"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cancelAppointmentCustomer } from "@/lib/actions/portal"

interface CancelButtonProps {
    appointmentId: string
    disabled?: boolean
}

export function CancelAppointmentButton({ appointmentId, disabled }: CancelButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleCancel = () => {
        startTransition(async () => {
            try {
                await cancelAppointmentCustomer(appointmentId)
            } catch (e: any) {
                alert(e.message)
            }
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={disabled || isPending}>
                    {isPending ? "Cancelando..." : "Cancelar"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción cancelará su cita. Si necesita reprogramar, por favor agende una nueva cita después.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Volver</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90">
                        Confirmar Cancelación
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
