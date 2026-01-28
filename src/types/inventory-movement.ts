export type InventoryMovementType = 'purchase' | 'sale' | 'adjustment' | 'return'

export type InventoryMovement = {
    id: string
    product_id: string
    movement_type: InventoryMovementType
    quantity: number
    unit_price?: number
    notes?: string
    created_at: string

    // Relation
    products?: { name: string, sku: string }
    profiles?: { full_name: string }
}
