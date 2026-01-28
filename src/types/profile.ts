export type Profile = {
    id: string
    full_name: string
    email?: string // Joined from auth.users (if possible in view) or we just use what we have
    phone: string | null
    avatar_url: string | null
    role: 'admin' | 'doctor' | 'receptionist'
    specialty: string | null
    license_number: string | null
    color: string | null
    bio: string | null
    created_at: string
    updated_at: string
}
