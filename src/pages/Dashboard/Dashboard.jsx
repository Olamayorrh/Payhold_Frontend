import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Link as LinkIcon, 
  Wallet, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/UI/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card/Card';
import Input from '../../components/UI/Input/Input';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [links, setLinks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newLink, setNewLink] = useState({ title: '', amount: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [linksRes, transRes] = await Promise.all([
                    api.get('/link/my-links'),
                    api.get('/payment/transactions')
                ]);
                
                setLinks(linksRes.data.data);
                // setTransactions(transRes.data.data);
            } catch (err) {
                console.error('Error fetching dashboard data');
            }
        };
        fetchData();
    }, []);

    const handleCreateLink = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post('/link/create', newLink);
            setLinks([data.data, ...links]);
            setIsCreateModalOpen(false);
            setNewLink({ title: '', amount: '', description: '' });
        } catch (err) {
            alert('Failed to create link');
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
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Seller Dashboard</h1>
                    <p className="text-muted leading-relaxed font-medium">Welcome back, <span className="text-primary font-bold">{user?.fullName}</span>. Manage your escrow links and deals.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 shadow-lg hover:shadow-primary/20 h-12">
                    <Plus size={20} /> Create Payment Link
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-premium bg-primary text-white overflow-hidden">
                    <CardContent className="p-6 relative">
                        <div className="absolute right-0 top-0 opacity-10 -mr-4 -mt-4"><Wallet size={120} /></div>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
                        <h2 className="text-3xl font-extrabold tracking-tight">₦0.00</h2>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-full border border-white/10 uppercase tracking-tighter">
                            <ShieldCheck size={12} /> Bank-grade security
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-premium bg-white overflow-hidden">
                    <CardContent className="p-6 relative">
                        <p className="text-muted text-xs font-bold uppercase tracking-widest mb-1">Active Links</p>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{links.length}</h2>
                        <div className="mt-4 text-[10px] font-extrabold text-primary uppercase tracking-tighter hover:underline cursor-pointer flex items-center gap-1">
                            View all links <ArrowUpRight size={12} />
                        </div>
                    </CardContent>
                </Card>

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

            {/* Links Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Your Payment Links</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {links.length > 0 ? links.map((link) => (
                        <Card key={link._id} className="border-none shadow-premium hover:shadow-md transition-all group overflow-hidden">
                            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{link.title}</h3>
                                    <p className="text-xs text-muted font-medium italic">Amount: <span className="text-slate-900 font-bold">₦{link.amount.toLocaleString()}</span></p>
                                    <p className="text-[10px] font-mono text-slate-400">Code: {link.linkCode}</p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.linkCode)} className="flex-1 sm:flex-none gap-2 font-bold border-slate-200">
                                        <Copy size={14} /> Copy
                                    </Button>
                                    <Button size="sm" onClick={() => window.open(`/p/${link.linkCode}`, '_blank')} className="flex-1 sm:flex-none gap-2 font-bold">
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

            {/* Create Link Modal (Simplified Overlay) */}
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
                        <form onSubmit={handleCreateLink} className="p-8 space-y-6">
                            <Input 
                                label="Item Title" 
                                placeholder="iPhone 13 Pro Max" 
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

export default Dashboard;
