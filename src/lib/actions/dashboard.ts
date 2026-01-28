'use server'

import { createClient } from '@/lib/supabase/server'
import { format, subDays } from 'date-fns'

export async function getDashboardStats() {
    const supabase = await createClient()

    // 1. Total Patients
    const { count: totalPatients, error: patientError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })

    // 2. Today's Appointments
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const { count: todayAppointments, error: aptError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('appointment_date', today)
        .lt('appointment_date', tomorrow)

    // 3. Monthly Revenue (Current Month)
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();

    const { data: invoices, error: invError } = await supabase
        .from('invoices')
        .select('total_amount')
        .gte('issue_date', firstDay)
        .neq('status', 'cancelled') // We count pending + paid for now as "Revenue Generated"

    const monthlyRevenue = invoices?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0

    return {
        totalPatients: totalPatients || 0,
        todayAppointments: todayAppointments || 0,
        monthlyRevenue: monthlyRevenue
    }
}

export async function getRevenueChartData() {
    // Mock data based on last 7 days for visual demo if DB is empty, 
    // or aggregate real data. For simplicity in MVP, we might return mock structure 
    // populated with some real data points if they exist, or just mock for "wow" effect until data flows.

    // Let's try to fetch last 30 invoices to aggregate by day
    const supabase = await createClient()
    const { data: invoices } = await supabase
        .from('invoices')
        .select('issue_date, total_amount')
        .order('issue_date', { ascending: true })
        .limit(50)

    // Aggregate by date
    const grouped = (invoices || []).reduce((acc: any, curr) => {
        const date = curr.issue_date.split('T')[0]
        acc[date] = (acc[date] || 0) + curr.total_amount
        return acc
    }, {})

    // Format for Recharts array
    // If no data, return some empty placeholders to avoid crash
    if (Object.keys(grouped).length === 0) {
        return [
            { name: 'Lun', total: 0 },
            { name: 'Mar', total: 0 },
            { name: 'Mie', total: 0 },
            { name: 'Jue', total: 0 },
            { name: 'Vie', total: 0 },
        ]
    }

    return Object.keys(grouped).map(date => ({
        name: format(new Date(date), 'dd/MM'),
        total: grouped[date]
    }))
}
