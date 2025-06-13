import React from 'react';
import { Home, Users, Calendar, BookOpen, Shield } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOfficerAccess: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isOpen, 
  onClose,
  onOfficerAccess
}) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar }
  ];

  const handleItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-amber-50 to-orange-50 
        border-r border-amber-200 shadow-lg transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex flex-col items-start mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-3 
                          shadow-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">4E</span>
            </div>
            <h2 className="text-xl font-bold text-amber-900 uppercase tracking-wide">
              4EDFIL7C
            </h2>
            <p className="text-xs text-amber-700 font-medium">OFFICIAL WEBSITE</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent mb-6" />

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleItemClick(id)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-lg text-left font-medium
                  transition-all duration-200 group
                  ${activeSection === id 
                    ? 'bg-gradient-to-r from-amber-200 to-orange-200 text-amber-900 shadow-sm' 
                    : 'text-amber-700 hover:bg-amber-100 hover:text-amber-900'
                  }
                `}
              >
                <Icon className={`
                  w-5 h-5 mr-3 transition-colors duration-200
                  ${activeSection === id ? 'text-amber-600' : 'text-amber-500 group-hover:text-amber-600'}
                `} />
                {label}
              </button>
            ))}
          </nav>

          {/* Officer Access Button */}
          <div className="mt-8 pt-6 border-t border-amber-200">
            <button
              onClick={onOfficerAccess}
              className="w-full flex items-center px-4 py-3 rounded-lg text-left font-medium
                       text-amber-700 hover:bg-amber-100 hover:text-amber-900 transition-all duration-200 group"
            >
              <Shield className="w-5 h-5 mr-3 text-amber-500 group-hover:text-amber-600 transition-colors duration-200" />
              Officer Access
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;