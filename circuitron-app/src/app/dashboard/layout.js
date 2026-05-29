import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardLayout({ children }) {
  const user = useQuery(api.users.current);

  // Protect the route
  if (!convexAuthNextjsToken()) {
    redirect("/");
  }
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row text-white">
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-400">Circuitron</h1>
          <nav className="mt-8 space-y-2">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
              <LayoutDashboard size={18} /> Dashboard
            </a>
            <a href="/dashboard/days" className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Bootcamp Roadmap
            </a>
            {user?.role === "admin" && (
              <div className="pt-6 mt-6 border-t border-white/10">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 px-3">Management</p>
                <a href="/admin" className="flex items-center gap-3 px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors">
                  <LayoutDashboard size={18} /> Admin Portal
                </a>
              </div>
            )}
          </nav>
        </div>
        <LogoutButton />
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
