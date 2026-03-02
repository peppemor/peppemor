import { Profile, UserRole } from '../types/index.js';

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
    return userRole.role === 'admin';
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
  
  if (profile.fullName) return profile.fullName;
  
  const firstName = profile.firstName || '';
  const lastName = profile.lastName || '';
  
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
  
  const firstName = profile.firstName?.[0] || '';
  const lastName = profile.lastName?.[0] || '';
  
  return `${firstName}${lastName}`.toUpperCase();
}