'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FeatureCard from './FeatureCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Features() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray('.animated-section');
    
    sections.forEach((section) => {
      gsap.to(section.querySelectorAll('.fade-up'), {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="features" className="relative z-10 bg-background py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-32">
        
        {/* Section 1: Core Practice */}
        <div className="animated-section">
          <div className="fade-up mb-12 max-w-2xl opacity-0 translate-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Practice with purpose</h2>
            <p className="text-foreground/60 text-lg">Everything you need to sit papers effectively.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px]">
            <FeatureCard 
              title="Timed past papers" 
              description="Sit full 40-question papers under real exam conditions. 1hr 50min timer, no interruptions." 
              className="md:col-span-2"
            />
            <FeatureCard 
              title="Topic practice" 
              description="Filter by topic and difficulty. Work through questions at your own pace." 
            />
            <FeatureCard 
              title="Post-exam review" 
              description="After every paper, revisit every question. See what you got wrong and why." 
              className="md:col-span-3 h-[200px]"
            />
          </div>
        </div>

        {/* Section 2: AI */}
        <div className="animated-section">
          <div className="fade-up mb-12 max-w-2xl opacity-0 translate-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">AI that understands you</h2>
            <p className="text-foreground/60 text-lg">Stop guessing what went wrong.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 auto-rows-[300px]">
            <FeatureCard 
              title="Reasoning checker" 
              description="Write out your thinking. AI reads it and tells you exactly where your logic broke down." 
            />
            <div className="grid grid-rows-2 gap-4 md:gap-6 h-full">
              <FeatureCard 
                title="Weakness insights" 
                description="Get a plain-English breakdown of which topics need more work." 
                className="p-6 h-auto"
              />
              <FeatureCard 
                title="Auto-classified" 
                description="Every question tagged by topic, subtopic, difficulty, and cognitive level." 
                className="p-6 h-auto"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Progression */}
        <div className="animated-section">
          <div className="fade-up mb-12 max-w-2xl opacity-0 translate-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Track every step forward</h2>
            <p className="text-foreground/60 text-lg">A progression system that adapts to your skill level.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px]">
            <FeatureCard 
              title="Levels" 
              description="Advance through levels by answering correctly in a row." 
            />
            <FeatureCard 
              title="Smart question sets" 
              description="Build custom sessions around your weak spots." 
            />
            <FeatureCard 
              title="Attempt history" 
              description="Every answer logged. Track your accuracy." 
            />
          </div>
        </div>

      </div>
    </section>
  );
}
