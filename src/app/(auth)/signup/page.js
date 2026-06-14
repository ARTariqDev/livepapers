'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';

export default function SignupPage() {
  const formRef = useRef(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLinkPrompt, setShowLinkPrompt] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleImage, setGoogleImage] = useState('');
  const router = useRouter();

  // Parse Google parameters on mount safely without Next.js Suspense warnings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const err = params.get('error');
      const emailParam = params.get('email');
      const nameParam = params.get('name');
      const imageParam = params.get('image');

      if (err === 'NoAccountFound' && emailParam) {
        setEmail(emailParam);
        setGoogleEmail(emailParam);
        if (nameParam) setName(nameParam);
        if (imageParam) setGoogleImage(imageParam);
        // Clean up URL immediately so refreshing or clicking Google button again doesn't re-trigger this
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);


  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.4,
      });

      tl.fromTo(
        '.auth-title',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );
      tl.fromTo(
        '.auth-subtitle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      );


      tl.fromTo(
        '.social-btn',
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08 },
        '-=0.2'
      );

      tl.fromTo(
        '.auth-divider',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6 },
        '-=0.2'
      );

  
      tl.fromTo(
        '.form-field',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        '-=0.3'
      );


      tl.fromTo(
        '.submit-btn',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.15'
      );

    
      tl.fromTo(
        '.auth-footer',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        '-=0.1'
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  // Animate password strength bar when it changes
  useEffect(() => {
    if (password.length > 0 && !showLinkPrompt) {
      gsap.to('.strength-fill', {
        width: `${(passwordStrength / 4) * 100}%`,
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.fromTo(
        '.strength-label',
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  }, [passwordStrength, password.length, showLinkPrompt]);


  useEffect(() => {
    if (showLinkPrompt) {
      gsap.fromTo(
        '.link-prompt-content',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [showLinkPrompt]);

  const handleLinkGoogle = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleSkipLink = async () => {
    setLoading(true);
    setError('');
    try {
      const signInRes = await signIn('credentials', {
        redirect: false,
        identifier: email,
        password,
      });

      if (signInRes?.error) {
        setError(signInRes.error);
        setShowLinkPrompt(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during sign in');
      setShowLinkPrompt(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    gsap.fromTo(
      '.submit-btn',
      { scale: 0.97 },
      { scale: 1, duration: 0.3, ease: 'back.out(2)' }
    );

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          googleEmail: googleEmail || undefined,
          image: googleImage || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (googleEmail) {
          // If we came from a Google-linking redirect, it's already linked in the DB
          // Log in with credentials and redirect directly to dashboard
          const signInRes = await signIn('credentials', {
            redirect: false,
            identifier: email,
            password,
          });

          if (signInRes?.error) {
            setError(signInRes.error);
          } else {
            router.push('/dashboard?linked=true');
            router.refresh();
          }
        } else {

          gsap.to(
            ['.auth-title', '.auth-subtitle', '.social-btn', '.auth-divider', '.form-field', '.submit-btn', '.auth-footer'],
            {
              y: -20,
              opacity: 0,
              duration: 0.4,
              stagger: 0.05,
              onComplete: () => {
                setShowLinkPrompt(true);
              },
            }
          );
        }
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1] || '';
  const strengthColor = [
    'bg-red-400',
    'bg-amber-400',
    'bg-emerald-400',
    'bg-emerald-500',
  ][passwordStrength - 1] || 'bg-foreground/10';

  return (
    <div ref={formRef}>
      {showLinkPrompt ? (
        <div className="link-prompt-content flex flex-col items-center">
          <div className="w-16 h-16 bg-foreground/[0.04] rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-3.41-.81-6.618-2.25-9.35M12 18.75a6 6 0 100-12 6 6 0 000 12z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-center tracking-tight mb-2">
            Secure your account
          </h1>
          <p className="text-foreground/50 text-center text-sm mb-8 max-w-xs leading-relaxed">
            Would you like to link your Google account? This enables faster, one-click secure login next time.
          </p>

          {error && (
            <div className="w-full p-3 mb-4 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-3 w-full">
            <button
              type="button"
              onClick={handleLinkGoogle}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 text-sm font-semibold group shadow-sm cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 bg-white p-0.5 rounded-full" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Yes, Link Google Account
            </button>

            <button
              type="button"
              onClick={handleSkipLink}
              disabled={loading}
              className="w-full py-3 text-sm font-medium border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/[0.01] rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {loading ? "Signing in..." : "Skip, continue to dashboard"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="auth-title text-3xl font-bold tracking-tight mb-2">
            Create your account
          </h1>
          <p className="auth-subtitle text-foreground/50 text-sm mb-8">
            Start mastering your exams today — completely free
          </p>


          {/* Social Login thats hidden when user is completing Google-linked registration */}
          {!googleEmail && (
            <>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                  className="social-btn w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg border border-foreground/10 bg-background hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all duration-300 text-sm font-medium group cursor-pointer"
                >
                  <svg className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </div>


              <div className="auth-divider flex items-center gap-4 mb-6 origin-center">
                <div className="flex-1 h-px bg-foreground/10" />
                <span className="text-xs text-foreground/30 font-medium uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-foreground/10" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {googleEmail && (
              <div className="p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.04] rounded-lg border border-emerald-500/15 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continuing with <strong>{googleEmail}</strong> — set a password to complete registration.</span>
              </div>
            )}
            
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}
            
            <div className="form-field">
              <label htmlFor="signup-name" className="block text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-2">
                Full name
              </label>
              <div className={`relative rounded-lg border transition-all duration-300 ${
                focusedField === 'name'
                  ? 'border-foreground shadow-[0_0_0_3px_rgba(var(--foreground-rgb,0,0,0),0.06)]'
                  : 'border-foreground/10 hover:border-foreground/25'
              }`}>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/25 rounded-lg"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="signup-username" className="block text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-2">
                Username
              </label>
              <div className={`relative rounded-lg border transition-all duration-300 ${
                focusedField === 'username'
                  ? 'border-foreground shadow-[0_0_0_3px_rgba(var(--foreground-rgb,0,0,0),0.06)]'
                  : 'border-foreground/10 hover:border-foreground/25'
              }`}>
                <input
                  id="signup-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/25 rounded-lg"
                  placeholder="johndoe123"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="signup-email" className="block text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-2">
                Email
              </label>
              <div className={`relative rounded-lg border transition-all duration-300 ${
                focusedField === 'email'
                  ? 'border-foreground shadow-[0_0_0_3px_rgba(var(--foreground-rgb,0,0,0),0.06)]'
                  : 'border-foreground/10 hover:border-foreground/25'
              }`}>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/25 rounded-lg"
                  placeholder="you@example.com"
                  autoComplete="email"
                  readOnly={!!googleEmail}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="signup-password" className="block text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-2">
                Password
              </label>
              <div className={`relative rounded-lg border transition-all duration-300 ${
                focusedField === 'password'
                  ? 'border-foreground shadow-[0_0_0_3px_rgba(var(--foreground-rgb,0,0,0),0.06)]'
                  : 'border-foreground/10 hover:border-foreground/25'
              }`}>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/25 rounded-lg pr-12"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors duration-200 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>


              {password.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex gap-1 h-1 rounded-full overflow-hidden bg-foreground/5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full transition-all duration-500 ${
                          passwordStrength >= level ? strengthColor : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="strength-label text-xs text-foreground/40">
                    {strengthLabel && `Password strength: ${strengthLabel}`}
                  </p>
                </div>
              )}
            </div>

            <div className="form-field flex items-start gap-3 pt-1">
              <input
                id="signup-terms"
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded border-foreground/20 accent-[#1a1a1a] cursor-pointer"
              />
              <label htmlFor="signup-terms" className="text-xs text-foreground/40 leading-relaxed cursor-pointer select-none">
                I agree to the{' '}
                <Link href="/login" className="text-foreground/60 hover:text-foreground underline underline-offset-2 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/login" className="text-foreground/60 hover:text-foreground underline underline-offset-2 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="submit-btn pt-2">
              <Button text={loading ? "Creating account..." : "Create account"} variant="primary" className="w-full py-3 text-sm" />
            </div>
          </form>

          <p className="auth-footer text-center text-sm text-foreground/40 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-foreground font-semibold hover:underline underline-offset-4 transition-all duration-200">
              Log in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
