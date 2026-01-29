import { getProfiles } from "@/lib/actions/users"
import { HorariosPageContent } from "@/components/admin/horarios-content"
import { CalendarClock } from "lucide-react"

export default async function AdminHorariosPage() {
    // Fetch only doctors ideally, but for now all profiles with role doctor
    const profiles = await getProfiles()
    const doctors = profiles.filter(p => p.role === 'doctor')

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Horarios</h2>
                    <p className="text-muted-foreground mt-1">
                        Configura la disponibilidad semanal de los doctores para el calendario de citas.
                    </p>
                </div>
            </div>

            {doctors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <CalendarClock className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">No hay doctores registrados</h3>
                    <p className="text-slate-500 max-w-sm text-center mt-2">
                        Para gestionar horarios, primero debe crear usuarios con el rol de "Doctor" en la sección de Usuarios.
                    </p>
                </div>
            ) : (
                <HorariosPageContent doctors={doctors} />
            )}
        </div>
    )
}
