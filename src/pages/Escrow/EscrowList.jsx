import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Filter, Plus, ChevronRight, Clock, CheckCircle2, AlertCircle, PackageCheck, UserCheck, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import api from '../../services/api';
import Button from '../../components/UI/Button/Button';
import { Card, CardContent } from '../../components/UI/Card/Card';
import Input from '../../components/UI/Input/Input';
import { useAuth } from '../../context/AuthContext';

const EscrowList = () => {
  const { user } = useAuth();
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const getTabFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'purchases';
  };

  const [activeTab, setActiveTab ] = useState(getTabFromURL());
  const [isProcessing, setIsProcessing] = useState(false);

  // Listen for changes in the URL so Dashboard links correctly switch tabs
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
        setActiveTab(tab);
    }
  }, [location.search]);

  const fetchEscrows = async () => {
    try {
      const { data } = await api.get('/payment/transactions');
      setEscrows(data.data);
      // Auto-switch to sales if they have sales but no purchases and didn't specify tab
      const currentTab = new URLSearchParams(location.search).get('tab');
      if (!currentTab) {
          const hasSales = data.data.some(tx => tx.sellerId?._id?.toString() === user?._id?.toString());
          const hasPurchases = data.data.some(tx => tx.buyerId?._id?.toString() === user?._id?.toString());
          if (hasSales && !hasPurchases) setActiveTab('sales');
      }
    } catch (err) {
      console.error('Error fetching escrows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrows();
  }, [user?._id]);

  const handleAction = async (id, action) => {
    setIsProcessing(true);
    try {
      await api.post(`/transaction/${action}/${id}`, {});
      alert(`Transaction ${action === 'confirm' ? 'confirmed' : action === 'dispute' ? 'disputed' : 'marked as shipped'} successfully!`);
      fetchEscrows();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} transaction.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-blue-50 text-blue-700 ring-blue-100';
      case 'delivered': return 'bg-amber-50 text-amber-700 ring-amber-100';
      case 'completed': return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
      case 'disputed': return 'bg-red-50 text-red-700 ring-red-100';
      default: return 'bg-slate-50 text-slate-700 ring-slate-100';
    }
  };

  const filteredEscrows = escrows.filter(item => {
    const userIdStr = user?._id?.toString();
    if (activeTab === 'purchases') return (item.buyerId?._id || item.buyerId)?.toString() === userIdStr;
    if (activeTab === 'sales') return (item.sellerId?._id || item.sellerId)?.toString() === userIdStr;
    return false;
  });

  if (loading) return <div className="p-8 text-center font-bold text-primary italic">Loading your deals...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Secure Deals</h1>
          <p className="text-muted leading-relaxed">Track your active purchases and business sales.</p>
        </div>
        {user?.role === 'seller' && (
          <Link to="/dashboard">
            <Button className="gap-2 shadow-lg hover:shadow-primary/20 h-11">
              <Plus size={18} /> New Link
            </Button>
          </Link>
        )}
      </div>

      {/* Role Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('purchases')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-bold transition-all",
            activeTab === 'purchases' ? "bg-white text-primary shadow-sm" : "text-muted hover:text-slate-900"
          )}
        >
          My Purchases
        </button>
        {user?.role === 'seller' && (
          <button 
            onClick={() => setActiveTab('sales')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'sales' ? "bg-white text-primary shadow-sm" : "text-muted hover:text-slate-900"
            )}
          >
            Orders Received
          </button>
        )}
      </div>

      {filteredEscrows.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredEscrows.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="hover:shadow-md transition-all group border-none shadow-premium overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl shadow-xs ring-1 ring-inset transition-all",
                        item.status === 'completed' ? "bg-emerald-50 text-emerald-600 ring-emerald-100" :
                        item.status === 'delivered' ? "bg-amber-50 text-amber-600 ring-amber-100" : "bg-primary/5 text-primary ring-primary/10"
                      )}>
                          {item.status === 'completed' ? <CheckCircle2 size={32} /> : 
                           item.status === 'delivered' ? <PackageCheck size={32} /> : 
                           item.status === 'paid' ? <Clock size={32} /> : <ShieldCheck size={32} />}
                      </div>
                      <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-primary transition-colors">{item.paymentLinkId?.title || 'Escrow Payment'}</h3>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 rounded-full py-0.5 border border-slate-100 leading-none">
                                {activeTab === 'sales' ? 'Seller' : 'Buyer'}
                             </span>
                          </div>
                          <p className="text-sm text-muted font-medium italic">Ref: {item.paymentReference.slice(0, 8)}...</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:text-right gap-6">
                       <div className="space-y-1">
                          <p className="text-lg font-extrabold text-slate-900 leading-none">₦{item.amount.toLocaleString()}</p>
                          <span className={cn(
                            "inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ring-1 ring-inset shadow-xs",
                            getStatusColor(item.status)
                          )}>
                            {item.status === 'delivered' ? 'IN TRANSIT' : item.status}
                          </span>
                       </div>
                       <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-muted transition-all shadow-xs">
                          <ChevronRight size={20} />
                       </div>
                    </div>
                  </div>

                  {/* Visual Timeline */}
                  <div className="px-6 py-8 bg-white border-t border-slate-50">
                    <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-0"></div>
                        <div className={cn("absolute top-1/2 left-0 h-0.5 -translate-y-1/2 -z-0 transition-all duration-700", 
                            item.status === 'disputed' ? 'w-full bg-red-500' : 
                            (item.status === 'paid' ? 'w-0' : 
                             item.status === 'delivered' ? 'w-2/3' : 
                             item.status === 'completed' ? 'w-full' : 'w-0') + " bg-primary")}></div>
                        
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className={cn("h-8 w-8 rounded-full border-2 flex items-center justify-center bg-white transition-colors", 
                                ["paid", "delivered", "completed", "disputed"].includes(item.status) ? "border-primary text-primary" : "border-slate-200 text-slate-300")}>
                                <CreditCard size={14} />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-400">Paid</span>
                        </div>
                        
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className={cn("h-8 w-8 rounded-full border-2 flex items-center justify-center bg-white transition-colors", 
                                ["delivered", "completed", "disputed"].includes(item.status) ? "border-primary text-primary" : "border-slate-200 text-slate-300")}>
                                <PackageCheck size={14} />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-400">In Transit</span>
                        </div>

                        {item.status === 'disputed' ? (
                             <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className="h-8 w-8 rounded-full border-2 flex items-center justify-center bg-white border-red-500 text-red-500 animate-pulse">
                                    <AlertCircle size={14} />
                                </div>
                                <span className="text-[10px] font-bold uppercase text-red-500">Disputed</span>
                            </div>
                        ) : (
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className={cn("h-8 w-8 rounded-full border-2 flex items-center justify-center bg-white transition-colors", 
                                    item.status === 'completed' ? "border-primary text-primary" : "border-slate-200 text-slate-300")}>
                                    <CheckCircle2 size={14} />
                                </div>
                                <span className="text-[10px] font-bold uppercase text-slate-400">Completed</span>
                            </div>
                        )}
                    </div>
                  </div>

                  {/* Contextual Action Bar */}
                  {( (activeTab === 'sales' && item.status === 'paid') || 
                     (activeTab === 'purchases' && item.status === 'delivered') ) && (
                    <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 border-dashed">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider">
                         <div className="h-2 w-2 rounded-full bg-primary animate-ping"></div>
                         Action Required
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        {activeTab === 'sales' && item.status === 'paid' && (
                          <Button 
                            disabled={isProcessing}
                            onClick={() => handleAction(item._id, 'deliver')}
                            className="w-full sm:w-auto gap-2 h-10 shadow-lg hover:shadow-primary/20"
                          >
                            <PackageCheck size={18} /> Mark as Shipped
                          </Button>
                        )}
                        {activeTab === 'purchases' && item.status === 'delivered' && (
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button 
                              disabled={isProcessing}
                              onClick={() => handleAction(item._id, 'confirm')}
                              className="flex-1 sm:flex-none gap-2 h-10 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 font-bold px-6"
                            >
                              <UserCheck size={18} /> Confirm Receipt
                            </Button>
                            <Button 
                              variant="outline"
                              disabled={isProcessing}
                              onClick={() => handleAction(item._id, 'dispute')}
                              className="flex-1 sm:flex-none gap-2 h-10 text-red-600 border-red-100 hover:bg-red-50 font-bold px-6"
                            >
                              <AlertCircle size={18} /> Raise Dispute
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-white space-y-4">
           <AlertCircle size={48} className="text-slate-200 mx-auto" />
           <p className="text-muted font-medium italic">
             {activeTab === 'purchases' ? "You haven't bought anything yet." : "You haven't sold anything yet."}
           </p>
        </div>
      )}
    </div>
  );
};

// Helper function for class names
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default EscrowList;
