'use server'

import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types/product'
import { ProductFormValues } from '@/lib/validations-inventory'
import { revalidatePath } from 'next/cache'

export async function getProducts() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }

    return data as Product[]
}

export async function createProduct(data: ProductFormValues) {
    const supabase = await createClient()

    const { error } = await supabase.from('products').insert({
        name: data.name,
        description: data.description || null,
        sku: data.sku || null,
        price: data.price,
        cost: data.cost,
        stock_quantity: data.stock_quantity,
        min_stock_level: data.min_stock_level,
        category: data.category || null,
        supplier: data.supplier || null,
        is_active: data.is_active
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/inventario')
}

export async function updateStock(id: string, newQuantity: number) {
    const supabase = await createClient()

    const { error } = await supabase.from('products').update({
        stock_quantity: newQuantity
    }).eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/inventario')
}
