"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { getGenericExportData } from "@/lib/actions/reports"
import { useState } from "react"

export function ExportButtons() {
    const [loading, setLoading] = useState(false)

    const handleExport = async (table: 'appointments' | 'invoices' | 'patients', filename: string) => {
        setLoading(true)
        try {
            const data = await getGenericExportData(table)

            if (!data || data.length === 0) {
                alert("No hay datos para exportar")
                return
            }

            // Convert to CSV
            const headers = Object.keys(data[0])
            const csvRows = [
                headers.join(','), // header row
                ...data.map(row => headers.map(fieldName => {
                    const val = row[fieldName]
                    // Escape quotes and wrap in quotes if needed
                    return JSON.stringify(val === null ? '' : val)
                }).join(','))
            ]
            const csvString = csvRows.join('\n')

            // Trigger download
            const blob = new Blob([csvString], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.setAttribute('hidden', '')
            a.setAttribute('href', url)
            a.setAttribute('download', `${filename}.csv`)
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        } catch (error) {
            console.error(error)
            alert("Error al exportar")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('appointments', 'reporte_citas')} disabled={loading}>
                <Download className="mr-2 h-4 w-4" /> Citas
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('invoices', 'reporte_facturas')} disabled={loading}>
                <Download className="mr-2 h-4 w-4" /> Facturación
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('patients', 'reporte_pacientes')} disabled={loading}>
                <Download className="mr-2 h-4 w-4" /> Pacientes
            </Button>
        </div>
    )
}
