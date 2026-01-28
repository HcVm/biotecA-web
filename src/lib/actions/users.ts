'use server'

import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types/profile'
import { revalidatePath } from 'next/cache'

export async function getProfiles() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'patient') // Exclude patients from Staff list
        .order('full_name', { ascending: true })

    if (error) {
        console.error('Error fetching profiles:', error)
        return []
    }

    return data as Profile[]
}

export async function updateProfile(id: string, data: Partial<Profile>) {
    const supabase = await createClient()

    const { error } = await supabase.from('profiles').update({
        full_name: data.full_name,
        role: data.role,
        specialty: data.specialty,
        license_number: data.license_number,
        color: data.color,
        bio: data.bio
    }).eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/usuarios')
}
