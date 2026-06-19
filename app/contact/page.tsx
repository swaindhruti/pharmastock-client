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
        <div className="mb-32">
          <h1 className="gsap-hero-element text-6xl md:text-[5.5rem] font-medium tracking-tight mb-8 text-text-main leading-[1.05]">
            {"Connect with Pharmastock"}
          </h1>
          <p className="gsap-hero-element text-xl md:text-2xl text-text-muted font-medium leading-relaxed">
            Whether you want to integrate our API, report an issue, or just chat about Indian healthcare data—we&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {CONTACTS.map((contact, idx) => (
            <div key={idx} className="gsap-fade-up">
              <a 
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border-2 border-text-main bg-transparent hover:bg-surface-hover p-8 transition-all duration-300 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="text-text-main font-black tracking-widest uppercase text-xs">
                    {contact.platform}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-text-main">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
                <h2 className="text-2xl font-medium tracking-tight group-hover:text-text-muted transition-colors">
                  {contact.handle}
                </h2>
              </a>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
