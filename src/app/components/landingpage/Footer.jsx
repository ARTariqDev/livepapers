'use client';

import Button from '../Button';

export default function Footer() {
  return (
    <footer className="py-24 px-6 text-center border-t border-foreground/10 relative z-30 overflow-hidden">

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
        <div className="w-[50vw] h-[50vw] rounded-full bg-foreground blur-[100px] opacity-10 translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-bold mb-8 tracking-tight max-w-xl leading-tight">
          Ready to maximize your score?
        </h2>
        <p className="text-foreground/60 mb-10 max-w-md">
          Join thousands of students using LivePapers to prepare for their most important exams.
        </p>
        <Button text="Create your free account" variant="primary" href="/signup" className="px-8 py-4 text-base" />
        
        <div className="mt-20 text-sm text-foreground/40 font-medium">
          © {new Date().getFullYear()} LivePapers. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
