-- Funzione per ottenere l'email di un utente tramite username
-- Questa funzione deve essere eseguita nel database Supabase

CREATE OR REPLACE FUNCTION get_email_by_username(input_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email TEXT;
BEGIN
    -- Cerca l'email dell'utente tramite il join con auth.users
    SELECT au.email INTO user_email
    FROM public.profiles p
    INNER JOIN auth.users au ON p.id = au.id
    WHERE p.username = input_username;
    
    -- Ritorna l'email se trovata, altrimenti NULL
    RETURN user_email;
END;
$$;

-- Permetti l'accesso alla funzione per gli utenti autenticati
GRANT EXECUTE ON FUNCTION get_email_by_username(TEXT) TO authenticated;