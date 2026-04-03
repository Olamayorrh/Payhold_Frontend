import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Lock, ArrowRight, Loader2, Mail } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import { Card, CardContent } from '../../components/UI/Card/Card';
import { useAuth } from '../../context/AuthContext';

const PaymentVerify = () => {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference');
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [transaction, setTransaction] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const verify = async () => {
            try {
                const { data } = await api.get(`/payment/verify/${reference}`);
                if (data.status) {
                    setTransaction(data.data);
                    setIsGuest(data.data.buyerId.isGuest);
                    setStatus('success');
                }
            } catch (err) {
                setStatus('error');
            }
        };
        if (reference) verify();
    }, [reference]);

    const handleClaimAccount = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // New endpoint to "claim" guest account
            const { data } = await api.post('/auth/claim-guest', {
                email: transaction.buyerId.email,
                password
            });
            login(data, data.token);
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to secure account. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (status === 'verifying') {
        return (
            <div className="flex h-screen flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-lg font-bold text-slate-900 animate-pulse">Verifying your secure payment...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex h-screen flex-col items-center justify-center space-y-4 p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">！</div>
                <h1 className="text-2xl font-extrabold text-slate-900">Verification Failed</h1>
                <p className="text-muted max-w-xs">We couldn't verify your payment. If you were debited, please contact support.</p>
                <Button onClick={() => navigate('/')}>Return Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6">
            <div className="w-full max-w-xl">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="text-center mb-10">
                        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-200 mb-6 border-4 border-white">
                            <CheckCircle2 size={48} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payment Successful!</h1>
                        <p className="text-muted mt-2">Your funds are now held securely in escrow.</p>
                    </div>

                    {isGuest ? (
                        <Card className="border-none shadow-premium overflow-hidden ring-2 ring-primary/20">
                            <div className="bg-primary px-6 py-3 flex items-center justify-between">
                                <span className="text-xs font-bold text-white uppercase tracking-widest">Action Required</span>
                                <ShieldCheck size={20} className="text-white/80" />
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-slate-900">Secure Your Account</h2>
                                    <p className="text-sm text-muted italic">To track this delivery and raise disputes if necessary, please set a password for your account.</p>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <Mail size={18} className="text-primary" />
                                    <span className="text-sm font-bold text-slate-700">{transaction?.buyerId?.email}</span>
                                </div>

                                <form onSubmit={handleClaimAccount} className="space-y-4">
                                    <Input 
                                        label="Create Password" 
                                        type="password" 
                                        placeholder="••••••••" 
                                        icon={<Lock size={18} />}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Button type="submit" disabled={isSaving} className="w-full h-12 shadow-lg hover:shadow-primary/20">
                                        {isSaving ? 'Securing...' : 'Claim Account & Go to Dashboard'} <ArrowRight size={18} className="ml-2" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-none shadow-premium">
                            <CardContent className="p-8 text-center space-y-6">
                                <p className="text-muted">You can now track this transaction in your dashboard.</p>
                                <Button onClick={() => navigate('/dashboard')} className="w-full">Go to Dashboard</Button>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentVerify;
