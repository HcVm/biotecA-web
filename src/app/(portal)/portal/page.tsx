import { createClient } from "@/lib/supabase/server"
import { getPatientAppointments } from "@/lib/actions/portal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function PortalDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Inicie sesión</div>

    const { data: patient } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center">
                <h1 className="text-2xl font-bold mb-4">¡Bienvenido al Portal del Paciente!</h1>
                <p className="max-w-md text-muted-foreground mb-6">
                    Parece que tu cuenta de usuario aún no está vinculada a un expediente clínico.
                    Por favor, contacta con la clínica para solicitar la activación.
                </p>
                <Button asChild>
                    <Link href="tel:+123456789">Contactar Soporte</Link>
                </Button>
            </div>
        )
    }

    const allAppointments = await getPatientAppointments(patient.id)
    // Filter for upcoming
    const now = new Date()
    const upcoming = allAppointments
        .filter(a => new Date(a.appointment_date) > now && a.status !== 'cancelled')
        .reverse() // Closest first

    const nextAppointment = upcoming[0]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hola, {patient.first_name}</h1>
                <p className="text-muted-foreground">Bienvenido a su área personal de salud.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Next Appointment Card */}
                <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" /> Próxima Cita
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {nextAppointment ? (
                            <div className="space-y-2">
                                <div className="text-2xl font-bold">
                                    {format(new Date(nextAppointment.appointment_date), "EEEE d 'de' MMMM", { locale: es })}
                                </div>
                                <div className="flex items-center text-muted-foreground text-lg">
                                    <Clock className="mr-2 h-5 w-5" />
                                    {format(new Date(nextAppointment.appointment_date), "HH:mm")}
                                </div>
                                <div className="text-sm mt-2 p-2 bg-muted rounded-md">
                                    Dr/a. {nextAppointment.doctor?.full_name || "Asignado"}
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 text-center text-muted-foreground">
                                <p>No tienes citas programadas.</p>
                                <Button className="mt-4" variant="outline" asChild>
                                    <Link href="/portal/citas">Solicitar Cita</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Accesos Rápidos</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                            <Link href="/portal/citas">
                                <Calendar className="h-6 w-6" />
                                <span>Mis Citas</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                            <Link href="/portal/historial">
                                <FileText className="h-6 w-6" />
                                <span>Historial</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
