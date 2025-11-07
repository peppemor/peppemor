/**
 * ESEMPIO: Nuova architettura Auth - Separazione pulita dei ruoli
 * 
 * Questo esempio mostra come utilizzare la nuova architettura con
 * separazione netta tra stato e operazioni.
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthActions } from '../hooks/useAuthService';

// Componente che usa solo lo STATO (useAuth)
const UserProfile: React.FC = () => {
  const { user, profile, isLoading } = useAuth(); // Solo lettura dello stato
  
  if (isLoading) return <div>Caricamento...</div>;
  if (!user) return <div>Non autenticato</div>;
  
  return (
    <div>
      <h2>Profilo Utente</h2>
      <p>Email: {user.email}</p>
      <p>Nome: {profile?.first_name} {profile?.last_name}</p>
      <p>Admin: {user.is_admin ? 'Sì' : 'No'}</p>
    </div>
  );
};

// Componente che usa le OPERAZIONI (useAuthActions)
const LoginForm: React.FC = () => {
  const { signIn, signUp } = useAuthActions(); // Solo operazioni
  
  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) {
      console.error('Errore login:', error);
    }
    // Non gestisco lo stato qui - viene aggiornato automaticamente
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleLogin(
        formData.get('email') as string,
        formData.get('password') as string
      );
    }}>
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

// Componente che usa ENTRAMBI (stato + operazioni)
const UserSettings: React.FC = () => {
  const { user, profile } = useAuth(); // Stato
  const { updateProfile } = useAuthActions(); // Operazioni
  
  const handleUpdateProfile = async (updates: any) => {
    const { error } = await updateProfile(updates);
    if (error) {
      console.error('Errore aggiornamento:', error);
    }
    // Lo stato viene aggiornato automaticamente dopo updateProfile
  };
  
  if (!user) return null;
  
  return (
    <div>
      <h3>Impostazioni</h3>
      <p>Utente corrente: {user.email}</p>
      <button onClick={() => handleUpdateProfile({ first_name: 'Nuovo Nome' })}>
        Aggiorna Nome
      </button>
    </div>
  );
};

// Utilizzo diretto dell'AuthService (senza Context)
import { useAuthService } from '../hooks/useAuthService';

const AdminPanel: React.FC = () => {
  const authService = useAuthService(); // Accesso diretto al servizio
  
  const checkUsername = async (username: string) => {
    const { data: isUnique } = await authService.isUsernameUnique(username);
    return isUnique;
  };
  
  // Questo componente può fare operazioni senza dipendere dal Context
  return (
    <div>
      <h3>Pannello Admin</h3>
      <button onClick={() => checkUsername('test')}>
        Verifica Username
      </button>
    </div>
  );
};

export { UserProfile, LoginForm, UserSettings, AdminPanel };