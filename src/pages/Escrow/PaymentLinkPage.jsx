import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Phone, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card/Card';

const PaymentLinkPage = () => {
    const { code } = useParams();
    const [linkData, setLinkData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        buyerEmail: '',
        buyerPhone: '',
        buyerFullName: ''
    });
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

    const handlePayment = async (e) => {
        e.preventDefault();
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
            <Button onClick={() => window.location.href = '/'}>Go Home</Button>
        </div>
    );

    const platformFee = linkData.amount * 0.025;
    const totalAmount = linkData.amount + platformFee;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 lg:px-8">
            <div className="mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Left: Product Info */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">P</div>
                        <span className="text-xl font-bold tracking-tight text-primary">PayHold</span>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-full border border-primary/10">Secure Escrow Payment</span>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">{linkData.title}</h1>
                        <p className="text-muted leading-relaxed font-medium">{linkData.description}</p>
                    </div>

                    <Card className="border-none shadow-premium overflow-hidden">
                        <CardContent className="p-6 space-y-4 bg-white/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-muted">Item Price</span>
                                <span className="text-slate-900 font-bold font-mono">₦{linkData.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-muted">Escrow Fee (2.5%)</span>
                                <span className="text-emerald-600 font-bold font-mono">+₦{platformFee.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-slate-100"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-extrabold text-slate-900">Total to Pay</span>
                                <span className="text-2xl font-extrabold text-primary font-mono tracking-tighter">₦{totalAmount.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-xs">
                                <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-[10px] font-bold">JD</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-bold text-slate-900">{linkData.sellerId.fullName}</span>
                                    {linkData.sellerId.isVerified && <CheckCircle2 size={14} className="text-primary fill-primary/10" />}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-muted uppercase tracking-tighter">
                                    Trust Score: <span className="text-primary">{linkData.sellerId.trustScore}/100</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Guest Checkout Form */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-none shadow-premium overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <User size={24} className="text-primary" /> Guest Checkout
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <p className="text-sm text-muted mb-6 italic leading-relaxed">Enter your details to initiate the escrow payment. You'll be able to create an account after payment to track your delivery.</p>
                            
                            <form onSubmit={handlePayment} className="space-y-6">
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

export default PaymentLinkPage;
