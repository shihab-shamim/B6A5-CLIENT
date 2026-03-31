"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";
import { 
  CreditCard,
  MapPin, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function PaymentHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const { data } = await api.get("/events/my-payments");
      setHistory(data);
    } catch (error) {
      console.error("Failed to load payment history", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center flex-col items-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-400">Loading payment records...</p>
      </div>
    );
  }

  
  const totalSpent = history.reduce((sum, record) => sum + (record.paidAmount || 0), 0);
  const paidCount = history.filter(h => h.paidAmount > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Payment History</h1>
        <p className="text-sm text-slate-400">View your transaction history and payment statuses.</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="glass-card p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
               <CreditCard className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
               <p className="text-sm text-slate-400">Total Payments</p>
               <h3 className="text-2xl font-bold text-white">{paidCount} <span className="text-sm font-normal text-slate-500">transactions</span></h3>
            </div>
         </div>
         <div className="glass-card p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
               <span className="text-xl font-bold text-green-400">$</span>
            </div>
            <div>
               <p className="text-sm text-slate-400">Total Amount Spent</p>
               <h3 className="text-2xl font-bold text-white">${totalSpent.toFixed(2)}</h3>
            </div>
         </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-700 p-6 min-h-[400px]">
        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 border border-slate-700 mb-6">
              <CreditCard className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Payment History</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-8">
              You haven't made any payments or registered for any events yet.
            </p>
            <Link 
              href="/events" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg mb-4 border-b border-slate-700 pb-2">Recent Transactions</h3>
            {history.map((record) => (
              <div key={record.id} className="glass-card p-5 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-slate-500 transition-colors">
                
                
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  record.status === 'APPROVED' ? 'bg-green-500' : 
                  record.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />

                <div className="flex-1 pl-2">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-lg font-bold text-white">
                        <Link href={`/events/${record.eventId}`} className="hover:text-blue-400 transition-colors">
                           {record.event.title}
                        </Link>
                     </h3>
                     <div className="text-right">
                        <span className="text-lg font-bold text-white block">
                           {record.paidAmount > 0 ? `$${record.paidAmount.toFixed(2)}` : "Free"}
                        </span>
                        <span className="text-xs text-slate-500">{format(new Date(record.createdAt), "MMM d, yyyy")}</span>
                     </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                     <div className="flex items-center gap-2 text-sm text-slate-400">
                       <MapPin className="w-4 h-4" />
                       {record.paymentId ? `Transaction ID: ${record.paymentId.substring(0, 14)}...` : 'No Transaction ID'}
                     </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                  
                  <div className="flex items-center gap-2 mb-4">
                    {record.status === 'APPROVED' ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> SUCCESS
                      </span>
                    ) : record.status === 'PENDING' ? (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> PROCESSING
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> FAILED
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    href={`/events/${record.eventId}`}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    View Event <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
