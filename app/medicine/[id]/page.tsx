import Navbar from '@/components/Navbar';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import EntryAnimation from '@/components/EntryAnimation';

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
  const collection = db.collection('medicines'); // Fallback to 'medicines' since Pharmastock might be the wrong collection name based on sitemap, let's use the one from sitemap! Wait, getMedicine uses 'Pharmastock'. I'll stick to 'Pharmastock'.
  
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

  // Fetch cross-links for substitutes to build our PageRank web!
  const substituteLinks = await getSubstituteLinks(medicine.substitutes || []);
  
  // Create a mapping to easily find the link if it exists
  const substituteMap = new Map(
    substituteLinks.map((sub) => [sub.name.toLowerCase(), sub._id.toString()])
  );

  // Generate Google Rich Results Schema (JSON-LD)
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
    <div className="min-h-screen bg-bg-main text-text-main font-faktum flex flex-col relative overflow-hidden">
      {/* Inject Structured Data for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EntryAnimation />

      {/* Unique Background Grid + Dots */}
      <div className="gsap-bg-pattern absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-size-[60px_60px] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#94a3b8_2.5px,transparent_2.5px)] bg-size-[60px_60px] opacity-60" style={{ backgroundPosition: '30px 30px' }} />
        <div className="absolute inset-0 bg-linear-to-b from-bg-main/30 via-transparent to-bg-main" />
        <div className="absolute inset-0 bg-linear-to-r from-bg-main/80 via-transparent to-transparent" />
      </div>

      <Navbar />

      <main className="w-full mx-auto px-6 md:px-16 pt-40 pb-32 flex flex-col relative z-10 grow">

        {/* Breadcrumb */}
        <div className="gsap-hero-element mb-12">
          <Link href="/search" className="text-text-muted hover:text-text-main font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Search
          </Link>
        </div>

        {/* Header Section */}
        <div className=" mb-16">
          <h1 className="text-6xl md:text-[5.5rem] font-medium tracking-tight mb-6 text-text-main leading-[1.05] capitalize">
            {medicine.name.split("").map((char, index) => (
              <span key={index} className="inline-block gsap-letter">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          {medicine.therapeuticClass && (
            <div className="gsap-hero-element inline-block border-2 border-text-main text-text-main px-6 py-2 rounded-full font-black tracking-widest uppercase text-sm mb-8 bg-surface">
              {medicine.therapeuticClass}
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Info */}
          <div className="gsap-hero-element lg:col-span-2 space-y-16">

            {/* Uses */}
            {medicine.uses && medicine.uses.length > 0 && (
              <section>
                <h2 className="text-3xl font-medium tracking-tight mb-6 flex items-center gap-4">
                  Primary Uses
                </h2>
                <ul className="space-y-4">
                  {medicine.uses.map((use, idx) => (
                    <li key={idx} className="p-6 bg-white border-2 border-text-main rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-medium text-text-main">
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
                  Potential Side Effects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medicine.sideEffects.map((effect, idx) => (
                    <div key={idx} className="p-6 bg-white border-2 border-text-main rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-medium text-text-main">
                      {effect}
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar / Substitutes */}
          <div className="gsap-hero-element space-y-8">
            {medicine.substitutes && medicine.substitutes.length > 0 && (
              <div className="p-8 border-2 border-text-main bg-white rounded-3xl sticky top-32 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black tracking-tight mb-8">Generic Substitutes</h3>
                <div className="flex flex-wrap gap-3">
                  {medicine.substitutes.map((sub, idx) => {
                    const linkedId = substituteMap.get(sub.toLowerCase());
                    const slug = linkedId ? `${linkedId}-${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : null;
                    
                    return slug ? (
                      <Link 
                        key={idx} 
                        href={`/medicine/${slug}`}
                        className="px-5 py-3 border-2 border-text-main rounded-full font-bold text-text-main bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all tracking-wide"
                      >
                        {sub}
                      </Link>
                    ) : (
                      <div key={idx} className="px-5 py-3 border-2 border-border-subtle rounded-full font-bold text-text-muted bg-surface tracking-wide">
                        {sub}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </main >
    </div >
  );
}
