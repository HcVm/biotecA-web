'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Notification = {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    link?: string
    is_read: boolean
    created_at: string
}

export async function getNotifications() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

    return data as Notification[]
}

export async function markNotificationAsRead(id: string) {
    const supabase = await createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    revalidatePath('/portal')
    revalidatePath('/dashboard')
}

export async function createNotification(userId: string, title: string, message: string, type: string = 'info', link?: string) {
    // Utility to be called by other actions
    const supabase = await createClient()
    await supabase.from('notifications').insert({
        user_id: userId,
        title,
        message,
        type,
        link
    })
}
