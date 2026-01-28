"use client"

import { useState, useTransition, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { createAppointment, getDoctorAvailability } from "@/lib/actions/appointments"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"

// Modified schema for patient request (no patient_id selection needed)
const requestSchema = z.object({
    doctor_id: z.string().min(1, "Seleccione un especialista."),
    appointment_date: z.date(),
    notes: z.string().optional(),
    appointment_type: z.string().default('Consulta Inicial'), // Logic handled in submit
})

type RequestFormValues = z.infer<typeof requestSchema>

interface RequestAppointmentDialogProps {
    patientId: string
}

export function RequestAppointmentDialog({ patientId }: RequestAppointmentDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [doctors, setDoctors] = useState<{ label: string, value: string }[]>([])

    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    const form = useForm<RequestFormValues>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            appointment_type: 'Consulta Inicial'
        },
    })

    const selectedDoctorId = form.watch('doctor_id')

    // Fetch Doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('profiles').select('id, full_name, role').eq('role', 'doctor')
            if (data) {
                setDoctors(data.map(p => ({ label: p.full_name, value: p.id })))
            } else {
                // Fallback
                const { data: all } = await supabase.from('profiles').select('id, full_name')
                if (all) setDoctors(all.map(p => ({ label: p.full_name, value: p.id })))
            }
        }
        if (open) fetchDoctors()
    }, [open])

    // Custom UI Date/Time
    const [uiDate, setUiDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [uiTime, setUiTime] = useState<string>("")

    // Slots effect
    useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDoctorId || !uiDate) return
            setLoadingSlots(true)
            try {
                const slots = await getDoctorAvailability(selectedDoctorId, uiDate)
                setAvailableSlots(slots)
            } finally {
                setLoadingSlots(false)
            }
        }
        fetchSlots()
    }, [selectedDoctorId, uiDate])


    async function onSubmit(data: RequestFormValues) {
        startTransition(async () => {
            try {
                const finalDate = new Date(`${uiDate}T${uiTime}:00`)

                await createAppointment({
                    patient_id: patientId, // Fixed to current patient
                    doctor_id: data.doctor_id,
                    appointment_date: finalDate,
                    duration: 30, // Default duration
                    appointment_type: data.appointment_type,
                    notes: data.notes,
                    status: 'scheduled' // Or 'pending_confirmation' if you want approval flow
                })

                setOpen(false)
                form.reset()
                setUiDate(new Date().toISOString().split('T')[0])
                setUiTime("")
                router.refresh()
                alert("Su cita ha sido agendada correctamente.")
            } catch (error: any) {
                console.error(error)
                alert(error.message || "Error al agendar cita")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Solicitar Cita
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Solicitar Cita</DialogTitle>
                    <DialogDescription>
                        Seleccione el especialista y el horario de su preferencia.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="doctor_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Especialista</FormLabel>
                                    <Select onValueChange={(v) => {
                                        field.onChange(v);
                                        setUiTime("")
                                    }} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione doctor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {doctors.map(d => (
                                                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormItem>
                                <FormLabel>Fecha Deseada</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={uiDate}
                                        onChange={(e) => {
                                            setUiDate(e.target.value)
                                            setUiTime("")
                                        }}
                                    />
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Hora Inicio</FormLabel>
                                {loadingSlots ? (
                                    <div className="flex items-center text-xs text-muted-foreground h-10 border rounded px-3">
                                        <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Buscando...
                                    </div>
                                ) : (
                                    <Select
                                        value={uiTime}
                                        onValueChange={setUiTime}
                                        disabled={availableSlots.length === 0 || !selectedDoctorId}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={
                                                    !selectedDoctorId ? "Elija Doctor primero" :
                                                        availableSlots.length > 0 ? "Seleccionar hora" : "Sin disponibilidad"
                                                } />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[200px]">
                                            {availableSlots.map(slot => (
                                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </FormItem>
                        </div>

                        <FormField
                            control={form.control}
                            name="appointment_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo Principal</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Consulta Inicial">Primera Visita</SelectItem>
                                            <SelectItem value="Seguimiento">Revisión / Seguimiento</SelectItem>
                                            <SelectItem value="Tratamiento">Tratamiento Específico</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas Adicionales</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describa brevemente su problema..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending || !uiTime}>
                                {isPending ? "Confirmando..." : "Confirmar Cita"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
