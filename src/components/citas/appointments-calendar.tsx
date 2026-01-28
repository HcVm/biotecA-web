"use client"

import { Calendar as BigCalendar, dateFnsLocalizer, View, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Appointment } from '@/types/appointment'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const locales = {
    'es': es,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

interface AppointmentsCalendarProps {
    appointments: Appointment[]
}

export function AppointmentsCalendar({ appointments }: AppointmentsCalendarProps) {
    const [view, setView] = useState<View>(Views.WEEK)
    const [date, setDate] = useState(new Date())
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)

    // Transform appointments to big-calendar format
    const events = useMemo(() => {
        return appointments.map(apt => ({
            id: apt.id,
            title: apt.patient_id ? `${apt.patients?.first_name} ${apt.patients?.last_name}` : 'Cita',
            start: new Date(apt.appointment_date),
            end: new Date(new Date(apt.appointment_date).getTime() + apt.duration * 60000),
            resource: apt
        }))
    }, [appointments])

    const onNavigate = (newDate: Date) => setDate(newDate)
    const onView = (newView: View) => setView(newView)

    const handleSelectEvent = (event: any) => {
        setSelectedAppointment(event.resource)
        setDetailsOpen(true)
    }

    return (
        <div className="h-[700px] bg-card rounded-md shadow p-4">
            <div className='flex justify-between items-center mb-4'>
                <div className='flex gap-2'>
                    <Button variant="outline" size="icon" onClick={() => onNavigate(new Date())}>Today</Button>
                    <div className='flex items-center gap-1'>
                        <Button variant="ghost" size="icon" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7))}>
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <span className='font-semibold text-lg capitalize'>
                            {format(date, 'MMMM yyyy', { locale: es })}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7))}>
                            <ChevronRight className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <Button variant={view === Views.MONTH ? 'default' : 'outline'} onClick={() => onView(Views.MONTH)}>Mes</Button>
                    <Button variant={view === Views.WEEK ? 'default' : 'outline'} onClick={() => onView(Views.WEEK)}>Semana</Button>
                    <Button variant={view === Views.DAY ? 'default' : 'outline'} onClick={() => onView(Views.DAY)}>Día</Button>
                </div>
            </div>

            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100% - 60px)' }}
                view={view}
                onView={onView}
                date={date}
                onNavigate={onNavigate}
                onSelectEvent={handleSelectEvent}
                culture='es'
                messages={{
                    next: "Siguiente",
                    previous: "Anterior",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    agenda: "Agenda",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "Sin citas en este rango",
                }}
            />

            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalle de la Cita</DialogTitle>
                    </DialogHeader>
                    {selectedAppointment && (
                        <div className='py-4 space-y-2'>
                            <p><strong>Paciente:</strong> {selectedAppointment.patients?.first_name} {selectedAppointment.patients?.last_name}</p>
                            <p><strong>Fecha:</strong> {format(new Date(selectedAppointment.appointment_date), "dd/MM/yyyy HH:mm")}</p>
                            <p><strong>Duración:</strong> {selectedAppointment.duration} min</p>
                            <p><strong>Estado:</strong> {selectedAppointment.status}</p>
                            <p><strong>Notas:</strong> {selectedAppointment.notes || "Sin notas"}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
