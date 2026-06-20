'use client';

import Link from 'next/link';
import MedicineSearch from '@/components/MedicineSearch';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function SearchPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Fade up the content inside the hero
    gsap.fromTo('.gsap-hero-element',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );

    // Fade in the background pattern
    gsap.fromTo('.gsap-bg-pattern',
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: 'power2.out', delay: 0.5 }
    );
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-bg-main text-text-main font-faktum flex flex-col relative overflow-hidden">
      
      {/* Unique Background Grid + Dots */}
      <div className="gsap-bg-pattern absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-size-[60px_60px] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#94a3b8_2.5px,transparent_2.5px)] bg-size-[60px_60px] opacity-60" style={{ backgroundPosition: '30px 30px' }} />
        <div className="absolute inset-0 bg-linear-to-b from-bg-main/30 via-transparent to-bg-main" />
        <div className="absolute inset-0 bg-linear-to-r from-bg-main/80 via-transparent to-transparent" />
      </div>

      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-16 z-[100] bg-white border-2 border-text-main text-text-main px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Home
      </Link>

      <main className="w-full h-[100dvh] overflow-hidden mx-auto px-6 md:px-16 pt-20 md:pt-32 pb-4 md:pb-16 flex flex-col relative z-10">
        <MedicineSearch />
      </main>
    </div>
  );
}
