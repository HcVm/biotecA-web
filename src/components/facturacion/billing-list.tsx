"use client"

import { useState } from "react"
import { Invoice } from "@/types/invoice"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Eye, Download, Printer, FileText } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface BillingListProps {
    data: Invoice[]
}

export function BillingList({ data }: BillingListProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredData = data.filter(invoice =>
        invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nº factura o paciente..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredData.length} documentos encontrados
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-700">Nº Factura</TableHead>
                            <TableHead className="font-semibold text-slate-700">Paciente</TableHead>
                            <TableHead className="font-semibold text-slate-700">Fecha Emisión</TableHead>
                            <TableHead className="text-center font-semibold text-slate-700">Estado</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">Importe Total</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700 px-4">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <FileText className="h-8 w-8 text-slate-300" />
                                        <p>No se encontraron facturas.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((invoice) => (
                                <TableRow key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                            {invoice.invoice_number}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-slate-900">
                                            {invoice.patient?.first_name} {invoice.patient?.last_name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500">
                                        {format(new Date(invoice.issue_date), "dd MMM yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={
                                            invoice.status === 'paid' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                invoice.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                    "bg-slate-100 text-slate-500 border-slate-200"
                                        }>
                                            {invoice.status === 'paid' ? 'Pagada' :
                                                invoice.status === 'pending' ? 'Pendiente' : 'Borrador'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-slate-800 text-base">
                                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(invoice.total_amount)}
                                    </TableCell>
                                    <TableCell className="text-right px-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" /> Descargar PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Printer className="mr-2 h-4 w-4" /> Imprimir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
