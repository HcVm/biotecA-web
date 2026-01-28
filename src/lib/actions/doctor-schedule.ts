'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type DoctorSchedule = {
    id?: string
    doctor_id: string
    day_of_week: number
    start_time: string
    end_time: string
    is_active: boolean
}

export async function getMySchedule() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', user.id)
        .order('day_of_week')

    return data as DoctorSchedule[]
}

export async function updateMySchedule(schedules: DoctorSchedule[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Upsert logic
    // We want to ensure doctor_id is current user to prevent tampering
    const cleanSchedules = schedules.map(s => ({
        ...s,
        doctor_id: user.id
    }))

    const { error } = await supabase
        .from('doctor_schedules')
        .upsert(cleanSchedules, { onConflict: 'doctor_id, day_of_week' })

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/perfil')
}
