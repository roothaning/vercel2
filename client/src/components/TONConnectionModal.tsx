import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTON } from "@/lib/ton.jsx";
import { useState } from "react";

interface TONConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TONConnectionModal({ isOpen, onClose }: TONConnectionModalProps) {
  const { connect, isConnecting } = useTON();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  
  const wallets = [
    { id: 'tonkeeper', name: 'Tonkeeper', icon: 'wallet', color: 'bg-blue-500' },
    { id: 'telegram', name: 'Telegram Wallet', icon: 'telegram-plane', iconType: 'fab', color: 'bg-indigo-500' },
    { id: 'tonconnect', name: 'TON Connect', icon: 'plug', color: 'bg-purple-500' },
  ];
  
  const handleConnect = async (walletId: string) => {
    setSelectedWallet(walletId);
    try {
      await connect();
      onClose();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setSelectedWallet(null);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-dark-800 border-flame-700/30 text-white max-w-md">
        <DialogHeader className="mb-5">
          <div className="flex justify-between items-center">
            <DialogTitle className="font-montserrat font-bold text-xl">Connect TON Wallet</DialogTitle>
            <Button 
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-dark-700 hover:bg-dark-600"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>
          <DialogDescription className="text-gray-300 mt-2">
            Connect your TON wallet to buy, sell, and trade NFT equipment for Flame Coin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mb-6">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
              onClick={() => handleConnect(wallet.id)}
              disabled={isConnecting}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${wallet.color} flex items-center justify-center mr-3`}>
                  <i className={`${wallet.iconType || 'fas'} fa-${wallet.icon} text-white`}></i>
                </div>
                <span className="font-medium">{wallet.name}</span>
              </div>
              {isConnecting && selectedWallet === wallet.id ? (
                <div className="animate-spin h-4 w-4 border-2 border-flame-500 rounded-full border-t-transparent"></div>
              ) : (
                <i className="fas fa-chevron-right text-gray-500"></i>
              )}
            </button>
          ))}
        </div>
        
        <div className="text-center text-xs text-gray-400">
          By connecting a wallet, you agree to Flame Coin's <a href="#" className="text-flame-400">Terms of Service</a> and <a href="#" className="text-flame-400">Privacy Policy</a>.
        </div>
      </DialogContent>
    </Dialog>
  );
}
