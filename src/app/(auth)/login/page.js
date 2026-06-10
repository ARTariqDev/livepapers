'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';

export default function LoginPage() {
  const formRef = useRef(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.4,
      });

      // Title and subtitle
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

      // Social buttons
      tl.fromTo(
        '.social-btn',
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08 },
        '-=0.2'
      );

      // Divider
      tl.fromTo(
        '.auth-divider',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6 },
        '-=0.2'
      );

      // Form fields stagger
      tl.fromTo(
        '.form-field',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        '-=0.3'
      );

      // Submit button
      tl.fromTo(
        '.submit-btn',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.15'
      );

      // Footer
      tl.fromTo(
        '.auth-footer',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        '-=0.1'
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    // Animate the button on submit
    gsap.fromTo(
      '.submit-btn',
      { scale: 0.97 },
      { scale: 1, duration: 0.3, ease: 'back.out(2)' }
    );

    const res = await signIn('credentials', {
      redirect: false,
      identifier,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div ref={formRef}>
      <h1 className="auth-title text-3xl font-bold tracking-tight mb-2">
        Welcome back
      </h1>
      <p className="auth-subtitle text-foreground/50 text-sm mb-8">
        Log in to continue your exam preparation
      </p>

      {/* Social Login */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="social-btn w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg border border-foreground/10 bg-background hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all duration-300 text-sm font-medium group"
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

      {/* Divider */}
      <div className="auth-divider flex items-center gap-4 mb-6 origin-center">
        <div className="flex-1 h-px bg-foreground/10" />
        <span className="text-xs text-foreground/30 font-medium uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-foreground/10" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}
        <div className="form-field">
          <label htmlFor="login-identifier" className="block text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-2">
            Email or Username
          </label>
          <div className={`relative rounded-lg border transition-all duration-300 ${
            focusedField === 'identifier'
              ? 'border-foreground shadow-[0_0_0_3px_rgba(var(--foreground-rgb,0,0,0),0.06)]'
              : 'border-foreground/10 hover:border-foreground/25'
          }`}>
            <input
              id="login-identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onFocus={() => setFocusedField('identifier')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 py-3 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/25 rounded-lg"
              placeholder="Email or Username"
              autoComplete="username"
            />
          </div>
        </div>

        <div className="form-field">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-foreground/40">
              Password
            </label>
            <Link
              href="/login"
              className="text-xs text-foreground/40 hover:text-foreground transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>
          <div className={`relative rounded-lg border transition-all duration-300 ${
            focusedField === 'password'
              ? 'border-foreground shadow-[0_0_0_3px_rgba(var(--foreground-rgb,0,0,0),0.06)]'
              : 'border-foreground/10 hover:border-foreground/25'
          }`}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 py-3 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/25 rounded-lg pr-12"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors duration-200"
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
        </div>

        <div className="submit-btn pt-2">
          <Button text={loading ? "Logging in..." : "Log in"} variant="primary" className="w-full py-3 text-sm" />
        </div>
      </form>

      <p className="auth-footer text-center text-sm text-foreground/40 mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-foreground font-semibold hover:underline underline-offset-4 transition-all duration-200">
          Sign up
        </Link>
      </p>
    </div>
  );
}
