import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle2, User, Building2, Upload, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card/Card';

const KYCVerification = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nin: '',
        bvn: '',
        businessName: '',
        cacNumber: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, processing, success
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('processing');
        
        try {
            await api.post('/kyc/submit', formData);
            
            // Mock delay for verification processing
            setTimeout(() => {
                setStatus('success');
                setIsSubmitting(false);
            }, 2000);
            
        } catch (err) {
            alert('Failed to submit KYC. Please try again.');
            setStatus('idle');
            setIsSubmitting(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 max-w-sm"
                >
                    <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto border-4 border-white shadow-lg">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Identity Verified!</h1>
                    <p className="text-muted italic leading-relaxed">Your account has been upgraded to **Level 1 Verification**. You can now trade with higher limits and the **Verified Badge**.</p>
                    <Button onClick={() => navigate('/dashboard')} className="w-full">Back to Dashboard</Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Identity Verification</h1>
                <p className="text-muted leading-relaxed">Complete your KYC to unlock full trading potential and build trust.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Progress Tracking */}
                <div className="space-y-4">
                    {[
                        { step: 1, title: 'Personal Info', desc: 'NIN & BVN verification', active: step === 1, done: step > 1 },
                        { step: 2, title: 'Business Certs', desc: 'CAC & Business Proof', active: step === 2, done: step > 2 }
                    ].map((s) => (
                        <Card key={s.step} className={cn(
                            "border-none shadow-premium transition-all",
                            s.active ? "ring-2 ring-primary bg-primary/5" : "bg-white opacity-70"
                        )}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm",
                                    s.done ? "bg-emerald-500 text-white" : s.active ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                                )}>
                                    {s.done ? <CheckCircle2 size={20} /> : s.step}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 leading-none">{s.title}</h3>
                                    <p className="text-[10px] uppercase font-bold text-muted mt-1 leading-none">{s.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-800 text-xs italic">
                        <AlertCircle size={32} className="shrink-0" />
                        <p>BVN is used to verify your name against your bank records. **PayHold** cannot access your funds.</p>
                    </div>
                </div>

                {/* Right: The Form */}
                <Card className="lg:col-span-2 border-none shadow-premium overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            {step === 1 ? <User className="text-primary" /> : <Building2 className="text-primary" />}
                            {step === 1 ? 'Step 1: Personal Identification' : 'Step 2: Business Registration'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {status === 'processing' ? (
                            <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="animate-spin text-primary" size={48} />
                                <p className="font-bold text-slate-900 italic">Verifying your records with national databases...</p>
                            </div>
                        ) : (
                            <form onSubmit={(e) => { 
                                if (step === 1) { e.preventDefault(); setStep(2); }
                                else { handleSubmit(e); }
                            }} className="space-y-8">
                                
                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <Input 
                                            label="NIN (National Identity Number)" 
                                            placeholder="11-digit number" 
                                            required
                                            value={formData.nin}
                                            onChange={(e) => setFormData({...formData, nin: e.target.value})}
                                        />
                                        <Input 
                                            label="BVN (Bank Verification Number)" 
                                            placeholder="11-digit number" 
                                            required
                                            value={formData.bvn}
                                            onChange={(e) => setFormData({...formData, bvn: e.target.value})}
                                        />
                                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-muted group hover:border-primary transition-all cursor-pointer bg-slate-50/50">
                                            <Upload className="mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Selfie with NIN Document</span>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <Input 
                                            label="Registered Business Name" 
                                            placeholder="PayHold Escrow LTD" 
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                                        />
                                        <Input 
                                            label="CAC Registration Number" 
                                            placeholder="RC-1234567" 
                                            value={formData.cacNumber}
                                            onChange={(e) => setFormData({...formData, cacNumber: e.target.value})}
                                        />
                                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-muted group hover:border-primary transition-all cursor-pointer bg-slate-50/50">
                                            <FileText className="mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Upload CAC Certificate (PDF)</span>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    {step === 2 && (
                                        <Button type="button" variant="ghost" onClick={() => setStep(1)} className="font-bold flex-1">Back</Button>
                                    )}
                                    <Button type="submit" disabled={isSubmitting} className="flex-1 font-extrabold h-12 shadow-lg hover:shadow-primary/20">
                                        {step === 1 ? 'Next Step' : 'Submit Verification'} 
                                        <ArrowRight size={18} className="ml-2" />
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Helper function for class names
function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}

export default KYCVerification;
