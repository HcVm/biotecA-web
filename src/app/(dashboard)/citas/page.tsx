import { getAppointments } from "@/lib/actions/appointments"
import { AppointmentsCalendar } from "@/components/citas/appointments-calendar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NewAppointmentDialog } from "@/components/citas/new-appointment-dialog"

export default async function CitasPage() {
    const appointments = await getAppointments()

    return (
        <div className="container mx-auto py-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agenda de Citas</h1>
                    <p className="text-muted-foreground">
                        Gestiona las citas y horarios de la clínica.
                    </p>
                </div>
                <NewAppointmentDialog />
            </div>

            <div className="flex-1 min-h-[600px]">
                <AppointmentsCalendar appointments={appointments} />
            </div>
        </div>
    )
}
