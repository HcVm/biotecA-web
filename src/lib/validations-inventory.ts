import * as z from "zod"

export const productSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    description: z.string().optional(),
    sku: z.string().optional(),
    price: z.coerce.number().min(0, "El precio no puede ser negativo"),
    cost: z.coerce.number().min(0, "El costo no puede ser negativo").default(0),
    stock_quantity: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
    min_stock_level: z.coerce.number().int().min(0).default(5),
    category: z.string().optional(),
    supplier: z.string().optional(),
    is_active: z.boolean().default(true),
})

export type ProductFormValues = z.infer<typeof productSchema>
