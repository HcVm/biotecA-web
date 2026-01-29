import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, ShieldCheck, UserCog } from "lucide-react"

interface UserStatsProps {
    totalUsers: number
    doctorCount: number
    adminCount: number
    staffCount: number
}

export function UserStats({ totalUsers, doctorCount, adminCount, staffCount }: UserStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="shadow-sm border-l-4 border-l-slate-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Total Usuarios
                    </CardTitle>
                    <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-slate-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{totalUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Cuentas activas
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-blue-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Doctores
                    </CardTitle>
                    <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{doctorCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Personal médico
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-purple-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Administradores
                    </CardTitle>
                    <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-purple-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{adminCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Acceso total
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-emerald-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Staff / Recepción
                    </CardTitle>
                    <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center">
                        <UserCog className="h-4 w-4 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{staffCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Soporte operativo
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
