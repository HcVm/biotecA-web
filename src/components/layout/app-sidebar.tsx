"use client"

import * as React from "react"
import {
    LayoutDashboard,
    UsersRound,
    CalendarDays,
    Stethoscope, // Tratamientos
    PackageSearch,
    ReceiptEuro,
    ChartPie,
    Settings,
    LogOut,
    User2,
    ShieldCheck,
    CalendarClock,
    Activity,
    UserCog
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
    SidebarSeparator,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent
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
        icon: LayoutDashboard,
    },
    {
        title: "Pacientes",
        url: "/pacientes",
        icon: UsersRound,
    },
    {
        title: "Citas",
        url: "/citas",
        icon: CalendarDays,
    },
    {
        title: "Tratamientos",
        url: "/tratamientos",
        icon: Stethoscope,
    },
    {
        title: "Inventario",
        url: "/inventario",
        icon: PackageSearch,
    },
    {
        title: "Facturación",
        url: "/facturacion",
        icon: ReceiptEuro,
    },
    {
        title: "Reportes",
        url: "/reportes",
        icon: ChartPie,
    },
]

// Admin specific items
const adminNav = [
    {
        title: "Gestión de Usuarios",
        url: "/admin/usuarios",
        icon: ShieldCheck,
    },
    {
        title: "Configurar Horarios",
        url: "/admin/horarios",
        icon: CalendarClock,
    },
]

export function AppSidebar({ user, role, ...props }: React.ComponentProps<typeof Sidebar> & { user?: any, role?: string }) {
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    const userRole = role || user?.user_metadata?.role || 'staff'

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-3 px-1.5 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-bold text-base tracking-tight text-slate-900">Bioteca Web</span>
                        <span className="text-xs font-medium text-slate-500">Clínica Podológica</span>
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
                                        className="text-slate-600 hover:text-slate-900 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700 font-medium"
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

                {userRole === 'admin' && (
                    <>
                        <SidebarSeparator className="my-2" />
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
                                                className="text-slate-600 hover:text-slate-900 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700 font-medium"
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
                    </>
                )}

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
                                    <Avatar className="h-8 w-8 rounded-lg border border-slate-200">
                                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                                        <AvatarFallback className="rounded-lg bg-slate-100 text-slate-500">
                                            {user?.user_metadata?.full_name?.substring(0, 2)?.toUpperCase() || <User2 className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold text-slate-700">{user?.user_metadata?.full_name || 'Usuario'}</span>
                                        <span className="truncate text-xs capitalize text-slate-500">{userRole === 'doctor' ? 'Doctor' : userRole === 'admin' ? 'Administrador' : userRole}</span>
                                    </div>
                                    <Settings className="ml-auto size-4 text-slate-400" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-slate-200 shadow-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg border border-slate-200">
                                            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                                            <AvatarFallback className="rounded-lg bg-slate-100 text-slate-500">
                                                {user?.user_metadata?.full_name?.substring(0, 2)?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold text-slate-700">{user?.user_metadata?.full_name || 'Usuario'}</span>
                                            <span className="truncate text-xs text-slate-500">{user?.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/perfil" className="cursor-pointer flex items-center gap-2">
                                        <UserCog className="h-4 w-4 text-slate-500" />
                                        <span>Mi Perfil Profesional</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 flex items-center gap-2 cursor-pointer">
                                    <LogOut className="h-4 w-4" />
                                    <span>Cerrar Sesión</span>
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
