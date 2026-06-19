'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export default function EntryAnimation() {
  useGSAP(() => {
    // Animate letters
    gsap.fromTo('.gsap-letter',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.02, ease: 'power3.out', delay: 0.2 }
    );

    // Fade up the content inside the hero
    gsap.fromTo('.gsap-hero-element',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.6 }
    );

    // Fade in the background pattern
    gsap.fromTo('.gsap-bg-pattern',
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: 'power2.out', delay: 0.2 }
    );
  });

  return null;
}
