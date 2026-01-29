"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Appointment {
    id: string
    patientName: string
    patientEmail: string
    doctorName: string
    date: string
    time: string
    status: string
}

const statusMap: Record<string, { label: string, color: string }> = {
    'scheduled': { label: 'Programada', color: 'bg-blue-100 text-blue-800' },
    'confirmed': { label: 'Confirmada', color: 'bg-purple-100 text-purple-800' },
    'completed': { label: 'Completada', color: 'bg-green-100 text-green-800' },
    'cancelled': { label: 'Cancelada', color: 'bg-red-100 text-red-800' },
    'no_show': { label: 'Sin Asistir', color: 'bg-orange-100 text-orange-800' },
}

export function RecentAppointments({ appointments }: { appointments: Appointment[] }) {
    if (!appointments?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground">No hay citas recientes.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {appointments.map((apt) => {
                const statusDetails = statusMap[apt.status] || { label: apt.status, color: 'bg-gray-100 text-gray-800' }

                // Initials
                const initials = apt.patientName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2)

                return (
                    <div key={apt.id} className="flex items-center justify-between group p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm group-hover:border-teal-100 transition-colors">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${apt.patientEmail}`} alt="Avatar" />
                                <AvatarFallback className="bg-teal-100 text-teal-700 font-bold">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none text-slate-900">{apt.patientName}</p>
                                <p className="text-xs text-muted-foreground">{apt.patientEmail}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant="secondary" className={`${statusDetails.color} border-0`}>
                                {statusDetails.label}
                            </Badge>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(apt.date), 'dd MMM', { locale: es })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {apt.time.substring(0, 5)}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
