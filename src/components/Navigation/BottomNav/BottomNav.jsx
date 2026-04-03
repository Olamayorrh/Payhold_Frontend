import React from 'react';
import { Home, CreditCard, ShieldCheck, User, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/dashboard' },
    { icon: <ShieldCheck size={24} />, label: 'Escrows', path: '/escrows' },
    { icon: <PlusCircle size={32} />, label: 'New', path: '/create-escrow', special: true },
    { icon: <CreditCard size={24} />, label: 'Wallet', path: '/wallet' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-border bg-white glass-card lg:hidden">
      <div className="flex h-full items-center justify-around px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-200",
              item.special ? "mb-8 rounded-full bg-primary p-3 text-white shadow-lg ring-4 ring-white" : "p-2",
              location.pathname === item.path ? "text-primary" : "text-muted"
            )}
          >
            {item.icon}
            {!item.special && <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
