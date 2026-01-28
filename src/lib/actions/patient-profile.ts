'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPatientProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    console.log("Checking profile for User:", user.id, user.email)

    // 1. Try finding by user_id
    let { data: patient, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // 2. Fallback: Find by Email (Auto-Link)
    if (!patient && user.email) {
        console.log("Not found by ID, trying email:", user.email)
        const { data: patientByEmail } = await supabase
            .from('patients')
            .select('*')
            .eq('email', user.email)
            .single()

        if (patientByEmail) {
            console.log("Found by email! Linking now...")
            // Fix the link
            await supabase
                .from('patients')
                .update({ user_id: user.id })
                .eq('id', patientByEmail.id)

            patient = patientByEmail
        } else {
            // 3. Last Resort: Create empty patient shell if explicitly permitted?
            // For now, let's just return null and let UI handle "No profile"
            console.log("No patient found with email either.")
        }
    }

    if (error && !patient) {
        console.error("Error fetching patient:", error)
        return null
    }

    return patient
}


export async function updatePatientProfile(data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Update patient table
    const { error } = await supabase
        .from('patients')
        .update({
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            address: data.address,
            city: data.city,
            date_of_birth: data.date_of_birth,
            allergies: data.allergies,
            medical_conditions: data.medical_conditions
        })
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/portal/perfil')
    revalidatePath('/portal')
}
