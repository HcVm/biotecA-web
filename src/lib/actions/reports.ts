'use server'

import { createClient } from '@/lib/supabase/server'

export async function getFinancialReport(startDate: string, endDate: string) {
    const supabase = await createClient()

    // Revenues from Invoices
    const { data: invoices, error } = await supabase
        .from('invoices')
        .select('total_amount, issue_date, status')
        .gte('issue_date', startDate)
        .lte('issue_date', endDate)
        .neq('status', 'cancelled')
        .neq('status', 'draft')

    if (error) throw new Error(error.message)

    // Aggregate by Month
    const revenueByMonth: Record<string, number> = {}
    let totalRevenue = 0

    invoices.forEach(inv => {
        const month = inv.issue_date.substring(0, 7) // YYYY-MM
        revenueByMonth[month] = (revenueByMonth[month] || 0) + inv.total_amount
        totalRevenue += inv.total_amount
    })

    // Format for Chart
    const chartData = Object.entries(revenueByMonth).map(([name, value]) => ({
        name,
        total: value
    })).sort((a, b) => a.name.localeCompare(b.name))

    return {
        totalRevenue,
        chartData,
        transactionCount: invoices.length
    }
}

export async function getOperationalReport(startDate: string, endDate: string) {
    const supabase = await createClient()

    // Appointments stats
    const { data: appointments } = await supabase
        .from('appointments')
        .select(`
            status,
            doctor_id,
            profiles!appointments_doctor_id_fkey (full_name)
        `)
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)

    // Status Distribution
    const statusCounts: Record<string, number> = {
        'completed': 0,
        'cancelled': 0,
        'scheduled': 0,
        'no_show': 0
    }

    // Doctor Performance
    const doctorStats: Record<string, { name: string, count: number }> = {}

    appointments?.forEach(apt => {
        // Status
        if (statusCounts[apt.status] !== undefined) {
            statusCounts[apt.status]++
        } else {
            // Handle other statuses or map to 'scheduled'
            if (['confirmed', 'in_progress'].includes(apt.status)) statusCounts['scheduled']++
        }

        // Doctor
        if (apt.doctor_id && apt.profiles) {
            // Supabase sometimes returns array for joined partials if not forced strict, or object. 
            // In many-to-one, it should be object if single() was used or inferred types are correct. 
            // BUT without types, safety check:
            const profileName = Array.isArray(apt.profiles)
                ? apt.profiles[0]?.full_name
                : (apt.profiles as any).full_name

            if (profileName) {
                if (!doctorStats[apt.doctor_id]) {
                    doctorStats[apt.doctor_id] = { name: profileName, count: 0 }
                }
                doctorStats[apt.doctor_id].count++
            }
        }
    })

    const statusChart = [
        { name: 'Completadas', value: statusCounts['completed'], fill: '#22c55e' }, // green
        { name: 'Canceladas', value: statusCounts['cancelled'], fill: '#ef4444' }, // red
        { name: 'Programadas', value: statusCounts['scheduled'], fill: '#3b82f6' }, // blue
        { name: 'No Show', value: statusCounts['no_show'], fill: '#f97316' }, // orange
    ]

    const doctorChart = Object.values(doctorStats).map(d => ({
        name: d.name,
        citas: d.count
    })).sort((a, b) => b.citas - a.citas)

    return {
        totalAppointments: appointments?.length || 0,
        statusChart,
        doctorChart
    }
}

export async function getGenericExportData(table: 'appointments' | 'invoices' | 'patients') {
    const supabase = await createClient()

    // Limit to last 1000 for safety in this demo
    const { data } = await supabase.from(table).select('*').limit(1000).order('created_at', { ascending: false })
    return data || []
}
