-- 1. Permitir rol 'patient' en la tabla profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'doctor', 'receptionist', 'patient'));

-- 2. Actualizar el trigger de nuevos usuarios para que por defecto sean 'patient'
-- (Esto evita que se creen como receptionistas inadvertidamente)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient') -- Si no se especifica rol, es paciente
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asegurarse que el trigger esté activo (si no existía)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. (Opcional) Corregir usuarios existentes que sean pacientes pero tengan rol incorrecto
-- NOTA: Ejecutar esto solo si sabes qué usuarios son. 
-- Ejemplo genérico: Si su email está en la tabla patients, ponerle rol patient en profiles.

UPDATE profiles
SET role = 'patient'
FROM patients
WHERE profiles.id = patients.user_id;
