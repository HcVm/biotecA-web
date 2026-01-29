import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, Layers } from "lucide-react"

interface InventoryStatsProps {
    totalProducts: number
    lowStockCount: number
    totalValue: number
    topCategory: string
}

export function InventoryStats({ totalProducts, lowStockCount, totalValue, topCategory }: InventoryStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="shadow-sm border-l-4 border-l-blue-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Total Productos
                    </CardTitle>
                    <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{totalProducts}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Items registrados
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-red-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Stock Bajo
                    </CardTitle>
                    <div className="h-8 w-8 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{lowStockCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Requieren reabastecimiento
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-emerald-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Valor Inventario
                    </CardTitle>
                    <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalValue)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Costo total estimado
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-purple-500 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Categoría Principal
                    </CardTitle>
                    <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center">
                        <Layers className="h-4 w-4 text-purple-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900 truncate">
                        {topCategory}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Mayor variedad
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
