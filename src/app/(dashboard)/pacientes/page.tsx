import { getPatients } from "@/lib/actions/patients"
import { columns } from "@/components/pacientes/columns"
import { DataTable } from "@/components/pacientes/data-table"
import { NewPatientDialog } from "@/components/pacientes/new-patient-dialog"
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
    const { data: patients, pageCount } = await getPatients(query, currentPage, 10)

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
                    <p className="text-muted-foreground">
                        Gestione la información de sus pacientes.
                    </p>
                </div>
                <NewPatientDialog />
            </div>

            <div className="flex items-center space-x-2 mb-4">
                <SearchInput placeholder="Buscar por nombre, email o teléfono..." />
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow">
                {/* We reuse DataTable but disable its internal pagination if we use server side, 
             or pass all data. Since we are slicing, we pass sliced data. */}
                <DataTable columns={columns} data={patients} />
            </div>

            <div className="mt-4">
                <PaginationControl totalPages={pageCount} />
            </div>
        </div>
    )
}
