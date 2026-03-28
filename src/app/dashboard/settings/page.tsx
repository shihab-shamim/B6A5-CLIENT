"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { User, Mail, ShieldAlert, Image as ImageIcon, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, login, token } = useAuth();
  
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error("Name cannot be empty");
    }

    setIsSaving(true);
    try {
      const { data } = await api.put("/auth/profile", { name, avatar });
      // The backend returns the updated user object AND a new token
      login(data, data.token || token as string);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-sm text-slate-400">Update your profile information.</p>
      </div>

      <div className="glass-card rounded-2xl border border-slate-700 p-8 space-y-8">
        
        <div className="flex items-center gap-6 pb-8 border-b border-slate-700">
           <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-slate-600 relative group flex-shrink-0">
              {avatar || user?.avatar ? (
                <img src={avatar || user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-slate-300">{user?.name.charAt(0) || "U"}</span>
              )}
           </div>
           <div>
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
              <div className="flex items-center gap-2">
                 <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${user?.role === 'ADMIN' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                   {user?.role} ACCOUNT
                 </span>
              </div>
           </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
           <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                placeholder="Your full name"
                required
              />
           </div>

           <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Profile Avatar URL (Optional)
              </label>
              <input 
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                placeholder="https://example.com/my-photo.jpg"
              />
           </div>
           
           <div className="space-y-1 opacity-60">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input 
                type="text"
                value={user?.email || ""}
                disabled
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Email address cannot be changed.</p>
           </div>

           <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                 {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 {isSaving ? "Saving..." : "Save Changes"}
              </button>
           </div>
        </form>

      </div>
    </div>
  );
}
