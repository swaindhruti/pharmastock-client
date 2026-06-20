'use client';

import Navbar from '@/components/Navbar';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CONTACTS = [
  { platform: "Email", handle: "hello@smartdrugfinder.in", link: "mailto:hello@smartdrugfinder.in" },
  { platform: "Twitter", handle: "@smartdrugfinder_hq", link: "#" },
  { platform: "YouTube", handle: "SmartDrugFinder", link: "#" },
  { platform: "Instagram", handle: "@smartdrugfinder.in", link: "#" },
  { platform: "Medium", handle: "@smartdrugfinder", link: "#" },
  { platform: "Linktree", handle: "smartdrugfinder", link: "#" }
];

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'Email':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-text-main group-hover:-translate-y-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      );
    case 'Twitter':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-text-main group-hover:-translate-y-1 transition-transform">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'YouTube':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-text-main group-hover:-translate-y-1 transition-transform">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'Instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-text-main group-hover:-translate-y-1 transition-transform">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      );
    case 'Medium':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-text-main group-hover:-translate-y-1 transition-transform">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
        </svg>
      );
    case 'Linktree':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-text-main group-hover:-translate-y-1 transition-transform">
          <path d="M13.435 9.155L19.467 3.12 21.09 4.743l-5.636 5.636h5.83v2.29h-8.082v5.71h2.29v4.582h-6.874v-4.582h2.292v-5.71H2.827v-2.29h5.83L3.02 4.743 4.644 3.12l6.03 6.033v-9.15h2.29v9.153z"/>
        </svg>
      );
    default:
      return null;
  }
};

export default function Contact() {
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
        <div className="mb-32">
          <h1 className="text-6xl md:text-[5.5rem] font-medium tracking-tight mb-8 text-text-main leading-[1.05]">
            {splitText("Connect with SmartDrugFinder")}
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
                  <div className="flex items-center gap-4">
                    {getPlatformIcon(contact.platform)}
                    <span className="text-text-main font-black tracking-widest uppercase text-xs">
                      {contact.platform}
                    </span>
                  </div>
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
