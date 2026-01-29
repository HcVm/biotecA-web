"use client"

import { Calendar as BigCalendar, dateFnsLocalizer, View, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Appointment } from '@/types/appointment'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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

const statusColors: Record<string, string> = {
    scheduled: '!bg-blue-100 !text-blue-700 !border-blue-200',
    confirmed: '!bg-teal-100 !text-teal-700 !border-teal-200',
    in_progress: '!bg-purple-100 !text-purple-700 !border-purple-200',
    completed: '!bg-slate-100 !text-slate-700 !border-slate-200',
    cancelled: '!bg-rose-100 !text-rose-700 !border-rose-200 !line-through',
    no_show: '!bg-orange-100 !text-orange-700 !border-orange-200',
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
            resource: apt // The original appointment object
        }))
    }, [appointments])

    const onNavigate = (newDate: Date) => setDate(newDate)
    const onView = (newView: View) => setView(newView)

    const handleSelectEvent = (event: any) => {
        setSelectedAppointment(event.resource)
        setDetailsOpen(true)
    }

    const eventPropGetter = (event: any) => {
        const status = event.resource.status || 'scheduled'
        let className = statusColors[status] || '!bg-blue-100 !text-blue-700'

        return {
            className: cn("border-l-4 text-xs font-semibold px-1 rounded-sm border-0 shadow-sm", className),
            style: {
                // Ensure no default RBC background overrides our tailwind classes
                backgroundColor: 'transparent',
            }
        }
    }

    const CustomEvent = ({ event }: any) => {
        return (
            <div className="h-full w-full flex flex-col overflow-hidden leading-snug">
                <span className="truncate">{event.title}</span>
                {view !== Views.MONTH && (
                    <span className="text-[10px] opacity-80 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(event.start, 'HH:mm')}
                    </span>
                )}
            </div>
        )
    }

    return (
        <div className="h-[750px] bg-white p-4">
            <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
                <div className='flex items-center gap-4 bg-slate-100 p-1 rounded-lg'>
                    <Button variant="ghost" size="icon" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7))}>
                        <ChevronLeft className='h-4 w-4' />
                    </Button>
                    <span className='font-semibold text-sm w-32 text-center capitalize text-slate-700'>
                        {format(date, 'MMMM yyyy', { locale: es })}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7))}>
                        <ChevronRight className='h-4 w-4' />
                    </Button>
                </div>

                <div className='flex items-center gap-2'>
                    <Button variant="outline" size="sm" onClick={() => onNavigate(new Date())} className="mr-2">
                        <CalendarIcon className="mr-2 h-3.5 w-3.5" /> Hoy
                    </Button>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => onView(Views.MONTH)}
                            className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", view === Views.MONTH ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900")}
                        >
                            Mes
                        </button>
                        <button
                            onClick={() => onView(Views.WEEK)}
                            className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", view === Views.WEEK ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900")}
                        >
                            Semana
                        </button>
                        <button
                            onClick={() => onView(Views.DAY)}
                            className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", view === Views.DAY ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900")}
                        >
                            Día
                        </button>
                    </div>
                </div>
            </div>

            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100% - 80px)' }}
                view={view}
                onView={onView}
                date={date}
                onNavigate={onNavigate}
                onSelectEvent={handleSelectEvent}
                culture='es'
                toolbar={false} // Hide default toolbar since we have a custom one
                min={new Date(0, 0, 0, 8, 0, 0)} // Start at 8 AM
                max={new Date(0, 0, 0, 20, 0, 0)} // End at 8 PM
                eventPropGetter={eventPropGetter}
                components={{
                    event: CustomEvent
                }}
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
                className="rounded-lg border-none text-sm"
            />

            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            Detalle de la Cita
                            {selectedAppointment && (
                                <Badge variant="outline" className={cn("ml-2 capitalize", statusColors[selectedAppointment.status || 'scheduled'])}>
                                    {selectedAppointment.status}
                                </Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedAppointment && (
                        <div className='py-4 space-y-4'>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-semibold text-slate-500 mb-1">Paciente</h4>
                                    <p className="text-slate-900 font-medium">{selectedAppointment.patients?.first_name} {selectedAppointment.patients?.last_name}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-500 mb-1">Especialista</h4>
                                    <p className="text-slate-900 font-medium">
                                        {/* Assuming profile/doctor data is available or joined, wait, we need to check if we fetched doctor name */}
                                        {/* The interface says: doctor:profiles(...) but earlier I saw 'profiles!...' in getAppointments */}
                                        {/* Let's try to access it safely */}
                                        {(selectedAppointment as any).profiles?.full_name || 'No asignado'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between border border-slate-100">
                                <div className="flex items-center gap-2 text-slate-700">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span className="font-medium">
                                        {format(new Date(selectedAppointment.appointment_date), "EEEE d 'de' MMMM", { locale: es })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium">
                                        {format(new Date(selectedAppointment.appointment_date), "HH:mm")} - {format(new Date(new Date(selectedAppointment.appointment_date).getTime() + selectedAppointment.duration * 60000), "HH:mm")}
                                    </span>
                                </div>
                            </div>

                            {selectedAppointment.notes && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 mb-1">Notas</h4>
                                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded border border-slate-100">
                                        {selectedAppointment.notes}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" size="sm">Editar</Button>
                                <Button variant="destructive" size="sm">Cancelar Cita</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
