import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, History, Filter, Search, TrendingUp, CreditCard } from 'lucide-react';
import Button from '../../components/UI/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card/Card';
import Input from '../../components/UI/Input/Input';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('all');

  const balances = [
    { label: 'Available Balance', value: '₦235,500.00', color: 'bg-primary' },
    { label: 'Held in Escrow', value: '₦45,000.00', color: 'bg-emerald-500' },
  ];

  const transactions = [
    { id: '1', type: 'Deposit', amount: '+₦50,000', status: 'Completed', date: 'Oct 12, 2026', ref: 'DEP-90210' },
    { id: '2', type: 'Escrow Payment', amount: '-₦12,500', status: 'Pending', date: 'Oct 11, 2026', ref: 'ESC-44321' },
    { id: '3', type: 'Withdrawal', amount: '-₦100,000', status: 'Completed', date: 'Oct 10, 2026', ref: 'WTH-77889' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">My Wallet</h1>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2 shadow-xs ring-1 ring-slate-100">
            <ArrowDownCircle size={18} /> Deposit
          </Button>
          <Button className="gap-2 shadow-lg hover:shadow-primary/20">
            <ArrowUpCircle size={18} /> Withdraw
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {balances.map((balance, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={cn(balance.color, "text-white overflow-hidden shadow-lg shadow-black/5")}>
              <CardContent className="p-8 relative">
                 <div className="absolute right-0 top-0 opacity-10 -mr-6 -mt-6">
                    <WalletIcon size={160} />
                 </div>
                 <p className="text-white/70 font-bold uppercase tracking-wider text-xs mb-2 transition-all group-hover:tracking-widest">{balance.label}</p>
                 <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-none">{balance.value}</h2>
                 <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                   <TrendingUp size={16} /> <span className="underline decoration-white/20 underline-offset-4">12% more than last month</span>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
          <div className="flex items-center gap-4">
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <Input className="pl-10 h-10 border-none bg-white shadow-xs italic font-medium" placeholder="Search reference..." />
             </div>
             <Button variant="outline" className="h-10 gap-2 border-slate-200 shadow-xs">
                <Filter size={16} /> Filter
             </Button>
          </div>
        </div>

        <Card className="border-none shadow-premium overflow-hidden">
           <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex gap-6 text-xs font-bold uppercase tracking-wider text-muted">
              <button onClick={() => setActiveTab('all')} className={cn("pb-1 transition-all border-b-2", activeTab === 'all' ? "border-primary text-primary" : "border-transparent")}>All</button>
              <button onClick={() => setActiveTab('deposits')} className={cn("pb-1 transition-all border-b-2", activeTab === 'deposits' ? "border-primary text-primary" : "border-transparent")}>Deposits</button>
              <button onClick={() => setActiveTab('payouts')} className={cn("pb-1 transition-all border-b-2", activeTab === 'payouts' ? "border-primary text-primary" : "border-transparent")}>Payouts</button>
           </div>
           
           <div className="divide-y divide-slate-100 overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                   <tr>
                      <th className="px-6 py-4">Transaction</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Reference</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                   </tr>
                </thead>
                <tbody className="text-sm font-medium">
                   {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className={cn(
                                 "h-9 w-9 rounded-full flex items-center justify-center transition-all group-hover:scale-110",
                                 tx.amount.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                               )}>
                                  {tx.amount.startsWith('+') ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                               </div>
                               <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{tx.type}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ring-1 ring-inset shadow-xs font-sans",
                              tx.status === 'Completed' ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-amber-50 text-amber-700 ring-amber-100"
                            )}>
                               {tx.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-muted">{tx.date}</td>
                         <td className="px-6 py-4 font-mono text-xs italic tracking-tighter text-slate-500">{tx.ref}</td>
                         <td className={cn(
                           "px-6 py-4 text-right font-extrabold leading-tight",
                           tx.amount.startsWith('+') ? "text-emerald-600" : "text-slate-900"
                         )}>
                            {tx.amount}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
           
           <CardHeader className="bg-slate-50/50 py-4 text-center">
              <p className="text-xs text-muted font-bold tracking-widest italic uppercase">End of recent history</p>
           </CardHeader>
        </Card>
      </div>
    </div>
  );
};

// Helper function for class names
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Wallet;
