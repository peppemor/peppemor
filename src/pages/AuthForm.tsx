import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';

import { useAuthActions } from '../hooks/index.js';
import PathConstants from '../routes/pathConstants.js';
import Input from '../components/ui/Input.js';

type AuthMode = 'login' | 'register' | 'reset';

export function AuthForm() {
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    emailOrUsername: '',  // Campo per login (email o username)
    email: '',           // Campo per registrazione e reset
    password: '',
    username: '',
    firstName: '',
    lastName: '',
  });

  // Solo operazioni di autenticazione
  const { resetPassword, signIn, signUp, isUsernameUnique, isEmailUnique } = useAuthActions();
  
    // Reset error when mode changes
    useEffect(() => {
        setError(null);
      }, [mode]);


  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
 
    const { data: isUsernameAvailable } = await isUsernameUnique(username);
    
    setUsernameAvailable(isUsernameAvailable);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        
        // Controllo dell'unicità dell'email
        const isEmailAvailable = await isEmailUnique(formData.email);
        if (!isEmailAvailable) {
            setError('Email is already registered');
            return;
        }

        const { error: signUpError } = await signUp({
            email: formData.email,
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
        });

        if (signUpError) throw new Error(signUpError);

        setMode('login');
        alert('Account created successfully! Please log in.');
      } else if (mode === 'login') {
        const { error: signInError } = await signIn(
          formData.emailOrUsername,  // Supporta email o username
          formData.password  
        );

        if (signInError) throw signInError;

        navigate(PathConstants.INDEX);

      } else if (mode === 'reset') {
        const { error: resetError } = await resetPassword(formData.email);
        
        if (resetError) throw resetError;
        alert('Password reset instructions sent to your email');
        setMode('login');
      }
    } catch (err) {
      // Gestisce diversi tipi di errore per messaggi più specifici
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as Error).message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 
             mode === 'register' ? 'Create your account' : 
             'Reset your password'}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    usernameAvailable === true ? 'border-green-500' :
                    usernameAvailable === false ? 'border-red-500' :
                    'border-gray-300'
                  }`}
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    checkUsername(e.target.value);
                  }}
                />
                {usernameAvailable !== null && (
                  <p className={`mt-1 text-sm ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {usernameAvailable ? 'Username is available' : 'Username is taken'}
                  </p>
                )}
              </div>
            </>
          )}

          <div>           
            <Input
                id={mode === 'login' ? "emailOrUsername" : "email"}
                name={mode === 'login' ? "emailOrUsername" : "email"}
                type={mode === 'login' ? "text" : "email"}
                autoComplete="email"
                required
                label={mode === 'login' ? "Email or Username" : "Email address"}
                icon={<Mail size={16} className="text-gray-500" />}
                value={mode === 'login' ? formData.emailOrUsername : formData.email}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  [mode === 'login' ? 'emailOrUsername' : 'email']: e.target.value 
                })}
              />            
          </div>

          {mode !== 'reset' && (
            <div className="relative">
                <div className="relative">
                  <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  label="Password"
                  icon={<Lock size={16} className="text-gray-500" />}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || (mode === 'register' && !usernameAvailable)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                mode === 'login' ? 'Sign in' :
                mode === 'register' ? 'Sign up' :
                'Reset password'
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                  onClick={() => setMode('register')}
                >
                  Create new account
                </button>
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                  onClick={() => setMode('reset')}
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-500"
                onClick={() => setMode('login')}
              >
                Already have an account? Sign in
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}