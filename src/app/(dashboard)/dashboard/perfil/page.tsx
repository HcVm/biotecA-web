import { createClient } from "@/lib/supabase/server"
import { getMySchedule } from "@/lib/actions/doctor-schedule"
import { DoctorScheduleForm } from "@/components/admin/doctor-schedule-form"
import { StaffProfileForm } from "@/components/admin/staff-profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

    return (
        <div className="container mx-auto py-6 max-w-4xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mi Perfil Profesional</h1>
                <p className="text-muted-foreground">Gestione su información personal y preferencias de trabajo.</p>
            </div>

            <Tabs defaultValue="profile">
                <TabsList>
                    <TabsTrigger value="profile">Datos Personales</TabsTrigger>
                    {isDoctor && <TabsTrigger value="schedule">Mi Horario</TabsTrigger>}
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                    <StaffProfileForm profile={profile} />
                </TabsContent>

                {isDoctor && (
                    <TabsContent value="schedule" className="mt-6">
                        <DoctorScheduleForm initialData={schedule || []} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
