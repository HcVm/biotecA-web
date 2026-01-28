'use server'

import { createClient } from '@/lib/supabase/server'
import { Invoice } from '@/types/invoice'
import { InvoiceFormValues } from '@/lib/validations-billing'
import { revalidatePath } from 'next/cache'

export async function getInvoices() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('invoices')
        .select(`
        *,
        patient:patients(first_name, last_name, email)
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching invoices:', error)
        return []
    }

    return data as Invoice[]
}

export async function createInvoice(data: InvoiceFormValues) {
    const supabase = await createClient()

    // 1. Calculate totals
    const totalItems = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    // Basic tax logic (can be improved)
    const taxRate = 0.21 // 21% VAT Spain example
    const taxAmount = totalItems * taxRate
    const totalAmount = totalItems + taxAmount

    // 2. Generate Invoice Number (Sequential logic usually requires a trigger or separate table, simulating here with timestamp for MVP)
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`

    // 3. Insert Invoice Header
    const { data: invoice, error: invoiceError } = await supabase.from('invoices').insert({
        patient_id: data.patient_id,
        invoice_number: invoiceNumber,
        issue_date: data.issue_date.toISOString(),
        due_date: data.due_date.toISOString(),
        status: data.status,
        payment_method: data.payment_method || null,
        notes: data.notes || null,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        discount_amount: 0 // Not implementing discount input yet
    }).select().single()

    if (invoiceError) {
        throw new Error(invoiceError.message)
    }

    // 4. Insert Invoice Items
    const itemsToInsert = data.items.map(item => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
    }))

    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert)

    if (itemsError) {
        // Ideally should rollback invoice creation here
        console.error("Error creating invoice items", itemsError)
        throw new Error(itemsError.message)
    }

    revalidatePath('/facturacion')
}
