import { getPatientProfile } from "@/lib/actions/patient-profile"
import { RequestAppointmentDialog } from "@/components/portal/request-appointment-dialog"

export async function RequestAppointmentDialogWrapper() {
    const patient = await getPatientProfile()
    if (!patient) return null
    return <RequestAppointmentDialog patientId={patient.id} />
}
