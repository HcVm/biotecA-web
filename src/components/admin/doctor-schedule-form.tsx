"use client"

import { useTransition } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Loader2, Check, Clock, Calendar } from "lucide-react"
import { updateMySchedule, DoctorSchedule } from "@/lib/actions/doctor-schedule"
import { Badge } from "@/components/ui/badge"

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const scheduleSchema = z.object({
    schedules: z.array(z.object({
        day_of_week: z.number(),
        start_time: z.string(),
        end_time: z.string(),
        is_active: z.boolean(),
        id: z.string().optional()
    }))
})

export function DoctorScheduleForm({ initialData }: { initialData: DoctorSchedule[] }) {
    const [isPending, startTransition] = useTransition()

    // Fill missing days with defaults
    const completeData = days.map((_, index) => {
        const existing = initialData.find(d => d.day_of_week === index)
        return existing || {
            day_of_week: index,
            start_time: "09:00",
            end_time: "17:00",
            is_active: false,
        }
    })

    const form = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            schedules: completeData
        }
    })

    const { fields } = useFieldArray({
        control: form.control,
        name: "schedules"
    })

    function onSubmit(data: any) {
        startTransition(async () => {
            try {
                await updateMySchedule(data.schedules)
                alert("Horario actualizado correctamente")
            } catch (err: any) {
                alert("Error: " + err.message)
            }
        })
    }

    return (
        <Card className="shadow-sm border border-slate-200">
            <CardHeader className="bg-white border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">Agenda Semanal</CardTitle>
                        <CardDescription className="text-slate-500">
                            Configure su disponibilidad estándar para recibir citas.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="divide-y divide-slate-100">
                            {fields.map((field, index) => {
                                const isActive = form.watch(`schedules.${index}.is_active`)
                                return (
                                    <div key={field.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-4 mb-3 sm:mb-0 w-40">
                                            <div className={`w-1 h-8 rounded-full ${isActive ? 'bg-blue-500' : 'bg-slate-200'}`} />
                                            <div className="font-medium text-slate-900">{days[field.day_of_week]}</div>
                                        </div>

                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="min-w-[100px]">
                                                <FormField
                                                    control={form.control}
                                                    name={`schedules.${index}.is_active`}
                                                    render={({ field: f }) => (
                                                        <FormItem className="flex items-center space-y-0">
                                                            <FormControl>
                                                                <div className="flex items-center">
                                                                    <Switch
                                                                        checked={f.value}
                                                                        onCheckedChange={f.onChange}
                                                                        className="data-[state=checked]:bg-blue-600"
                                                                    />
                                                                    <span className={`ml-3 text-sm font-medium ${f.value ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                                        {f.value ? 'Disponible' : 'Cerrado'}
                                                                    </span>
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {isActive ? (
                                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                    <div className="relative">
                                                        <Clock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                                        <FormField
                                                            control={form.control}
                                                            name={`schedules.${index}.start_time`}
                                                            render={({ field: f }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="time"
                                                                            {...f}
                                                                            className="w-32 pl-8 h-9 bg-white border-slate-200 focus:ring-blue-500"
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <span className="text-slate-400">–</span>
                                                    <div className="relative">
                                                        <Clock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                                        <FormField
                                                            control={form.control}
                                                            name={`schedules.${index}.end_time`}
                                                            render={({ field: f }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="time"
                                                                            {...f}
                                                                            className="w-32 pl-8 h-9 bg-white border-slate-200 focus:ring-blue-500"
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
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
                            <Button type="submit" disabled={isPending} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[150px]">
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" /> Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
