-- =====================================================
-- SCHEMA SQL PARA CLÍNICA PODOLÓGICA
-- Ejecutar este script en Supabase SQL Editor
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'receptionist')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    city TEXT,
    postal_code TEXT,
    insurance_provider TEXT,
    insurance_number TEXT,
    allergies TEXT,
    medical_conditions TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de tratamientos (catálogo)
CREATE TABLE IF NOT EXISTS treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- en minutos
    price DECIMAL(10, 2) NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES profiles(id),
    appointment_date TIMESTAMPTZ NOT NULL,
    duration INTEGER NOT NULL DEFAULT 30, -- en minutos
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    appointment_type TEXT,
    notes TEXT,
    cancellation_reason TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de tratamientos aplicados a pacientes
CREATE TABLE IF NOT EXISTS patient_treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    treatment_id UUID NOT NULL REFERENCES treatments(id),
    appointment_id UUID REFERENCES appointments(id),
    applied_by UUID REFERENCES profiles(id),
    treatment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    photos TEXT[], -- URLs de fotos en Supabase Storage
    status TEXT DEFAULT 'completed' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de historial médico
CREATE TABLE IF NOT EXISTS medical_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    visit_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diagnosis TEXT,
    symptoms TEXT,
    treatment_notes TEXT,
    photos TEXT[], -- URLs de fotos
    next_visit DATE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de productos (inventario)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT UNIQUE,
    category TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 10,
    unit TEXT DEFAULT 'unit',
    supplier TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de movimientos de inventario
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase', 'sale', 'adjustment', 'return')),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2),
    reference_id UUID, -- puede ser invoice_id o purchase_order_id
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES patients(id),
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'paid', 'partially_paid', 'overdue', 'cancelled')),
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer', 'insurance', 'other')),
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de items de factura
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('treatment', 'product')),
    item_id UUID NOT NULL, -- ID del tratamiento o producto
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'transfer', 'insurance', 'other')),
    reference_number TEXT,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de recordatorios
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN ('email', 'sms', 'whatsapp')),
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de configuración de la clínica
CREATE TABLE IF NOT EXISTS clinic_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    opening_hours JSONB, -- { "monday": { "open": "09:00", "close": "18:00" }, ... }
    appointment_duration_default INTEGER DEFAULT 30,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(issue_date);
CREATE INDEX idx_medical_history_patient ON medical_history(patient_id);
CREATE INDEX idx_patient_treatments_patient ON patient_treatments(patient_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON treatments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar número de factura automático
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    next_number INTEGER;
BEGIN
    IF NEW.invoice_number IS NULL THEN
        year_prefix := TO_CHAR(NEW.issue_date, 'YYYY');
        
        SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 7) AS INTEGER)), 0) + 1
        INTO next_number
        FROM invoices
        WHERE invoice_number LIKE year_prefix || '%';
        
        NEW.invoice_number := year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_invoice_number_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_number();

-- Función para actualizar stock al crear movimiento de inventario
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.movement_type IN ('purchase', 'return') THEN
        UPDATE products 
        SET stock_quantity = stock_quantity + NEW.quantity
        WHERE id = NEW.product_id;
    ELSIF NEW.movement_type IN ('sale', 'adjustment') THEN
        UPDATE products 
        SET stock_quantity = stock_quantity - NEW.quantity
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_stock_trigger
    AFTER INSERT ON inventory_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles (usuarios pueden ver y editar su propio perfil)
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para pacientes (todos los usuarios autenticados pueden ver y gestionar)
CREATE POLICY "Authenticated users can view patients" ON patients
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert patients" ON patients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update patients" ON patients
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete patients" ON patients
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para tratamientos
CREATE POLICY "Authenticated users can view treatments" ON treatments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage treatments" ON treatments
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para citas
CREATE POLICY "Authenticated users can view appointments" ON appointments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage appointments" ON appointments
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para tratamientos de pacientes
CREATE POLICY "Authenticated users can view patient treatments" ON patient_treatments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage patient treatments" ON patient_treatments
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para historial médico
CREATE POLICY "Authenticated users can view medical history" ON medical_history
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage medical history" ON medical_history
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para productos
CREATE POLICY "Authenticated users can view products" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para movimientos de inventario
CREATE POLICY "Authenticated users can view inventory movements" ON inventory_movements
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage inventory movements" ON inventory_movements
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para facturas
CREATE POLICY "Authenticated users can view invoices" ON invoices
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage invoices" ON invoices
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para items de factura
CREATE POLICY "Authenticated users can view invoice items" ON invoice_items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage invoice items" ON invoice_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para pagos
CREATE POLICY "Authenticated users can view payments" ON payments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage payments" ON payments
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para recordatorios
CREATE POLICY "Authenticated users can view reminders" ON reminders
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage reminders" ON reminders
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para configuración de clínica
CREATE POLICY "Authenticated users can view clinic settings" ON clinic_settings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage clinic settings" ON clinic_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- DATOS INICIALES (SEED)
-- =====================================================

