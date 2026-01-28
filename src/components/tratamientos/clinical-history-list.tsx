import { format } from "date-fns"
import { es } from "date-fns/locale"
import { PatientTreatment } from "@/types/patient-treatment"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Stethoscope, Calendar as CalendarIcon, User } from "lucide-react"

interface ClinicalHistoryListProps {
    treatments: PatientTreatment[]
}

export function ClinicalHistoryList({ treatments }: ClinicalHistoryListProps) {
    if (treatments.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                <Stethoscope className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No hay tratamientos registrados en el historial.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {treatments.map((entry) => (
                <Card key={entry.id}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-base font-semibold text-primary">
                                    {entry.treatments?.name || "Tratamiento"}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {format(new Date(entry.treatment_date), "PPP", { locale: es })}
                                    <span>•</span>
                                    <User className="h-3 w-3" />
                                    {entry.profiles?.full_name || "Staff"}
                                </CardDescription>
                            </div>
                            <Badge variant={entry.status === 'completed' ? 'default' : 'outline'}>
                                {entry.status === 'completed' ? 'Completado' :
                                    entry.status === 'in_progress' ? 'En Curso' : 'Planificado'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                            {entry.notes || "Sin notas adicionales."}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
