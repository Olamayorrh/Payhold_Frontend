import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Wallet as WalletIcon, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  Copy,
  ExternalLink,
  Package,
  ShoppingBag,
  CreditCard,
  Clock
} from 'lucide-react';
import { Link } from 'react-router';
import api from '../../services/api';
import Button from '../../components/UI/Button/Button';
import { Card, CardContent } from '../../components/UI/Card/Card';
import Input from '../../components/UI/Input/Input';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user, refreshUser } = useAuth();
    const [links, setLinks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [wallet, setWallet] = useState({ escrowBalance: 0, availableBalance: 0 });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newLink, setNewLink] = useState({ title: '', amount: '', description: '', feePaidBy: 'buyer', businessName: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Sync business name from user profile when user data is available
    useEffect(() => {
        if (user?.businessName) {
            setNewLink(prev => ({ ...prev, businessName: user.businessName }));
        }
    }, [user]);

    // Handle opening the modal
    const openCreateModal = () => {
        setNewLink(prev => ({ 
            ...prev, 
            businessName: user?.businessName || '',
            title: '',
            amount: '',
            description: '',
            feePaidBy: 'buyer'
        }));
        setIsCreateModalOpen(true);
    };
    
    // Determine if the user is a buyer
    const isBuyer = user?.role === 'buyer';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Wallet
                const walletRes = await api.get('/payment/wallet');
                setWallet(walletRes.data.data);

                // Fetch Transactions (for both roles to see activity)
                const txRes = await api.get('/payment/transactions');
                setTransactions(txRes.data.data);

                if (!isBuyer) {
                    const res = await api.get('/link/my-links');
                    setLinks(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching dashboard data');
            }
        };
        if (user) {
            fetchData();
        }
    }, [isBuyer, user]);

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this transaction?`)) return;
        setIsLoading(true);
        try {
            const endpoint = 
                action === 'confirm' ? `/transaction/confirm/${id}` : 
                action === 'dispute' ? `/transaction/dispute/${id}` : 
                `/transaction/deliver/${id}`;
            await api.post(endpoint);
            alert(`Transaction ${action === 'confirm' ? 'confirmed' : action === 'dispute' ? 'disputed' : 'marked as delivered'} successfully!`);
            
            // Refresh data
            const res = await api.get('/payment/transactions');
            setTransactions(res.data.data);
            const walletRes = await api.get('/payment/wallet');
            setWallet(walletRes.data.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateLink = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // If business name was provided/updated, also update user profile
            if (newLink.businessName && newLink.businessName !== user.businessName) {
                await api.put('/auth/profile', { businessName: newLink.businessName });
                await refreshUser(); // Re-fetch user to update local state
            }
            
            const { data } = await api.post('/link/create', newLink);
            setLinks([data.data, ...links]);
            setIsCreateModalOpen(false);
            setNewLink(prev => ({ 
                ...prev, 
                title: '', 
                amount: '', 
                description: '', 
                feePaidBy: 'buyer', 
                businessName: user?.businessName || prev.businessName 
            }));
        } catch (err) {
            console.error('Create link error:', err);
            alert(err.response?.data?.message || 'Failed to create link');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (code) => {
        const url = `${window.location.origin}/p/${code}`;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {isBuyer ? 'Buyer Dashboard' : 'Seller Dashboard'}
                    </h1>
                    <p className="text-muted leading-relaxed font-medium">
                        Welcome back, <span className="text-primary font-bold">{user?.fullName}</span>. 
                        {isBuyer ? ' Track your purchases and securely release funds.' : ' Manage your escrow links and deals.'}
                    </p>
                </div>
                {!isBuyer && (
                    <div className="flex gap-3">
                        <Link to="/payout">
                            <Button variant="outline" className="gap-2 border-slate-200 h-12">
                                <CreditCard size={20} /> Withdraw
                            </Button>
                        </Link>
                        <Link to="/escrows?tab=sales">
                            <Button variant="outline" className="gap-2 border-slate-200 h-12 bg-slate-50">
                                <ShoppingBag size={20} /> Manage Sales
                            </Button>
                        </Link>
                        <Button onClick={openCreateModal} className="gap-2 shadow-lg hover:shadow-primary/20 h-12">
                            <Plus size={20} /> Create Payment Link
                        </Button>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-premium bg-primary text-white overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute right-0 top-0 opacity-10 -mr-4 -mt-4"><WalletIcon size={120} /></div>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
                            {isBuyer ? 'Total Spent (Escrow)' : 'Available Balance'}
                        </p>
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            ₦ {(isBuyer ? (wallet.escrowBalance || 0) : (wallet.availableBalance || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-full border border-white/10 uppercase tracking-tighter">
                            <ShieldCheck size={12} /> Bank-grade security
                        </div>
                    </CardContent>
                </Card>

                {!isBuyer ? (
                    <Card className="border-none shadow-premium bg-slate-900 text-white overflow-hidden">
                        <CardContent className="p-6 relative">
                             <div className="absolute right-0 top-0 opacity-10 -mr-4 -mt-4"><Clock size={120} /></div>
                            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Escrow Balance (Pending)</p>
                            <h2 className="text-3xl font-extrabold tracking-tight">₦ {(wallet.escrowBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                            <p className="mt-4 text-[10px] text-white/50 italic font-medium">Funds move to Available once buyers confirm delivery.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-none shadow-premium bg-white overflow-hidden">
                        <CardContent className="p-6 relative">
                            <p className="text-muted text-xs font-bold uppercase tracking-widest mb-1">Active Purchases</p>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{transactions.filter(t => t.status !== 'completed').length}</h2>
                            <div className="mt-4 text-[10px] font-extrabold text-primary uppercase tracking-tighter hover:underline cursor-pointer flex items-center gap-1">
                                <Link to="/escrows" className="flex items-center gap-1">Track transit <ArrowUpRight size={12} /></Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-none shadow-premium bg-white overflow-hidden">
                    <CardContent className="p-6 relative">
                        <p className="text-muted text-xs font-bold uppercase tracking-widest mb-1">Success Resolution</p>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">100%</h2>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter">
                            <CheckCircle2 size={12} /> 0 pending disputes
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
                {/* 1. Tracking Purchases (For Everyone) */}
                {(isBuyer || transactions.some(tx => tx.buyerId?._id?.toString() === user?._id?.toString())) && (
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <ShoppingBag size={18} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Tracking Purchases</h2>
                            </div>
                            <Link to="/escrows?tab=purchases">
                                <Button variant="ghost" size="sm" className="font-bold text-primary italic">View All Purchases <ArrowUpRight size={16} className="ml-1" /></Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {transactions.filter(tx => tx.buyerId?._id?.toString() === user?._id?.toString()).slice(0, 4).length > 0 ? 
                                transactions.filter(tx => tx.buyerId?._id?.toString() === user?._id?.toString()).slice(0, 4).map((tx) => (
                                <Card key={tx._id} className="border-none shadow-premium hover:shadow-md transition-all group overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-md font-bold text-slate-900 group-hover:text-primary transition-colors">{tx.paymentLinkId?.title || 'Escrow Item'}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={cn(
                                                            "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border shadow-xs",
                                                            tx.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                            tx.status === 'delivered' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                                                            tx.status === 'disputed' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                                        )}>
                                                            {tx.status === 'delivered' ? 'IN TRANSIT' : tx.status}
                                                        </span>
                                                        <p className="text-[10px] text-muted font-bold tracking-tight">₦{tx.amount.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Link to="/escrows?tab=purchases">
                                                    <Button size="sm" variant="ghost" className="w-full sm:w-auto font-bold h-9">
                                                        Track Order
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                        {/* Simple Tracking Indicator */}
                                        <div className="h-1 bg-slate-50 flex">
                                            <div className={cn("h-full transition-all duration-1000", tx.status === 'pending' ? 'w-1/4 bg-slate-200' : tx.status === 'paid' ? 'w-1/2 bg-blue-500' : tx.status === 'delivered' ? 'w-3/4 bg-amber-500' : 'w-full bg-emerald-500')}></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                                    <p className="text-muted font-medium italic text-sm">No recent purchases found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. Your Payment Links (For Sellers) */}
                {!isBuyer && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                                    <ExternalLink size={18} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Your Payment Links (Templates)</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {links.length > 0 ? links.map((link) => (
                                <Card key={link._id} className="border-none shadow-premium hover:shadow-md transition-all group overflow-hidden">
                                    <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-md font-bold text-slate-900 group-hover:text-primary transition-colors">{link.title}</h3>
                                            <p className="text-xs text-muted font-bold italic">Amount: <span className="text-slate-900 font-bold">₦{link.amount.toLocaleString()}</span></p>
                                            <p className="text-[10px] font-mono text-slate-400">Code: {link.linkCode}</p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.linkCode)} className="flex-1 sm:flex-none gap-2 font-bold border-slate-200 text-xs">
                                                <Copy size={14} /> Copy
                                            </Button>
                                            <Button size="sm" onClick={() => window.open(`/p/${link.linkCode}`, '_blank')} className="flex-1 sm:flex-none gap-2 font-bold text-xs">
                                                <ExternalLink size={14} /> Visit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                                    <p className="text-muted font-medium italic">No payment links created yet. Start by creating one!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Link Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="bg-primary p-6 text-white text-center">
                            <h2 className="text-2xl font-bold tracking-tight">Create Payment Link</h2>
                            <p className="text-white/70 text-xs font-medium italic capitalize mt-1">Generate a secure escrow link for your item</p>
                        </div>
                        <form onSubmit={handleCreateLink} className="p-8 space-y-4">
                            <Input 
                                label="Business / Company Name" 
                                placeholder="Your Brand Name" 
                                required 
                                value={newLink.businessName} 
                                onChange={(e) => setNewLink({...newLink, businessName: e.target.value})} 
                            />
                            <Input 
                                label="Item Title" 
                                placeholder="Iphone 13 Pro Max" 
                                required 
                                value={newLink.title} 
                                onChange={(e) => setNewLink({...newLink, title: e.target.value})} 
                            />
                            <Input 
                                label="Amount (NGN)" 
                                type="number" 
                                placeholder="500000" 
                                required 
                                value={newLink.amount} 
                                onChange={(e) => setNewLink({...newLink, amount: e.target.value})} 
                            />
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Who pays the 2.5% Escrow fee?</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                        <input 
                                            type="radio" 
                                            name="feePaidBy" 
                                            value="buyer" 
                                            checked={newLink.feePaidBy === 'buyer'} 
                                            onChange={(e) => setNewLink({...newLink, feePaidBy: e.target.value})}
                                            className="accent-primary"
                                        />
                                        <span className="text-sm font-semibold">Buyer Pays</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                        <input 
                                            type="radio" 
                                            name="feePaidBy" 
                                            value="seller" 
                                            checked={newLink.feePaidBy === 'seller'} 
                                            onChange={(e) => setNewLink({...newLink, feePaidBy: e.target.value})}
                                            className="accent-primary"
                                        />
                                        <span className="text-sm font-semibold">Seller Pays</span>
                                    </label>
                                </div>
                            </div>
                            <Input 
                                label="Description" 
                                placeholder="UK used, 128GB, Silver color..." 
                                value={newLink.description}
                                onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                            />
                            <div className="flex gap-4">
                                <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="flex-1 font-bold">Cancel</Button>
                                <Button type="submit" disabled={isLoading} className="flex-1 font-bold h-12 shadow-lg hover:shadow-primary/20">
                                    {isLoading ? 'Creating...' : 'Create Link'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

// Helper function for class names
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Dashboard;

