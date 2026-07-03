"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Medicine {
  _id: string;
  name: string;
  therapeuticClass: string;
  substitutes: string[];
  sideEffects: string[];
  uses: string[];
  composition?: string;
  manufacturer?: string;
  form?: string;
}

const BRANDS = [
  { name: "All Manufacturers", value: "" },
  { name: "Cipla", value: "Cipla" },
  { name: "Lupin", value: "Lupin" },
  { name: "Mankind Pharma", value: "Mankind Pharma" },
  { name: "Sun Pharma", value: "Sun Pharma" },
];

export default function MedicineSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Medicine[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Show profile dialog on first visit
    if (typeof document !== "undefined" && !document.cookie.includes("profile_completed=true")) {
      const timer = setTimeout(() => {
        setShowProfileDialog(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState("");
  const [formData, setFormData] = useState({
    profession: "Pharmacist",
    gender: "Male",
    purpose: "Finding Substitutes",
  });
  const [submittingProfile, setSubmittingProfile] = useState(false);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (
      typeof document !== "undefined" &&
      document.cookie.includes("profile_completed=true")
    ) {
      return;
    }
    e.preventDefault();
    setPendingHref(href);
    setShowProfileDialog(true);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProfile(true);
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      document.cookie = "profile_completed=true; path=/; max-age=31536000";
      setShowProfileDialog(false);
      if (pendingHref) router.push(pendingHref);
    } catch (err) {
      console.error(err);
      document.cookie = "profile_completed=true; path=/; max-age=31536000";
      setShowProfileDialog(false);
      if (pendingHref) router.push(pendingHref);
    } finally {
      setSubmittingProfile(false);
    }
  };

  const debouncedSearch = useDebounce(searchTerm, 350);

  useEffect(() => {
    async function fetchResults() {
      if (debouncedSearch.length < 3) {
        setResults([]);
        setIsFallback(false);
        return;
      }

      setLoading(true);
      try {
        const brandQuery = selectedBrand ? `&brand=${encodeURIComponent(selectedBrand)}` : "";
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedSearch)}${brandQuery}`,
        );
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
  }, [debouncedSearch, selectedBrand]);

  const hasActiveSearch = searchTerm.length > 0;
  const isSearchReady = debouncedSearch.length >= 3;
  const isTyping = searchTerm !== debouncedSearch;

  useGSAP(
    () => {
      if (!hasActiveSearch) {
        gsap.fromTo(
          ".gsap-landing-item",
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
        );
      }
    },
    { scope: containerRef, dependencies: [hasActiveSearch] },
  );

  useGSAP(
    () => {
      if (results.length > 0 && !loading) {
        gsap.fromTo(
          ".gsap-result-card",
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
        );
      }
    },
    { scope: containerRef, dependencies: [results, loading] },
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-[100dvh] flex flex-col font-faktum relative bg-[#F8FAFC] overflow-hidden text-text-main"
    >
      <div className="w-full max-w-md mx-auto h-full flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.03)] bg-bg-main border-x border-border-subtle/50">
        
        {/* Dynamic Header */}
        <header
          className={`w-full transition-all duration-500 ease-in-out shrink-0 z-50 flex flex-col items-center px-5 pt-6 pb-4 ${
            hasActiveSearch
              ? "bg-bg-main border-b border-border-subtle shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
              : "justify-center pt-[8vh]"
          }`}
        >
          {/* Title */}
          <div
            className={`transition-all duration-500 flex flex-col items-center gsap-landing-item w-full ${
              hasActiveSearch ? "h-0 opacity-0 overflow-hidden mb-0" : "h-auto opacity-100 mb-8"
            }`}
          >
            <h1 className="font-bold text-3xl tracking-tight text-text-main mb-1.5">
              SmartDrugFinder
            </h1>
            <p className="text-sm text-text-muted font-medium">
              Zero-Latency Medicine Database
            </p>
          </div>

          {/* Search Capsule */}
          <div className="w-full relative gsap-landing-item z-20">
            <div className="relative flex items-center bg-surface border border-border-subtle rounded-2xl focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] transition-all px-4 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-text-muted shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or uses..."
                className="w-full py-2.5 px-3 bg-transparent text-text-main focus:outline-none placeholder:text-text-muted/60 text-[15px] font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1 rounded-full text-text-muted hover:text-text-main hover:bg-border-subtle transition-colors shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Custom Brand Filter Dropdown */}
          <div className="w-full mt-4 gsap-landing-item relative z-30" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-surface border border-border-subtle text-text-main text-sm font-medium rounded-xl px-4 py-3 hover:bg-surface-hover transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <span>{BRANDS.find(b => b.value === selectedBrand)?.name || "All Manufacturers"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-subtle rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-[fadeIn_0.15s_ease-out]">
                {BRANDS.map((brand) => (
                  <button
                    key={brand.value}
                    onClick={() => {
                      setSelectedBrand(brand.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                      selectedBrand === brand.value
                        ? "bg-[var(--color-cream-red)] text-brand font-semibold"
                        : "text-text-main hover:bg-surface-hover font-medium"
                    }`}
                  >
                    <span>{brand.name}</span>
                    {selectedBrand === brand.value && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="w-full grow overflow-y-auto px-5 pb-24 scrollbar-none bg-[#FDFDFD] relative z-10">
          
          {/* Landing State Info */}
          {!hasActiveSearch && (
            <div className="mt-8 flex flex-col gap-4">
              <div className="gsap-landing-item bg-surface border border-border-subtle p-5 rounded-2xl flex flex-col gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
                <h3 className="text-text-main font-semibold text-[15px]">2.5L+ Drugs Database</h3>
                <p className="text-[13px] text-text-muted leading-relaxed">Extensive directory for retailers and healthcare professionals.</p>
              </div>
              <div className="gsap-landing-item bg-surface border border-border-subtle p-5 rounded-2xl flex flex-col gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
                <h3 className="text-text-main font-semibold text-[15px]">Find Substitutes Fast</h3>
                <p className="text-[13px] text-text-muted leading-relaxed">Check generic maps and alternative brands seamlessly.</p>
              </div>
              <div className="gsap-landing-item bg-surface border border-border-subtle p-5 rounded-2xl flex flex-col gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
                <h3 className="text-text-main font-semibold text-[15px]">Top Manufacturers</h3>
                <p className="text-[13px] text-text-muted leading-relaxed">Data sourced straight from Cipla, Lupin, Mankind & more.</p>
              </div>
            </div>
          )}

          {/* Prompt to type more */}
          {hasActiveSearch && searchTerm.length < 3 && !loading && (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 rounded-full border-2 border-border-subtle border-t-brand animate-spin mb-4" />
              <p className="text-text-muted text-sm font-medium">Continue typing...</p>
            </div>
          )}

          {/* Loading Skeleton */}
          {(loading || (hasActiveSearch && searchTerm.length >= 3 && isTyping)) && (
            <div className="mt-5 flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-surface border border-border-subtle p-5 rounded-2xl flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-border-subtle rounded-md w-1/2 animate-pulse" />
                    <div className="h-3.5 bg-border-subtle rounded-md w-1/5 animate-pulse" />
                  </div>
                  <div className="h-3 bg-border-subtle rounded-md w-3/4 animate-pulse" />
                  <div className="h-8 bg-border-subtle rounded-md w-full animate-pulse mt-1" />
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !isTyping && isSearchReady && results.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-center rounded-2xl mt-5 bg-surface border border-border-subtle">
              <p className="text-text-main font-semibold text-[15px] mb-1">No medicines found</p>
              <p className="text-[13px] text-text-muted">Try a different name or brand filter.</p>
            </div>
          )}

          {/* Results List */}
          {!loading && !isTyping && results.length > 0 && (
            <div className="mt-5 flex flex-col gap-4">
              {/* Removed fallback banner as requested */}
              {results.map((med) => (
                <Link
                  key={med._id}
                  href={`/medicine/${med._id}-${med.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  onClick={(e) =>
                    handleLinkClick(
                      e,
                      `/medicine/${med._id}-${med.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
                    )
                  }
                  className="gsap-result-card opacity-0 bg-surface border border-border-subtle rounded-2xl p-4.5 flex flex-col hover:border-text-muted/30 transition-all active:bg-surface-hover shadow-[0_2px_10px_rgba(0,0,0,0.015)]"
                >
                  <div className="flex justify-between items-start mb-1.5 gap-3">
                    <h3 className="font-semibold text-text-main capitalize text-[14px] leading-tight">{med.name}</h3>
                    {med.therapeuticClass && (
                      <span className="shrink-0 text-[9px] px-2 py-0.5 rounded-md bg-[var(--color-cream-red)] text-[var(--color-cream-red-text)] font-semibold uppercase tracking-wider">
                        {med.therapeuticClass}
                      </span>
                    )}
                  </div>
                  
                  {(med.manufacturer || med.form) && (
                    <div className="flex items-center gap-2.5 text-[11px] text-text-muted font-medium mb-3">
                      {med.manufacturer && <span className="capitalize">{med.manufacturer}</span>}
                      {med.manufacturer && med.form && <span className="w-1 h-1 rounded-full bg-text-muted/30" />}
                      {med.form && <span className="capitalize">{med.form}</span>}
                    </div>
                  )}

                  {med.composition && (
                    <div className="mt-auto pt-3 border-t border-border-subtle border-dashed">
                      <p className="text-[11.5px] text-text-muted leading-relaxed line-clamp-2">
                        <span className="font-medium text-text-main mr-1.5">Composition:</span>
                        <span className="capitalize">{med.composition}</span>
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Dialog Overlay */}
      {showProfileDialog &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 font-faktum">
            <div className="bg-bg-main border border-border-subtle rounded-3xl p-7 w-full max-w-sm shadow-2xl animate-[slideUp_0.2s_ease-out]">
              <h2 className="text-xl font-bold mb-1.5 text-text-main">
                Quick Setup
              </h2>
              <p className="text-[13px] text-text-muted mb-6 leading-relaxed">
                Help us personalize your search experience.
              </p>
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-text-muted text-[11px] uppercase tracking-wider">
                    Role
                  </label>
                  <select
                    className="w-full p-3 border border-border-subtle rounded-xl bg-surface text-text-main focus:outline-none focus:border-brand text-sm"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  >
                    <option>Retailer / Shopkeeper</option>
                    <option>Pharmacist</option>
                    <option>Doctor</option>
                    <option>Medical Student</option>
                    <option>Patient / General Public</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-text-muted text-[11px] uppercase tracking-wider">
                    Purpose
                  </label>
                  <select
                    className="w-full p-3 border border-border-subtle rounded-xl bg-surface text-text-main focus:outline-none focus:border-brand text-sm"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  >
                    <option>Finding Substitutes</option>
                    <option>Stock Verification</option>
                    <option>Research / Study</option>
                    <option>General Knowledge</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submittingProfile}
                  className="mt-3 w-full bg-brand hover:bg-brand-hover text-white py-3 rounded-xl text-[14px] font-semibold transition-colors disabled:opacity-50"
                >
                  {submittingProfile ? "Saving..." : "Continue"}
                </button>
              </form>
            </div>
            <style
              dangerouslySetInnerHTML={{
                __html: `
            @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
          `,
              }}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
