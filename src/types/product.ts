export type Product = {
    id: string
    name: string
    description: string | null
    sku: string | null
    price: number
    cost: number
    stock_quantity: number
    min_stock_level: number
    category: string | null
    supplier: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}
