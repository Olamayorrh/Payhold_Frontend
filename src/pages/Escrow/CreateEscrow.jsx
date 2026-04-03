import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, User, ArrowRight, Wallet, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card/Card';

const CreateEscrow = () => {
  const [formData, setFormData] = useState({
    sellerEmail: '',
    buyerEmail: '',
    itemTitle: '',
    price: '',
    description: ''
  });
  const [fee, setFee] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const priceValue = parseFloat(formData.price) || 0;
    const platformFee = priceValue * 0.025; // 2.5% fee
    setFee(platformFee);
    setTotal(priceValue + platformFee);
  }, [formData.price]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating Escrow:', { ...formData, fee, total });
    // Logic for backend API would go here
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-2xl py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Secure Escrow</h1>
        <p className="text-muted leading-relaxed">Fill in the details to generate a payment link and protect your transaction.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-premium">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50">
            <CardTitle className="text-lg flex items-center gap-2">
               <ShieldCheck className="text-primary" size={20} /> Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Item or Service Title"
                placeholder="e.g. Brand New iPhone 13 Pro"
                required
                value={formData.itemTitle}
                onChange={(e) => setFormData({ ...formData, itemTitle: e.target.value })}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Seller Email"
                  type="email"
                  placeholder="seller@example.com"
                  required
                  value={formData.sellerEmail}
                  onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                />
                <Input
                  label="Buyer Email"
                  type="email"
                  placeholder="buyer@example.com"
                  required
                  value={formData.buyerEmail}
                  onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <Input
                  label="Selling Price (NGN)"
                  type="number"
                  placeholder="0.00"
                  icon={<Wallet size={18} />}
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />

                {/* Fee Calculation Breakdown */}
                <div className="rounded-xl bg-primary/5 p-6 border border-primary/10">
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">Product Price:</span>
                      <span className="font-bold text-slate-900 leading-tight">₦{parseFloat(formData.price || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 underline decoration-dotted decoration-slate-400">
                        <span className="text-sm font-medium text-slate-600">Escrow Charge (2.5%):</span>
                        <Info size={14} className="text-muted" />
                      </div>
                      <span className="font-bold text-primary italic leading-tight">₦{fee.toLocaleString()}</span>
                   </div>
                   <div className="h-px bg-primary/20 mb-4"></div>
                   <div className="flex items-center justify-between">
                      <span className="text-lg font-extrabold text-slate-900 leading-tight">Total to Pay:</span>
                      <span className="text-2xl font-extrabold text-primary leading-tight">₦{total.toLocaleString()}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-xs text-emerald-800 border border-emerald-100">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <p>Funds will be held securely in PayHold's escrow until the buyer confirms the item is received and exactly as described.</p>
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-bold group shadow-lg hover:shadow-primary/20">
                Generate Link & Pay <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <div className="text-center italic">
        <p className="text-xs text-muted">Protected by AES-256 bank-level encryption. All rights reserved PayHold © 2026</p>
      </div>
    </div>
  );
};

export default CreateEscrow;