-- Insertar configuración inicial de la clínica
INSERT INTO clinic_settings (
    clinic_name,
    address,
    phone,
    email,
    appointment_duration_default,
    tax_rate,
    currency,
    opening_hours
) VALUES (
    'Clínica Podológica',
    'Calle Principal 123',
    '+34 123 456 789',
    'contacto@clinicapodologica.com',
    30,
    21.00,
    'EUR',
    '{
        "monday": {"open": "09:00", "close": "18:00"},
        "tuesday": {"open": "09:00", "close": "18:00"},
        "wednesday": {"open": "09:00", "close": "18:00"},
        "thursday": {"open": "09:00", "close": "18:00"},
        "friday": {"open": "09:00", "close": "18:00"},
        "saturday": {"open": "09:00", "close": "14:00"},
        "sunday": {"open": null, "close": null}
    }'::jsonb
);

-- Insertar tratamientos base
INSERT INTO treatments (name, description, duration, price, category) VALUES
    ('Consulta Inicial', 'Primera consulta podológica completa', 45, 50.00, 'Consultas'),
    ('Quiropedia', 'Tratamiento de uñas y durezas', 30, 35.00, 'Tratamientos Básicos'),
    ('Tratamiento de Uña Encarnada', 'Tratamiento de onicocriptosis', 45, 60.00, 'Tratamientos Especializados'),
    ('Estudio Biomecánico', 'Análisis completo de la marcha', 60, 80.00, 'Estudios'),
    ('Plantillas Personalizadas', 'Diseño y fabricación de plantillas ortopédicas', 30, 150.00, 'Ortopedia'),
    ('Tratamiento de Papilomas', 'Eliminación de verrugas plantares', 30, 45.00, 'Tratamientos Especializados'),
    ('Tratamiento de Hongos', 'Tratamiento antifúngico', 30, 40.00, 'Tratamientos Dermatológicos'),
    ('Revisión y Mantenimiento', 'Control periódico', 20, 25.00, 'Seguimiento');

-- Insertar productos base
INSERT INTO products (name, description, sku, category, price, cost, stock_quantity, min_stock) VALUES
    ('Crema Hidratante Pies', 'Crema hidratante para pies secos', 'CREAM-001', 'Cuidado', 15.00, 8.00, 50, 10),
    ('Plantillas Gel', 'Plantillas de gel para confort', 'PLANT-001', 'Plantillas', 25.00, 12.00, 30, 5),
    ('Antifúngico Tópico', 'Tratamiento para hongos', 'ANTI-001', 'Medicamentos', 20.00, 10.00, 40, 10),
    ('Separadores de Dedos', 'Separadores de silicona', 'SEP-001', 'Accesorios', 8.00, 3.00, 100, 20),
    ('Protector de Juanetes', 'Protector de silicona', 'PROT-001', 'Protección', 12.00, 5.00, 60, 15),
    ('Lima Podológica', 'Lima profesional para pies', 'LIMA-001', 'Herramientas', 10.00, 4.00, 80, 20),
    ('Aceite Esencial Tea Tree', 'Aceite natural antifúngico', 'ACEIT-001', 'Naturales', 18.00, 9.00, 35, 10);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de citas con información completa
CREATE OR REPLACE VIEW appointments_detailed AS
SELECT 
    a.id,
    a.appointment_date,
    a.duration,
    a.status,
    a.appointment_type,
    a.notes,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.phone AS patient_phone,
    p.email AS patient_email,
    d.full_name AS doctor_name,
    a.created_at
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN profiles d ON a.doctor_id = d.id;

-- Vista de facturas con totales
CREATE OR REPLACE VIEW invoices_summary AS
SELECT 
    i.id,
    i.invoice_number,
    i.issue_date,
    i.status,
    i.total_amount,
    p.first_name || ' ' || p.last_name AS patient_name,
    COALESCE(SUM(pay.amount), 0) AS paid_amount,
    i.total_amount - COALESCE(SUM(pay.amount), 0) AS balance
FROM invoices i
JOIN patients p ON i.patient_id = p.id
LEFT JOIN payments pay ON i.id = pay.invoice_id
GROUP BY i.id, p.first_name, p.last_name;

-- Vista de productos con stock bajo
CREATE OR REPLACE VIEW products_low_stock AS
SELECT 
    id,
    name,
    sku,
    category,
    stock_quantity,
    min_stock,
    min_stock - stock_quantity AS units_needed
FROM products
WHERE stock_quantity <= min_stock
AND is_active = true;

-- =====================================================
-- COMPLETADO
-- =====================================================

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Schema creado exitosamente para Clínica Podológica!';
    RAISE NOTICE 'Tablas: 13 | Índices: 15 | Triggers: 8 | Vistas: 3';
    RAISE NOTICE 'RLS habilitado en todas las tablas';
END $$;
