"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Navbar({ className = "" }: { className?: string }) {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power4.out", delay: 0 },
      );
    },
    { scope: navRef },
  );

  return (
    <nav
      ref={navRef}
      className={`w-full fixed top-0 left-0 z-[100] opacity-0 translate-y-[-100px] ${className}`}
    >
      {/* Blurred Background that fades in on scroll */}
      <div
        className={`absolute inset-0 transition-all duration-300 pointer-events-none ${scrolled ? "bg-bg-main/80 backdrop-blur-xl border-b border-border-subtle shadow-sm" : "bg-transparent border-b border-transparent"}`}
      />

      <div
        className={`w-full mx-auto px-6 md:px-16 flex items-center justify-between relative z-10 transition-all duration-300 ${scrolled ? "py-6" : "pt-8 pb-6"}`}
      >
        {/* Left Side: Logo */}
        <Link
          href="/"
          className="text-2xl font-black text-text-main hover:opacity-80 transition-opacity tracking-tightest"
        >
          SmartDrugFinder
        </Link>

        {/* Right Side: Index Status Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border-2 border-text-main text-text-main px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Database
          </div>
        </div>
      </div>
    </nav>
  );
}
