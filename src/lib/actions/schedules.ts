'use server'

import { createClient } from '@/lib/supabase/server'
import { DoctorSchedule } from '@/types/schedule'
import { revalidatePath } from 'next/cache'

export async function getDoctorSchedule(doctorId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('day_of_week', { ascending: true })

    if (error) {
        console.error('Error fetching schedule:', error)
        return []
    }

    // Ensure we return 7 days (fill gaps if needed, though frontend can handle it)
    return data as DoctorSchedule[]
}

export async function updateDoctorSchedule(doctorId: string, schedules: Partial<DoctorSchedule>[]) {
    const supabase = await createClient()

    // Upsert logic for each day
    for (const schedule of schedules) {
        if (schedule.day_of_week === undefined) continue;

        const { error } = await supabase.from('doctor_schedules').upsert({
            doctor_id: doctorId,
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time || '09:00',
            end_time: schedule.end_time || '17:00',
            is_active: schedule.is_active ?? true
        }, {
            onConflict: 'doctor_id, day_of_week'
        })

        if (error) {
            console.error(error)
            throw new Error("Error updating schedule for day " + schedule.day_of_week)
        }
    }

    revalidatePath('/admin/horarios')
}
