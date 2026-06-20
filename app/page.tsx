'use client';

import Navbar from '@/components/Navbar';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

export default function Home() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate letters
    gsap.fromTo('.gsap-letter',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.02, ease: 'power3.out', delay: 0.2 }
    );

    // Fade up the content inside the hero
    gsap.fromTo('.gsap-hero-element',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.8 }
    );
    // Fade in the background pattern
    gsap.fromTo('.gsap-bg-pattern',
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: 'power2.out', delay: 0.5 }
    );
  }, { scope: container });

  const splitText = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className="inline-block gsap-letter">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div ref={container} className="min-h-screen bg-bg-main text-text-main font-faktum selection:bg-brand/20 selection:text-brand flex flex-col relative overflow-hidden">

      <Navbar />

      <main className="w-full mx-auto px-6 md:px-16 pt-32 pb-24 flex flex-col items-start justify-end text-left relative z-10 grow min-h-[80vh]">

        {/* Unique Background Grid + Dots */}
        <div className="gsap-bg-pattern absolute inset-0 pointer-events-none z-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-size-[60px_60px] opacity-50" />
          {/* Dot pattern interspersed (offset by half the grid size) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,#94a3b8_2.5px,transparent_2.5px)] bg-size-[60px_60px] opacity-60" style={{ backgroundPosition: '30px 30px' }} />
          {/* Gradient fade to bottom/top to blend nicely */}
          <div className="absolute inset-0 bg-linear-to-b from-bg-main/30 via-transparent to-bg-main" />
          <div className="absolute inset-0 bg-linear-to-r from-bg-main/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl flex flex-col items-start w-full mt-auto">

          {/* Massive Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-medium tracking-tight mb-8 text-text-main leading-[1.05]">
            Intelligent Search for <br className="hidden md:block" /> <span className="text-text-main">Indian Healthcare</span>
          </h1>

          {/* Subtext */}
          <p className="gsap-hero-element text-lg md:text-2xl text-text-muted max-w-2xl font-medium leading-relaxed mb-12">
            With our state-of-the-art zero latency search, you can instantly lookup medicines, map generic substitutes, and view side effects in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="gsap-hero-element flex flex-col sm:flex-row gap-6 mt-4">
            <Link href="/search" className="group flex items-center justify-center gap-3 bg-text-main text-white px-8 py-4 rounded-full font-bold tracking-wide transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
              <span>Explore Database</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </Link>
            <Link href="/about" className="group flex items-center justify-center gap-3 bg-transparent border-2 border-text-main text-text-main px-8 py-4 rounded-full font-bold tracking-wide transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-surface-hover">
              <span>Learn More</span>
            </Link>
          </div>

        </div>

      </main>

    </div>
  );
}
