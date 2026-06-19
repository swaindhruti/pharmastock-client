import Navbar from '@/components/Navbar';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Medicine {
  _id: ObjectId;
  name: string;
  therapeuticClass: string;
  substitutes: string[];
  sideEffects: string[];
  uses: string[];
  chemicalClass?: string;
  actionClass?: string;
  habitForming?: string;
}

async function getMedicine(id: string): Promise<Medicine | null> {
  if (!ObjectId.isValid(id)) return null;
  
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  const collection = db.collection('Pharmastock');
  
  const result = await collection.findOne({ _id: new ObjectId(id) });
  return result as unknown as Medicine;
}

export default async function MedicinePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const medicine = await getMedicine(resolvedParams.id);

  if (!medicine) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-faktum selection:bg-brand/20 selection:text-brand flex flex-col relative overflow-hidden">
      
      {/* Decorative SVG curves */}
      <div className="absolute top-0 right-0 w-full h-[800px] pointer-events-none z-0 opacity-20">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full stroke-brand fill-none" strokeWidth="1">
           <path d="M 0,200 C 300,0 600,400 1000,100" />
           <path d="M 0,600 C 400,800 800,200 1000,500" />
        </svg>
      </div>

      <Navbar />

      <main className="w-full max-w-[1400px] mx-auto px-6 md:px-16 pt-40 pb-32 flex flex-col relative z-10 flex-grow">
        
        {/* Breadcrumb */}
        <div className="mb-12">
          <Link href="/search" className="text-text-muted hover:text-brand font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Search
          </Link>
        </div>

        {/* Header Section */}
        <div className="max-w-4xl mb-16">
          <h1 className="text-6xl md:text-[5.5rem] font-medium tracking-tight mb-6 text-text-main leading-[1.05] capitalize">
            {medicine.name}
          </h1>
          {medicine.therapeuticClass && (
            <div className="inline-block border-2 border-brand text-brand px-6 py-2 rounded-full font-black tracking-widest uppercase text-sm mb-8 bg-brand/5">
              {medicine.therapeuticClass}
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Uses */}
            {medicine.uses && medicine.uses.length > 0 && (
              <section>
                <h2 className="text-3xl font-medium tracking-tight mb-6 flex items-center gap-4">
                  <span className="w-8 h-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Primary Uses
                </h2>
                <ul className="space-y-4">
                  {medicine.uses.map((use, idx) => (
                    <li key={idx} className="p-6 bg-surface border border-border-subtle rounded-xl shadow-sm text-lg font-medium text-text-muted">
                      {use}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Side Effects */}
            {medicine.sideEffects && medicine.sideEffects.length > 0 && (
              <section>
                <h2 className="text-3xl font-medium tracking-tight mb-6 flex items-center gap-4">
                  <span className="w-8 h-8 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Potential Side Effects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medicine.sideEffects.map((effect, idx) => (
                    <div key={idx} className="p-4 bg-surface border border-border-subtle rounded-xl shadow-sm font-medium text-text-muted">
                      {effect}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Substitutes */}
            {medicine.substitutes && medicine.substitutes.length > 0 && (
              <section>
                <h2 className="text-3xl font-medium tracking-tight mb-6">Generic Substitutes</h2>
                <div className="flex flex-wrap gap-3">
                  {medicine.substitutes.map((sub, idx) => (
                    <div key={idx} className="px-5 py-3 bg-surface-hover border border-border-subtle rounded-xl font-bold text-text-main shadow-sm">
                      {sub}
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar / Meta info */}
          <div className="space-y-8">
            <div className="p-8 bg-surface border-2 border-border-subtle rounded-2xl sticky top-32 shadow-sm">
              <h3 className="text-xl font-black tracking-tight mb-8">Clinical Details</h3>
              
              <div className="space-y-6">
                {medicine.chemicalClass && (
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Chemical Class</p>
                    <p className="font-medium text-lg">{medicine.chemicalClass}</p>
                  </div>
                )}
                {medicine.actionClass && (
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Action Class</p>
                    <p className="font-medium text-lg">{medicine.actionClass}</p>
                  </div>
                )}
                {medicine.habitForming && (
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Habit Forming</p>
                    <p className="font-medium text-lg capitalize">{medicine.habitForming}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border-subtle bg-surface px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between text-xs font-bold text-text-main gap-4 relative z-10 mt-auto">
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
