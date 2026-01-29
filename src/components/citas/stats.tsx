import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

interface AppointmentStatsProps {
    todayCount: number
    pendingCount: number // e.g., 'scheduled'
    confirmedCount: number
    cancelledCount: number
}

export function AppointmentStats({ todayCount, pendingCount, confirmedCount, cancelledCount }: AppointmentStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="shadow-sm border-l-4 border-l-blue-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Citas Hoy
                    </CardTitle>
                    <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{todayCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Programadas para hoy
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-orange-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Por Confirmar
                    </CardTitle>
                    <div className="h-8 w-8 bg-orange-50 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Estado 'Agendada'
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-teal-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Confirmadas
                    </CardTitle>
                    <div className="h-8 w-8 bg-teal-50 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{confirmedCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Listas para atender
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-rose-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Canceladas
                    </CardTitle>
                    <div className="h-8 w-8 bg-rose-50 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-rose-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{cancelledCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Este mes
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
