import { useTON } from "@/lib/ton.jsx";
import { TONConnectionModal } from "./TONConnectionModal";
import { useState } from "react";

export function Header() {
  const { wallet, isConnecting } = useTON();
  const [showTonModal, setShowTonModal] = useState(false);
  
  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-dark-900 border-b border-flame-700/30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-flame-500 rounded-lg">
              <i className="fas fa-fire text-white animate-flame"></i>
            </div>
            <h1 className="font-montserrat font-bold text-xl text-white">
              <span className="text-flame-500">Flame</span>Coin
            </h1>
          </div>
          
          {/* Wallet Connection Button */}
          <button 
            onClick={() => setShowTonModal(true)}
            className="flex items-center bg-dark-800 hover:bg-dark-700 transition-colors px-3 py-1.5 rounded-full text-sm font-medium border border-flame-700/30"
            disabled={isConnecting}
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
