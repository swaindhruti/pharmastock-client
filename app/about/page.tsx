'use client';

import Navbar from '@/components/Navbar';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FAQS = [
  { question: "Why Pharmastock?", answer: "We saw a deeply fragmented healthcare data ecosystem in India and built a unified platform." },
  { question: "Is the data verified?", answer: "Yes, our database of 2.5L+ records is cross-referenced with top manufacturers and stockists." },
  { question: "How fast is the search?", answer: "Powered by MongoDB Atlas Search with edge-gram tokenization, our search is virtually zero-latency." },
  { question: "Can I find substitutes easily?", answer: "Absolutely. Our core philosophy is to map alternatives and generic substitutes instantly." },
  { question: "Who is Pharmastock for?", answer: "Pharmacists, clinicians, and everyday consumers looking for accurate medical information." }
];

export default function About() {
  const container = useRef<HTMLDivElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useGSAP(() => {
    // Reveal elements as they scroll into view
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
            trigger: el,
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

  return (
    <div ref={container} className="min-h-screen bg-bg-main text-text-main font-faktum selection:bg-brand/20 selection:text-brand flex flex-col relative overflow-hidden">
      
      {/* Decorative SVG curves (like in the reference) */}
      <div className="absolute top-0 right-0 w-full h-[800px] pointer-events-none z-0 opacity-20">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full stroke-brand fill-none" strokeWidth="1">
           <path d="M 0,200 C 300,0 600,400 1000,100" />
           <path d="M 0,600 C 400,800 800,200 1000,500" />
        </svg>
      </div>

      <Navbar />

      <main className="w-full max-w-[1400px] mx-auto px-6 md:px-16 pt-40 pb-32 flex flex-col relative z-10">
        
        {/* Header & Copy Section */}
        <div className="max-w-4xl mb-32">
          <h1 className="gsap-fade-up text-6xl md:text-[5.5rem] font-medium tracking-tight mb-12 text-text-main leading-[1.05]">
            Building the definitive dictionary for Indian healthcare
          </h1>
          
          <div className="gsap-fade-up flex flex-col gap-8 max-w-3xl text-lg text-text-muted">
            <p>
              From the beginning, Pharmastock was about building the right tool for the right job. We isolated the tasks that doctors and pharmacists struggled with and built specialized data pipelines to do them instead. Starting with fuzzy search and generic mapping, our platform makes medicine discovery faster, better, and cheaper for everyone.
            </p>
            <p>
              We envision a future where instant medical data can be seamlessly integrated into all pharmacy systems — the static databases of today will become dynamic, zero-latency interfaces. At Pharmastock, we want to build the infrastructure to make this possible.
            </p>
            <p>
              Our team was born out of intense mentorship and a relentless drive for technical excellence. Guided by industry veterans, we quickly learned that speed and precision are non-negotiable. If you&apos;re stubbornly optimistic and don&apos;t back away from hard technical problems, join us.
            </p>
          </div>

          <button className="gsap-fade-up mt-12 bg-brand text-white px-8 py-3 font-bold flex items-center gap-2 hover:bg-brand-hover transition-colors shadow-sm">
            JOIN THE TEAM
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Meet the Team */}
        <div className="mb-32 team-container">
          <h2 className="gsap-fade-up text-5xl md:text-6xl font-medium tracking-tight mb-12">Meet the team</h2>
          <div className="flex gap-4 overflow-x-auto pb-8 snap-x no-scrollbar">
            {/* Team Image Placeholders */}
            {[1,2,3,4].map((i) => (
              <div key={i} className="gsap-team-photo min-w-[300px] md:min-w-[400px] h-[250px] md:h-[300px] bg-border-subtle shrink-0 snap-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-surface to-border-subtle mix-blend-multiply transition-transform duration-700 group-hover:scale-105"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted By */}
        <div className="gsap-fade-up flex flex-col md:flex-row items-start md:items-center justify-between border-t border-border-subtle pt-12 mb-32 gap-8">
          <p className="text-text-muted font-medium max-w-[200px]">Trusted by the best leading pharmacies:</p>
          <div className="flex flex-wrap gap-12 opacity-60 grayscale items-center font-bold text-2xl tracking-tighter">
            <span>Apollo Pharmacy</span>
            <span>Netmeds</span>
            <span>Pharmeasy</span>
            <span>1mg</span>
          </div>
        </div>

        {/* FAQs */}
        <div className="gsap-fade-up grid grid-cols-1 md:grid-cols-12 gap-12 mb-32 border-t border-border-subtle pt-16">
          <div className="md:col-span-4">
            <span className="text-brand text-xs font-bold uppercase tracking-widest mb-4 block">■ FAQS</span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
              Frequently<br />asked<br />questions
            </h2>
          </div>
          <div className="md:col-span-8 flex flex-col">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border-b border-border-subtle py-6">
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-xl hover:text-brand transition-colors"
                >
                  {faq.question}
                  <span className="text-2xl font-light">{openFaqIndex === idx ? '−' : '+'}</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === idx ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-text-muted font-medium text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="gsap-fade-up flex flex-col mb-20">
          <h2 className="text-6xl md:text-7xl font-medium tracking-tight mb-8">
            Get started in <span className="text-brand">minutes</span>
          </h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <p className="text-text-muted font-medium text-lg max-w-md">
              Try out our search bar, and start with our free tier to test Pharmastock models in your application.
            </p>
            <div className="flex gap-4">
              <button className="bg-brand text-white px-8 py-3 font-bold flex items-center gap-2 hover:bg-brand-hover transition-colors shadow-sm">
                GET A DEMO
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" /></svg>
              </button>
              <button className="bg-surface-hover border border-border-subtle text-text-main px-8 py-3 font-bold flex items-center gap-2 hover:bg-border-subtle transition-colors">
                SIGN UP FOR FREE
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
          
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full border-t border-border-subtle bg-surface px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between text-xs font-bold text-text-main gap-4 relative z-10">
        <div className="flex items-center gap-2 text-lg">
          Pharmastock
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-brand transition-colors">Y COMBINATOR</a>
          <a href="#" className="hover:text-brand transition-colors">ABOUT US</a>
          <a href="#" className="hover:text-brand transition-colors">EMAIL US</a>
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
