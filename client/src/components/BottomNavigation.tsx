import { Link, useLocation } from "wouter";
import { useState } from "react";
import { PremiumModal } from "./PremiumModal";

export function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleAdd = () => {
    setShowPremiumModal(true);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-flame-700/30 z-40">
        <div className="grid grid-cols-5 h-16">
          <Link href="/">
            <a className={`flex flex-col items-center justify-center ${location === '/' ? 'text-flame-500' : 'text-gray-500'}`}>
              <i className="fas fa-fire text-xl"></i>
              <span className="text-xs mt-1">Mine</span>
            </a>
          </Link>
          
          <Link href="/marketplace">
            <a className={`flex flex-col items-center justify-center ${location === '/marketplace' ? 'text-flame-500' : 'text-gray-500'}`}>
              <i className="fas fa-store text-xl"></i>
              <span className="text-xs mt-1">Market</span>
            </a>
          </Link>
          
          <a 
            onClick={handleAdd}
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="rounded-full w-14 h-14 bg-gradient-to-r from-flame-600 to-flame-500 flex items-center justify-center -mt-5 shadow-lg">
              <i className="fas fa-plus text-xl"></i>
            </div>
          </a>
          
          <Link href="/inventory">
            <a className={`flex flex-col items-center justify-center ${location === '/inventory' ? 'text-flame-500' : 'text-gray-500'}`}>
              <i className="fas fa-backpack text-xl"></i>
              <span className="text-xs mt-1">Inventory</span>
            </a>
          </Link>
          
          <Link href="/profile">
            <a className={`flex flex-col items-center justify-center ${location === '/profile' ? 'text-flame-500' : 'text-gray-500'}`}>
              <i className="fas fa-user text-xl"></i>
              <span className="text-xs mt-1">Profile</span>
            </a>
          </Link>
        </div>
      </nav>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  );
}
