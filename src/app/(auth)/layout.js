'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function AuthLayout({ children }) {
  const containerRef = useRef(null);
  const brandRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Brand panel slides in from left
      tl.fromTo(
        '.auth-brand-panel',
        { x: '-100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 1 }
      );

      // Floating orbs fade in
      tl.fromTo(
        '.auth-orb',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.15, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)' },
        '-=0.5'
      );

      // Brand text staggers in
      tl.fromTo(
        '.brand-text-line',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        '-=0.6'
      );

      // Form panel fades in from right
      tl.fromTo(
        '.auth-form-panel',
        { x: '40px', opacity: 0 },
        { x: '0px', opacity: 1, duration: 0.8 },
        '-=0.5'
      );

      // Continuous floating animation for orbs
      gsap.utils.toArray('.auth-orb').forEach((orb, i) => {
        gsap.to(orb, {
          y: `random(-30, 30)`,
          x: `random(-20, 20)`,
          duration: `random(3, 5)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[100dvh] flex bg-background text-foreground font-sans">
      {/* Left Brand Panel */}
      <div className="auth-brand-panel hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden flex-col justify-between p-12 bg-foreground text-background">
        {/* Floating orbs */}
        <div className="auth-orb absolute top-[15%] left-[20%] w-64 h-64 rounded-full bg-background" />
        <div className="auth-orb absolute top-[55%] right-[10%] w-48 h-48 rounded-full bg-background" />
        <div className="auth-orb absolute bottom-[10%] left-[40%] w-32 h-32 rounded-full bg-background" />
        <div className="auth-orb absolute top-[35%] left-[60%] w-20 h-20 rounded-full bg-background" />

        {/* Brand Content */}
        <div className="relative z-10">
          <Link href="/" className="brand-text-line block text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            LivePapers.
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="brand-text-line text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
            Master your exams with intelligent past papers.
          </h2>
          <p className="brand-text-line text-base opacity-70 leading-relaxed">
            Experience real exam conditions. Get AI-powered insights on your reasoning. Systematically eliminate your weak spots.
          </p>
        </div>

        <div className="relative z-10">
          <p className="brand-text-line text-xs opacity-40 font-medium">
            © {new Date().getFullYear()} LivePapers. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div ref={formRef} className="auth-form-panel flex-1 flex flex-col min-h-[100dvh]">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-foreground/5">
          <Link href="/" className="text-xl font-bold tracking-tight">
            LivePapers.
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
