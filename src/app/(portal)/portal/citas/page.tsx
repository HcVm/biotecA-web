import { getPatientAppointments } from "@/lib/actions/portal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CancelAppointmentButton } from "@/components/portal/cancel-button"
import { RequestAppointmentDialogWrapper } from "@/components/portal/request-appointment-wrapper"

export default async function PortalCitasPage() {
    const appointments = await getPatientAppointments()

    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mis Citas</h1>
                        <p className="text-muted-foreground">Gestiona tus próximas visitas y consulta el historial.</p>
                    </div>
                    {/* We need patient ID for the dialog. Since this is server component, fetch it. */}
                    <RequestAppointmentDialogWrapper />
                </div>      </div>

            <div className="grid gap-4">
                {appointments.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground border rounded-lg bg-card shadow-sm">
                        No tiene citas registradas.
                    </div>
                ) : (
                    appointments.map((apt) => {
                        const isUpcoming = new Date(apt.appointment_date) > new Date() && apt.status !== 'cancelled' && apt.status !== 'completed'
                        const isCancelled = apt.status === 'cancelled'

                        return (
                            <Card key={apt.id} className={isCancelled ? "opacity-60 bg-muted" : "border-l-4 border-l-primary"}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">
                                                {format(new Date(apt.appointment_date), "EEEE d 'de' MMMM, yyyy - HH:mm", { locale: es })}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Especialista: {apt.doctor?.full_name || 'Sin asignar'}
                                            </p>
                                        </div>
                                        <Badge variant={
                                            isCancelled ? 'destructive' :
                                                apt.status === 'completed' ? 'default' :
                                                    'outline'
                                        }>
                                            {isCancelled ? 'Cancelada' :
                                                apt.status === 'completed' ? 'Realizada' :
                                                    isUpcoming ? 'Programada' : apt.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-sm">Tipo: <strong>{apt.appointment_type}</strong></p>
                                            {apt.notes && <p className="text-sm text-muted-foreground italic mt-1">"{apt.notes}"</p>}
                                        </div>

                                        {isUpcoming && (
                                            <CancelAppointmentButton appointmentId={apt.id} />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
