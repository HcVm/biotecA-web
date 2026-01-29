import { getDashboardStats, getRevenueChartData, getRecentAppointments } from "@/lib/actions/dashboard"
import { Overview } from "@/components/dashboard/overview"
import { RecentAppointments } from "@/components/dashboard/recent-appointments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Euro, Activity, TrendingUp, Clock, UserCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch generic name if no metadata, or use metadata
    const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Doctor'

    const stats = await getDashboardStats()
    const chartData = await getRevenueChartData()
    const recentAppointments = await getRecentAppointments()

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Hola, {userName} 👋
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Aquí tienes el resumen de la actividad clínica de hoy.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-teal-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Ingresos Mensuales
                        </CardTitle>
                        <div className="h-8 w-8 bg-teal-50 rounded-full flex items-center justify-center">
                            <Euro className="h-4 w-4 text-teal-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(stats.monthlyRevenue)}
                        </div>
                        <p className="text-xs text-teal-600 flex items-center mt-1 font-medium">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12.5% vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Pacientes Totales
                        </CardTitle>
                        <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalPatients}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Base de datos activa
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Citas Hoy</CardTitle>
                        <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center">
                            <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.todayAppointments}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Agenda del día
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            En Tratamiento
                        </CardTitle>
                        <div className="h-8 w-8 bg-orange-50 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">12</div>
                        <p className="text-xs text-muted-foreground mt-1 cursor-pointer hover:underline">
                            Ver casos activos
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Revenue/Stats Chart */}
                <Card className="col-span-4 shadow-sm border border-slate-100">
                    <CardHeader>
                        <CardTitle className="text-lg">Resumen Financiero</CardTitle>
                        <CardDescription>
                            Evolución de ingresos durante los últimos días.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={chartData} />
                    </CardContent>
                </Card>

                {/* Recent Activity List */}
                <Card className="col-span-3 shadow-sm border border-slate-100">
                    <CardHeader>
                        <CardTitle className="text-lg">Citas Recientes</CardTitle>
                        <CardDescription>
                            Últimas confirmaciones y reservas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentAppointments appointments={recentAppointments} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
