'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';

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

  const debouncedSearch = useDebounce(searchTerm, 350); // 350ms window

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
    <div className="w-full max-w-3xl mx-auto p-4 font-faktum relative">

      <div className="relative z-10 flex gap-2">
        <div className="relative flex-1 group">
          {/* Thick colored border wrapper */}
          <div className="absolute -inset-0.5 bg-brand rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>

          <div className="relative flex bg-surface border-2 border-brand rounded-xl overflow-hidden shadow-sm transition-shadow duration-300 group-focus-within:shadow-brand/20 group-focus-within:shadow-lg">
            <input
              type="text"
              placeholder="Search for medicines, substitutes, side effects, uses..."
              className="w-full px-6 py-5 bg-transparent text-text-main focus:outline-none placeholder:text-text-muted/60 text-lg font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Loading Spinner or Clear Button */}
            <div className="absolute right-24 top-1/2 -translate-y-1/2">
              {loading && <div className="w-5 h-5 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />}
            </div>

            {/* Search Button */}
            <button className="bg-brand text-white px-8 flex items-center justify-center hover:bg-brand-hover active:bg-brand-hover/90 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 hover:scale-110 active:scale-95 transition-transform duration-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8 relative z-10">
        <span className="text-xs font-bold text-text-muted mr-2 opacity-80">India&apos;s largest dataset of 2.5L+ records covering</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 relative z-10">
        <button className="px-5 py-2.5 rounded-lg bg-surface text-text-main border-2 border-border-subtle font-bold hover:bg-surface-hover hover:border-brand/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2">
          Medicines
        </button>
        <button className="px-5 py-2.5 rounded-lg bg-surface text-text-main border-2 border-border-subtle font-bold hover:bg-surface-hover hover:border-brand/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2">
          Substitutes
        </button>
        <button className="px-5 py-2.5 rounded-lg bg-surface text-text-main border-2 border-border-subtle font-bold hover:bg-surface-hover hover:border-brand/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2">
          Side Effects
        </button>
        <button className="px-5 py-2.5 rounded-lg bg-surface text-text-main border-2 border-border-subtle font-bold hover:bg-surface-hover hover:border-brand/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2">
          Uses
        </button>
        <button className="px-5 py-2.5 rounded-lg bg-surface text-text-main border-2 border-border-subtle font-bold hover:bg-surface-hover hover:border-brand/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2">
          Retail & Stockists
        </button>
      </div>

      {/* Skeleton Loading State */}
      {loading && results.length === 0 && searchTerm.length >= 3 && (
        <ul className="mt-8 space-y-3 relative z-20">
          {[...Array(4)].map((_, i) => (
            <li key={i} className="p-5 rounded-xl border-2 border-border-subtle bg-surface animate-pulse flex flex-col gap-3 shadow-sm opacity-80">
              <div className="flex items-center gap-3">
                <div className="h-4 bg-border-subtle rounded w-1/3"></div>
                <div className="h-3 bg-border-subtle rounded w-1/4"></div>
              </div>
              <div className="h-2.5 bg-border-subtle rounded w-full mt-2"></div>
              <div className="h-2.5 bg-border-subtle rounded w-5/6"></div>
            </li>
          ))}
        </ul>
      )}

      {isFallback && results.length > 0 && !loading && (
        <div className="mt-8 p-4 rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-700 font-bold flex items-center gap-3 shadow-md relative z-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No exact medicine found. Showing relevant alternatives.
        </div>
      )}

      {searchTerm.length >= 3 && !loading && results.length === 0 && (
        <div className="mt-8 p-8 rounded-xl bg-surface border-2 border-border-subtle text-center flex flex-col items-center justify-center shadow-md relative z-20">
          <p className="text-text-main font-black text-xl mb-2">No results for &ldquo;{searchTerm}&rdquo;</p>
          <p className="text-base font-medium text-text-muted">Try checking the spelling or searching by therapeutic class.</p>
        </div>
      )}

      {/* Results List */}
      {!loading && results.length > 0 && (
        <div className="relative z-20">
          <ul className="mt-8 space-y-4">
            {results.map((med) => (
              <li
                key={med._id}
                className="rounded-xl border-2 border-border-subtle bg-surface hover:border-brand hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <Link href={`/medicine/${med._id}`} className="block p-5 w-full h-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <h3 className="text-xl font-black text-text-main capitalize group-hover:text-brand transition-colors duration-200">
                      {med.name}
                    </h3>
                    {med.therapeuticClass && (
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-bg-main text-text-muted border-2 border-border-subtle self-start sm:self-auto font-bold group-hover:border-brand/20 transition-colors">
                        {med.therapeuticClass}
                      </span>
                    )}
                  </div>

                {med.substitutes && med.substitutes.length > 0 && (
                  <div className="mt-4 pt-4 border-t-2 border-border-subtle/50 group-hover:border-brand/10 transition-colors">
                    <p className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">Substitutes</p>
                    <div className="flex flex-wrap gap-2">
                      {med.substitutes.slice(0, 4).map((sub, idx) => (
                        <span key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-surface-hover text-text-main border border-border-subtle font-semibold group-hover:bg-brand/5 group-hover:border-brand/20 transition-colors">
                          {sub}
                        </span>
                      ))}
                      {med.substitutes.length > 4 && (
                        <span className="text-xs px-3 py-1.5 rounded-lg bg-surface-hover text-text-muted border border-border-subtle font-semibold">
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
        </div>
      )}
    </div>
  );
}
