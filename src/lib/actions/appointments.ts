'use server'

import { createClient } from '@/lib/supabase/server'
import { Appointment } from '@/types/appointment'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'

// ... existing actions ...

export async function getAppointments() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('appointments')
        .select(`
        *,
        patients (
            first_name,
            last_name
        ),
        profiles!appointments_doctor_id_fkey (
            full_name
        )
    `)
        .order('appointment_date', { ascending: false })

    if (error) {
        console.error('Error fetching appointments:', error)
        return []
    }

    return data as Appointment[]
}

export async function createAppointment(data: any) {
    const supabase = await createClient()

    // VALIDATION: Check for conflicts
    const startTime = new Date(data.appointment_date)
    const endTime = new Date(startTime.getTime() + data.duration * 60000)

    // 1. Check doctor availability schedule
    const dayOfWeek = startTime.getDay()
    const { data: schedule } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', data.doctor_id)
        .eq('day_of_week', dayOfWeek)
        .single()

    // If schedule exists for that day, check bounds
    // Note: If no schedule exists, we default to potentially "Available" or "Unavailable" depending on policy.
    // Let's assume strict: If schedule defined, must be within. If not defined, assume not working? 
    // Or simpler: If schedule exists, check it.
    if (schedule) {
        if (!schedule.is_active) {
            throw new Error("El doctor no trabaja este día.")
        }

        const scheduleStart = new Date(`${startTime.toISOString().split('T')[0]}T${schedule.start_time}`)
        const scheduleEnd = new Date(`${startTime.toISOString().split('T')[0]}T${schedule.end_time}`)

        // Adjust for timezone potentially, but simplified here assuming local/UTC consistent
        // Comparing hours/minutes
        const reqStartMinutes = startTime.getHours() * 60 + startTime.getMinutes()
        const reqEndMinutes = endTime.getHours() * 60 + endTime.getMinutes()

        const schStartMinutes = parseInt(schedule.start_time.split(':')[0]) * 60 + parseInt(schedule.start_time.split(':')[1])
        const schEndMinutes = parseInt(schedule.end_time.split(':')[0]) * 60 + parseInt(schedule.end_time.split(':')[1])

        if (reqStartMinutes < schStartMinutes || reqEndMinutes > schEndMinutes) {
            throw new Error(`Horario fuera del turno (${schedule.start_time} - ${schedule.end_time})`)
        }
    }

    // 2. Check for overlapping appointments
    const { count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', data.doctor_id)
        .neq('status', 'cancelled')
        .or(`and(appointment_date.lte.${startTime.toISOString()}, appointment_date.gte.${new Date(startTime.getTime() - 24 * 60 * 60 * 1000).toISOString()})`) // filter close range first optimization

    // Precise overlap check in JS or SQL
    // Overlap if: (StartA < EndB) and (EndA > StartB)
    const { data: overlaps } = await supabase
        .from('appointments')
        .select('appointment_date, duration')
        .eq('doctor_id', data.doctor_id)
        .neq('status', 'cancelled')
        .gte('appointment_date', new Date(startTime.getTime() - 12 * 60 * 60 * 1000).toISOString())
        .lte('appointment_date', new Date(endTime.getTime() + 12 * 60 * 60 * 1000).toISOString())

    const hasOverlap = overlaps?.some(apt => {
        const aptStart = new Date(apt.appointment_date)
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000)
        return startTime < aptEnd && endTime > aptStart
    })

    if (hasOverlap) {
        throw new Error("El doctor ya tiene una cita en ese horario.")
    }

    const { error } = await supabase.from('appointments').insert({
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        appointment_date: data.appointment_date.toISOString(),
        duration: data.duration,
        appointment_type: data.appointment_type,
        notes: data.notes,
        status: data.status
    })

    if (error) {
        throw new Error(error.message)
    }

    // Notify User
    // 1. Get Patient's User ID
    const { data: patientData } = await supabase
        .from('patients')
        .select('user_id')
        .eq('id', data.patient_id)
        .single()

    if (patientData && patientData.user_id) {
        await createNotification(
            patientData.user_id,
            "Cita Agendada",
            "Se ha agendado una nueva cita correctamente.",
            "success",
            "/portal/citas"
        )
    }

    revalidatePath('/citas')
}

export async function updateAppointment(id: string, data: any) {
    const supabase = await createClient() // Create client inside action

    // (Could add same validation logic here)

    const { error } = await supabase.from('appointments').update(data).eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/citas')
}

export async function getDoctorAvailability(doctorId: string, dateStr: string) {
    const supabase = await createClient()
    const date = new Date(dateStr)
    const dayOfWeek = date.getDay()

    // 1. Get Schedule
    const { data: schedule } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('day_of_week', dayOfWeek)
        .single()

    if (!schedule || !schedule.is_active) {
        return [] // No slots
    }

    // 2. Get existing appointments
    const { data: appointments } = await supabase
        .from('appointments')
        .select('appointment_date, duration')
        .eq('doctor_id', doctorId)
        .neq('status', 'cancelled')
        .gte('appointment_date', `${dateStr}T00:00:00`)
        .lte('appointment_date', `${dateStr}T23:59:59`)

    // 3. Generate slots (e.g. every 30 mins)
    const slots = []
    let current = parseInt(schedule.start_time.split(':')[0]) * 60 + parseInt(schedule.start_time.split(':')[1])
    const end = parseInt(schedule.end_time.split(':')[0]) * 60 + parseInt(schedule.end_time.split(':')[1])
    const interval = 30 // hardcoded 30 min slots for picker

    while (current + interval <= end) {
        const h = Math.floor(current / 60)
        const m = current % 60
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`

        // Check collision
        const slotStart = new Date(`${dateStr}T${timeStr}:00`)
        const slotEnd = new Date(slotStart.getTime() + interval * 60000)

        const isTaken = appointments?.some(apt => {
            const aptStart = new Date(apt.appointment_date)
            const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000)
            return slotStart < aptEnd && slotEnd > aptStart
        })

        if (!isTaken) {
            slots.push(timeStr)
        }
        current += interval
    }

    return slots
}
