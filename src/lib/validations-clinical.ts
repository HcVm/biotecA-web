import * as z from "zod"

export const patientTreatmentSchema = z.object({
    patient_id: z.string(),
    treatment_id: z.string().min(1, "Debe seleccionar un tratamiento"),
    treatment_date: z.date().default(() => new Date()),
    notes: z.string().optional(),
    status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']).default('completed'),
})

export type PatientTreatmentFormValues = z.infer<typeof patientTreatmentSchema>
