import { getTreatments } from "@/lib/actions/treatments"
import { NewTreatmentDialog } from "@/components/tratamientos/new-treatment-dialog"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Euro } from "lucide-react"

export default async function TratamientosPage() {
    const treatments = await getTreatments()

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Catálogo de Tratamientos</h1>
                    <p className="text-muted-foreground">
                        Gestiona los servicios y precios ofrecidos por la clínica.
                    </p>
                </div>
                <NewTreatmentDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {treatments.map((treatment) => (
                    <Card key={treatment.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{treatment.name}</CardTitle>
                                <Badge variant={treatment.is_active ? "default" : "secondary"}>
                                    {treatment.is_active ? "Activo" : "Inactivo"}
                                </Badge>
                            </div>
                            <CardDescription>{treatment.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                {treatment.description || "Sin descripción disponible."}
                            </p>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    {treatment.duration} min
                                </div>
                                <div className="flex items-center font-bold text-lg">
                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(treatment.price)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
