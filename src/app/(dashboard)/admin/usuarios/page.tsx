import { getProfiles } from "@/lib/actions/users"
import { UsersTable } from "@/components/admin/users-table"
import { CreateUserDialog } from "@/components/admin/create-user-dialog"
import { UserStats } from "@/components/admin/user-stats"

export default async function AdminUsuariosPage() {
    const users = await getProfiles()

    // Server-side stats calculation
    const totalUsers = users.length
    const doctorCount = users.filter(u => u.role === 'doctor').length
    const adminCount = users.filter(u => u.role === 'admin').length
    const staffCount = users.filter(u => u.role === 'receptionist').length

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Usuarios</h2>
                    <p className="text-muted-foreground mt-1">
                        Control de accesos y perfiles del personal médico y administrativo.
                    </p>
                </div>
                <CreateUserDialog />
            </div>

            <UserStats
                totalUsers={totalUsers}
                doctorCount={doctorCount}
                adminCount={adminCount}
                staffCount={staffCount}
            />

            <UsersTable users={users} />
        </div>
    )
}
