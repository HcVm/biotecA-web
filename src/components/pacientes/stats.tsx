import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, UserCheck, AlertCircle } from "lucide-react"

export function PatientStats({ total, active }: { total: number, active: number }) {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm border-l-4 border-l-teal-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Total Pacientes
                    </CardTitle>
                    <div className="h-8 w-8 bg-teal-50 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-teal-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{total}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Registrados en plataforma
                    </p>
                </CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-blue-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Activos
                    </CardTitle>
                    <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{active}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Con historial reciente
                    </p>
                </CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-emerald-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Nuevos (Mes)
                    </CardTitle>
                    <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center">
                        <UserPlus className="h-4 w-4 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">+12</div>
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                        +2 desde la semana pasada
                    </p>
                </CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-orange-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Sin Seguimiento
                    </CardTitle>
                    <div className="h-8 w-8 bg-orange-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">3</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Requieren contacto
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
