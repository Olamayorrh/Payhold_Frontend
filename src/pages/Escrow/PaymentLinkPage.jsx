import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Phone, User, ArrowRight, CheckCircle2, AlertCircle, LogIn, Eye, EyeOff, Lock } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card/Card';
import { useAuth } from '../../context/AuthContext';

const PaymentLinkPage = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [linkData, setLinkData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        buyerEmail: '',
        buyerPhone: '',
        buyerFullName: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const { data } = await api.get(`/link/${code}`);
                setLinkData(data.data);
            } catch (err) {
                setError('Payment link not found or expired.');
            } finally {
                setLoading(false);
            }
        };
        fetchLink();
    }, [code]);

    // Pre-fill form if user is logged in
    useEffect(() => {
        if (user) {
            setFormData({
                buyerEmail: user.email || '',
                buyerPhone: user.phone || '',
                buyerFullName: user.fullName || ''
            });
        }
    }, [user]);

    // Check email status
    useEffect(() => {
        const checkEmail = async () => {
            if (formData.buyerEmail.length > 5 && !user) {
                try {
                    const { data } = await api.post('/auth/check-email', { email: formData.buyerEmail });
                    if (data.exists) {
                        setIsMember(true);
                        // Auto-populate recognized data
                        setFormData(prev => ({
                            ...prev,
                            buyerFullName: data.fullName || prev.buyerFullName,
                            buyerPhone: data.maskedPhone || prev.buyerPhone
                        }));
                    } else {
                        setIsMember(false);
                    }
                } catch (err) {
                    console.error('Email check failed');
                }
            }
        };

        const timeoutId = setTimeout(checkEmail, 500);
        return () => clearTimeout(timeoutId);
    }, [formData.buyerEmail, user]);

    const handlePayment = async (e) => {
        e.preventDefault();
        
        // Password validation for new users
        if (isMember === false && formData.password) {
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
        }

        setIsProcessing(true);
        try {
            const { data } = await api.post('/payment/initialize', {
                linkCode: code,
                ...formData
            });
            if (data.status) {
                window.location.href = data.data.authorization_url;
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to initialize payment.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center font-bold text-primary italic">Loading secure payment link...</div>;
    if (error) return (
        <div className="flex h-screen flex-col items-center justify-center space-y-4 p-6 text-center">
            <AlertCircle size={64} className="text-red-500" />
            <h1 className="text-2xl font-bold text-slate-900">{error}</h1>
            <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
    );

    if (!linkData) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 lg:px-8">
            <div className="mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Left: Product Info (The Receipt Card) */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="h-full">
                    <Card className="border-none shadow-premium overflow-hidden h-full flex flex-col">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-primary/10">
                                    {(linkData.sellerId.businessName || linkData.sellerId.fullName).slice(0, 1).toUpperCase()}
                                </div>
                                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none italic">
                                    {linkData.sellerId.businessName || linkData.sellerId.fullName}
                                </h1>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">Official Payment Link</span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6 flex-1">
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Description</p>
                                    <p className="text-base text-slate-700 leading-relaxed font-medium">{linkData.description}</p>
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-muted">Item Price</span>
                                        <span className="text-slate-900 font-bold font-mono">₦{linkData.amount.toLocaleString()}</span>
                                    </div>
                                    {linkData.feePaidBy === 'buyer' && (
                                        <div className="flex items-center justify-between text-xs font-medium">
                                            <span className="text-muted">Escrow Fee (2.5%)</span>
                                            <span className="text-emerald-600 font-bold font-mono">+₦{(linkData.amount * 0.025).toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-slate-200"></div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-extrabold text-slate-900 uppercase tracking-tighter">Total Amount</span>
                                        <span className="text-2xl font-extrabold text-primary font-mono tracking-tighter italic">
                                            ₦{(linkData.feePaidBy === 'buyer' ? linkData.amount * 1.025 : linkData.amount).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        
                        <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-center gap-2">
                             <ShieldCheck size={16} className="text-primary" />
                             <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Safe Escrow by PayHold</span>
                        </div>
                    </Card>
                </motion.div>

                {/* Right: Checkout Form */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full">
                    <Card className="border-none shadow-premium h-full flex flex-col">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                                <LogIn size={20} className="text-primary" />
                                <span>Confirm Checkout</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col">
                            {/* Profile/Identity Section */}
                            {user ? (
                                linkData.sellerId._id === user._id ? (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                                        <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Seller Dashboard View</p>
                                            <p className="text-xs text-muted leading-relaxed mt-0.5">
                                                You are viewing your own payment link as the seller. To test the buyer checkout experience, please open this link in an <strong>Incognito</strong> or private window.
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                                         <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-emerald-100">
                                            {user.fullName?.slice(0, 2).toUpperCase()}
                                         </div>
                                         <div>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Logged In As</p>
                                            <p className="text-lg font-bold text-slate-900 leading-tight">{user.fullName}</p>
                                            <p className="text-xs text-muted leading-tight">{user.email}</p>
                                         </div>
                                    </div>
                                )
                            ) : (
                                <p className="text-sm text-muted mb-6 italic leading-relaxed">Enter your details to initiate the escrow payment.</p>
                            )}

                            {isMember && !user && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                                    <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-900">Account Recognized</p>
                                        <p className="text-xs text-amber-700 leading-relaxed mt-0.5">
                                            This email belongs to an existing account. <Link to={`/login?redirect=/p/${code}&email=${formData.buyerEmail}`} className="font-bold underline">Sign In</Link> to pay faster and track your delivery securely.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            
                            <form onSubmit={handlePayment} className="space-y-4 flex-1 flex flex-col">
                                <div className={`space-y-4 transition-opacity ${user ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <Input 
                                        label="Full Name" 
                                        placeholder="Enter your name" 
                                        icon={<User size={18} />}
                                        required
                                        value={formData.buyerFullName}
                                        onChange={(e) => setFormData({...formData, buyerFullName: e.target.value})}
                                    />
                                    <Input 
                                        label="Email Address" 
                                        type="email" 
                                        placeholder="your@email.com" 
                                        icon={<Mail size={18} />}
                                        required
                                        value={formData.buyerEmail}
                                        onChange={(e) => setFormData({...formData, buyerEmail: e.target.value})}
                                    />
                                    <Input 
                                        label="Phone Number" 
                                        type="tel" 
                                        placeholder="+234..." 
                                        icon={<Phone size={18} />}
                                        required
                                        value={formData.buyerPhone}
                                        onChange={(e) => setFormData({...formData, buyerPhone: e.target.value})}
                                    />
                                    
                                    {!user && !isMember && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Input
                                                label="Create Password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                icon={<Lock size={18} />}
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                suffix={
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="text-muted hover:text-primary transition-colors cursor-pointer"
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                }
                                            />
                                            <Input
                                                label="Confirm Password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                icon={<Lock size={18} />}
                                                required
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3 text-[10px] sm:text-xs text-emerald-800 border border-emerald-100">
                                    <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                                    <p>Your money is held securely by <strong>PayHold Escrow</strong>. The seller will only be paid once you confirm delivery.</p>
                                </div>

                                <Button type="submit" disabled={isProcessing} className="w-full h-12 text-base font-semibold group shadow-lg hover:shadow-primary/20">
                                    {isProcessing ? 'Processing...' : 'Pay with Paystack'} <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

            </div>
        </div>
    );
};

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default PaymentLinkPage;
