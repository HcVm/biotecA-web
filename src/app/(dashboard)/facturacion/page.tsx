import { getInvoices } from "@/lib/actions/billing"
import { NewInvoiceDialog } from "@/components/facturacion/new-invoice-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function FacturacionPage() {
    const invoices = await getInvoices()

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
                    <p className="text-muted-foreground">
                        Gestión de facturas y pagos.
                    </p>
                </div>
                <NewInvoiceDialog />
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nº Factura</TableHead>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Importe Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No hay facturas registradas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                                    <TableCell>
                                        {invoice.patient?.first_name} {invoice.patient?.last_name}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(invoice.issue_date), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            invoice.status === 'paid' ? 'default' :
                                                invoice.status === 'pending' ? 'secondary' : 'outline'
                                        }>
                                            {invoice.status === 'paid' ? 'Pagada' :
                                                invoice.status === 'pending' ? 'Pendiente' : invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(invoice.total_amount)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
