import { getPatientProfile } from "@/lib/actions/patient-profile"
import { PatientProfileForm } from "@/components/portal/patient-profile-form"
import { redirect } from "next/navigation"

export default async function PortalPerfilPage() {
    const patient = await getPatientProfile()

    if (!patient) {
        // Handle case where auth user exists but no patient profile linked
        return <div>Error: No se encontró ficha de paciente asociada.</div>
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
                <p className="text-muted-foreground">Actualice su información personal y de contacto.</p>
            </div>

            <PatientProfileForm initialData={patient} />
        </div>
    )
}
