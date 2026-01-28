"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getNotifications, markNotificationAsRead, Notification } from "@/lib/actions/notifications"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function NotificationsMenu() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchNotes = async () => {
            const data = await getNotifications()
            setNotifications(data)
            setUnreadCount(data.filter(n => !n.is_read).length)
        }
        // Poll every 30s or on mount
        fetchNotes()
        const interval = setInterval(fetchNotes, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleRead = async (n: Notification) => {
        if (!n.is_read) {
            await markNotificationAsRead(n.id)
            setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, is_read: true } : item))
            setUnreadCount(prev => Math.max(0, prev - 1))
        }
        if (n.link) {
            router.push(n.link)
            setOpen(false)
        }
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
                <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No tienes notificaciones.
                    </div>
                ) : (
                    notifications.map(note => (
                        <DropdownMenuItem
                            key={note.id}
                            onClick={() => handleRead(note)}
                            className={cn(
                                "flex flex-col items-start gap-1 p-3 cursor-pointer",
                                !note.is_read && "bg-muted/50 font-medium"
                            )}
                        >
                            <div className="flex justify-between w-full">
                                <span className="text-sm font-semibold">{note.title}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {note.message}
                            </p>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
