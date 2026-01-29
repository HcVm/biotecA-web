"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Search, ShieldAlert, Stethoscope, User } from "lucide-react"

interface UsersTableProps {
    users: Profile[]
}

export function UsersTable({ users }: UsersTableProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 shadow-none"><ShieldAlert className="w-3 h-3 mr-1" /> Admin</Badge>
            case 'doctor':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 shadow-none"><Stethoscope className="w-3 h-3 mr-1" /> Doctor</Badge>
            case 'receptionist':
                return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 shadow-none"><User className="w-3 h-3 mr-1" /> Staff</Badge>
            default:
                return <Badge variant="outline">{role}</Badge>
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar usuario por nombre o rol..."
                        className="pl-9 bg-slate-50 border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-500 ml-auto">
                    {filteredUsers.length} usuarios encontrados
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[80px] font-semibold text-slate-700">Avatar</TableHead>
                            <TableHead className="font-semibold text-slate-700">Nombre Completo</TableHead>
                            <TableHead className="font-semibold text-slate-700">Rol</TableHead>
                            <TableHead className="font-semibold text-slate-700">Especialidad</TableHead>
                            <TableHead className="font-semibold text-slate-700">Nº Colegiado</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">Etiqueta</TableHead>
                            <TableHead className="w-[100px] text-center font-semibold text-slate-700">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <User className="h-8 w-8 text-slate-300" />
                                        <p>No se encontraron usuarios.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <Avatar className="h-9 w-9 border border-slate-200">
                                            <AvatarImage src={user.avatar_url || ""} />
                                            <AvatarFallback className="bg-slate-100 text-slate-600">
                                                {user.full_name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-900">{user.full_name}</TableCell>
                                    <TableCell>
                                        {getRoleBadge(user.role)}
                                    </TableCell>
                                    <TableCell className="text-slate-600">{user.specialty || <span className="text-slate-300 italic">N/A</span>}</TableCell>
                                    <TableCell className="text-slate-600">{user.license_number || <span className="text-slate-300 italic">N/A</span>}</TableCell>
                                    <TableCell className="text-right">
                                        {user.color ? (
                                            <div className="w-6 h-6 rounded-full inline-block border border-slate-200 shadow-sm" style={{ backgroundColor: user.color }} title="Color de Agenda" />
                                        ) : (
                                            <span className="text-slate-300 text-xs">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <EditUserDialog user={user} />
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
