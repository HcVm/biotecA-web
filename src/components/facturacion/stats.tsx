import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, FileText, CheckCircle2, Clock } from "lucide-react"

interface BillingStatsProps {
    totalRevenue: number
    pendingAmount: number
    paidCount: number
    pendingCount: number
}

export function BillingStats({ totalRevenue, pendingAmount, paidCount, pendingCount }: BillingStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="shadow-sm border-l-4 border-l-emerald-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Ingresos Totales
                    </CardTitle>
                    <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Facturado y cobrado
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-amber-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Pendiente de Cobro
                    </CardTitle>
                    <div className="h-8 w-8 bg-amber-50 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(pendingAmount)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {pendingCount} facturas pendientes
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-blue-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Facturas Pagadas
                    </CardTitle>
                    <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{paidCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Completadas con éxito
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-slate-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Total Emitidas
                    </CardTitle>
                    <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-slate-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                        {paidCount + pendingCount}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Volumen total
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
