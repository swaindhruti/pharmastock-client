'use client';

import Navbar from '@/components/Navbar';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function About() {
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

    // Reveal elements as they scroll into view
    const fadeElements = gsap.utils.toArray('.gsap-fade-up');
    fadeElements.forEach((el) => {
      const element = el as HTMLElement;
      gsap.fromTo(element,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Staggered team photos when container scrolls into view
    gsap.fromTo('.gsap-team-photo',
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.team-container',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
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

      {/* Unique Background Grid + Dots */}
      <div className="gsap-bg-pattern absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-size-[60px_60px] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#94a3b8_2.5px,transparent_2.5px)] bg-size-[60px_60px] opacity-60" style={{ backgroundPosition: '30px 30px' }} />
        <div className="absolute inset-0 bg-linear-to-b from-bg-main/30 via-transparent to-bg-main" />
        <div className="absolute inset-0 bg-linear-to-r from-bg-main/80 via-transparent to-transparent" />
      </div>

      <Navbar />

      <main className="w-full mx-auto px-6 md:px-16 pt-40 pb-32 flex flex-col relative z-10">

        {/* Header & Copy Section */}
        <div className="mb-32">
          <h1 className="text-6xl md:text-[5.5rem] font-medium tracking-tight mb-12 text-text-main leading-[1.05]">
            {splitText("Building the definitive dictionary for Indian healthcare")}
          </h1>

          <div className="gsap-hero-element flex flex-col gap-8 max-w-7xl text-lg text-text-muted">
            <p className="gsap-hero-element leading-relaxed">
              From the beginning, SmartDrugFinder was about building the right tool for the right job. We isolated the tasks that doctors and pharmacists struggled with and built specialized data pipelines to do them instead. Starting with fuzzy search and generic mapping, our platform makes medicine discovery faster, better, and cheaper for everyone.
            </p>
            <p>
              We envision a future where instant medical data can be seamlessly integrated into all pharmacy systems — the static databases of today will become dynamic, zero-latency interfaces. At SmartDrugFinder, we want to build the infrastructure to make this possible.
            </p>
            <p>
              Our team was born out of intense mentorship and a relentless drive for technical excellence. Guided by industry veterans, we quickly learned that speed and precision are non-negotiable. If you&apos;re stubbornly optimistic and don&apos;t back away from hard technical problems, join us.
            </p>
          </div>

          <div className="gsap-hero-element flex flex-col sm:flex-row gap-6 mt-12">
            <button className="group bg-text-main text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
              <span>JOIN THE TEAM</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </button>
            <button className="group bg-transparent border-2 border-text-main text-text-main px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-surface-hover">
              <span>EXPLORE SERVICES</span>
            </button>
          </div>
        </div>

        {/* Meet the Team */}
        <div className="mb-32 team-container">
          <div className="flex justify-between items-end mb-12">
            <h2 className="gsap-fade-up text-5xl md:text-6xl font-medium tracking-tight">Meet the team</h2>
            <div className="gsap-fade-up gap-4 hidden sm:flex">
              <button className="bg-text-main text-white hover:bg-text-main/90 transition-colors w-14 h-14 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              </button>
              <button className="bg-text-main text-white hover:bg-text-main/90 transition-colors w-14 h-14 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-8 snap-x no-scrollbar">
            {/* Team Image Placeholders */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="gsap-team-photo min-w-[300px] md:min-w-[400px] h-[250px] md:h-[300px] bg-border-subtle shrink-0 snap-center relative group overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-linear-to-tr from-surface to-border-subtle mix-blend-multiply transition-transform duration-700 group-hover:scale-105"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted By */}
        <div className="flex flex-col items-start py-16 mb-32 gap-12 rounded-3xl">
          <h2 className="gsap-fade-up text-5xl md:text-6xl font-medium tracking-tight">Trusted by leading pharmacies</h2>
          <div className="flex flex-wrap justify-start gap-6 items-center">
            <div className="gsap-fade-up bg-text-main text-white px-8 py-4 rounded-full font-bold text-xl md:text-2xl tracking-tight flex items-center justify-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
              Apollo Pharmacy
            </div>
            <div className="gsap-fade-up bg-transparent border-2 border-text-main text-text-main hover:bg-surface-hover px-8 py-4 rounded-full font-bold text-xl md:text-2xl tracking-tight flex items-center justify-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
              Netmeds
            </div>
            <div className="gsap-fade-up bg-text-main text-white px-8 py-4 rounded-full font-bold text-xl md:text-2xl tracking-tight flex items-center justify-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
              Pharmeasy
            </div>
            <div className="gsap-fade-up bg-transparent border-2 border-text-main text-text-main hover:bg-surface-hover px-8 py-4 rounded-full font-bold text-xl md:text-2xl tracking-tight flex items-center justify-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
              1mg
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="gsap-fade-up flex flex-col mb-20 items-start">
          <h2 className="text-6xl md:text-7xl font-medium tracking-tight mb-8">
            Get started in <span className="text-text-main">minutes</span>
          </h2>
          <div className="flex flex-col items-start gap-8 mb-16">
            <p className="gsap-hero-element text-xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
              Try out our search bar, and start with our free tier to test SmartDrugFinder models in your application.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mt-4">
              <button className="group flex items-center justify-center gap-3 bg-text-main text-white px-8 py-4 rounded-full font-bold tracking-wide transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                <span>GET A DEMO</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </button>
              <button className="group flex items-center justify-center gap-3 bg-transparent border-2 border-text-main text-text-main px-8 py-4 rounded-full font-bold tracking-wide transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-surface-hover">
                <span>SIGN UP FOR FREE</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
