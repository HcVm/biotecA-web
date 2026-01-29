import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Stethoscope, User, Lock, Phone, MapPin, Mail, Clock } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Biotec Activa</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#servicios" className="hover:text-teal-600 transition-colors">Servicios</Link>
            <Link href="#nosotros" className="hover:text-teal-600 transition-colors">Nosotros</Link>
            <Link href="#contacto" className="hover:text-teal-600 transition-colors">Contacto</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login?type=patient">
              <Button variant="ghost" className="hidden sm:flex text-slate-700 hover:text-teal-700 hover:bg-teal-50">
                Portal Pacientes
              </Button>
            </Link>
            <Link href="/login?type=staff">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                Acceso Staff
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/hero.png')",
              filter: "brightness(0.85)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-slate-900/40" />
          </div>

          <div className="container relative z-10 px-4 text-center md:text-left">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up">
                Salud Integral para <br className="hidden md:block" />Tus Pies y Bienestar
              </h1>
              <p className="text-lg md:text-xl text-slate-100 mb-8 max-w-2xl leading-relaxed">
                En Biotec Activa combinamos tecnología avanzada y calidez humana para ofrecerte los mejores tratamientos podológicos. Tu movilidad es nuestra prioridad.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/login?type=patient">
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-teal-500/20">
                    <User className="mr-2 h-5 w-5" /> Soy Paciente
                  </Button>
                </Link>
                <Link href="/login?type=staff">
                  <Button size="lg" variant="outline" className="border-white/30 bg-white/10 hover:bg-white/20 text-white h-14 px-8 text-lg w-full sm:w-auto backdrop-blur-sm">
                    <Lock className="mr-2 h-5 w-5" /> Portal Corporativo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestros Servicios</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Ofrecemos una gama completa de cuidados especializados para garantizar la salud de tus pies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Podología General", desc: "Cuidado integral para afecciones comunes, uñas y piel.", icon: "🦶" },
                { title: "Biomecánica y Ortorpodología", desc: "Estudio de la pisada y plantillas personalizadas.", icon: "🏃" },
                { title: "Cirugía Podológica", desc: "Intervenciones mínimamente invasivas para soluciones definitivas.", icon: "🏥" },
                { title: "Pie Diabético", desc: "Prevención y tratamiento especializado para pacientes de riesgo.", icon: "❤️" },
                { title: "Podología Deportiva", desc: "Optimización del rendimiento y tratamiento de lesiones.", icon: "🏅" },
                { title: "Podología Infantil", desc: "Cuidado del desarrollo del pie desde los primeros pasos.", icon: "👶" }
              ].map((service, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About/Info Section */}
        <section id="nosotros" className="py-20 bg-white">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold mb-2">
                Sobre Biotec Activa
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Tecnología y Experiencia a tu Servicio
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Somos una clínica líder en podología, comprometida con mejorar la calidad de vida de nuestros pacientes. Contamos con un equipo de profesionales altamente calificados y equipamiento de última generación.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Equipo médico certificado",
                  "Tecnología láser de última generación",
                  "Atención personalizada",
                  "Instalaciones modernas y accesibles"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-teal-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-teal-200 rounded-3xl transform rotate-3 scale-95 opacity-50 blur-xl"></div>
              {/* Placeholder for clinic interior or doctor image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-slate-200 flex items-center justify-center">
                {/* Ideally another specific image, using hero for now or generic pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
                <Stethoscope className="h-24 w-24 text-slate-300 relative z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contáctanos</h2>
                <p className="text-slate-400 mb-8 text-lg">
                  Estamos aquí para ayudarte. Agenda tu cita o visítanos en nuestra clínica.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-teal-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg">Ubicación</h4>
                      <p className="text-slate-400">Av. Principal 123, Edificio Médico, Planta Baja.<br />Ciudad de México, CDMX.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-teal-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg">Teléfono</h4>
                      <p className="text-slate-400">+52 55 1234 5678</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-teal-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg">Email</h4>
                      <p className="text-slate-400">contacto@biotecactiva.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-teal-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg">Horarios</h4>
                      <p className="text-slate-400">Lun - Vie: 9:00 AM - 7:00 PM<br />Sáb: 9:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <h3 className="text-xl font-bold mb-4">¿Listo para mejorar tu salud?</h3>
                <p className="text-slate-400 mb-6">
                  Accede al portal de pacientes para agendar tu cita en línea de manera rápida y sencilla.
                </p>
                <Link href="/login?type=patient">
                  <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12 text-lg">
                    Agendar Cita Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-500 py-8 border-t border-slate-900">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Biotec Activa. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
