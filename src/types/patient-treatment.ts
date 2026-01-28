export type PatientTreatment = {
    id: string
    patient_id: string
    treatment_id: string
    appointment_id: string | null
    applied_by: string | null
    treatment_date: string
    notes: string | null
    photos: string[] | null
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
    created_at: string
    updated_at: string

    // Relations
    treatments?: {
        name: string
        price: number
    }
    profiles?: {
        full_name: string
    }
}
