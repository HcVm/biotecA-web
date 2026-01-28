'use server'

import { createClient } from '@/lib/supabase/server'
import { Patient } from '@/types/patient'
import { PatientFormValues } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function getPatients(query: string = '', page: number = 1, pageSize: number = 10) {
    const supabase = await createClient()

    const start = (page - 1) * pageSize
    const end = start + pageSize - 1

    let dbQuery = supabase
        .from('patients')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end)

    if (query) {
        dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    }

    const { data, error, count } = await dbQuery

    if (error) {
        console.error('Error fetching patients:', error)
        return { data: [], count: 0, pageCount: 0 }
    }

    return {
        data: data as Patient[],
        count: count || 0,
        pageCount: Math.ceil((count || 0) / pageSize)
    }
}

export async function getPatient(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching patient:', error)
        return null
    }

    return data as Patient
}

export async function createPatient(data: PatientFormValues) {
    const supabase = await createClient()

    const { error } = await supabase.from('patients').insert({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        address: data.address,
        notes: data.notes
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/pacientes')
}
