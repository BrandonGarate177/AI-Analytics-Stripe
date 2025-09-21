import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardContent from './components/DashboardContent';
import AnalyticsContent from './components/AnalyticsContent';

export type ActivePage = 'home' | 'analytics' | 'payments' | 'customers' | 'invoices' | 'revenue' | 'radar' | 'connect';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState<ActivePage>('home');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (page: ActivePage) => {
    setActivePage(page);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <DashboardContent />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'payments':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">Payment processing and transaction management coming soon.</p>
          </div>
        );
      case 'customers':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Customer management and insights coming soon.</p>
          </div>
        );
      case 'invoices':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">Invoice management and billing coming soon.</p>
          </div>
        );
      case 'revenue':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Revenue Recognition</h1>
            <p className="text-gray-600 mt-1">Revenue recognition and accounting features coming soon.</p>
          </div>
        );
      case 'radar':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Radar</h1>
            <p className="text-gray-600 mt-1">Fraud detection and prevention tools coming soon.</p>
          </div>
        );
      case 'connect':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Connect</h1>
            <p className="text-gray-600 mt-1">Marketplace and platform features coming soon.</p>
          </div>
        );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} activePage={activePage} onPageChange={handlePageChange} />
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-16'
      }`}>
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

export default App;
