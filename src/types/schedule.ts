export type DoctorSchedule = {
    id: string
    doctor_id: string
    day_of_week: number // 0-6
    start_time: string // HH:mm:ss
    end_time: string // HH:mm:ss
    is_active: boolean
    created_at: string
    updated_at: string
}

export type DoctorScheduleException = {
    id: string
    doctor_id: string
    exception_date: string // YYYY-MM-DD
    is_available: boolean
    start_time: string | null
    end_time: string | null
    reason: string | null
    created_at: string
}
