-- Trigger para vincular automáticamente Usuario <-> Paciente por Email
CREATE OR REPLACE FUNCTION public.link_patient_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Intenta encontrar un paciente con este email que NO tenga usuario aún
  UPDATE public.patients
  SET user_id = NEW.id
  WHERE email = NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger se ejecuta cada vez que alguien se registra
DROP TRIGGER IF EXISTS on_auth_user_created_link_patient ON auth.users;
CREATE TRIGGER on_auth_user_created_link_patient
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.link_patient_on_signup();
