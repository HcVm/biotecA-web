"use client"

import { useState } from "react"
import { Profile } from "@/types/profile"
import { ScheduleManager } from "@/components/admin/schedule-manager"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HorariosPageProps {
    doctors: Profile[]
}

// Client wrapper to handle state
export function HorariosPageContent({ doctors }: HorariosPageProps) {
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || "")

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Seleccionar Doctor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map(doc => (
                                    <SelectItem key={doc.id} value={doc.id}>
                                        {doc.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-4">
                            Selecciona un profesional para gestionar su disponibilidad semanal.
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-3">
                <ScheduleManager doctorId={selectedDoctorId} />
            </div>
        </div>
    )
}
