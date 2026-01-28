-- =====================================================
-- SCHEMA V2 - MEJORAS Y EXPANSIÓN
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. ACTUALIZAR PROFILES (Para doctores/staff)
-- Agregamos campos para detalles profesionales y visualización
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS specialty TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3b82f6', -- Color para el calendario (Blue default)
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. TABLA DE HORARIOS DE DOCTORES (Fase 2)
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(doctor_id, day_of_week) -- Un horario base por día de la semana
);

-- 3. EXCEPCIONES DE HORARIO (Días libres, vacaciones)
CREATE TABLE IF NOT EXISTS doctor_schedule_exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT false, -- false = día libre/vacaciones
    start_time TIME, -- Si es true, horario específic para ese día
    end_time TIME,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ACTUALIZAR PATIENTS (Para Portal Paciente - Fase 3)
-- Linkear paciente con auth.users para que puedan loguearse
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);

-- 5. RLS UPDATES
ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedule_exceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view schedules" ON doctor_schedules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and Doctors can manage schedules" ON doctor_schedules
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'doctor'))
    );

CREATE POLICY "Authenticated users can view exceptions" ON doctor_schedule_exceptions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and Doctors can manage exceptions" ON doctor_schedule_exceptions
    FOR ALL USING (
         auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'doctor'))
    );
