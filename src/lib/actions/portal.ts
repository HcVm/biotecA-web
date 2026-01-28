'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getPatientIdFromUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single()
    return patient?.id
}

export async function getPatientAppointments(patientId?: string) {
    const supabase = await createClient()
    let targetId = patientId

    if (!targetId) {
        targetId = await getPatientIdFromUser() || ''
    }
    if (!targetId) return []

    const { data } = await supabase
        .from('appointments')
        .select(`
            id,
            appointment_date,
            duration,
            status,
            appointment_type,
            notes,
            doctor:profiles!appointments_doctor_id_fkey (full_name, specialty)
        `)
        .eq('patient_id', targetId)
        .order('appointment_date', { ascending: false })

    return (data || []) as any[]
}

export async function getPatientHistory(patientId?: string) {
    const supabase = await createClient()
    let targetId = patientId

    if (!targetId) {
        targetId = await getPatientIdFromUser() || ''
    }
    if (!targetId) return []

    const { data } = await supabase
        .from('patient_treatments')
        .select(`
            *,
            treatments (name),
            profiles (full_name)
        `)
        .eq('patient_id', targetId)
        .order('treatment_date', { ascending: false })

    return (data || []) as any[]
}

export async function cancelAppointmentCustomer(appointmentId: string) {
    const supabase = await createClient()
    const patientId = await getPatientIdFromUser()

    if (!patientId) throw new Error("Unauthorized")

    // Verify ownership
    const { data: appointment } = await supabase
        .from('appointments')
        .select('id, patient_id, appointment_date, status')
        .eq('id', appointmentId)
        .single()

    if (!appointment || appointment.patient_id !== patientId) {
        throw new Error("Cita no encontrada o no autorizada")
    }

    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
        throw new Error("No se puede cancelar una cita completada o ya cancelada")
    }

    // Logic: Prevent cancellation if less than 2 hours?
    const aptTime = new Date(appointment.appointment_date).getTime()
    const now = new Date().getTime()
    const diffHours = (aptTime - now) / (1000 * 60 * 60)

    if (diffHours < 2) {
        throw new Error("Para cancelar con menos de 2 horas de antelación, por favor llame a la clínica.")
    }

    const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', cancellation_reason: 'Cancelado por el paciente desde portal' })
        .eq('id', appointmentId)

    if (error) throw new Error(error.message)

    revalidatePath('/portal/citas')
    revalidatePath('/portal')
}
