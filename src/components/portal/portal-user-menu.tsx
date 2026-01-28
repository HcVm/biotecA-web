"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { CircleUser, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function PortalUserMenu() {
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <a href="/portal/perfil" className="flex items-center w-full cursor-pointer">
                        <CircleUser className="mr-2 h-4 w-4" />
                        Mi Perfil
                    </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 hover:text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
