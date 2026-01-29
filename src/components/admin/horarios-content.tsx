"use client"

import { useState } from "react"
import { Profile } from "@/types/profile"
import { ScheduleManager } from "@/components/admin/schedule-manager"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users } from "lucide-react"

interface HorariosPageProps {
    doctors: Profile[]
}

// Client wrapper to handle state
export function HorariosPageContent({ doctors }: HorariosPageProps) {
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || "")

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            <div className="md:col-span-1 space-y-4">
                <Card className="shadow-sm border border-slate-200 sticky top-4">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-500" /> Professional
                        </CardTitle>
                        <CardDescription>
                            Seleccione para editar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <label className="text-xs font-medium text-slate-500 mb-2 block uppercase tracking-wider">Doctor Seleccionado</label>
                        <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                            <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Seleccione un doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map(doc => (
                                    <SelectItem key={doc.id} value={doc.id}>
                                        <span className="font-medium">{doc.full_name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">Nota:</h4>
                            <p className="text-xs text-blue-800 leading-relaxed">
                                Los cambios en el horario afectarán la disponibilidad futura en el calendario de citas. Asegúrese de coordinar con el profesional antes de realizar modificaciones mayores.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-3">
                <ScheduleManager doctorId={selectedDoctorId} />
            </div>
        </div>
    )
}
