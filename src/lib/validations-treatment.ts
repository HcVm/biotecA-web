import * as z from "zod"

export const treatmentSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    description: z.string().optional(),
    duration: z.coerce.number().min(5, "Duración mínima 5 minutos").default(30),
    price: z.coerce.number().min(0, "El precio no puede ser negativo"),
    category: z.string().optional(),
    is_active: z.boolean().default(true),
})

export type TreatmentFormValues = z.infer<typeof treatmentSchema>
