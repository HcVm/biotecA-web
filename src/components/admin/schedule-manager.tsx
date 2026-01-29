"use client"

import { useState, useTransition, useEffect } from "react"
import { DoctorSchedule } from "@/types/schedule"
import { updateDoctorSchedule, getDoctorSchedule } from "@/lib/actions/schedules"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, Calendar, Check, X, BellRing } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const DAYS = [
    { id: 1, label: 'Lunes', short: 'Lun' },
    { id: 2, label: 'Martes', short: 'Mar' },
    { id: 3, label: 'Miércoles', short: 'Mié' },
    { id: 4, label: 'Jueves', short: 'Jue' },
    { id: 5, label: 'Viernes', short: 'Vie' },
    { id: 6, label: 'Sábado', short: 'Sáb' },
    { id: 0, label: 'Domingo', short: 'Dom' },
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
                alert("Horario actualizado correctamente")
            } catch (e) {
                console.error(e)
                alert("Error al guardar horario")
            }
        })
    }

    if (!doctorId) return (
        <Card className="border-dashed shadow-sm bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <BellRing className="w-12 h-12 mb-4 text-slate-300" />
                <h3 className="font-semibold text-lg text-slate-700">Seleccione un Doctor</h3>
                <p>Elija un profesional del menú lateral para gestionar su disponibilidad.</p>
            </CardContent>
        </Card>
    )

    if (loading) return (
        <Card className="border-none shadow-none bg-transparent">
            <CardContent className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
        </Card>
    )

    return (
        <Card className="shadow-sm border border-slate-200">
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">Configuración Semanal</CardTitle>
                        <CardDescription className="text-slate-500">
                            Establezca los turnos de atención para este especialista.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                    {DAYS.map((day) => {
                        const schedule = schedules.find(s => s.day_of_week === day.id) || {}
                        return (
                            <div key={day.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-4 mb-3 sm:mb-0 w-40">
                                    <div className={`w-1 h-8 rounded-full ${schedule.is_active ? 'bg-blue-500' : 'bg-slate-200'}`} />
                                    <div>
                                        <div className="font-medium text-slate-900">{day.label}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 flex-1">
                                    <div className="min-w-[100px]">
                                        <Switch
                                            checked={schedule.is_active}
                                            onCheckedChange={(c) => handleUpdate(day.id, 'is_active', c)}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                        <span className={`ml-3 text-sm font-medium ${schedule.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {schedule.is_active ? 'Disponible' : 'No disponible'}
                                        </span>
                                    </div>

                                    {schedule.is_active ? (
                                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                            <div className="relative">
                                                <Clock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                                <Input
                                                    type="time"
                                                    className="w-32 pl-8 h-9 bg-white border-slate-200 focus:ring-blue-500"
                                                    value={schedule.start_time?.toString().slice(0, 5)}
                                                    onChange={(e) => handleUpdate(day.id, 'start_time', e.target.value)}
                                                />
                                            </div>
                                            <span className="text-slate-400">–</span>
                                            <div className="relative">
                                                <Clock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                                <Input
                                                    type="time"
                                                    className="w-32 pl-8 h-9 bg-white border-slate-200 focus:ring-blue-500"
                                                    value={schedule.end_time?.toString().slice(0, 5)}
                                                    onChange={(e) => handleUpdate(day.id, 'end_time', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 text-sm text-slate-400 italic pl-1">
                                            Sin turnos asignados
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex justify-end p-6 border-t border-slate-100 bg-slate-50/30">
                    <Button onClick={onSave} disabled={isPending} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[150px]">
                        {isPending ? "Guardando..." : (
                            <>
                                <Check className="w-4 h-4 mr-2" /> Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
