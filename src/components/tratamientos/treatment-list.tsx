"use client"

import { useState } from "react"
import { Treatment } from "@/types/treatment"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Search, MoreVertical, Edit, Power, Trash2 } from "lucide-react"
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
import { toggleTreatmentStatus } from "@/lib/actions/treatments"

interface TreatmentListProps {
    data: Treatment[]
}

export function TreatmentList({ data }: TreatmentListProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filtereddata = data.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await toggleTreatmentStatus(id, !currentStatus)
        } catch (error) {
            console.error("Error toggling status", error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar tratamientos..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    Mostrando {filtereddata.length} de {data.length} servicios
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtereddata.map((treatment) => (
                    <Card key={treatment.id} className="group hover:shadow-md transition-all duration-200 border-slate-200 bg-white overflow-hidden">
                        <div className={`h-1 w-full ${treatment.is_active ? 'bg-teal-500' : 'bg-slate-300'}`} />
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <Badge variant="outline" className={`mb-2 ${treatment.category === 'Quiropodia' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            treatment.category === 'Cirugía' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                treatment.category === 'Ortopedia' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                    'bg-slate-50 text-slate-700 border-slate-100'
                                        }`}>
                                        {treatment.category || "General"}
                                    </Badge>
                                    <CardTitle className="text-lg font-bold text-slate-800 leading-tight">
                                        {treatment.name}
                                    </CardTitle>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleToggleStatus(treatment.id, treatment.is_active)}>
                                            <Power className="mr-2 h-4 w-4" />
                                            {treatment.is_active ? 'Desactivar' : 'Activar'}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-rose-600">
                                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px] leading-relaxed">
                                {treatment.description || "Sin descripción detallada disponible para este servicio."}
                            </p>

                            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                                <div className="flex items-center text-sm font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
                                    <Clock className="mr-1.5 h-4 w-4 text-slate-400" />
                                    {treatment.duration} min
                                </div>
                                <div className="text-xl font-bold text-teal-700">
                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(treatment.price)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {filtereddata.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                    <p className="text-muted-foreground">No se encontraron tratamientos que coincidan con su búsqueda.</p>
                </div>
            )}
        </div>
    )
}
