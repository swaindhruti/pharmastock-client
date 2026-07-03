import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

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
  composition?: string;
  manufacturer?: string;
  form?: string;
}

async function getMedicine(idParam: string): Promise<Medicine | null> {
  const id = idParam.split('-')[0];
  if (!ObjectId.isValid(id)) return null;

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  const collection = db.collection('Pharmastock');

  const result = await collection.findOne({ _id: new ObjectId(id) });
  return result as unknown as Medicine;
}

async function getSubstituteLinks(names: string[]) {
  if (!names || names.length === 0) return [];
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  const result = await db.collection('Pharmastock').find(
    { name: { $in: names } },
    { projection: { _id: 1, name: 1 } }
  ).toArray();
  
  return result;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const medicine = await getMedicine(resolvedParams.id);

  if (!medicine) {
    return {
      title: 'Medicine Not Found - SmartDrugFinder',
    };
  }

  const title = `${medicine.name} - Uses, Side Effects, and Substitutes | SmartDrugFinder`;
  const description = `Learn about ${medicine.name}. Find its primary uses, chemical class (${medicine.chemicalClass || 'Unknown'}), side effects, and safe substitutes.`;
  const slug = `${medicine._id}-${medicine.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://smartdrugfinder.com/medicine/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function MedicinePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const medicine = await getMedicine(resolvedParams.id);

  if (!medicine) {
    notFound();
  }

  const substituteLinks = await getSubstituteLinks(medicine.substitutes || []);
  const substituteMap = new Map(
    substituteLinks.map((sub) => [sub.name.toLowerCase(), sub._id.toString()])
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Drug',
    name: medicine.name,
    activeIngredient: medicine.chemicalClass || '',
    clinicalPharmacology: medicine.actionClass || '',
    mechanismOfAction: medicine.therapeuticClass || '',
    isAvailableGenerically: true,
    warning: medicine.sideEffects?.length ? medicine.sideEffects[0] : 'Consult a doctor for side effects',
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col font-faktum relative bg-bg-main overflow-x-hidden text-text-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.05)] bg-bg-main pb-12">

        {/* Top Navbar */}
        <header className="w-full bg-surface border-b border-border-subtle sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-lg bg-bg-main border border-border-subtle text-text-main hover:bg-surface-hover transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <span className="font-semibold text-xs tracking-wide uppercase text-text-muted">Drug Profile</span>
          <div className="w-9 h-9"></div>
        </header>

        <main className="w-full px-4 pt-6 flex flex-col relative z-10">

          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight mb-2 text-text-main leading-tight capitalize">
              {medicine.name}
            </h1>
            {medicine.therapeuticClass && (
              <div className="inline-block bg-[var(--color-cream-red)] text-[var(--color-cream-red-text)] border border-[var(--color-cream-red-text)]/20 px-2.5 py-1 rounded-md font-medium uppercase text-[10px] tracking-wider">
                {medicine.therapeuticClass}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Primary Uses */}
            {medicine.uses && medicine.uses.length > 0 && (
              <section className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
                <h2 className="text-base font-bold text-text-main mb-3">Primary Uses</h2>
                <ul className="space-y-3">
                  {medicine.uses.map((use, idx) => (
                    <li key={idx} className="text-[15px] font-semibold text-text-main flex items-start gap-3">
                      <span className="text-brand mt-0.5">•</span>
                      <span className="leading-relaxed">{use}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Composition */}
            {medicine.composition && (
              <section className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
                <h2 className="text-xs font-bold text-brand uppercase tracking-widest mb-2">Composition</h2>
                <p className="text-[15px] font-bold text-text-main leading-relaxed capitalize">{medicine.composition}</p>
              </section>
            )}

            {/* Manufacturer & Form */}
            {(medicine.manufacturer || medicine.form) && (
              <section className="grid grid-cols-2 gap-3">
                {medicine.manufacturer && (
                  <div className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
                    <h2 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Manufacturer</h2>
                    <p className="text-[15px] font-bold text-text-main capitalize">{medicine.manufacturer}</p>
                  </div>
                )}
                {medicine.form && (
                  <div className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
                    <h2 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Form</h2>
                    <p className="text-[15px] font-bold text-text-main capitalize">{medicine.form}</p>
                  </div>
                )}
              </section>
            )}

            {/* Substitutes */}
            {medicine.substitutes && medicine.substitutes.length > 0 && (
              <section className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
                <h2 className="text-base font-bold text-text-main mb-4">Generic Substitutes</h2>
                <div className="flex flex-col gap-3">
                  {medicine.substitutes.map((sub, idx) => {
                    const linkedId = substituteMap.get(sub.toLowerCase());
                    const slug = linkedId ? `${linkedId}-${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : null;
                    
                    return slug ? (
                      <Link 
                        key={idx} 
                        href={`/medicine/${slug}`}
                        className="p-4 border-2 border-border-subtle hover:border-brand rounded-xl text-[15px] font-bold text-text-main bg-bg-main flex items-center justify-between group transition-all hover:shadow-[0_4px_12px_rgba(198,40,40,0.1)]"
                      >
                        <span className="capitalize">{sub}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-text-muted group-hover:text-brand transition-colors">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    ) : (
                      <div key={idx} className="p-4 border-2 border-border-subtle/50 rounded-xl text-[15px] font-bold text-text-muted bg-bg-main/50 flex items-center justify-between">
                        <span className="capitalize">{sub}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Side Effects */}
            {medicine.sideEffects && medicine.sideEffects.length > 0 && (
              <section className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
                <h2 className="text-sm font-bold text-text-main mb-3">Side Effects</h2>
                <div className="flex flex-wrap gap-2.5">
                  {medicine.sideEffects.map((effect, idx) => (
                    <div key={idx} className="px-3 py-1.5 bg-bg-main border-2 border-border-subtle rounded-lg text-xs font-bold text-text-muted">
                      {effect}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
