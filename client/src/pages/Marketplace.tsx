import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserStats } from "@/components/UserStats";
import { MarketplaceModal } from "@/components/MarketplaceModal";
import { useEffect, useState } from "react";

export default function Marketplace() {
  const [showMarketModal, setShowMarketModal] = useState(false);
  
  // Automatically open marketplace modal when navigating to this page
  useEffect(() => {
    setShowMarketModal(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-24">
        <UserStats />
        
        <div className="text-center py-16">
          <button 
            className="px-6 py-3 rounded-lg bg-flame-600 hover:bg-flame-500 transition-colors font-medium text-white"
            onClick={() => setShowMarketModal(true)}
          >
            Open Marketplace
          </button>
        </div>
      </main>
      
      <BottomNavigation />
      
      <MarketplaceModal 
        isOpen={showMarketModal} 
        onClose={() => setShowMarketModal(false)} 
      />
    </div>
  );
}
