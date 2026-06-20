'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface Medicine {
  _id: string;
  name: string;
  therapeuticClass: string;
  substitutes: string[];
  sideEffects: string[];
  uses: string[];
}

export default function MedicineSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Medicine[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 350);

  useGSAP(() => {
    gsap.fromTo('.gsap-search-left',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );
  }, { scope: containerRef });

  useEffect(() => {
    async function fetchResults() {
      if (debouncedSearch.length < 3) {
        setResults([]);
        setIsFallback(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearch)}`);
        const data = await res.json();
        setResults(data.results || []);
        setIsFallback(data.isFallback || false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [debouncedSearch]);

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col lg:flex-row gap-8 lg:gap-24 font-faktum relative z-10 lg:pt-16">

      {/* Left Column: Header and Search Bar */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center h-full max-w-2xl shrink-0 pb-12 lg:pb-32">
        <div className="mb-16">
          <h1 className="gsap-search-left text-6xl md:text-[5.5rem] font-medium tracking-tight mb-8 text-text-main leading-[1.05]">
            Indian Medical Database
          </h1>
          <p className="gsap-search-left text-xl md:text-2xl text-text-muted font-medium leading-relaxed max-w-xl">
            Instantly lookup medicines, map generic substitutes, and view side-effects using our zero-latency search index.
          </p>
        </div>

        {/* Redesigned Search Bar */}
        <div className="gsap-search-left relative z-10 w-full group">
          <div className="relative flex items-center bg-transparent border-b-4 border-text-main focus-within:border-text-muted transition-colors">
            <input
              type="text"
              placeholder="Search by name or uses..."
              className="w-full py-6 bg-transparent text-text-main focus:outline-none placeholder:text-text-muted/40 text-3xl md:text-4xl font-black tracking-tight"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {/* Loading Spinner */}
            <div className="absolute right-12">
              {loading && <div className="w-8 h-8 border-4 border-text-muted/20 border-t-text-main rounded-full animate-spin" />}
            </div>
            {/* Decorative Icon */}
            <div className="absolute right-0 text-text-main">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10 opacity-40">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Scrollable Results */}
      <div className="w-full lg:w-1/2 h-full grow overflow-y-auto pb-32 lg:pt-12 pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none relative">

        {/* Initial Empty State */}
        {!loading && searchTerm.length < 3 && results.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 mt-20 lg:mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32 mb-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
            </svg>
            <p className="text-2xl font-bold tracking-widest uppercase">Awaiting Input</p>
          </div>
        )}

        {/* Skeleton Loading State */}
        {loading && results.length === 0 && searchTerm.length >= 3 && (
          <ul className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <li key={i} className="p-8 rounded-3xl border-2 border-text-main bg-transparent animate-pulse flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-6 bg-border-subtle rounded-md w-1/3"></div>
                  <div className="h-5 bg-border-subtle rounded-md w-1/4"></div>
                </div>
                <div className="h-4 bg-border-subtle rounded-md w-full mt-2"></div>
                <div className="h-4 bg-border-subtle rounded-md w-5/6"></div>
              </li>
            ))}
          </ul>
        )}

        {/* Fallback Notice */}
        {isFallback && results.length > 0 && !loading && (
          <div className="mb-6 p-6 rounded-3xl bg-surface border-2 border-text-main font-bold flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No exact medicine found. Showing relevant alternatives.
          </div>
        )}

        {/* No Results Notice */}
        {searchTerm.length >= 3 && !loading && results.length === 0 && (
          <div className="p-12 rounded-3xl bg-transparent border-2 border-text-main text-center flex flex-col items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-text-main font-black text-3xl mb-4">No results for &ldquo;{searchTerm}&rdquo;</p>
            <p className="text-xl font-medium text-text-muted">Try checking the spelling or searching by therapeutic class.</p>
          </div>
        )}

        {/* Results List */}
        {!loading && results.length > 0 && (
          <ul className="space-y-6 pb-20">
            {results.map((med) => (
              <li key={med._id}>
                <Link
                  href={`/medicine/${med._id}-${med.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="block p-8 rounded-3xl border-2 border-text-main bg-transparent hover:bg-surface-hover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all group"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                    <h3 className="text-3xl font-black text-text-main capitalize group-hover:text-text-muted transition-colors duration-200 tracking-tight">
                      {med.name}
                    </h3>
                    {med.therapeuticClass && (
                      <span className="text-xs px-4 py-2 rounded-full bg-surface border-2 border-text-main self-start xl:self-auto font-black text-text-main uppercase tracking-widest shrink-0">
                        {med.therapeuticClass}
                      </span>
                    )}
                  </div>

                  {med.substitutes && med.substitutes.length > 0 && (
                    <div className="mt-6 pt-6 border-t-2 border-border-subtle">
                      <p className="text-xs font-bold text-text-muted mb-4 uppercase tracking-widest">Generic Substitutes</p>
                      <div className="flex flex-wrap gap-3">
                        {med.substitutes.slice(0, 4).map((sub, idx) => (
                          <span key={idx} className="text-sm px-4 py-2 rounded-full bg-surface border-2 border-border-subtle font-bold text-text-main">
                            {sub}
                          </span>
                        ))}
                        {med.substitutes.length > 4 && (
                          <span className="text-sm px-4 py-2 rounded-full bg-transparent border-2 border-transparent font-bold text-text-muted">
                            +{med.substitutes.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
