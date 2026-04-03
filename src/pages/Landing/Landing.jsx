import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../../components/UI/Button/Button';
import { Card, CardContent } from '../../components/UI/Card/Card';
import heroImage from '../../assets/images/hero.png';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">P</div>
            <span className="text-xl font-bold tracking-tight text-primary">PayHold</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted hover:text-primary transition-colors">How it works</a>
            <a href="#security" className="text-sm font-medium text-muted hover:text-primary transition-colors">Security</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="shadow-lg hover:shadow-primary/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-2xl"
              >
                <motion.div variants={itemVariants} className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20 mb-6">
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Trusted by 10k+ sellers</span>
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                  Secure Every <span className="text-primary italic">Deal</span> with PayHold
                </motion.h1>
                <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-slate-600">
                  The ultimate escrow platform for social commerce. We hold the money until the product is delivered, ensuring both buyers and sellers are 100% protected.
                </motion.p>
                <motion.div variants={itemVariants} className="mt-10 flex items-center gap-x-6">
                  <Link to="/signup">
                    <Button size="lg" className="gap-2 group">
                      Create an Escrow <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <a href="#how-it-works" className="text-sm font-semibold leading-6 text-slate-900 flex items-center gap-2 hover:text-primary transition-colors">
                    Learn how it works <span aria-hidden="true">→</span>
                  </a>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mt-12 flex items-center gap-8 grayscale opacity-50">
                  <div className="flex items-center gap-2 font-bold text-xl text-slate-400">PAYSTACK</div>
                  <div className="flex items-center gap-2 font-bold text-xl text-slate-400">STRIPE</div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
              >
                 <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl lg:-inset-8"></div>
                 <img
                  src={heroImage}
                  alt="Secure transactions dashboard"
                  className="relative rounded-2xl shadow-2xl ring-1 ring-slate-900/10"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-primary pt-12 pb-12">
           <div className="mx-auto max-w-7xl px-6 lg:px-8">
             <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
               {[
                 { label: 'Successful Deals', value: '50k+' },
                 { label: 'Money Protected', value: '$12M+' },
                 { label: 'Active Sellers', value: '8k+' },
                 { label: 'Buyer Satisfaction', value: '4.9/5' }
               ].map((stat, idx) => (
                 <div key={idx} className="text-center">
                   <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                   <div className="text-sm font-medium text-white/70">{stat.label}</div>
                 </div>
               ))}
             </div>
           </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-primary">Security First</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to trade safely</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { icon: <Lock className="text-primary" />, title: 'Smart Escrow', desc: 'Money is only released when both parties confirm delivery and satisfaction.' },
                { icon: <Zap className="text-primary" />, title: 'Fast Payouts', desc: 'Once the buyer confirms, funds are into the sellers wallet instantly.' },
                { icon: <ShieldCheck className="text-primary" />, title: 'Dispute Resolution', desc: 'In case of issues, our team mediates to ensure fairness for everyone.' }
              ].map((feature, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow border-none">
                  <CardContent className="pt-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 italic leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-white font-bold text-sm">P</div>
            <span className="font-bold text-slate-900">PayHold</span>
          </div>
          <p className="text-sm text-muted">© 2026 PayHold. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-muted">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
