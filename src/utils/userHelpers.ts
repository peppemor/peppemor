import { Profile, UserRole } from '../types';

/**
 * Utility functions per gestire operazioni su User
 */

/**
 * Controlla se un utente è amministratore
 * Può usare sia il Profile che il UserRole come fonte
 * 
 * @param profile - Profilo utente (opzionale)
 * @param userRole - Ruolo utente (opzionale)
 * @returns true se l'utente è admin
 */
export function isUserAdmin(
  profile?: Profile | null, 
  userRole?: UserRole | null
): boolean {
  // Se abbiamo userRole, usalo come fonte primaria
  if (userRole) {
    return Boolean(userRole.is_admin);
  }
  
  // Se abbiamo profile con informazioni di ruolo
  if (profile && 'role' in profile) {
    return (profile as any).role === 'admin';
  }
  
  // Fallback: nessuna informazione, non admin
  return false;
}

/**
 * Estrae il nome completo dell'utente da Profile
 * 
 * @param profile - Profilo utente
 * @returns Nome completo o stringa vuota
 */
export function getUserFullName(profile?: Profile | null): string {
  if (!profile) return '';
  
  if (profile.full_name) return profile.full_name;
  
  const firstName = profile.first_name || '';
  const lastName = profile.last_name || '';
  
  return `${firstName} ${lastName}`.trim();
}

/**
 * Estrae le iniziali dell'utente da Profile
 * 
 * @param profile - Profilo utente  
 * @returns Iniziali (es. "GP") o stringa vuota
 */
export function getUserInitials(profile?: Profile | null): string {
  if (!profile) return '';
  
  const firstName = profile.first_name?.[0] || '';
  const lastName = profile.last_name?.[0] || '';
  
  return `${firstName}${lastName}`.toUpperCase();
}