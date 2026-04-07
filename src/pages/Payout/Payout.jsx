import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, ArrowLeft, History, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import api from '../../services/api';
import Button from '../../components/UI/Button/Button';
import { Card, CardContent } from '../../components/UI/Card/Card';
import Input from '../../components/UI/Input/Input';

const Payout = () => {
    const [wallet, setWallet] = useState({ escrowBalance: 0, availableBalance: 0 });
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        bankName: '',
        accountNumber: '',
        accountName: ''
    });

    const fetchData = async () => {
        try {
            const [walletRes, payoutsRes] = await Promise.all([
                api.get('/payment/wallet'),
                api.get('/payout/history')
            ]);
            setWallet(walletRes.data.data);
            setPayouts(payoutsRes.data.data);
        } catch (err) {
            console.error('Error fetching payout data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePayout = async (e) => {
        e.preventDefault();
        if (parseFloat(formData.amount) > wallet.availableBalance) {
            alert('Insufficient available balance');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/payout/request', formData);
            alert('Payout request submitted successfully!');
            setFormData({ amount: '', bankName: '', accountNumber: '', accountName: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit payout request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center font-bold text-primary italic">Loading financial data...</div>;

    return (
        <div className="space-y-8 pb-10 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/dashboard">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
                        <ArrowLeft size={20} />
                    </div>
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Withdraw Funds</h1>
                    <p className="text-muted font-medium">Move your cleared funds to your bank account.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Withdrawal Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-premium overflow-hidden">
                        <div className="bg-primary p-6 text-white">
                            <div className="flex items-center justify-between">
                                 <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Available to Withdraw</p>
                                 <Landmark size={24} className="opacity-40" />
                            </div>
                            <h2 className="text-4xl font-extrabold mt-1">₦{wallet.availableBalance.toLocaleString()}</h2>
                        </div>
                        <CardContent className="p-8">
                            <form onSubmit={handlePayout} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <Input 
                                        label="Amount to Withdraw" 
                                        type="number" 
                                        placeholder="Min ₦1,000" 
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    />
                                    <Input 
                                        label="Bank Name" 
                                        placeholder="e.g. Kuda, GTBank..." 
                                        required
                                        value={formData.bankName}
                                        onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <Input 
                                        label="Account Number" 
                                        placeholder="10 Digits" 
                                        required
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                                    />
                                    <Input 
                                        label="Account Name" 
                                        placeholder="Full Name as on Bank" 
                                        required
                                        value={formData.accountName}
                                        onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                                    />
                                </div>
                                <div className="pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={submitting || wallet.availableBalance <= 0} 
                                        className="w-full h-12 shadow-lg hover:shadow-primary/20 gap-2 font-bold"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" /> : 'Process Withdrawal'}
                                    </Button>
                                    <p className="text-[10px] text-center text-muted mt-3 italic font-medium">Standard processing time: 24 - 48 business hours.</p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* History */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                            <History size={18} />
                            <h3>Withdrawal History</h3>
                        </div>
                        
                        {payouts.length > 0 ? (
                            <div className="space-y-3">
                                {payouts.map((payout) => (
                                    <Card key={payout._id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center",
                                                    payout.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                )}>
                                                    {payout.status === 'completed' ? <CheckCircle2 size={20} /> : <div className="h-2 w-2 rounded-full bg-current animate-pulse" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">₦{payout.amount.toLocaleString()}</p>
                                                    <p className="text-[10px] text-muted font-medium uppercase">{payout.bankName} • {payout.accountNumber}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                                                    payout.status === 'completed' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                                )}>
                                                    {payout.status}
                                                </span>
                                                <p className="text-[10px] text-slate-400 mt-1 font-mono">{new Date(payout.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white bg-opacity-50">
                                <Landmark size={40} className="mx-auto text-slate-200 mb-3" />
                                <p className="text-muted font-medium italic">No withdrawal history yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-none bg-slate-900 text-white shadow-premium">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <ShieldCheck size={18} className="text-primary" />
                                <h3>Safe Withdrawal</h3>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                We use bank-grade security to process all payouts. Your funds are only released to verified bank accounts.
                            </p>
                            <div className="h-px bg-slate-800" />
                            <div className="flex items-start gap-3">
                                <AlertCircle size={16} className="text-amber-400 mt-0.5" />
                                <p className="text-[10px] text-slate-400">
                                    Ensure your bank details are correct to avoid delays or loss of funds.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Payout Limits</h4>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted">Minimum</span>
                            <span className="font-bold text-slate-900">₦1,000</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted">Maximum (Daily)</span>
                            <span className="font-bold text-slate-900">₦500,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function for class names
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Payout;
