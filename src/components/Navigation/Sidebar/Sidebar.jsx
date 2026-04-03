import React from 'react';
import { Home, CreditCard, ShieldCheck, User, Settings, ArrowRightLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ShieldCheck size={20} />, label: 'Escrows', path: '/escrows' },
    { icon: <ArrowRightLeft size={20} />, label: 'Transactions', path: '/transactions' },
    { icon: <CreditCard size={20} />, label: 'Wallet', path: '/wallet' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-border bg-white shadow-xs lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">P</div>
          <span className="text-xl font-bold tracking-tight text-primary">PayHold</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-slate-50 hover:text-primary",
              location.pathname === item.path ? "bg-primary/5 text-primary shadow-xs ring-1 ring-primary/10" : "text-muted"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto p-4 border-t border-border">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted transition-all hover:bg-slate-50 hover:text-primary"
        >
          <Settings size={20} />
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
