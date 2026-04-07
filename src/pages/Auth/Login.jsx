import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router';
import { Mail, Lock, LogIn, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import { Card, CardContent } from '../../components/UI/Card/Card';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get redirect and pre-fill email from query string
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/dashboard';
  const prefilledEmail = queryParams.get('email') || '';

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    password: ''
  });
  
  // Get success message from state
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/auth/login', formData);
      login(data, data.token);
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <div className="p-8 pb-10">
            <div className="text-center mb-10">
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-[0_8px_30px_rgb(59,130,246,0.2)] ring-4 ring-primary/10">P</div>
                <span className="text-3xl font-bold tracking-tight text-primary">PayHold</span>
              </Link>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="mt-2 text-sm text-slate-500 font-medium tracking-tight">Sign in to your escrow account</p>
            </div>

            {successMessage && (
              <div className="mb-6 rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-600 border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 size={18} /> {successMessage}
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 italic">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  icon={<Mail size={18} />}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Password"
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-slate-600">
                    Remember me
                  </label>
                </div>

                <div className="text-xs">
                  <a href="#" className="font-bold text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-semibold group shadow-lg hover:shadow-primary/20">
                {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <p className="mt-10 text-center text-sm font-medium text-slate-500">
              New to PayHold?{' '}
              <Link to="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
