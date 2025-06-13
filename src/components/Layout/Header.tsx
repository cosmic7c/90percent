import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="lg:hidden bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 
                     px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors duration-200"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-amber-900 tracking-wide">
          4EDFIL7C Official Website
        </h1>
      </div>
    </header>
  );
};

export default Header;