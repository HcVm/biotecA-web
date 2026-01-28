export type Patient = {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    date_of_birth: string | null
    gender: 'male' | 'female' | 'other' | null
    address: string | null
    city: string | null
    postal_code: string | null
    insurance_provider: string | null
    insurance_number: string | null
    allergies: string | null
    medical_conditions: string | null
    notes: string | null
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
}
