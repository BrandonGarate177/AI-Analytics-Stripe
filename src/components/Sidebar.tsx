import React from 'react';
import { 
  BarChart3, 
  CreditCard, 
  Home, 
  Settings, 
  Users, 
  FileText, 
  TrendingUp,
  Shield,
  Zap,
  HelpCircle
} from 'lucide-react';
import { ActivePage } from '../App';

interface SidebarProps {
  isOpen: boolean;
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activePage, onPageChange }) => {
  const menuItems = [
    { icon: Home, label: 'Home', page: 'home' as ActivePage },
    { icon: BarChart3, label: 'Analytics', page: 'analytics' as ActivePage },
    { icon: CreditCard, label: 'Payments', page: 'payments' as ActivePage },
    { icon: Users, label: 'Customers', page: 'customers' as ActivePage },
    { icon: FileText, label: 'Invoices', page: 'invoices' as ActivePage },
    { icon: TrendingUp, label: 'Revenue Recognition', page: 'revenue' as ActivePage },
    { icon: Shield, label: 'Radar', page: 'radar' as ActivePage },
    { icon: Zap, label: 'Connect', page: 'connect' as ActivePage },
  ];

  const settingsItems = [
    { icon: Settings, label: 'Settings', active: false },
    { icon: HelpCircle, label: 'Help', active: false },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-stripe-blue rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          {isOpen && <span className="font-semibold text-gray-900">Stripe</span>}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onPageChange(item.page)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                activePage === item.page
                  ? 'bg-stripe-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-2 py-4 border-t border-gray-200">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors w-full text-left"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
