'use server'

import { createClient } from '@/lib/supabase/server'
import { Treatment } from '@/types/treatment'
import { TreatmentFormValues } from '@/lib/validations-treatment'
import { revalidatePath } from 'next/cache'

export async function getTreatments() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching treatments:', error)
        return []
    }

    return data as Treatment[]
}

export async function createTreatment(data: TreatmentFormValues) {
    const supabase = await createClient()

    const { error } = await supabase.from('treatments').insert({
        name: data.name,
        description: data.description || null,
        duration: data.duration,
        price: data.price,
        category: data.category || null,
        is_active: data.is_active
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/tratamientos')
}

export async function toggleTreatmentStatus(id: string, isActive: boolean) {
    const supabase = await createClient()

    const { error } = await supabase.from('treatments').update({
        is_active: isActive
    }).eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/tratamientos')
}
