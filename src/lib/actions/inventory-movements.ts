'use server'

import { createClient } from '@/lib/supabase/server'
import { InventoryMovementType } from '@/types/inventory-movement'
import { revalidatePath } from 'next/cache'

export async function createInventoryMovement(data: {
    product_id: string
    movement_type: InventoryMovementType
    quantity: number
    unit_price?: number
    notes?: string
}) {
    const supabase = await createClient()

    // 1. Insert Movement
    const { error } = await supabase.from('inventory_movements').insert({
        product_id: data.product_id,
        movement_type: data.movement_type,
        quantity: data.quantity,
        unit_price: data.unit_price,
        notes: data.notes
    })

    if (error) throw new Error(error.message)

    // Trigger in DB handles stock update automatically!

    revalidatePath('/inventario')
}
