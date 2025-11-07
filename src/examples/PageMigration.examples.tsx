/**
 * GUIDA: Come aggiornare le pagine per la nuova architettura Auth
 * 
 * Questa guida mostra come modificare le pagine esistenti per utilizzare
 * la nuova separazione tra stato (useAuth) e operazioni (useAuthActions).
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthActions } from '../hooks/useAuthService';

// ========================
// ESEMPIO 1: Pagina che LEGGE solo lo stato
// ========================
const ProfileDisplay: React.FC = () => {
  // ✅ Usa solo useAuth per leggere lo stato
  const { user, profile, isLoading } = useAuth();
  
  // ❌ NON importare operazioni se non necessarie
  // const { signOut } = useAuthActions(); // Non serve qui!
  
  if (isLoading) return <div>Caricamento...</div>;
  if (!user) return <div>Non autenticato</div>;
  
  return (
    <div>
      <h2>Il tuo Profilo</h2>
      <p>Email: {user.email}</p>
      <p>Username: {profile?.username}</p>
      <p>Nome: {profile?.first_name} {profile?.last_name}</p>
      <p>Admin: {user.is_admin ? 'Sì' : 'No'}</p>
    </div>
  );
};

// ========================
// ESEMPIO 2: Pagina che fa OPERAZIONI
// ========================
const AuthOperations: React.FC = () => {
  // ✅ Usa useAuthActions per le operazioni
  const { signOut, isUsernameUnique } = useAuthActions();
  
  // ❌ NON importare lo stato se non necessario
  // const { user } = useAuth(); // Non serve qui se non leggi lo stato
  
  const handleLogout = async () => {
    await signOut();
    // Il redirect sarà gestito automaticamente dal Context
  };
  
  const checkUsername = async (username: string) => {
    const { data: isUnique } = await isUsernameUnique(username);
    console.log(`Username ${username} è ${isUnique ? 'disponibile' : 'occupato'}`);
  };
  
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => checkUsername('test')}>Check Username</button>
    </div>
  );
};

// ========================
// ESEMPIO 3: Pagina che usa ENTRAMBI (più comune)
// ========================
const UserSettingsPage: React.FC = () => {
  // ✅ Separa chiaramente stato e operazioni
  const { user, profile, isLoading } = useAuth(); // Solo stato
  const { updateProfile, signOut } = useAuthActions(); // Solo operazioni
  
  const handleUpdateProfile = async (newData: any) => {
    const { error } = await updateProfile(newData);
    if (error) {
      console.error('Errore:', error);
    }
    // Lo stato viene aggiornato automaticamente!
  };
  
  if (isLoading) return <div>Caricamento...</div>;
  if (!user) return <div>Devi essere autenticato</div>;
  
  return (
    <div>
      {/* Visualizza stato */}
      <h2>Impostazioni di {user.email}</h2>
      <p>Username attuale: {profile?.username}</p>
      
      {/* Operazioni */}
      <button onClick={() => handleUpdateProfile({ first_name: 'Nuovo Nome' })}>
        Aggiorna Nome
      </button>
      <button onClick={signOut}>Logout</button>
    </div>
  );
};

// ========================
// ESEMPIO 4: Componente che usa AuthService direttamente (raro)
// ========================
import { useAuthService } from '../hooks/useAuthService';

const DirectServiceExample: React.FC = () => {
  // ✅ Per operazioni che non influenzano lo stato del Context
  const authService = useAuthService();
  
  const validateEmail = async (email: string) => {
    try {
      const isUnique = await authService.isEmailUnique(email);
      console.log(`Email ${email} è ${isUnique ? 'disponibile' : 'già registrata'}`);
    } catch (error) {
      console.error('Errore validazione email:', error);
    }
  };
  
  return (
    <div>
      <button onClick={() => validateEmail('test@example.com')}>
        Valida Email
      </button>
    </div>
  );
};

// ========================
// PATTERN DA SEGUIRE:
// ========================

/* 
❌ SBAGLIATO (vecchio pattern):
const { user, profile, signIn, signOut, updateProfile } = useAuth();

✅ CORRETTO (nuovo pattern):
const { user, profile, isLoading } = useAuth(); // Solo stato
const { signIn, signOut, updateProfile } = useAuthActions(); // Solo operazioni

o se usi solo operazioni:
const { signIn, signOut } = useAuthActions(); // Solo operazioni

o se usi solo stato:
const { user, profile } = useAuth(); // Solo stato
*/

export { 
  ProfileDisplay, 
  AuthOperations, 
  UserSettingsPage, 
  DirectServiceExample 
};