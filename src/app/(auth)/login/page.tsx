"use client"

import { LoginForm } from "@/components/auth/login-form"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"

function LoginContent() {
    const searchParams = useSearchParams()
    const type = searchParams.get("type") === "staff" ? "staff" : "patient"
    const isPatient = type === "patient"

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Image Panel */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={isPatient ? "/login-patient.png" : "/login-staff.png"}
                        alt={isPatient ? "Bienestar y Salud" : "Tecnología Médica"}
                        fill
                        className="object-cover opacity-90 transition-opacity duration-700 hover:scale-105 transform"
                        priority
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isPatient ? 'from-teal-900/90 to-teal-800/20' : 'from-slate-900/90 to-slate-800/30'}`} />
                </div>

                <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
                    <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors w-fit">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">Volver al inicio</span>
                    </Link>

                    <div className="mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-4xl font-bold mb-4">
                                {isPatient ? "Tu Salud, Nuestra Prioridad" : "Gestión Clínica Avanzada"}
                            </h2>
                            <p className="text-lg text-white/80 max-w-md leading-relaxed">
                                {isPatient
                                    ? "Accede a tu historial, gestiona tus citas y mantén el control de tu bienestar podológico con Biotec Activa."
                                    : "Plataforma integral para el equipo médico y administrativo. Eficiencia y precisión en cada diagnóstico."}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 relative">
                <div className="lg:hidden absolute top-8 left-8">
                    <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">Volver</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <LoginForm />
                </motion.div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Cargando...</div>}>
            <LoginContent />
        </Suspense>
    )
}
