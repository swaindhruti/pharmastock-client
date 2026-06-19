'use client';

import Navbar from '@/components/Navbar';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CONTACTS = [
  { platform: "Email", handle: "hello@pharmastock.in", link: "mailto:hello@pharmastock.in" },
  { platform: "Twitter", handle: "@pharmastock_hq", link: "#" },
  { platform: "YouTube", handle: "Pharmastock", link: "#" },
  { platform: "Instagram", handle: "@pharmastock.in", link: "#" },
  { platform: "Medium", handle: "@pharmastock", link: "#" },
  { platform: "Linktree", handle: "pharmastock", link: "#" }
];

export default function Contact() {
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
        <div className="max-w-4xl mb-32">
          <h1 className="gsap-fade-up text-6xl md:text-[5.5rem] font-medium tracking-tight mb-8 text-text-main leading-[1.05]">
            Connect with <br className="hidden md:block"/>
            <span className="text-brand">Pharmastock</span>
          </h1>
          <p className="gsap-fade-up text-xl md:text-2xl text-text-muted max-w-2xl font-medium leading-relaxed">
            Whether you want to integrate our API, report an issue, or just chat about Indian healthcare data—we&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {CONTACTS.map((contact, idx) => (
            <a 
              key={idx} 
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="gsap-fade-up group block border-2 border-border-subtle bg-surface hover:border-brand p-8 transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-brand font-black tracking-widest uppercase text-xs">
                  {contact.platform}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium tracking-tight group-hover:text-brand transition-colors">
                {contact.handle}
              </h2>
            </a>
          ))}
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
