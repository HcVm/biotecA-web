import { getPatients } from "@/lib/actions/patients"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { columns } from "@/components/pacientes/columns"
import { DataTable } from "@/components/pacientes/data-table"
import { NewPatientDialog } from "@/components/pacientes/new-patient-dialog"
import { PatientStats } from "@/components/pacientes/stats"
import { SearchInput } from "@/components/ui/search-input"
import { PaginationControl } from "@/components/ui/pagination-control"

export default async function PacientesPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; page?: string }>
}) {
    const params = await searchParams
    const query = params.query || ''
    const currentPage = Number(params.page) || 1

    // Parallel fetching
    const patientData = getPatients(query, currentPage, 10)
    const statsData = getDashboardStats()

    const [{ data: patients, pageCount }, stats] = await Promise.all([patientData, statsData])

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pacientes</h2>
                    <p className="text-muted-foreground mt-1">
                        Gestión completa de historiales clínicos y datos personales.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <NewPatientDialog />
                </div>
            </div>

            <PatientStats total={stats.totalPatients} active={stats.totalPatients} />

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-full sm:w-1/2 lg:w-1/3">
                        <SearchInput placeholder="🔍 Buscar por nombre, email o DNI..." className="w-full" />
                    </div>
                </div>

                <div className="w-full">
                    <DataTable columns={columns} data={patients} />
                </div>

                <div className="flex justify-end mt-4">
                    <PaginationControl totalPages={pageCount} />
                </div>
            </div>
        </div>
    )
}
