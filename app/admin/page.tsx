import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";
import EntryAnimation from "@/components/EntryAnimation";

async function login(formData: FormData) {
  "use server";
  const id = formData.get("id");
  const password = formData.get("password");

  if (id === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", {
      secure: true,
      httpOnly: true,
      path: "/",
    });
  }
  redirect("/admin");
}

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] text-text-main font-faktum flex items-center justify-center p-4 relative overflow-hidden">
        <EntryAnimation />
        {/* Subtle Background */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-[#FDFDFD]">
          <div className="absolute inset-0 bg-[radial-gradient(circle,#F1F5F9_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />
        </div>

        <form
          action={login}
          className="gsap-hero-element relative z-10 bg-surface border border-border-subtle p-10 md:p-12 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] max-w-md w-full flex flex-col gap-6"
        >
          <div className="flex flex-col items-center text-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-brand/5 flex items-center justify-center mb-4 border border-brand/10">
              <span className="text-3xl text-brand">🔒</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-text-muted font-medium text-sm mt-1">
              Authenticate to view analytics.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <input
              name="id"
              placeholder="Admin ID"
              className="px-4 py-3.5 border border-border-subtle rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand font-medium bg-[#FDFDFD] text-sm transition-all"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="px-4 py-3.5 border border-border-subtle rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand font-medium bg-[#FDFDFD] text-sm transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-brand hover:bg-brand-hover text-white py-3.5 mt-2 rounded-xl font-semibold tracking-wide transition-colors shadow-[0_4px_14px_0_rgba(198,40,40,0.2)]"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  // Dashboard Data Fetching
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  const profilesCollection = db.collection("platform-usage-analytics");
  const searchesCollection = db.collection("search-analytics");

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalUsers = await profilesCollection.countDocuments();
  const weeklySearches = await searchesCollection.countDocuments({
    timestamp: { $gte: oneWeekAgo },
  });
  const monthlySearches = await searchesCollection.countDocuments({
    timestamp: { $gte: oneMonthAgo },
  });

  // Top 3 Professions
  const professionStats = await profilesCollection
    .aggregate([
      { $group: { _id: "$profession", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ])
    .toArray();

  // Top Locations
  const locationStats = await profilesCollection
    .aggregate([
      { $match: { regionName: { $ne: "Unknown" } } },
      {
        $group: {
          _id: { state: "$regionName", country: "$country" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 4 },
    ])
    .toArray();

  const recentUsers = await profilesCollection
    .find()
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-text-main font-faktum p-6 relative overflow-hidden">
      <EntryAnimation />
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[#FDFDFD]">
        <div className="absolute inset-0 bg-[radial-gradient(circle,#F1F5F9_1.5px,transparent_1.5px)] bg-[size:40px_40px] opacity-80" />
      </div>

      <div className="max-w-[1400px] w-full mx-auto pt-6 relative z-10 flex flex-col xl:flex-row gap-8 xl:gap-10 h-auto xl:h-[calc(100vh-4rem)]">
        
        {/* Left Side: Metrics and Rankings */}
        <div className="w-full xl:w-1/3 flex flex-col gap-6 xl:overflow-y-auto pr-2 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="gsap-hero-element bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
              <h2 className="text-[10px] font-semibold text-text-muted mb-2 uppercase tracking-widest">Total Profiles</h2>
              <p className="text-3xl font-bold">{totalUsers}</p>
            </div>
            
            <div className="gsap-hero-element bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
              <h2 className="text-[10px] font-semibold text-text-muted mb-2 uppercase tracking-widest">Weekly Search</h2>
              <p className="text-3xl font-bold text-brand">{weeklySearches}</p>
            </div>

            <div className="gsap-hero-element bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.015)] col-span-2 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-semibold text-text-muted mb-1.5 uppercase tracking-widest">Monthly Search Volume</h2>
                <p className="text-4xl font-bold">{monthlySearches}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-[var(--color-cream-red)] text-brand flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
              </div>
            </div>
          </div>

          {/* Top Professions */}
          <div className="gsap-hero-element bg-surface border border-border-subtle p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.015)] shrink-0">
            <h2 className="text-sm font-bold mb-4 text-text-muted uppercase tracking-wider">Top Professions</h2>
            <div className="flex flex-col gap-3">
              {professionStats.map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <span className="font-semibold text-sm">{stat._id}</span>
                  <span className="bg-bg-main border border-border-subtle text-text-muted group-hover:text-text-main group-hover:border-text-muted/30 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors">{stat.count} Users</span>
                </div>
              ))}
              {professionStats.length === 0 && <span className="text-text-muted text-xs font-medium">No data yet.</span>}
            </div>
          </div>

          {/* Top Regions */}
          <div className="gsap-hero-element bg-surface border border-border-subtle p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.015)] shrink-0">
            <h2 className="text-sm font-bold mb-4 text-text-muted uppercase tracking-wider">Top Locations</h2>
            <div className="flex flex-col gap-3">
              {locationStats.slice(0,3).map((loc, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <span className="font-semibold text-sm">{loc._id.state}, <span className="text-text-muted font-medium text-[11px]">{loc._id.country}</span></span>
                  <span className="bg-bg-main border border-border-subtle text-text-muted group-hover:text-text-main group-hover:border-text-muted/30 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors">{loc.count} Hits</span>
                </div>
              ))}
              {locationStats.length === 0 && <span className="text-text-muted text-xs font-medium">No location data yet.</span>}
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity Table */}
        <div className="w-full xl:w-2/3 h-[600px] xl:h-full flex flex-col pb-12 xl:pb-0">
          <div className="gsap-hero-element bg-surface border border-border-subtle rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full">
            <div className="p-6 lg:px-8 lg:py-6 border-b border-border-subtle bg-bg-main shrink-0 flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Activity</h2>
              <span className="px-3 py-1 bg-[var(--color-cream-red)] text-brand text-[10px] font-bold uppercase tracking-wider rounded-md">Live Stream</span>
            </div>
            <div className="overflow-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              <table className="w-full text-left font-medium min-w-[700px] border-collapse">
                <thead className="sticky top-0 bg-surface z-10 shadow-[0_1px_0_0_var(--color-border-subtle)]">
                  <tr className="uppercase text-[10px] tracking-wider text-text-muted">
                    <th className="px-8 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Profession</th>
                    <th className="px-6 py-4 font-semibold">Purpose</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-8 py-4 font-semibold text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-sm">
                  {recentUsers.map((user, idx) => (
                    <tr key={idx} className="hover:bg-bg-main transition-colors">
                      <td className="px-8 py-4 whitespace-nowrap text-text-muted text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-semibold text-text-main">{user.profession}</td>
                      <td className="px-6 py-4 text-text-muted">{user.purpose}</td>
                      <td className="px-6 py-4 text-text-main">{user.city}, {user.region} <span className="text-xs text-text-muted ml-1">({user.countryCode})</span></td>
                      <td className="px-8 py-4 text-text-muted font-mono text-[11px] text-right">{user.ip}</td>
                    </tr>
                  ))}
                  {recentUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-text-muted text-sm">
                        No analytics data yet. Wait for users to interact with the platform.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
