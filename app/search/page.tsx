'use client';

import Navbar from '@/components/Navbar';
import MedicineSearch from '@/components/MedicineSearch';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function SearchPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const fadeElements = gsap.utils.toArray('.gsap-fade-up');
    fadeElements.forEach((el: unknown) => {
      gsap.fromTo(el as HTMLElement,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el as HTMLElement,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-bg-main text-text-main font-faktum selection:bg-brand/20 selection:text-brand flex flex-col relative overflow-hidden">
      
      {/* Decorative SVG curves */}
      <div className="absolute top-0 right-0 w-full h-[800px] pointer-events-none z-0 opacity-20">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full stroke-brand fill-none" strokeWidth="1">
           <path d="M 0,200 C 300,0 600,400 1000,100" />
           <path d="M 0,600 C 400,800 800,200 1000,500" />
        </svg>
      </div>

      <Navbar />

      <main className="w-full max-w-[1400px] mx-auto px-6 md:px-16 pt-40 pb-32 flex flex-col relative z-10 flex-grow">
        
        {/* Header Section */}
        <div className="max-w-4xl mb-16">
          <h1 className="gsap-fade-up text-6xl md:text-[5.5rem] font-medium tracking-tight mb-8 text-text-main leading-[1.05]">
            Global <span className="text-brand">Medical Database</span>
          </h1>
          <p className="gsap-fade-up text-xl md:text-2xl text-text-muted max-w-2xl font-medium leading-relaxed">
            Instantly lookup medicines, map generic substitutes, and view side-effects using our zero-latency search index.
          </p>
        </div>

        {/* The dedicated search component */}
        <div className="gsap-fade-up w-full relative z-30 flex justify-start">
           <div className="w-full max-w-4xl">
             <MedicineSearch />
           </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border-subtle bg-surface px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between text-xs font-bold text-text-main gap-4 relative z-10">
        <div className="flex items-center gap-2 text-lg">
          Pharmastock
        </div>
        <div className="flex gap-4 text-text-muted font-medium">
          <a href="#" className="hover:text-text-main transition-colors">Status</a>
          <a href="#" className="hover:text-text-main transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-text-main transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
