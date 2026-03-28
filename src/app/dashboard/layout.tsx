"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { 
  Calendar, 
  PlusCircle, 
  MailWarning, 
  Star, 
  Settings,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = [
    { name: "My Events", href: "/dashboard", icon: Calendar },
    { name: "Create Event", href: "/dashboard/create", icon: PlusCircle },
    { name: "Invitations", href: "/dashboard/invitations", icon: MailWarning },
    { name: "My Reviews", href: "/dashboard/reviews", icon: Star },
    { name: "Payment History", href: "/dashboard/pay-history", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  if (user?.role === "ADMIN") {
      navigation.push({ name: "Admin Panel", href: "/admin", icon: ShieldCheck })
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="glass-card rounded-2xl border border-slate-700 p-4 sticky top-24">
              <div className="flex items-center gap-3 mb-6 p-2">
                 <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-600">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-slate-300">{user?.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                      <h3 className="text-white font-bold">{user?.name}</h3>
                      <p className="text-xs text-slate-400">{user?.role === "ADMIN" ? "Administrator" : "Event Organizer"}</p>
                  </div>
              </div>
              
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <item.icon
                        className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                          isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
