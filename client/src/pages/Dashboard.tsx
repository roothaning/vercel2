import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserStats } from "@/components/UserStats";
import { TabNavigation } from "@/components/TabNavigation";
import { MiningInterface } from "@/components/MiningInterface";
import { MarketplaceModal } from "@/components/MarketplaceModal";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("mine");
  const [showMarketModal, setShowMarketModal] = useState(false);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === "market") {
      setShowMarketModal(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-24">
        <UserStats />
        
        <TabNavigation activeTab={activeTab} onChange={handleTabChange} />
        
        {activeTab === "mine" && <MiningInterface />}
        
        {/* Other tabs would be conditionally rendered here */}
        {activeTab !== "mine" && activeTab !== "market" && (
          <div className="text-center py-8 rounded-xl bg-dark-800 border border-flame-700/30">
            <p className="text-gray-400 mb-2">This feature will be available soon!</p>
            <p className="text-sm text-gray-500">Check back later for updates</p>
          </div>
        )}
      </main>
      
      <BottomNavigation />
      
      <MarketplaceModal 
        isOpen={showMarketModal} 
        onClose={() => setShowMarketModal(false)} 
      />
    </div>
  );
}
