'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const containerRef = useRef(null);
  const [showLinkedBanner, setShowLinkedBanner] = useState(false);

  // Check for ?linked=true on mount and show the Google linked banner
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('linked') === 'true') {
        setShowLinkedBanner(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (showLinkedBanner) {
      gsap.fromTo(
        '.linked-banner',
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [showLinkedBanner]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.dash-header', 
          { y: -20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6 }
        );

        tl.fromTo('.dash-card', 
          { y: 25, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          '-=0.3'
        );

        tl.fromTo('.dash-row',
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 },
          '-=0.2'
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-foreground/10 border-t-foreground rounded-full animate-spin" />
          <p className="text-sm text-foreground/40 font-medium tracking-wide">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const mockPapers = [
    { id: 1, title: 'AP Chemistry 2024 - MCQ Section', duration: '45 mins', difficulty: 'Medium', status: 'In Progress', progress: 60 },
    { id: 2, title: 'AP Physics 1 2023 - Free Response', duration: '90 mins', difficulty: 'Hard', status: 'Not Started', progress: 0 },
    { id: 3, title: 'IB Mathematics Analysis & Approaches HL 2024', duration: '120 mins', difficulty: 'Expert', status: 'Completed', score: '84%', progress: 100 },
    { id: 4, title: 'SAT Practice Test 8 - Reading & Writing', duration: '64 mins', difficulty: 'Medium', status: 'Completed', score: '92%', progress: 100 },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-foreground/5 bg-background/50 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-85 transition-opacity">
            LivePapers.
          </Link>
          <span className="text-xs bg-foreground/5 text-foreground/60 px-2 py-0.5 rounded-full font-medium border border-foreground/[0.03]">
            Dashboard
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-right hidden sm:flex">
            <div>
              <p className="text-sm font-semibold leading-none">{session.user.name}</p>
              <p className="text-xs text-foreground/40 mt-1">{session.user.email}</p>
            </div>
            {session.user.image ? (
              <img src={session.user.image} alt="Profile" className="w-9 h-9 rounded-full border border-foreground/10" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center border border-foreground/10 text-xs font-bold uppercase">
                {session.user.name?.slice(0, 2)}
              </div>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-xs font-medium border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/[0.02] px-3.5 py-2 rounded-lg transition-all duration-200 cursor-pointer animate-pulse-subtle"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Google Linked Success Banner */}
      {showLinkedBanner && (
        <div className="linked-banner bg-emerald-500/[0.06] border-b border-emerald-500/15">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <strong>Google account linked!</strong> You can now sign in with Google for secure, one-click login next time.
              </p>
            </div>
            <button
              onClick={() => {
                gsap.to('.linked-banner', { y: -16, opacity: 0, duration: 0.3, onComplete: () => setShowLinkedBanner(false) });
              }}
              className="flex-shrink-0 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-10">
        
        {/* Header Hero Section */}
        <section className="dash-header flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-foreground/5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {session.user.name?.split(' ')[0]}!
            </h1>
            <p className="text-foreground/50 text-sm mt-1.5 leading-relaxed">
              Track your exam metrics and continue where you left off.
            </p>
          </div>
          
          {/* User metadata tags */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {session.user.username && (
              <span className="text-xs font-medium bg-foreground/[0.02] border border-foreground/5 text-foreground/60 px-3 py-1.5 rounded-lg">
                @{session.user.username}
              </span>
            )}
            <span className="text-xs font-medium bg-emerald-500/[0.04] border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Account
            </span>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="dash-card p-6 rounded-2xl border border-foreground/5 bg-foreground/[0.01] hover:border-foreground/15 hover:bg-foreground/[0.02] transition-all duration-300">
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">Mock Exams Completed</p>
            <h3 className="text-4xl font-bold mt-3 tracking-tight">14</h3>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
              <span>+3 this week</span>
            </div>
          </div>
          
          <div className="dash-card p-6 rounded-2xl border border-foreground/5 bg-foreground/[0.01] hover:border-foreground/15 hover:bg-foreground/[0.02] transition-all duration-300">
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">Average Score</p>
            <h3 className="text-4xl font-bold mt-3 tracking-tight">82.4%</h3>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
              <span>+1.8% vs last month</span>
            </div>
          </div>

          <div className="dash-card p-6 rounded-2xl border border-foreground/5 bg-foreground/[0.01] hover:border-foreground/15 hover:bg-foreground/[0.02] transition-all duration-300">
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">Practice Time</p>
            <h3 className="text-4xl font-bold mt-3 tracking-tight">12.5 hrs</h3>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-foreground/40 font-medium">
              <span>Goal: 15 hrs / month</span>
            </div>
          </div>
        </section>

        {/* Mock Past Papers Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Recommended Past Papers</h2>
            <button className="text-xs font-semibold text-foreground/60 hover:text-foreground hover:underline underline-offset-4 transition-colors cursor-pointer">
              Browse all papers →
            </button>
          </div>

          <div className="border border-foreground/5 rounded-2xl overflow-hidden divide-y divide-foreground/5 bg-foreground/[0.005]">
            {mockPapers.map((paper) => (
              <div
                key={paper.id}
                className="dash-row p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-foreground/[0.01] transition-colors duration-200"
              >
                <div className="space-y-1 max-w-xl">
                  <h4 className="text-sm font-semibold tracking-tight leading-tight">{paper.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-foreground/40">
                    <span>{paper.duration}</span>
                    <span>•</span>
                    <span>{paper.difficulty}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
                  {paper.status === 'Completed' ? (
                    <div>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.05] border border-emerald-500/10 px-2.5 py-1 rounded-full">
                        Score: {paper.score}
                      </span>
                    </div>
                  ) : paper.status === 'In Progress' ? (
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-foreground/5 h-1.5 rounded-full overflow-hidden hidden xs:block">
                        <div className="bg-foreground/50 h-full rounded-full" style={{ width: `${paper.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/[0.05] border border-amber-500/10 px-2.5 py-1 rounded-full">
                        Resume ({paper.progress}%)
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-foreground/40 bg-foreground/5 border border-foreground/10 px-2.5 py-1 rounded-full">
                      Not Started
                    </span>
                  )}

                  <button className="text-xs font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors shadow-sm cursor-pointer">
                    {paper.status === 'Completed' ? 'Review Solutions' : paper.status === 'In Progress' ? 'Resume Exam' : 'Start Exam'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Mini Footer */}
      <footer className="border-t border-foreground/5 py-6 px-6 text-center text-xs text-foreground/30 mt-auto">
        <p>© {new Date().getFullYear()} LivePapers. Powered by AI and intelligent learning pipelines.</p>
      </footer>
    </div>
  );
}
