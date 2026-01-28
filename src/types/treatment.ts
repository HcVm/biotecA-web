export type Treatment = {
    id: string
    name: string
    description: string | null
    duration: number // minutes
    price: number
    category: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}
