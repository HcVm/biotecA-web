"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Profile } from "@/types/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditUserDialog } from "@/components/admin/edit-user-dialog"

interface UsersTableProps {
    users: Profile[]
}

export function UsersTable({ users }: UsersTableProps) {
    if (users.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No hay usuarios registrados.</div>
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Avatar</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Especialidad</TableHead>
                        <TableHead>Nº Colegiado</TableHead>
                        <TableHead className="text-right">Color</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={user.avatar_url || ""} />
                                    <AvatarFallback>{user.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{user.full_name}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    user.role === 'admin' ? 'destructive' :
                                        user.role === 'doctor' ? 'default' : 'secondary'
                                }>
                                    {user.role === 'admin' ? 'Admin' :
                                        user.role === 'doctor' ? 'Doctor' : 'Recepción'}
                                </Badge>
                            </TableCell>
                            <TableCell>{user.specialty || "-"}</TableCell>
                            <TableCell>{user.license_number || "-"}</TableCell>
                            <TableCell className="text-right">
                                {user.color && (
                                    <div className="w-6 h-6 rounded-full inline-block border bg-center ml-auto" style={{ backgroundColor: user.color }} />
                                )}
                            </TableCell>
                            <TableCell>
                                <EditUserDialog user={user} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
