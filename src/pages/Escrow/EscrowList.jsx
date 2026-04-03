import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Filter, Plus, ChevronRight, Clock, CheckCircle2, AlertCircle, PackageCheck, UserCheck } from 'lucide-react';
import { Link } from 'react-router';
import api from '../../services/api';
import Button from '../../components/UI/Button/Button';
import { Card, CardContent } from '../../components/UI/Card/Card';
import Input from '../../components/UI/Input/Input';
import { useAuth } from '../../context/AuthContext';

const EscrowList = () => {
  const { user } = useAuth();
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchEscrows = async () => {
    try {
      const { data } = await api.get('/payment/transactions');
      setEscrows(data.data);
    } catch (err) {
      console.error('Error fetching escrows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrows();
  }, []);

  const handleAction = async (id, action) => {
    setIsProcessing(true);
    try {
      await api.post(`/transaction/${action}/${id}`, {});
      alert(`Transaction ${action}ed successfully!`);
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

  if (loading) return <div className="p-8 text-center font-bold text-primary italic">Loading your deals...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">My Escrows</h1>
          <p className="text-muted leading-relaxed">Securely track and manage your active deals.</p>
        </div>
        <Link to="/dashboard">
          <Button className="gap-2 shadow-lg hover:shadow-primary/20 h-11">
            <Plus size={18} /> New Link
          </Button>
        </Link>
      </div>

      {escrows.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {escrows.map((item, idx) => (
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
                                {item.sellerId._id === user._id ? 'Seller' : 'Buyer'}
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
                            {item.status}
                          </span>
                       </div>
                       <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-muted transition-all shadow-xs">
                          <ChevronRight size={20} />
                       </div>
                    </div>
                  </div>

                  {/* Contextual Action Bar */}
                  {( (item.sellerId._id === user._id && item.status === 'paid') || 
                     (item.buyerId._id === user._id && item.status === 'delivered') ) && (
                    <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 border-dashed">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider">
                         <div className="h-2 w-2 rounded-full bg-primary animate-ping"></div>
                         Action Required
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        {item.sellerId._id === user._id && item.status === 'paid' && (
                          <Button 
                            disabled={isProcessing}
                            onClick={() => handleAction(item._id, 'deliver')}
                            className="w-full sm:w-auto gap-2 h-10 shadow-lg hover:shadow-primary/20"
                          >
                            <PackageCheck size={18} /> Mark as Delivered
                          </Button>
                        )}
                        {item.buyerId._id === user._id && item.status === 'delivered' && (
                          <Button 
                            disabled={isProcessing}
                            onClick={() => handleAction(item._id, 'confirm')}
                            className="w-full sm:w-auto gap-2 h-10 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                          >
                            <UserCheck size={18} /> Confirm Receipt & Release
                          </Button>
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
           <p className="text-muted font-medium italic">You haven't initiated any secure escrow deals yet.</p>
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
