import { getFinancialReport, getOperationalReport } from "@/lib/actions/reports"
import { RevenueChart, StatusPieChart, DoctorPerformanceChart } from "@/components/reportes/charts"
import { ExportButtons } from "@/components/reportes/export-buttons"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarCheck, CreditCard, TrendingUp, Users, Activity, BarChart3, PieChart } from "lucide-react"

export default async function ReportesPage() {
    // Defaults: Last 3 months
    const endDate = new Date().toISOString()
    const startDate = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString()

    const financial = await getFinancialReport(startDate, endDate)
    const operational = await getOperationalReport(startDate, endDate)

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Reportes y Analítica</h2>
                    <p className="text-muted-foreground mt-1">
                        Visión general del rendimiento, finanzas y operaciones (Últimos 90 días).
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ExportButtons />
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Resumen Operativo</TabsTrigger>
                    <TabsTrigger value="financial" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Financiero</TabsTrigger>
                    <TabsTrigger value="export" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Datos</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="shadow-sm border-l-4 border-l-blue-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">Citas Totales</CardTitle>
                                <CalendarCheck className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{operational.totalAppointments}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    En el periodo seleccionado
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-l-4 border-l-emerald-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">Ingresos Totales</CardTitle>
                                <CreditCard className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(financial.totalRevenue)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Facturado y registrado
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-l-4 border-l-purple-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">Rendimiento</CardTitle>
                                <Activity className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {operational.totalAppointments > 0
                                        ? Math.round((financial.totalRevenue / operational.totalAppointments))
                                        : 0} €
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Ticket medio por cita
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-l-4 border-l-amber-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">Transacciones</CardTitle>
                                <TrendingUp className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{financial.transactionCount}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Facturas generadas
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 shadow-sm border border-slate-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="h-5 w-5 text-slate-500" /> Estado de Citas
                                </CardTitle>
                                <CardDescription>Distribución porcentual de estados</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <StatusPieChart data={operational.statusChart} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3 shadow-sm border border-slate-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-slate-500" /> Rendimiento Equipo
                                </CardTitle>
                                <CardDescription>Citas atendidas por especialista</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DoctorPerformanceChart data={operational.doctorChart} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-6">
                    <Card className="col-span-4 shadow-sm border border-slate-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-slate-500" /> Evolución de Ingresos
                            </CardTitle>
                            <CardDescription>Facturación mensual acumulada</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <RevenueChart data={financial.chartData} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="export" className="space-y-6">
                    <Card className="shadow-sm border border-slate-200">
                        <CardHeader>
                            <CardTitle>Centro de Descargas de Datos</CardTitle>
                            <CardDescription>
                                Acceda a los datos brutos del sistema. Todas las exportaciones se generan en formato CSV compatible con Excel.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border rounded-lg p-4 flex flex-col justify-between bg-slate-50">
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-800">Citas y Agenda</h4>
                                        <p className="text-sm text-slate-500 mt-1">Histórico completo de citas, estados y notas clínicas básicas.</p>
                                    </div>
                                    <div className="flex justify-end">
                                        {/* Note: The ExportButtons component handles multiple buttons. 
                                             Ideally refactor ExportButtons to accept a single type or render individually.
                                             For now, defaulting to the group component but purely for layout demo. */}
                                        {/* In a real refactor we would split ExportButtons. */}
                                        <ExportButtons />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
