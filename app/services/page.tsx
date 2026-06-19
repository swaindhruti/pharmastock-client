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
        <div className="max-w-4xl mb-32">
          <h1 className="gsap-fade-up text-6xl md:text-[5.5rem] font-medium tracking-tight mb-8 text-text-main leading-[1.05]">
            Enterprise Infrastructure for <br className="hidden md:block"/>
            <span className="text-brand">Healthcare Systems</span>
          </h1>
          <p className="gsap-fade-up text-xl md:text-2xl text-text-muted max-w-2xl font-medium leading-relaxed">
            We provide the foundational rails for medical applications. From blazing fast search to comprehensive supply chain analytics.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          {SERVICES.map((service, idx) => (
            <div key={idx} className="gsap-fade-up group cursor-pointer border-t-2 border-text-main pt-8">
              <div className="flex justify-between items-end mb-8">
                <span className="text-brand font-black text-2xl tracking-widest">{service.id}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 group-hover:text-brand transition-colors">
                {service.title}
              </h2>
              <p className="text-text-muted text-lg font-medium leading-relaxed max-w-md">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="gsap-fade-up bg-surface border border-border-subtle p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand/5"></div>
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-4xl font-medium mb-4">Ready to integrate?</h3>
            <p className="text-text-muted text-lg font-medium">Access our developer documentation and test our models in your application today.</p>
          </div>
          <button className="relative z-10 bg-text-main text-white px-8 py-4 font-black tracking-widest uppercase hover:bg-brand transition-colors whitespace-nowrap">
            READ THE DOCS
          </button>
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
