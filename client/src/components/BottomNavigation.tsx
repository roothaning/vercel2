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
          <div 
            className={`flex flex-col items-center justify-center cursor-pointer hover:bg-dark-800 ${location === '/' ? 'text-flame-500' : 'text-gray-400'}`}
            onClick={() => setLocation("/")}
            role="button"
            tabIndex={0}
            aria-label="Mine"
          >
            <i className="fas fa-fire text-xl"></i>
            <span className="text-xs mt-1">Mine</span>
          </div>
          
          <div 
            className={`flex flex-col items-center justify-center cursor-pointer hover:bg-dark-800 ${location === '/marketplace' ? 'text-flame-500' : 'text-gray-400'}`}
            onClick={() => setLocation("/marketplace")}
            role="button"
            tabIndex={0}
            aria-label="Market"
          >
            <i className="fas fa-store text-xl"></i>
            <span className="text-xs mt-1">Market</span>
          </div>
          
          <div 
            onClick={handleAdd}
            className="flex flex-col items-center justify-center cursor-pointer hover:opacity-90 active:opacity-80 transition"
            role="button"
            tabIndex={0}
            aria-label="Premium"
          >
            <div className="rounded-full w-14 h-14 bg-gradient-to-r from-flame-600 to-flame-500 flex items-center justify-center -mt-5 shadow-lg">
              <i className="fas fa-plus text-xl"></i>
            </div>
          </div>
          
          <div 
            className={`flex flex-col items-center justify-center cursor-pointer hover:bg-dark-800 ${location === '/inventory' ? 'text-flame-500' : 'text-gray-400'}`}
            onClick={() => setLocation("/inventory")}
            role="button"
            tabIndex={0}
            aria-label="Inventory"
          >
            <i className="fas fa-briefcase text-xl"></i>
            <span className="text-xs mt-1">Inventory</span>
          </div>
          
          <div 
            className={`flex flex-col items-center justify-center cursor-pointer hover:bg-dark-800 ${location === '/profile' ? 'text-flame-500' : 'text-gray-400'}`}
            onClick={() => setLocation("/profile")}
            role="button"
            tabIndex={0}
            aria-label="Profile"
          >
            <i className="fas fa-user text-xl"></i>
            <span className="text-xs mt-1">Profile</span>
          </div>
        </div>
      </nav>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  );
}
