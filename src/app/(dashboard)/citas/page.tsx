import { getAppointments } from "@/lib/actions/appointments"
import { AppointmentsCalendar } from "@/components/citas/appointments-calendar"
import { NewAppointmentDialog } from "@/components/citas/new-appointment-dialog"
import { AppointmentStats } from "@/components/citas/stats"
import { isSameDay, parseISO } from "date-fns"

export default async function CitasPage() {
    const appointments = await getAppointments()

    // Calculate Stats
    const today = new Date()
    const stats = {
        todayCount: appointments.filter(a => isSameDay(parseISO(a.appointment_date), today)).length,
        pendingCount: appointments.filter(a => a.status === 'scheduled').length,
        confirmedCount: appointments.filter(a => a.status === 'confirmed').length,
        cancelledCount: appointments.filter(a => a.status === 'cancelled').length
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Agenda de Citas</h2>
                    <p className="text-muted-foreground mt-1">
                        Control de turnos, disponibilidades y sesiones médicas.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <NewAppointmentDialog />
                </div>
            </div>

            <AppointmentStats {...stats} />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-1">
                <AppointmentsCalendar appointments={appointments} />
            </div>
        </div>
    )
}
