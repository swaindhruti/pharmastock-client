'use client';

import Navbar from '@/components/Navbar';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = [
  {
    id: "01",
    title: "Zero-Latency Fuzzy Search",
    description: "Built on top of MongoDB Atlas Search, our edge-gram tokenization ensures sub-millisecond retrieval of medicines even with typos. Perfect for high-volume clinical environments."
  },
  {
    id: "02",
    title: "Generic Substitute Mapping",
    description: "Instantly map branded drugs to their generic counterparts. Our extensive pipeline continuously cross-references 2.5L+ records to find exact molecular matches."
  },
  {
    id: "03",
    title: "Data Pipeline API",
    description: "Integrate Pharmastock's entire dataset directly into your SaaS or internal pharmacy management system via our highly scalable GraphQL and REST APIs."
  },
  {
    id: "04",
    title: "Retail & Stockist Analytics",
    description: "Gain deep visibility into supply chains. We aggregate real-time data to help you locate stockists, analyze drug shortages, and optimize procurement."
  }
];

export default function Services() {
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

    // Fade up scroll-triggered elements
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
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#94a3b8_2.5px,transparent_2.5px)] bg-[size:60px_60px] opacity-60" style={{ backgroundPosition: '30px 30px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-main/30 via-transparent to-bg-main" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-main/80 via-transparent to-transparent" />
      </div>

      <Navbar />

      <main className="w-full mx-auto px-6 md:px-16 pt-40 pb-32 flex flex-col relative z-10 flex-grow">

        {/* Header Section */}
        <div className=" mb-32">
          <h1 className="text-6xl md:text-[5.5rem] font-medium tracking-tight mb-8 text-text-main leading-[1.05]">
            {"Enterprise Infrastructure for Healthcare Systems"}
          </h1>
          <p className="gsap-hero-element text-xl md:text-2xl text-text-muted max-w-2xl font-medium leading-relaxed">
            We provide the foundational rails for medical applications. From blazing fast search to comprehensive supply chain analytics.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          {SERVICES.map((service, idx) => (
            <div key={idx} className="gsap-fade-up group cursor-pointer border-t-2 border-text-main pt-8">
              <div className="flex justify-between items-end mb-8">
                <span className="text-text-main font-black text-2xl tracking-widest">{service.id}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 group-hover:text-text-muted transition-colors">
                {service.title}
              </h2>
              <p className="text-text-muted text-lg font-medium leading-relaxed max-w-md">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
