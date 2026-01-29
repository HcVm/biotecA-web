import { getTreatments } from "@/lib/actions/treatments"
import { NewTreatmentDialog } from "@/components/tratamientos/new-treatment-dialog"
import { TreatmentStats } from "@/components/tratamientos/stats"
import { TreatmentList } from "@/components/tratamientos/treatment-list"

export default async function TratamientosPage() {
    const treatments = await getTreatments()

    // Server-side stats calculation
    const totalCount = treatments.length
    const activeCount = treatments.filter(t => t.is_active).length
    const avgPrice = totalCount > 0
        ? treatments.reduce((sum, t) => sum + t.price, 0) / totalCount
        : 0

    // Determine top category
    const categoryCounts: Record<string, number> = {}
    treatments.forEach(t => {
        const cat = t.category || 'General'
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Catálogo de Tratamientos</h2>
                    <p className="text-muted-foreground mt-1">
                        Gestión de precios, duración y tipos de servicios clínicos.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <NewTreatmentDialog />
                </div>
            </div>

            <TreatmentStats
                totalCount={totalCount}
                activeCount={activeCount}
                avgPrice={avgPrice}
                topCategory={topCategory}
            />

            <TreatmentList data={treatments} />
        </div>
    )
}
