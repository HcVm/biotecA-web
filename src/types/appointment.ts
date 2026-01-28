export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export type Appointment = {
    id: string
    patient_id: string
    doctor_id: string
    appointment_date: string // ISO string
    duration: number // minutes
    status: AppointmentStatus
    appointment_type: string | null
    notes: string | null
    cancellation_reason: string | null
    created_by: string | null
    created_at: string
    updated_at: string

    // Joined fields
    patients?: {
        first_name: string
        last_name: string
        phone: string | null
    }
    profiles?: {
        full_name: string
    }
}
