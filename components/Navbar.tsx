"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Data Explorer", path: "/search" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power4.out", delay: 0 },
      );
    },
    { scope: navRef },
  );

  useGSAP(() => {
    if (mobileMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        x: "0%",
        duration: 0.6,
        ease: "power4.out",
      });
      gsap.fromTo(
        ".mobile-nav-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: "power3.out",
        },
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power4.in",
      });
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Determine which path to highlight (hovered or active)
    const targetPath = hoveredPath || pathname;
    const activeIndex = NAV_ITEMS.findIndex((item) => item.path === targetPath);

    if (activeIndex !== -1 && listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        setIndicatorStyle({
          left: activeItem.offsetLeft,
          width: activeItem.offsetWidth,
          opacity: 1,
        });
      }
    } else if (!hoveredPath) {
      // If no active path and not hovering, hide indicator
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [pathname, hoveredPath]);

  return (
    <>
      <nav
        ref={navRef}
        className={`w-full fixed top-0 left-0 z-[100] opacity-0 translate-y-[-100px] ${className}`}
      >
        {/* Blurred Background that fades in on scroll */}
        <div
          className={`absolute inset-0 transition-all duration-300 pointer-events-none ${scrolled ? "bg-bg-main/80 backdrop-blur-xl border-b border-border-subtle shadow-sm" : "bg-transparent border-b border-transparent"}`}
        />

        <div
          className={`w-full mx-auto px-6 md:px-16 flex items-center justify-between relative z-10 transition-all duration-300 ${scrolled ? "py-6" : "pt-8 pb-6"}`}
        >
          {/* Left Side: Logo */}
          <Link
            href="/"
            className="text-2xl font-black text-text-main hover:opacity-80 transition-opacity tracking-tightest"
          >
            SmartDrugFinder
          </Link>

          {/* Middle: Capsule Links */}
          <div className="hidden xl:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <ul
              ref={listRef}
              className="flex items-center gap-2 bg-slate-50 px-2 py-2 relative border border-[#e5e5e5] rounded-full"
              onMouseLeave={() => setHoveredPath(null)}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li
                    key={item.path}
                    onMouseEnter={() => setHoveredPath(item.path)}
                    className={`cursor-pointer transition-colors duration-300 px-5 py-2 text-sm font-bold tracking-wide relative z-10 ${isActive || hoveredPath === item.path ? "text-text-main" : "text-text-muted"}`}
                  >
                    <Link href={item.path}>{item.name}</Link>
                  </li>
                );
              })}
              {/* Sliding Background Indicator */}
              <div
                className="absolute h-[calc(100%-16px)] top-2 bg-white shadow-sm border border-[#e5e5e5] transition-all duration-300 ease-out z-0 rounded-full"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  opacity: indicatorStyle.opacity,
                }}
              />
            </ul>
          </div>

          {/* Right Side: Login & Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="hidden md:flex group items-center justify-center gap-2 bg-slate-50 border-2 border-black text-black px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            >
              SmartDrugFinder
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </Link>

            {/* Hamburger Menu Button */}
            <button
              className="xl:hidden flex flex-col justify-center items-center w-12 h-12 bg-white border-2 border-text-main rounded-full z-[101] relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span
                className={`block w-5 h-0.5 bg-text-main transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[2px]" : "-translate-y-1"}`}
              />
              <span
                className={`block w-5 h-0.5 bg-text-main transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`block w-5 h-0.5 bg-text-main transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[2px]" : "translate-y-1"}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 bg-bg-main z-[99] flex flex-col justify-center items-center translate-x-full"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle,#94a3b8_2px,transparent_2px)] bg-[size:40px_40px] opacity-30 pointer-events-none" />
        <ul className="flex flex-col gap-8 text-center relative z-10">
          {NAV_ITEMS.map((item) => (
            <li key={item.path} className="mobile-nav-item opacity-0">
              <Link
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-4xl font-black tracking-tight ${pathname === item.path ? "text-text-main" : "text-text-muted hover:text-text-main transition-colors"}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li className="mobile-nav-item opacity-0 mt-8">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 bg-text-main text-white px-8 py-4 rounded-full text-xl font-bold tracking-wide transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
            >
              SmartDrugFinder
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
