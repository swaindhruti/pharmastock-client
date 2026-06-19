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
        <div className="max-w-4xl mb-24">
          <h1 className="gsap-fade-up text-6xl md:text-[5.5rem] font-medium tracking-tight mb-8 text-text-main leading-[1.05]">
            Insights & <br className="hidden md:block"/>
            <span className="text-brand">Updates</span>
          </h1>
          <p className="gsap-fade-up text-xl md:text-2xl text-text-muted max-w-2xl font-medium leading-relaxed">
            Thoughts on data engineering, the healthcare ecosystem, and building the definitive medical dictionary.
          </p>
        </div>

        {/* Featured Post (First one) */}
        <div className="gsap-fade-up mb-24 group cursor-pointer border-l-4 border-brand pl-8 py-2">
           <div className="flex items-center gap-4 mb-4">
              <span className="text-brand font-black tracking-widest uppercase text-xs">{BLOGS[0].tag}</span>
              <span className="text-text-muted text-sm font-medium">{BLOGS[0].date}</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 group-hover:text-brand transition-colors max-w-4xl">
              {BLOGS[0].title}
           </h2>
           <p className="text-text-muted text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
              {BLOGS[0].excerpt}
           </p>
        </div>

        {/* Grid of remaining posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32 border-t border-border-subtle pt-16">
          {BLOGS.slice(1).map((blog, idx) => (
            <div key={idx} className="gsap-fade-up group cursor-pointer flex flex-col">
              <div className="w-full h-[240px] bg-border-subtle relative overflow-hidden mb-6">
                  {/* Generic placeholder background for other blogs */}
                  <div className="absolute inset-0 bg-surface/50 group-hover:scale-105 transition-transform duration-700 ease-out"></div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-brand font-black tracking-widest uppercase text-xs">{blog.tag}</span>
                <span className="text-text-muted text-sm font-medium">{blog.date}</span>
              </div>
              <h3 className="text-2xl font-medium tracking-tight mb-3 group-hover:text-brand transition-colors">
                {blog.title}
              </h3>
              <p className="text-text-muted text-base font-medium leading-relaxed flex-grow">
                {blog.excerpt}
              </p>
            </div>
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
