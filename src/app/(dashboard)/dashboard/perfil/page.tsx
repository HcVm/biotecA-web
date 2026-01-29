import { createClient } from "@/lib/supabase/server"
import { getMySchedule } from "@/lib/actions/doctor-schedule"
import { DoctorScheduleForm } from "@/components/admin/doctor-schedule-form"
import { StaffProfileForm } from "@/components/admin/staff-profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserCog, CalendarClock, User } from "lucide-react"

export default async function DashboardProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>No autorizado</div>

    // Fetch Full Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch Schedule (Only relevant if doctor, but fetches empty if not)
    const schedule = await getMySchedule()
    const isDoctor = profile?.role === 'doctor'

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">Administrador</Badge>
            case 'doctor': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Doctor</Badge>
            case 'receptionist': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Recepción</Badge>
            default: return <Badge variant="outline">{role}</Badge>
        }
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Mi Perfil Profesional</h2>
                    <p className="text-muted-foreground mt-1">
                        Gestione su información personal y preferencias de trabajo.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                {/* User Summary Card */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-slate-100">
                            <AvatarImage src={profile?.avatar_url || ""} />
                            <AvatarFallback className="bg-slate-100 text-slate-400 text-2xl">
                                {profile?.full_name?.substring(0, 2).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg text-slate-900 mb-1">{profile?.full_name}</h3>
                        <p className="text-sm text-slate-500 mb-4">{user.email}</p>
                        {getRoleBadge(profile?.role)}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="bg-white border border-slate-200 p-1 rounded-lg w-full md:w-auto h-auto grid grid-cols-2 md:inline-flex">
                            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 py-2.5">
                                <UserCog className="w-4 h-4 mr-2" /> Datos Personales
                            </TabsTrigger>
                            {isDoctor && (
                                <TabsTrigger value="schedule" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 py-2.5">
                                    <CalendarClock className="w-4 h-4 mr-2" /> Mi Horario
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="profile" className="mt-0 focus-visible:ring-0">
                            <StaffProfileForm profile={profile} />
                        </TabsContent>

                        {isDoctor && (
                            <TabsContent value="schedule" className="mt-0 focus-visible:ring-0">
                                <DoctorScheduleForm initialData={schedule || []} />
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
