import * as z from "zod"

export const invoiceItemSchema = z.object({
    description: z.string().min(1, "Descripción requerida"),
    quantity: z.coerce.number().min(1, "Cantidad mínima 1"),
    unit_price: z.coerce.number().min(0, "Precio no puede ser negativo"),
})

export const invoiceSchema = z.object({
    patient_id: z.string().min(1, "Debe seleccionar un paciente"),
    issue_date: z.date(),
    due_date: z.date(),
    status: z.enum(['draft', 'paid', 'pending', 'cancelled']).default('pending'),
    payment_method: z.enum(['cash', 'card', 'transfer', 'insurance']).optional(),
    notes: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, "Debe agregar al menos un ítem"),
})

export type InvoiceFormValues = z.infer<typeof invoiceSchema>
export type InvoiceItemFormValues = z.infer<typeof invoiceItemSchema>
