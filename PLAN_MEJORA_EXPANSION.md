# Plan de Mejora y Expansión - Bioteca Web v2.0

Este documento detalla la hoja de ruta para la siguiente etapa de desarrollo, enfocada en la gestión de roles (Doctores/Pacientes), portal del paciente, reportes avanzados y refinamiento general de la experiencia de usuario.

## Objetivos Principales
1.  **Gestión de Usuarios Avanzada**: Permitir la creación de Doctores y personal por parte de administradores.
2.  **Portal del Paciente**: Acceso seguro para que los pacientes consulten sus citas e historial.
3.  **Gestión de Disponibilidad**: Herramientas para que los doctores definan sus horarios.
4.  **Reportes y Analítica**: Sección dedicada a métricas de negocio detalladas.
5.  **Refinamiento General**: Mejoras en UI/UX, filtros avanzados y validaciones en todos los módulos existentes.

---

## Fases de Implementación

### Fase 1: Gestión de Identidad y Roles (Admin/Staff)
**Objetivo**: Permitir al administrador gestionar el equipo médico y personal.
-   [ ] **Módulo de Usuarios (Admin)**: 
    -   Tabla de usuarios del sistema (Doctores, Recepcionistas, Admin).
    -   Formulario para invitar/crear nuevos usuarios (integración con Supabase Auth Admin).
    -   Asignación de roles (Doctor, Staff, Admin).
-   [ ] **Perfil de Usuario**:
    -   Página de configuración de cuenta `(dashboard)/account`.
    -   Actualización de datos personales y cambio de contraseña.
    -   Subida de foto de perfil (Avatar).

### Fase 2: Gestión de Disponibilidad Médica
**Objetivo**: Que los doctores puedan definir cuándo están disponibles para evitar conflictos de citas.
-   [ ] **Esquema de Base de Datos**: Crear tabla `doctor_schedules` (días, horas inicio/fin, descansos).
-   [ ] **Interfaz de Horarios**: Calendario interactivo para definir turnos recurrentes o bloqueos específicos.
-   [ ] **Validación de Citas**: Actualizar el formulario de `Nueva Cita` para bloquear horarios no disponibles.

### Fase 3: Portal del Paciente
**Objetivo**: Crear un entorno seguro para que los pacientes accedan a su información.
-   [ ] **Autenticación de Pacientes**: Flow de login separado o unificado para pacientes.
-   [ ] **Dashboard del Paciente**: Ruta `/portal`.
-   [ ] **Mis Citas**: Ver citas futuras y pasadas. Posibilidad de cancelar/reprogramar (con reglas).
-   [ ] **Mi Historial**: Visualización de tratamientos y documentos compartidos.

### Fase 4: Reportes Avanzados
**Objetivo**: Profundizar en la analítica del negocio.
-   [ ] **Módulo de Reportes**: Ruta `/dashboard/reportes`.
-   [ ] **Reporte Financiero**: Desglose de ingresos por tratamiento, doctor o periodo.
-   [ ] **Reporte Operativo**: Citas realizadas vs canceladas, ocupación de doctores.
-   [ ] **Exportación**: Posibilidad de descargar datos en CSV/PDF.

### Fase 5: Refinamiento de Módulos (Mejora Continua)
**Objetivo**: Pulir la funcionalidad existente.
-   [ ] **Pacientes**: Búsqueda avanzada (por DNI, teléfono), paginación real en servidor.
-   [ ] **Inventario**: Control de movimientos (entradas/salidas) historial de stock.
-   [ ] **Citas**: Drag & drop en el calendario para reprogramar. Vista de "Lista de Espera".
-   [ ] **Tratamientos**: Subida real de archivos/fotos (Storage).

---

## Arquitectura Técnica
-   **Roles**: Uso de Claims en Supabase Auth o tabla `profiles` extendida para manejar permisos (RLS).
-   **Almacenamiento**: Configuración de Supabase Storage para fotos de perfil y documentos clínicos.
-   **Emails**: Integración con Resend o similar para notificaciones de citas y bienvenidas.

## Estimación de Prioridad
1.  **Fase 1 (Usuarios/Doctores)**: Crítico para que la clínica opere con múltiples doctores.
2.  **Fase 2 (Disponibilidad)**: Necesario para el uso real de la agenda.
3.  **Fase 5 (Refinamiento)**: Importante para la usabilidad diaria.
4.  **Fase 3 (Portal Paciente)**: Valor añadido alto.
5.  **Fase 4 (Reportes)**: Valor gerencial.
