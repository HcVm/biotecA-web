import { getPatient } from "@/lib/actions/patients"
import { getPatientTreatments } from "@/lib/actions/clinical"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, FileText, Activity } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { ClinicalHistoryList } from "@/components/tratamientos/clinical-history-list"
import { NewClinicalEntryDialog } from "@/components/tratamientos/new-clinical-entry-dialog"

interface PatientPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function PatientPage({ params }: PatientPageProps) {
    const { id } = await params
    const patient = await getPatient(id)
    const treatments = await getPatientTreatments(id)

    if (!patient) {
        notFound()
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/pacientes">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{patient.first_name} {patient.last_name}</h1>
                    <p className="text-muted-foreground text-sm">ID: {patient.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-4 w-4" /> Información Personal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Email</span>
                                <p>{patient.email || "No registrado"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Teléfono</span>
                                <p>{patient.phone || "No registrado"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Fecha Nacimiento</span>
                                <p>{patient.date_of_birth || "No registrado"}</p>
                            </div>
                            <Separator />
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Dirección</span>
                                <p>{patient.address || "No registrada"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Notas Iniciales
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {patient.notes ? (
                                <p className="text-sm italic text-muted-foreground">{patient.notes}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground">Sin notas registradas.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Seguro Médico
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Proveedor</span>
                                <p>{patient.insurance_provider || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Nº Póliza</span>
                                <p>{patient.insurance_number || "N/A"}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="history">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="history">Historial</TabsTrigger>
                            <TabsTrigger value="treatments">Activos</TabsTrigger>
                            <TabsTrigger value="files">Archivos</TabsTrigger>
                        </TabsList>

                        <TabsContent value="history" className="space-y-4 mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Historial de Tratamientos</h2>
                                <NewClinicalEntryDialog patientId={patient.id} />
                            </div>
                            <ClinicalHistoryList treatments={treatments} />
                        </TabsContent>

                        <TabsContent value="treatments">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tratamientos en Curso</CardTitle>
                                    <CardDescription>Tratamientos marcados como 'En Progreso' o 'Planificados'.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ClinicalHistoryList treatments={treatments.filter(t => t.status === 'in_progress' || t.status === 'planned')} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="files">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Archivos y Fotos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-muted-foreground">
                                        <FileText className="h-10 w-10 mb-2" />
                                        <p>No hay archivos subidos.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
