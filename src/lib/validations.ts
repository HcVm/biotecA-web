import * as z from "zod"

export const patientSchema = z.object({
    first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido").optional().or(z.literal('')),
    phone: z.string().min(6, "Número de teléfono inválido").optional().or(z.literal('')),
    date_of_birth: z.string().optional(), // We'll handle date as string YYYY-MM-DD from input type="date"
    address: z.string().optional(),
    insurance_provider: z.string().optional(),
    insurance_number: z.string().optional(),
    notes: z.string().optional(),
})

export type PatientFormValues = z.infer<typeof patientSchema>

export const appointmentSchema = z.object({
    patient_id: z.string().min(1, "Debe seleccionar un paciente"),
    doctor_id: z.string().min(1, "Debe asignar un doctor"),
    appointment_date: z.date({
        required_error: "La fecha y hora son requeridas",
    }),
    duration: z.coerce.number().min(5, "Duración mínima 5 minutos").default(30),
    appointment_type: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).default('scheduled'),
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>
