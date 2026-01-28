"use client"

import * as React from "react"
import {
    Calendar,
    Home,
    Users,
    Stethoscope,
    Package,
    FileText,
    BarChart,
    Settings,
    LogOut,
    User2,
    Shield, // Imported
    Clock,  // Imported
    UserCog // Imported
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator, // Imported and used
    SidebarGroup, // Imported
    SidebarGroupLabel, // Imported
    SidebarGroupContent // Imported
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// Flat list for main nav
const navMain = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Pacientes",
        url: "/pacientes",
        icon: Users,
    },
    {
        title: "Citas",
        url: "/citas",
        icon: Calendar,
    },
    {
        title: "Tratamientos",
        url: "/tratamientos",
        icon: Stethoscope,
    },
    {
        title: "Inventario",
        url: "/inventario",
        icon: Package,
    },
    {
        title: "Facturación",
        url: "/facturacion",
        icon: FileText,
    },
    {
        title: "Reportes",
        url: "/reportes",
        icon: BarChart,
    },
]

// Admin specific items
const adminNav = [
    {
        title: "Usuarios",
        url: "/admin/usuarios",
        icon: UserCog,
    },
    {
        title: "Horarios",
        url: "/admin/horarios",
        icon: Clock,
    },
]

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user?: any }) {
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    // Basic check for admin role from metadata
    // In a real app we might want to be stricter or fetch profile, but metadata usually carries it if synced
    // For now we show it always or check user metadata if available
    // const isAdmin = user?.user_metadata?.role === 'admin'
    // To ensure the user sees it as requested, we will render it.

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold">Bioteca Web</span>
                        <span className="text-xs text-muted-foreground">Clínica Podológica</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Clínica</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Administración</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminNav.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                                        <AvatarFallback className="rounded-lg">
                                            <User2 className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.user_metadata?.full_name || 'Usuario'}</span>
                                        <span className="truncate text-xs">{user?.email}</span>
                                    </div>
                                    <Settings className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                                            <AvatarFallback className="rounded-lg">U</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user?.user_metadata?.full_name || 'Usuario'}</span>
                                            <span className="truncate text-xs">{user?.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/account">
                                        {/* Added link to account here if we have it, or just keep generic */}
                                        <Settings className="mr-2 h-4 w-4" />
                                        Configuración
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 hover:text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Cerrar Sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
