import { getProfiles } from "@/lib/actions/users"
import { UsersTable } from "@/components/admin/users-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminUsuariosPage() {
    const users = await getProfiles()

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground">
                        Administra los perfiles de doctores y personal de la clínica.
                    </p>
                </div>
                <Button disabled variant="outline" title="Requiere configuración de Service Role">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Equipo Médico y Personal</CardTitle>
                    <CardDescription>
                        Listado de todos los usuarios con acceso al sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UsersTable users={users} />
                </CardContent>
            </Card>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                <strong>Nota:</strong> Para crear nuevos usuarios, necesitamos configurar la <code>SUPABASE_SERVICE_ROLE_KEY</code> en las variables de entorno para usar la API administrativa de Supabase.
            </div>
        </div>
    )
}
