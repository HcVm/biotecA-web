import { getProducts } from "@/lib/actions/inventory"
import { NewProductDialog } from "@/components/inventario/new-product-dialog"
import { NewMovementDialog } from "@/components/inventario/new-movement-dialog"
import { InventoryStats } from "@/components/inventario/stats"
import { InventoryList } from "@/components/inventario/inventory-list"

export default async function InventarioPage() {
    const products = await getProducts()

    // Server-side stats calculation
    const totalProducts = products.length
    const lowStockCount = products.filter(p => p.stock_quantity <= p.min_stock_level).length
    const totalValue = products.reduce((sum, p) => sum + (p.cost * p.stock_quantity), 0)

    // Determine top category
    const categoryCounts: Record<string, number> = {}
    products.forEach(p => {
        const cat = p.category || 'General'
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Control de Inventario</h2>
                    <p className="text-muted-foreground mt-1">
                        Gestión de existencias, movimientos y valoración de stock.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <NewMovementDialog />
                    <NewProductDialog />
                </div>
            </div>

            <InventoryStats
                totalProducts={totalProducts}
                lowStockCount={lowStockCount}
                totalValue={totalValue}
                topCategory={topCategory}
            />

            <InventoryList data={products} />
        </div>
    )
}
