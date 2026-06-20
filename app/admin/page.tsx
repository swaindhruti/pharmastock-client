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
      <div className="min-h-screen bg-bg-main text-text-main font-faktum flex items-center justify-center p-4 relative overflow-hidden">
        <EntryAnimation />
        {/* Unique Background Grid + Dots */}
        <div className="gsap-bg-pattern absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle,#94a3b8_2.5px,transparent_2.5px)] bg-[size:60px_60px] opacity-60"
            style={{ backgroundPosition: "30px 30px" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-main/30 via-transparent to-bg-main" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-main/80 via-transparent to-transparent" />
        </div>

        <form
          action={login}
          className="gsap-hero-element relative z-10 bg-white border-4 border-text-main p-8 md:p-12 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md w-full flex flex-col gap-6"
        >
          <h1 className="text-4xl font-black mb-4">Admin Login</h1>
          <p className="text-text-muted font-medium mb-4">
            Please log in to view platform analytics.
          </p>
          <input
            name="id"
            placeholder="Admin ID"
            className="p-4 border-2 border-text-main rounded-xl focus:outline-none focus:ring-2 font-medium bg-surface"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="p-4 border-2 border-text-main rounded-xl focus:outline-none focus:ring-2 font-medium bg-surface"
            required
          />
          <button
            type="submit"
            className="bg-text-main text-white py-4 mt-4 rounded-full font-bold tracking-wide border-2 border-text-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            Login
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

  const splitText = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className="inline-block gsap-letter">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-faktum p-6 relative overflow-hidden">
      <EntryAnimation />
      {/* Unique Background Grid + Dots */}
      <div className="gsap-bg-pattern absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle,#94a3b8_2.5px,transparent_2.5px)] bg-[size:60px_60px] opacity-60"
          style={{ backgroundPosition: "30px 30px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-main/30 via-transparent to-bg-main" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-main/80 via-transparent to-transparent" />
      </div>

      <div className="max-w-[1600px] w-full mx-auto pt-8 relative z-10 flex flex-col xl:flex-row gap-8 xl:gap-12 h-auto xl:h-[calc(100vh-4rem)]">
        
        {/* Left Side: Metrics and Rankings */}
        <div className="w-full xl:w-1/3 flex flex-col gap-6 xl:overflow-y-auto pr-2 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none shrink-0">
          <h1 className="text-5xl font-black mb-4 tracking-tight shrink-0">
            {splitText("Platform Analytics")}
          </h1>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="gsap-hero-element bg-white border-4 border-text-main p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              <h2 className="text-xs font-bold text-text-muted mb-1 uppercase tracking-widest">Total Profiles</h2>
              <p className="text-4xl font-black">{totalUsers}</p>
            </div>
            
            <div className="gsap-hero-element bg-white border-4 border-text-main p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              <h2 className="text-xs font-bold text-text-muted mb-1 uppercase tracking-widest">Weekly Search</h2>
              <p className="text-4xl font-black text-text-main">{weeklySearches}</p>
            </div>

            <div className="gsap-hero-element bg-white border-4 border-text-main p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all col-span-2">
              <h2 className="text-xs font-bold text-text-muted mb-1 uppercase tracking-widest">Monthly Search</h2>
              <p className="text-4xl font-black text-text-main">{monthlySearches}</p>
            </div>
          </div>

          {/* Top Professions */}
          <div className="gsap-hero-element bg-white border-4 border-text-main p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <h2 className="text-lg font-black mb-4 tracking-tight">Top Professions</h2>
            <div className="flex flex-col gap-3">
              {professionStats.map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center bg-surface border-2 border-border-subtle p-3 rounded-2xl">
                  <span className="font-bold text-base">{stat._id}</span>
                  <span className="bg-text-main text-white px-3 py-1 rounded-full text-xs font-black">{stat.count} Users</span>
                </div>
              ))}
              {professionStats.length === 0 && <span className="text-text-muted text-sm font-medium">No data yet.</span>}
            </div>
          </div>

          {/* Top Regions */}
          <div className="gsap-hero-element bg-white border-4 border-text-main p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <h2 className="text-lg font-black mb-4 tracking-tight">Top Locations</h2>
            <div className="flex flex-col gap-3">
              {locationStats.slice(0,3).map((loc, idx) => (
                <div key={idx} className="flex justify-between items-center bg-surface border-2 border-border-subtle p-3 rounded-2xl">
                  <span className="font-bold text-base">{loc._id.state}, <span className="text-text-muted font-medium text-xs">{loc._id.country}</span></span>
                  <span className="bg-text-main text-white px-3 py-1 rounded-full text-xs font-black">{loc.count} Hits</span>
                </div>
              ))}
              {locationStats.length === 0 && <span className="text-text-muted text-sm font-medium">No location data yet.</span>}
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity Table */}
        <div className="w-full xl:w-2/3 h-[600px] xl:h-full flex flex-col pb-12 xl:pb-0">
          <div className="gsap-hero-element bg-white border-4 border-text-main rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-full">
            <div className="p-6 lg:p-8 border-b-4 border-text-main bg-slate-50 shrink-0">
              <h2 className="text-2xl font-black">Recent Activity</h2>
            </div>
            <div className="overflow-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              <table className="w-full text-left font-medium min-w-[600px]">
                <thead className="sticky top-0 bg-surface border-b-2 border-border-subtle z-10">
                  <tr className="uppercase text-xs tracking-widest text-text-muted">
                    <th className="p-6">Date</th>
                    <th className="p-6">Profession</th>
                    <th className="p-6">Purpose</th>
                    <th className="p-6">Location</th>
                    <th className="p-6">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, idx) => (
                    <tr key={idx} className="border-b-2 border-border-subtle hover:bg-surface-hover transition-colors">
                      <td className="p-6 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-6 font-bold">{user.profession}</td>
                      <td className="p-6">{user.purpose}</td>
                      <td className="p-6">{user.city}, {user.region} ({user.countryCode})</td>
                      <td className="p-6 text-text-muted font-mono text-sm">{user.ip}</td>
                    </tr>
                  ))}
                  {recentUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-text-muted">
                        No analytics data yet. Wait for users to fill the form.
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
