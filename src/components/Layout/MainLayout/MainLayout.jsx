import React from 'react';
import Sidebar from '../../Navigation/Sidebar/Sidebar';
import BottomNav from '../../Navigation/BottomNav/BottomNav';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 px-4 pt-16 pb-24 lg:ml-64 lg:px-8 lg:pt-8 lg:pb-8">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
