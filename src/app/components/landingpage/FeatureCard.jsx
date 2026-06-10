'use client';

import { useRef, useState } from 'react';

const FeatureCard = ({ title, description, className = '' }) => {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--x", `${x}px`);
    cardRef.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fade-up relative p-8 sm:p-10 rounded-2xl border border-foreground/10 bg-background overflow-hidden opacity-0 translate-y-8 group ${className}`}
    >
      {/* Subtle background glow on hover */}
      <span
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 400px at var(--x, 0px) var(--y, 0px), rgba(0,0,0,0.03), transparent 80%)`,
        }}
      />
      {/* Dark mode glow support - this relies on CSS variable but we'll use a generic approach */}
      <span
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 ease-out dark:hidden"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 400px at var(--x, 0px) var(--y, 0px), rgba(255,255,255,0.03), transparent 80%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full justify-end">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
        <p className="text-foreground/70 leading-relaxed text-sm sm:text-base max-w-md">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
