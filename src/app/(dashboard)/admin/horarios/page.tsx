import { getProfiles } from "@/lib/actions/users"
import { HorariosPageContent } from "@/components/admin/horarios-content"

export default async function AdminHorariosPage() {
    // Fetch only doctors ideally, but for now all profiles with role doctor
    const profiles = await getProfiles()
    const doctors = profiles.filter(p => p.role === 'doctor')

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Horarios</h1>
                    <p className="text-muted-foreground">
                        Configura la disponibilidad semanal de los doctores.
                    </p>
                </div>
            </div>

            {doctors.length === 0 ? (
                <div className="text-center py-10">
                    <p>No hay doctores registrados en el sistema.</p>
                </div>
            ) : (
                <HorariosPageContent doctors={doctors} />
            )}
        </div>
    )
}
