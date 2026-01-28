'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'

export type ShopProduct = {
    id: string
    name: string
    description: string | null
    price: number
    stock_quantity: number
    image_url?: string // Assuming we might have this later, strictly text for now in schema
}

export async function getShopProducts() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .gt('stock_quantity', 0) // Only show in-stock
        .order('name')

    if (error) {
        console.error("Error fetching shop products:", error)
        return []
    }

    return data as ShopProduct[]
}

export type CartItem = {
    productId: string
    quantity: number
}

export async function createShopOrder(items: CartItem[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Debes iniciar sesión.")

    // 1. Get Patient ID
    const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!patient) throw new Error("No se encontró ficha de paciente vinculada.")

    // 2. Calculate Totals & Verify Stock (Optimistic check)
    let totalAmount = 0
    const invoiceItems = []

    for (const item of items) {
        const { data: product } = await supabase
            .from('products')
            .select('price, name, stock_quantity')
            .eq('id', item.productId)
            .single()

        if (!product) throw new Error(`Producto no encontrado: ${item.productId}`)
        if (product.stock_quantity < item.quantity) {
            throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock_quantity}`)
        }

        const subtotal = product.price * item.quantity
        totalAmount += subtotal

        invoiceItems.push({
            item_type: 'product',
            item_id: item.productId,
            description: product.name,
            quantity: item.quantity,
            unit_price: product.price,
            subtotal: subtotal
        })
    }

    // 3. Create Invoice (Pending Payment)
    const { data: invoice, error: invError } = await supabase
        .from('invoices')
        .insert({
            patient_id: patient.id,
            status: 'pending', // Waiting for payment
            total_amount: totalAmount,
            issue_date: new Date().toISOString(),
            notes: 'Pedido Online desde Portal'
        })
        .select()
        .single()

    if (invError) throw new Error(invError.message)

    // 4. Create Invoice Items
    const itemsWithId = invoiceItems.map(i => ({ ...i, invoice_id: invoice.id }))
    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsWithId)

    if (itemsError) throw new Error(itemsError.message)

    // 5. Create Inventory Movements (Sale) -> Triggers stock update
    const movements = items.map(item => ({
        product_id: item.productId,
        movement_type: 'sale',
        quantity: item.quantity,
        reference_id: invoice.id,
        notes: `Venta Online # ${invoice.invoice_number || invoice.id}`
    }))

    const { error: movError } = await supabase.from('inventory_movements').insert(movements)

    if (movError) {
        console.error("Movements error", movError)
    }

    // Notify
    await createNotification(
        user.id,
        "Pedido Confirmado",
        `Tu pedido #${invoice.invoice_number} ha sido procesado exitosamente.`,
        "success",
        "/portal/tienda"
    )

    revalidatePath('/portal/tienda')
    revalidatePath('/portal/citas') // If we show orders there? Maybe distinct page.
    return invoice
}
