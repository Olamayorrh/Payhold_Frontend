import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { ShieldCheck, ArrowRight, User, Mail, Lock, Eye, EyeOff, FileText, Fingerprint, Upload, ShoppingBag } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import { Card, CardContent } from '../../components/UI/Card/Card';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    nin: '',
    businessDocument: null // Store the file object here
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFileChange = (e) => {
    setFormData({ ...formData, businessDocument: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Pre-validation
    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
    }

    if (formData.role === 'seller' && !formData.nin && !formData.businessDocument) {
        setError('Please provide your NIN or upload a Business Document to register as a seller.');
        setIsLoading(false);
        return;
    }

    try {
      // Use FormData for multipart/form-data
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await api.post('/auth/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Removed auto-login. Prompt user to login manually.
      navigate('/login', { state: { message: 'Account created successfully! Please log in to your new account.' } });
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      if (message.toLowerCase().includes('already exists')) {
        setError(
          <div className="flex flex-col gap-1">
            <span>This email is already registered.</span>
            <Link to="/login" className="text-primary font-bold underline">Login instead</Link>
          </div>
        );
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-10">
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-[0_8px_30px_rgb(59,130,246,0.2)] ring-4 ring-primary/10">P</div>
                <span className="text-3xl font-bold tracking-tight text-primary">PayHold</span>
              </Link>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Your Account</h2>
              <p className="mt-2 text-sm text-slate-500 font-medium tracking-tight">Secure your social commerce deals</p>
            </div>
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 italic">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                icon={<User size={18} />}
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={<Mail size={18} />}
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+234..."
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Account Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'seller' })}
                    className={`flex items-center justify-center rounded-lg border p-3 text-sm font-bold transition-all ${
                      formData.role === 'seller' ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' : 'border-slate-200 bg-white text-muted hover:bg-slate-50'
                    }`}
                  >
                    I'm a Seller
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'buyer' })}
                    className={`flex items-center justify-center rounded-lg border p-3 text-sm font-bold transition-all ${
                      formData.role === 'buyer' ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' : 'border-slate-200 bg-white text-muted hover:bg-slate-50'
                    }`}
                  >
                    I'm a Buyer
                  </button>
                </div>
              </div>

              {/* Conditional Seller Verification Fields */}
              <AnimatePresence mode="wait">
                {formData.role === 'seller' && (
                  <motion.div
                    key="seller-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="h-px bg-slate-100"></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Business Information</p>
                    <Input 
                      label="Business / Company Name" 
                      placeholder="e.g. Olamayorrh Ventures" 
                      icon={<ShoppingBag size={18} />}
                      required={formData.role === 'seller'}
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    />
                    <Input 
                      label="NIN (11 Digits)" 
                      placeholder="12345678901" 
                      icon={<Fingerprint size={18} />}
                      value={formData.nin}
                      onChange={(e) => setFormData({...formData, nin: e.target.value})}
                    />
                    <div className="text-center py-1 text-[10px] font-bold text-muted uppercase italic">OR UPLOAD</div>
                    
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Business Document (PDF)</label>
                        <div className="relative h-24 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50 group hover:border-primary transition-all overflow-hidden">
                            <input 
                                type="file" 
                                accept=".pdf" 
                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                onChange={handleFileChange}
                            />
                            {formData.businessDocument ? (
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs animate-bounce">
                                    <FileText size={18} /> {formData.businessDocument.name.slice(0, 20)}...
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-muted group-hover:text-primary transition-colors">
                                    <Upload size={20} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Click to upload PDF</span>
                                </div>
                            )}
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-100">
                <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                <p>We use bank-grade encryption to verify your documents.</p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-semibold group shadow-lg hover:shadow-primary/20">
                {isLoading ? 'Creating Account...' : `Create ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Account`} <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
            <p className="mt-8 text-center text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
