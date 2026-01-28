"use client"

import { useState, useTransition, useEffect } from "react"
import { DoctorSchedule } from "@/types/schedule"
import { updateDoctorSchedule, getDoctorSchedule } from "@/lib/actions/schedules"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock } from "lucide-react"

const DAYS = [
    { id: 1, label: 'Lunes' },
    { id: 2, label: 'Martes' },
    { id: 3, label: 'Miércoles' },
    { id: 4, label: 'Jueves' },
    { id: 5, label: 'Viernes' },
    { id: 6, label: 'Sábado' },
    { id: 0, label: 'Domingo' },
]

interface ScheduleManagerProps {
    doctorId: string
}

export function ScheduleManager({ doctorId }: ScheduleManagerProps) {
    const [schedules, setSchedules] = useState<Partial<DoctorSchedule>[]>([])
    const [loading, setLoading] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Load initial schedule
    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const data = await getDoctorSchedule(doctorId)
                // Merge with defaults
                const merged = DAYS.map(day => {
                    const found = data.find(s => s.day_of_week === day.id)
                    return found || {
                        day_of_week: day.id,
                        start_time: '09:00:00',
                        end_time: '18:00:00',
                        is_active: day.id !== 0 && day.id !== 6 // Default closed on weekends if no data
                    }
                })
                setSchedules(merged)
            } finally {
                setLoading(false)
            }
        }
        if (doctorId) load()
    }, [doctorId])

    const handleUpdate = (dayId: number, field: keyof DoctorSchedule, value: any) => {
        setSchedules(prev => prev.map(s => s.day_of_week === dayId ? { ...s, [field]: value } : s))
    }

    const onSave = () => {
        startTransition(async () => {
            try {
                await updateDoctorSchedule(doctorId, schedules)
                alert("Horario guardado correctamente")
            } catch (e) {
                console.error(e)
                alert("Error al guardar horario")
            }
        })
    }

    if (!doctorId) return <div className="text-muted-foreground p-4">Seleccione un doctor para ver su horario.</div>
    if (loading) return <div>Cargando horario...</div>

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Configurar Horario Semanal
                </CardTitle>
                <CardDescription>
                    Define los días y horas laborales habituales.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {DAYS.map((day) => {
                    const schedule = schedules.find(s => s.day_of_week === day.id) || {}
                    return (
                        <div key={day.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                            <div className="w-32 font-medium">{day.label}</div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={schedule.is_active}
                                        onCheckedChange={(c) => handleUpdate(day.id, 'is_active', c)}
                                    />
                                    <span className="text-sm text-muted-foreground w-20">
                                        {schedule.is_active ? 'Abierto' : 'Cerrado'}
                                    </span>
                                </div>

                                {schedule.is_active && (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="time"
                                            className="w-32"
                                            value={schedule.start_time?.toString().slice(0, 5)}
                                            onChange={(e) => handleUpdate(day.id, 'start_time', e.target.value)}
                                        />
                                        <span>-</span>
                                        <Input
                                            type="time"
                                            className="w-32"
                                            value={schedule.end_time?.toString().slice(0, 5)}
                                            onChange={(e) => handleUpdate(day.id, 'end_time', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}

                <Separator />

                <div className="flex justify-end">
                    <Button onClick={onSave} disabled={isPending}>
                        {isPending ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
