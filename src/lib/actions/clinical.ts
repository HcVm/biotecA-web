'use server'

import { createClient } from '@/lib/supabase/server'
import { PatientTreatment } from '@/types/patient-treatment'
import { PatientTreatmentFormValues } from '@/lib/validations-clinical'
import { revalidatePath } from 'next/cache'

export async function getPatientTreatments(patientId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('patient_treatments')
        .select(`
        *,
        treatments (
            name,
            price
        ),
        profiles (
            full_name
        )
    `)
        .eq('patient_id', patientId)
        .order('treatment_date', { ascending: false })

    if (error) {
        console.error('Error fetching patient treatments:', error)
        return []
    }

    return data as PatientTreatment[]
}

export async function createPatientTreatment(data: PatientTreatmentFormValues) {
    const supabase = await createClient()

    // Get current user to set as applied_by
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('patient_treatments').insert({
        patient_id: data.patient_id,
        treatment_id: data.treatment_id,
        treatment_date: data.treatment_date.toISOString(),
        notes: data.notes,
        status: data.status,
        applied_by: user?.id
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath(`/pacientes/${data.patient_id}`)
}
