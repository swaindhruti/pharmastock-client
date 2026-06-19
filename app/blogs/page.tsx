'use client';

import Navbar from '@/components/Navbar';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BLOGS = [
  {
    title: "How Edge-Gram Tokenization Revolutionized Our Search Speed",
    excerpt: "Deep dive into our implementation of MongoDB Atlas Search and how we reduced search latency from 400ms to 12ms for complex medical queries.",
    date: "Jun 12, 2026",
    tag: "ENGINEERING"
  },
  {
    title: "Navigating the Fragmented Indian Healthcare Database",
    excerpt: "Understanding the challenges of standardizing over 2.5L records across 30+ manufacturers, and the data pipeline we built to solve it.",
    date: "May 28, 2026",
    tag: "DATA"
  },
  {
    title: "The Importance of Generic Substitute Mapping",
    excerpt: "Why mapping exact molecular matches matters more than ever for both retail pharmacies and consumer cost-savings.",
    date: "May 15, 2026",
    tag: "HEALTHCARE"
  },
  {
    title: "Scaling Pharmastock API for Enterprise Customers",
    excerpt: "A look at our transition to a highly available GraphQL architecture to support large-scale stockist integrations.",
    date: "Apr 02, 2026",
    tag: "ENGINEERING"
  }
];

export default function Blogs() {
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
            start: 'top 85%',
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
        <div className="max-w-4xl mb-24">
          <h1 className="gsap-hero-element text-6xl md:text-[5.5rem] font-medium tracking-tight mb-8 text-text-main leading-[1.05]">
            {"Insights & Updates"}
          </h1>
          <p className="gsap-hero-element text-xl md:text-2xl text-text-muted max-w-2xl font-medium leading-relaxed">
            Thoughts on data engineering, the healthcare ecosystem, and building the definitive medical dictionary.
          </p>
        </div>

        {/* Featured Post (First one) */}
        <div className="gsap-hero-element mb-24">
          <a href="#" className="group flex flex-col border-2 border-text-main bg-white hover:bg-surface-hover p-8 md:p-12 transition-all duration-300 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <span className="text-text-main font-black tracking-widest uppercase text-xs">{BLOGS[0].tag}</span>
                <span className="text-text-muted text-sm font-medium">{BLOGS[0].date}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 transition-colors max-w-4xl">
              {BLOGS[0].title}
            </h2>
            <p className="text-text-muted text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
              {BLOGS[0].excerpt}
            </p>
          </a>
        </div>

        {/* Grid of remaining posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32 border-t border-border-subtle pt-16">
          {BLOGS.slice(1).map((blog, idx) => (
            <div key={idx} className="gsap-fade-up">
              <a href="#" className="group flex flex-col border-2 border-text-main bg-white hover:bg-surface-hover p-8 transition-all duration-300 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-text-main font-black tracking-widest uppercase text-xs">{blog.tag}</span>
                    <span className="text-text-muted text-sm font-medium">{blog.date}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium tracking-tight mb-4 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-text-muted text-base font-medium leading-relaxed flex-grow">
                  {blog.excerpt}
                </p>
              </a>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
