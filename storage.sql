-- =====================================================
-- SUPABASE STORAGE - CONFIGURACIÓN DE BUCKETS Y POLÍTICAS
-- Ejecutar DESPUÉS de schema.sql
-- =====================================================

-- =====================================================
-- CREAR BUCKETS DE ALMACENAMIENTO
-- =====================================================

-- Bucket para avatares de usuarios
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Bucket para fotos médicas de pacientes (privado)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-photos',
  'medical-photos',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Bucket para documentos y PDFs (facturas, recetas, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  20971520, -- 20MB
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD - BUCKET AVATARS (PÚBLICO)
-- =====================================================

-- Permitir a usuarios autenticados VER cualquier avatar
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');

-- Permitir a usuarios autenticados SUBIR su propio avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir a usuarios ACTUALIZAR su propio avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir a usuarios ELIMINAR su propio avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- POLÍTICAS DE SEGURIDAD - BUCKET MEDICAL-PHOTOS (PRIVADO)
-- =====================================================

-- Permitir a usuarios autenticados VER fotos médicas
CREATE POLICY "Authenticated users can view medical photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'medical-photos');

-- Permitir a usuarios autenticados SUBIR fotos médicas
-- Estructura de carpetas: medical-photos/patients/{patient_id}/{filename}
CREATE POLICY "Authenticated users can upload medical photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'medical-photos'
  AND (storage.foldername(name))[1] = 'patients'
);

-- Permitir a usuarios autenticados ACTUALIZAR fotos médicas
CREATE POLICY "Authenticated users can update medical photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'medical-photos')
WITH CHECK (bucket_id = 'medical-photos');

-- Permitir a usuarios autenticados ELIMINAR fotos médicas
CREATE POLICY "Authenticated users can delete medical photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'medical-photos');

-- =====================================================
-- POLÍTICAS DE SEGURIDAD - BUCKET DOCUMENTS (PRIVADO)
-- =====================================================

-- Permitir a usuarios autenticados VER documentos
CREATE POLICY "Authenticated users can view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- Permitir a usuarios autenticados SUBIR documentos
-- Estructura: documents/{type}/{patient_id}/{filename}
-- Tipos: invoices, prescriptions, reports
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] IN ('invoices', 'prescriptions', 'reports')
);

-- Permitir a usuarios autenticados ACTUALIZAR documentos
CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- Permitir a usuarios autenticados ELIMINAR documentos
CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');

-- =====================================================
-- FUNCIONES HELPER PARA STORAGE
-- =====================================================

-- Función para obtener la URL pública de un avatar
CREATE OR REPLACE FUNCTION get_avatar_url(avatar_path TEXT)
RETURNS TEXT AS $$
BEGIN
  IF avatar_path IS NULL OR avatar_path = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN concat(
    current_setting('app.settings.supabase_url', true),
    '/storage/v1/object/public/avatars/',
    avatar_path
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para generar path de foto médica
CREATE OR REPLACE FUNCTION generate_medical_photo_path(
  p_patient_id UUID,
  p_filename TEXT
)
RETURNS TEXT AS $$
BEGIN
  RETURN concat(
    'patients/',
    p_patient_id::text,
    '/',
    p_filename
  );
END;
$$ LANGUAGE plpgsql;

-- Función para generar path de documento
CREATE OR REPLACE FUNCTION generate_document_path(
  p_type TEXT,
  p_patient_id UUID,
  p_filename TEXT
)
RETURNS TEXT AS $$
BEGIN
  IF p_type NOT IN ('invoices', 'prescriptions', 'reports') THEN
    RAISE EXCEPTION 'Tipo de documento inválido: %', p_type;
  END IF;
  
  RETURN concat(
    p_type,
    '/',
    p_patient_id::text,
    '/',
    p_filename
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VISTA PARA GESTIÓN DE ARCHIVOS
-- =====================================================

-- Vista para ver estadísticas de storage por bucket
CREATE OR REPLACE VIEW storage_stats AS
SELECT 
  bucket_id,
  COUNT(*) as total_files,
  SUM((metadata->>'size')::bigint) as total_size_bytes,
  ROUND(SUM((metadata->>'size')::bigint) / 1024.0 / 1024.0, 2) as total_size_mb
FROM storage.objects
GROUP BY bucket_id;

-- =====================================================
-- TRIGGER PARA LIMPIAR ARCHIVOS HUÉRFANOS
-- =====================================================

-- Función para eliminar fotos cuando se elimina un paciente
CREATE OR REPLACE FUNCTION delete_patient_storage_files()
RETURNS TRIGGER AS $$
BEGIN
  -- Eliminar fotos médicas del paciente
  DELETE FROM storage.objects 
  WHERE bucket_id = 'medical-photos' 
  AND name LIKE 'patients/' || OLD.id::text || '/%';
  
  -- Eliminar documentos del paciente
  DELETE FROM storage.objects 
  WHERE bucket_id = 'documents' 
  AND name LIKE '%/' || OLD.id::text || '/%';
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la limpieza
CREATE TRIGGER cleanup_patient_files
AFTER DELETE ON patients
FOR EACH ROW
EXECUTE FUNCTION delete_patient_storage_files();

-- =====================================================
-- COMPLETADO
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Storage buckets y políticas configurados exitosamente!';
  RAISE NOTICE 'Buckets creados: avatars, medical-photos, documents';
  RAISE NOTICE 'Políticas de seguridad aplicadas';
  RAISE NOTICE 'Funciones helper creadas';
END $$;
