import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CircleDollarSign, Stethoscope, Tag } from "lucide-react"

interface TreatmentStatsProps {
    totalCount: number
    activeCount: number
    avgPrice: number
    topCategory: string
}

export function TreatmentStats({ totalCount, activeCount, avgPrice, topCategory }: TreatmentStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="shadow-sm border-l-4 border-l-teal-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Total Servicios
                    </CardTitle>
                    <div className="h-8 w-8 bg-teal-50 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-4 w-4 text-teal-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        En catálogo
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-blue-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Activos
                    </CardTitle>
                    <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{activeCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Disponibles para reserva
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-emerald-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Precio Promedio
                    </CardTitle>
                    <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center">
                        <CircleDollarSign className="h-4 w-4 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(avgPrice)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Valor medio del servicio
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-purple-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Categoría Top
                    </CardTitle>
                    <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center">
                        <Tag className="h-4 w-4 text-purple-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900 truncate">
                        {topCategory}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Más frecuente
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
