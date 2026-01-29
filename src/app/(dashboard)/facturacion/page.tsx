import { getInvoices } from "@/lib/actions/billing"
import { NewInvoiceDialog } from "@/components/facturacion/new-invoice-dialog"
import { BillingStats } from "@/components/facturacion/stats"
import { BillingList } from "@/components/facturacion/billing-list"

export default async function FacturacionPage() {
    const invoices = await getInvoices()

    // Calculate stats on the server
    const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.total_amount, 0)

    const pendingAmount = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.total_amount, 0)

    const paidCount = invoices.filter(inv => inv.status === 'paid').length
    const pendingCount = invoices.filter(inv => inv.status === 'pending').length

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Facturación y Pagos</h2>
                    <p className="text-muted-foreground mt-1">
                        Gestión financiera, control de facturas y seguimiento de cobros.
                    </p>
                </div>
                <NewInvoiceDialog />
            </div>

            <BillingStats
                totalRevenue={totalRevenue}
                pendingAmount={pendingAmount}
                paidCount={paidCount}
                pendingCount={pendingCount}
            />

            <BillingList data={invoices} />
        </div>
    )
}
