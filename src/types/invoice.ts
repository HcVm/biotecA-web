export type InvoiceStatus = 'draft' | 'paid' | 'pending' | 'cancelled'
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'insurance'

export type Invoice = {
    id: string
    patient_id: string
    invoice_number: string
    issue_date: string
    due_date: string
    status: InvoiceStatus
    total_amount: number
    tax_amount: number
    discount_amount: number
    notes: string | null
    payment_method: PaymentMethod | null
    created_at: string
    updated_at: string

    // Relations
    patient?: {
        first_name: string
        last_name: string
        email: string | null
    }
    items?: InvoiceItem[]
}

export type InvoiceItem = {
    id: string
    invoice_id: string
    description: string
    quantity: number
    unit_price: number
    total_price: number
    created_at: string
}
