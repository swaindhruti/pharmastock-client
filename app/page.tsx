"use client";

import MedicineSearch from "@/components/MedicineSearch";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-main text-text-main selection:bg-brand/20 selection:text-brand flex flex-col relative">
      <main className="w-full h-screen overflow-hidden flex flex-col relative z-10">
        <MedicineSearch />
      </main>
    </div>
  );
}
