import { getPatientHistory } from "@/lib/actions/portal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { FileText, Stethoscope } from "lucide-react"

export default async function PortalHistorialPage() {
    const history = await getPatientHistory()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mi Historial Clínico</h1>
                <p className="text-muted-foreground">Registro de tratamientos realizados.</p>
            </div>

            <div className="space-y-6">
                {history.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground border rounded-lg bg-card shadow-sm flex flex-col items-center">
                        <Stethoscope className="h-10 w-10 mb-4 opacity-50" />
                        <p>Aún no hay tratamientos registrados en su historial.</p>
                    </div>
                ) : (
                    <div className="relative border-l border-muted ml-3 space-y-8 pb-10">
                        {history.map((entry) => (
                            <div key={entry.id} className="relative pl-8">
                                {/* Timeline dot */}
                                <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />

                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-base font-semibold">
                                                    {entry.treatments?.name || "Tratamiento"}
                                                </CardTitle>
                                                <CardDescription className="uppercase text-xs font-bold text-muted-foreground mt-1">
                                                    {format(new Date(entry.treatment_date), "d MMM yyyy", { locale: es })}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="secondary">
                                                {entry.status === 'completed' ? 'Completado' : 'En proceso'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-foreground/80 mb-4">
                                            {entry.notes || "Sin notas visibles."}
                                        </p>
                                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                                            <Stethoscope className="h-3 w-3" />
                                            <span>Atendido por: {entry.profiles?.full_name || "Equipo Médico"}</span>
                                        </div>
                                        {entry.photos && entry.photos.length > 0 && (
                                            <div className="mt-4 pt-4 border-t">
                                                <span className="text-xs font-bold flex items-center gap-1 mb-2">
                                                    <FileText className="h-3 w-3" /> Archivos Adjuntos
                                                </span>
                                                <div className="text-xs text-muted-foreground">
                                                    (Archivos disponibles para descarga)
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
