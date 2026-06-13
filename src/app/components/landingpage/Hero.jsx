'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Button from '../Button';

export default function Hero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });


    tl.fromTo(
      '.hero-orb',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.15, duration: 1.2, stagger: 0.2, ease: 'back.out(1.5)' }
    );


    tl.fromTo(
      '.hero-stagger',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
      '-=0.6'
    );


    gsap.utils.toArray('.hero-orb').forEach((orb, i) => {
      gsap.to(orb, {
        y: `random(-40, 40)`,
        x: `random(-30, 30)`,
        duration: `random(4, 6)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.4,
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 pt-20">
      

      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="hero-orb absolute w-[30vw] h-[30vw] rounded-full bg-foreground blur-3xl opacity-0 translate-x-[-20%] translate-y-[-20%]" />
        <div className="hero-orb absolute w-[20vw] h-[20vw] rounded-full bg-foreground blur-3xl opacity-0 translate-x-[30%] translate-y-[20%]" />
        <div className="hero-orb absolute w-[15vw] h-[15vw] rounded-full bg-foreground blur-3xl opacity-0 translate-x-[-10%] translate-y-[40%]" />
      </div>


      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full">
        <h1 className="hero-stagger text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1] w-full opacity-0 translate-y-10">
          Master your exams with <span className="opacity-50">intelligent</span> past papers.
        </h1>
        
        <p className="hero-stagger text-lg sm:text-xl text-foreground/70 max-w-2xl mb-10 leading-relaxed opacity-0 translate-y-10">
          Experience real exam conditions. Get AI-powered insights on your reasoning. Systematically eliminate your weak spots.
        </p>
        
        <div className="hero-stagger flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto opacity-0 translate-y-10">
          <Button text="Start practicing free" variant="primary" href="/signup" className="px-8 py-4 text-base" />
          <Button text="View features" variant="outline" href="#features" className="px-8 py-4 text-base" />
        </div>
      </div>
    </section>
  );
}
