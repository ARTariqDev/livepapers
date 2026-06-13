"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const Button = ({
  text,
  variant = "primary", // primary, secondary, outline
  onClick,
  href,
  className = "",
}) => {
  const btnRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnRef.current.style.setProperty("--x", `${x}px`);
    btnRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    btnRef.current.style.setProperty("--x", `0px`);
    btnRef.current.style.setProperty("--y", `0px`);
    setHovered(false);
  };

  const handleClick = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    onClick && onClick(e);

    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 500);
  };

  const isPrimary = variant === "primary";

  const sharedProps = {
    ref: btnRef,
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    className: `relative px-8 py-3 rounded-md font-medium overflow-hidden transition-all duration-300 transform active:scale-95 w-full sm:w-auto flex items-center justify-center ${
      isPrimary
        ? "bg-foreground text-background border-2 border-foreground"
        : "bg-background text-foreground border-2 border-foreground/20 hover:border-foreground"
    } ${className}`,
  };

  const inner = (
    <>

      <span
        className="absolute inset-0 pointer-events-none rounded-md z-10 transition-opacity duration-300 ease-out"
        style={{
          border: '2px solid var(--foreground)',
          opacity: hovered ? 1 : 0,
          maskImage: `radial-gradient(120px at var(--x, 0px) var(--y, 0px), rgba(255,255,255,1) 0%, rgba(255,255,255,0) 80%)`,
          WebkitMaskImage: `radial-gradient(120px at var(--x, 0px) var(--y, 0px), rgba(255,255,255,1) 0%, rgba(255,255,255,0) 80%)`,
          boxShadow: hovered ? 'inset 0 0 15px var(--surface-dim)' : 'none'
        }}
      />


      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={`absolute rounded-full pointer-events-none z-0 animate-ripple ${
            isPrimary ? "bg-background/20" : "bg-foreground/10"
          }`}
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
          }}
        />
      ))}


      <span className="relative z-20">
        {text}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} {...sharedProps}>
        {inner}
      </Link>
    );
  }

  return (
    <button {...sharedProps}>
      {inner}
    </button>
  );
};

export default Button;
