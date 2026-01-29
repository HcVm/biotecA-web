"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Patient } from "@/types/patient"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const columns: ColumnDef<Patient>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorFn: row => `${row.first_name} ${row.last_name}`,
        id: "full_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Paciente
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const firstName = row.original.first_name
            const lastName = row.original.last_name
            const email = row.original.email
            const id = row.original.id
            const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${email}`} alt={firstName} />
                        <AvatarFallback className="bg-teal-100 text-teal-700 font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <Link href={`/pacientes/${id}`} className="font-medium hover:underline hover:text-teal-600 transition-colors">
                            {firstName} {lastName}
                        </Link>
                        <span className="text-xs text-muted-foreground">{email}</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === 'active' ? 'default' : 'secondary'} className={status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                    {status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
            )
        }
    },
    {
        accessorKey: "last_visit",
        header: "Última Visita",
        cell: () => <span className="text-muted-foreground italic text-sm">Sin visitas</span> // Placeholder for now
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const patient = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(patient.id)}
                        >
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/pacientes/${patient.id}`}>Ver historial</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar detalles</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">Desactivar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
