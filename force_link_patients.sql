-- 1. Vincular usuarios existentes con pacientes existentes por Email
UPDATE patients
SET user_id = users.id
FROM auth.users
WHERE patients.email = users.email
AND patients.user_id IS NULL;

-- 2. Asegurarse que el usuario tenga el rol 'patient' si es que se unió
-- y no tiene rol asignado en profiles (opcional, por seguridad)
UPDATE profiles
SET role = 'patient'
FROM patients
WHERE profiles.id = patients.user_id
AND profiles.role IS NULL;

-- 3. Verificación (Solo para ver qué pasó, puedes comentar esto si corre en script puro)
-- SELECT email, user_id FROM patients WHERE user_id IS NOT NULL;
