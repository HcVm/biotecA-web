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
import { appointmentSchema, AppointmentFormValues } from "@/lib/validations"
import { createAppointment, getDoctorAvailability } from "@/lib/actions/appointments"
import { useRouter } from "next/navigation"
import { Combobox } from "@/components/ui/combobox"
import { createClient } from "@/lib/supabase/client"

export function NewAppointmentDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [patients, setPatients] = useState<{ label: string, value: string }[]>([])
    const [doctors, setDoctors] = useState<{ label: string, value: string }[]>([])

    // Logic for slots
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            status: 'scheduled',
            duration: 30,
            appointment_date: new Date(),
        },
    })

    const selectedDoctorId = form.watch('doctor_id')
    const selectedDate = form.watch('appointment_date') // This is a Date object

    // Fetch patients and doctors
    useEffect(() => {
        const fetchOptions = async () => {
            const supabase = createClient()
            const { data: patientsData } = await supabase.from('patients').select('id, first_name, last_name')
            if (patientsData) {
                setPatients(patientsData.map(p => ({ label: `${p.first_name} ${p.last_name}`, value: p.id })))
            }
            const { data: doctorsData } = await supabase.from('profiles').select('id, full_name').eq('role', 'doctor')
            if (doctorsData) {
                setDoctors(doctorsData.map(p => ({ label: p.full_name, value: p.id })))
            } else {
                // Fallback if role not set up correctly yet, fetch all
                const { data: all } = await supabase.from('profiles').select('id, full_name')
                if (all) setDoctors(all.map(p => ({ label: p.full_name, value: p.id })))
            }
        }
        if (open) fetchOptions()
    }, [open])

    // Load slots when doctor or date changes
    useEffect(() => {
        const fetchSlots = async () => {
            // Need both doctor and a valid date string
            if (!selectedDoctorId || !selectedDate) return

            setLoadingSlots(true)
            try {
                // selectedDate likely has time if coming from input, but we want the 'YYYY-MM-DD' part for day query
                // CAREFUL: selectedDate from form might be just initialized to NOW()
                const dateStr = selectedDate.toISOString().split('T')[0]
                const slots = await getDoctorAvailability(selectedDoctorId, dateStr)
                setAvailableSlots(slots)
            } finally {
                setLoadingSlots(false)
            }
        }
        fetchSlots()
    }, [selectedDoctorId, selectedDate]) // If date object changes reference it triggers, better logic maybe needed

    // Custom date picker handling
    // We separate Date and Time in UI for easier slot selection
    const [uiDate, setUiDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [uiTime, setUiTime] = useState<string>("")

    async function onSubmit(data: AppointmentFormValues) {
        startTransition(async () => {
            try {
                // If using Custom UI, composite the date
                if (uiDate && uiTime) {
                    data.appointment_date = new Date(`${uiDate}T${uiTime}:00`)
                }

                await createAppointment(data)
                setOpen(false)
                form.reset()
                setUiDate(new Date().toISOString().split('T')[0])
                setUiTime("")
                router.refresh()
                alert("Cita agendada exitosamente")
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
                    <Plus className="mr-2 h-4 w-4" /> Nueva Cita
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Agendar Nueva Cita</DialogTitle>
                    <DialogDescription>
                        Seleccione doctor, día y hora disponible.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="patient_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Paciente</FormLabel>
                                    <Combobox
                                        items={patients}
                                        value={field.value}
                                        onSelect={field.onChange}
                                        placeholder="Seleccionar paciente..."
                                        searchPlaceholder="Buscar paciente..."
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="doctor_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Doctor / Especialista</FormLabel>
                                    <Combobox
                                        items={doctors}
                                        value={field.value}
                                        onSelect={(v) => {
                                            field.onChange(v);
                                            // Reset time when doctor changes
                                            setUiTime("")
                                        }}
                                        placeholder="Seleccionar especialista..."
                                        searchPlaceholder="Buscar especialista..."
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormItem>
                                <FormLabel>Fecha</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        value={uiDate}
                                        onChange={(e) => {
                                            setUiDate(e.target.value)
                                            // Update form state to trigger effect (a bit hacky sync)
                                            form.setValue('appointment_date', new Date(e.target.value))
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
                                    <Select value={uiTime} onValueChange={setUiTime} disabled={availableSlots.length === 0}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={availableSlots.length > 0 ? "Seleccionar hora" : "Sin disponibilidad"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[200px]">
                                            {availableSlots.map(slot => (
                                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                            ))}
                                            {availableSlots.length === 0 && <SelectItem value="none" disabled>No hay turnos libres</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                )}
                            </FormItem>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duración (min)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="appointment_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Consulta Inicial">Consulta Inicial</SelectItem>
                                                <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                                                <SelectItem value="Tratamiento">Tratamiento</SelectItem>
                                                <SelectItem value="Urgencia">Urgencia</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                    <FormLabel>Notas</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Motivo de la consulta..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending || !uiTime}>
                                {isPending ? "Agendando..." : "Confirmar Cita"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
