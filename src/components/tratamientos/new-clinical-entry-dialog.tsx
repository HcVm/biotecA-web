"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { patientTreatmentSchema, PatientTreatmentFormValues } from "@/lib/validations-clinical"
import { createPatientTreatment } from "@/lib/actions/clinical"
import { useRouter } from "next/navigation"
import { Combobox } from "@/components/ui/combobox"
import { createClient } from "@/lib/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewClinicalEntryDialogProps {
    patientId: string
}

export function NewClinicalEntryDialog({ patientId }: NewClinicalEntryDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [treatments, setTreatments] = useState<{ label: string, value: string }[]>([])

    const form = useForm<PatientTreatmentFormValues>({
        resolver: zodResolver(patientTreatmentSchema),
        defaultValues: {
            patient_id: patientId,
            treatment_date: new Date(),
            status: 'completed',
            notes: ''
        },
    })

    useEffect(() => {
        const fetchTreatments = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('treatments').select('id, name, price').eq('is_active', true)
            if (data) {
                setTreatments(data.map(t => ({
                    label: `${t.name} (${t.price}€)`,
                    value: t.id
                })))
            }
        }
        if (open) fetchTreatments()
    }, [open])

    async function onSubmit(data: PatientTreatmentFormValues) {
        startTransition(async () => {
            try {
                await createPatientTreatment(data)
                setOpen(false)
                form.reset({ ...data, notes: '', treatment_id: '' }) // Reset fields but keep patient_id
                router.refresh()
                // toast success
            } catch (error) {
                console.error(error)
                // toast error
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Registrar Tratamiento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Registrar Tratamiento Clínico</DialogTitle>
                    <DialogDescription>
                        Registre un tratamiento realizado al paciente.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="treatment_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Tratamiento Realizado</FormLabel>
                                    <Combobox
                                        items={treatments}
                                        value={field.value}
                                        onSelect={field.onChange}
                                        placeholder="Seleccionar tratamiento..."
                                        searchPlaceholder="Buscar tratamiento..."
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="completed">Completado</SelectItem>
                                                <SelectItem value="in_progress">En Progreso</SelectItem>
                                                <SelectItem value="planned">Planificado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="treatment_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                onChange={(e) => field.onChange(new Date(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas Clínicas / Evolución</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describa el procedimiento, evolución o detalles relevantes..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Guardando..." : "Guardar Registro"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
