import { useTON } from "@/lib/ton.jsx";
import { TONConnectionModal } from "./TONConnectionModal";
import { useState } from "react";
import { useLocation } from "wouter";

export function Header() {
  const { wallet, isConnecting } = useTON();
  const [showTonModal, setShowTonModal] = useState(false);
  const [location, setLocation] = useLocation();
  
  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-dark-900 border-b border-flame-700/30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => setLocation("/")}
            role="button"
            tabIndex={0}
            aria-label="Go to home page"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-flame-600 to-flame-500 rounded-lg shadow-md">
              <i className="fas fa-fire text-white animate-flame"></i>
            </div>
            <h1 className="font-montserrat font-bold text-xl text-white">
              <span className="text-flame-500">Flame</span>Coin
            </h1>
          </div>
          
          {/* Wallet Connection Button */}
          <button 
            onClick={() => setShowTonModal(true)}
            className="flex items-center bg-dark-800 hover:bg-dark-700 active:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-flame-500/70 focus:ring-offset-1 focus:ring-offset-dark-800 transition-colors px-3 py-1.5 rounded-full text-sm font-medium border border-flame-700/40"
            disabled={isConnecting}
            aria-label={isConnecting ? 'Connecting wallet' : (wallet ? 'Wallet connected' : 'Connect TON wallet')}
          >
            <i className="fas fa-wallet mr-2 text-flame-400"></i>
            <span>{isConnecting ? 'Connecting...' : (wallet ? wallet.shortAddress : 'Connect TON')}</span>
          </button>
        </div>
      </header>

      <TONConnectionModal 
        isOpen={showTonModal} 
        onClose={() => setShowTonModal(false)} 
      />
    </>
  );
}
