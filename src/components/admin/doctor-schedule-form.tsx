"use client"

import { useState, useTransition } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Loader2, Save } from "lucide-react"
import { updateMySchedule, DoctorSchedule } from "@/lib/actions/doctor-schedule"

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// Schema
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
            // doctor_id will be handled by server
        }
    })

    const form = useForm({
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
        <Card>
            <CardHeader>
                <CardTitle>Horario de Disponibilidad</CardTitle>
                <CardDescription>Configure los días y horas que estará disponible para citas.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                                <div className="w-24 font-medium">
                                    {days[field.day_of_week]}
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`schedules.${index}.is_active`}
                                    render={({ field: f }) => (
                                        <FormItem className="flex items-center space-y-0">
                                            <FormControl>
                                                <Switch checked={f.value} onCheckedChange={f.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`schedules.${index}.start_time`}
                                        render={({ field: f }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="time" {...f} disabled={!form.watch(`schedules.${index}.is_active`)} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <span>-</span>
                                    <FormField
                                        control={form.control}
                                        name={`schedules.${index}.end_time`}
                                        render={({ field: f }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="time" {...f} disabled={!form.watch(`schedules.${index}.is_active`)} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Horario
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
