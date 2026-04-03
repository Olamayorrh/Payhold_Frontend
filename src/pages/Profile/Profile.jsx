import { motion } from 'framer-motion';
import { User, ShieldCheck, Mail, Phone, MapPin, Award, Star, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../../components/UI/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card/Card';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  
  const trustMetrics = [
    { label: 'Completed Deals', value: '42', icon: <CheckCircle2 className="text-emerald-500" /> },
    { label: 'Trust Score', value: '98/100', icon: <Award className="text-primary" /> },
    { label: 'Avg. Rating', value: '4.9', icon: <Star className="text-amber-500 fill-amber-500" /> },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
         <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">My Profile</h1>
         <div className="flex gap-3">
            <Button variant="outline" className="gap-2 border-slate-200">
               <Settings size={18} /> Edit Profile
            </Button>
            <Button variant="ghost" onClick={logout} className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold">
               <LogOut size={18} /> Log Out
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
           <Card className="border-none shadow-premium overflow-hidden">
              <div className="h-24 bg-primary relative">
                 <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="h-24 w-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-primary font-bold text-4xl shadow-md overflow-hidden ring-4 ring-primary/10">
                       <User size={48} />
                    </div>
                 </div>
              </div>
              <CardContent className="pt-16 pb-8 text-center space-y-4">
                 <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                       <h2 className="text-2xl font-extrabold text-slate-900">{user?.name}</h2>
                       <CheckCircle2 size={24} className="text-primary fill-primary/10" />
                    </div>
                    <p className="text-sm font-medium text-muted">Premium Member since 2024</p>
                 </div>
                 
                 <div className="flex items-center justify-center gap-4 text-sm text-slate-500 italic font-medium">
                    <span className="flex items-center gap-1"><MapPin size={14} /> Lagos, Nigeria</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1 font-bold text-primary">ID VERIFIED</span>
                 </div>

                 <div className="pt-4 flex gap-4 justify-center">
                    <div className="flex flex-col items-center">
                       <span className="text-xl font-extrabold text-slate-900">42</span>
                       <span className="text-[10px] uppercase font-bold text-muted tracking-widest leading-none mt-1">Deals</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div className="flex flex-col items-center">
                       <span className="text-xl font-extrabold text-slate-900">10k+</span>
                       <span className="text-[10px] uppercase font-bold text-muted tracking-widest leading-none mt-1">Followers</span>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-premium overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 italic">
                 <CardTitle className="text-sm font-bold flex items-center gap-2">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center text-muted"><Mail size={18} /></div>
                    <div className="space-y-0.5">
                       <p className="text-[10px] uppercase font-bold text-muted leading-none">Email</p>
                       <p className="text-sm font-bold text-slate-900">{user?.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center text-muted"><Phone size={18} /></div>
                    <div className="space-y-0.5">
                       <p className="text-[10px] uppercase font-bold text-muted leading-none">Phone</p>
                       <p className="text-sm font-bold text-slate-900">+234 812 345 6789</p>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Metrics and Settings */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {trustMetrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-all border-none shadow-premium text-center">
                    <CardContent className="p-6">
                      <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shadow-xs">
                        {metric.icon}
                      </div>
                      <p className="text-[10px] uppercase font-bold text-muted mb-1 leading-none tracking-widest">{metric.label}</p>
                      <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">{metric.value}</h4>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
           </div>

           <Card className="border-none shadow-premium overflow-hidden">
              <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                 <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck size={24} className="text-primary" /> Security & Trust Metrics
                 </CardTitle>
                 <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-full">Bank-Grade Secure</span>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between group cursor-pointer">
                       <div className="space-y-1">
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">Trust Verification</p>
                          <p className="text-sm text-muted italic">Complete your KYC for higher withdrawal limits.</p>
                       </div>
                       <Link to="/kyc">
                          <Button variant="outline" size="sm" className="font-bold border-slate-200">Verify Now</Button>
                       </Link>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <div className="flex items-center justify-between group cursor-pointer">
                       <div className="space-y-1">
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">Two-Factor Authentication</p>
                          <p className="text-sm text-muted italic">Secure your account with an extra layer of protection.</p>
                       </div>
                       <div className="h-6 w-11 rounded-full bg-slate-200 relative p-1 shadow-inner">
                          <div className="h-4 w-4 rounded-full bg-white shadow-xs"></div>
                       </div>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="font-bold text-slate-900">Account History</p>
                          <p className="text-sm text-muted italic">Last login: Today at 11:42 AM from Lagos, Nigeria.</p>
                       </div>
                       <Button variant="ghost" size="sm" className="text-primary font-extrabold">View logs</Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
