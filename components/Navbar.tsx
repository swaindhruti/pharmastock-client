'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  useEffect(() => {
    // Determine which path to highlight (hovered or active)
    const targetPath = hoveredPath || pathname;
    const activeIndex = NAV_ITEMS.findIndex(item => item.path === targetPath);

    if (activeIndex !== -1 && listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        setIndicatorStyle({
          left: activeItem.offsetLeft,
          width: activeItem.offsetWidth,
          opacity: 1
        });
      }
    } else if (!hoveredPath) {
      // If no active path and not hovering, hide indicator
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [pathname, hoveredPath]);

  return (
    <nav ref={navRef} className={`w-full fixed top-0 left-0 z-[100] transition-all bg-bg-main/90 backdrop-blur-md pt-8 pb-6 ${className}`}>
      <div className="w-full mx-auto px-6 md:px-16 flex items-center justify-between">

        {/* Left Side: Logo */}
        <Link href="/" className="text-2xl font-black text-text-main hover:opacity-80 transition-opacity tracking-tight">
          PharmaStock
        </Link>

        {/* Middle: Capsule Links */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
          <ul ref={listRef} className="flex items-center gap-2 bg-[#f5f5f5] px-2 py-2 relative border border-[#e5e5e5] rounded-full" onMouseLeave={() => setHoveredPath(null)}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li
                  key={item.path}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  className={`cursor-pointer transition-colors duration-300 px-5 py-2 text-sm font-bold tracking-wide relative z-10 ${isActive || hoveredPath === item.path ? 'text-text-main' : 'text-text-muted'}`}
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

        {/* Right Side: Login */}
        <div className="flex items-center">
          <Link href="/app" className="group flex items-center justify-center gap-2 bg-text-main text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
            Sign Up / In
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </Link>
        </div>

      </div>
    </nav>
  );
}
