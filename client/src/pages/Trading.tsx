import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserStats } from "@/components/UserStats";
import { useQuery } from "@tanstack/react-query";
import { TradingOffer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTON } from "@/lib/ton.jsx";
import { toast } from "@/hooks/use-toast";

export default function Trading() {
  const [searchTerm, setSearchTerm] = useState("");
  const { wallet } = useTON();
  
  const { data: offers, isLoading } = useQuery<TradingOffer[]>({
    queryKey: ['/api/trading/offers'],
  });
  
  const filteredOffers = offers?.filter(offer => 
    offer.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.equipment.rarity.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleTrade = (offerId: string) => {
    if (!wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your TON wallet to trade",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would open a trading dialog
    toast({
      title: "Trade Functionality",
      description: "Trading feature coming soon!",
    });
  };
  
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-24">
        <UserStats />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">P2P Trading</h1>
          <p className="text-gray-400">Trade equipment with other players</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search equipment..."
              className="w-full bg-dark-700 border-dark-600 rounded-lg pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute right-3 top-2.5 text-gray-400"></i>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="bg-dark-800 rounded-lg h-32 animate-pulse"></div>
            <div className="bg-dark-800 rounded-lg h-32 animate-pulse"></div>
          </div>
        ) : filteredOffers && filteredOffers.length > 0 ? (
          <div className="space-y-4">
            {filteredOffers.map(offer => (
              <div key={offer.id} className="bg-dark-800 rounded-lg overflow-hidden border border-flame-700/30">
                <div className={`h-2 rarity-${offer.equipment.rarity.toLowerCase()}`}></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{offer.equipment.name}</h3>
                      <p className="text-xs text-gray-400">Offered by {offer.sellerName}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      offer.equipment.rarity === 'Legendary' ? 'bg-orange-800 text-orange-200' : 
                      offer.equipment.rarity === 'Rare' ? 'bg-blue-800 text-blue-200' : 
                      offer.equipment.rarity === 'Exclusive' ? 'bg-purple-800 text-purple-200' : 'bg-gray-800 text-gray-200'
                    }`}>{offer.equipment.rarity}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {offer.equipment.stats.map((stat, index) => (
                      <div key={index} className="flex items-center">
                        <i className={`fas fa-${stat.icon} text-flame-400 mr-1.5 w-4`}></i>
                        <span className="text-sm">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <img src="https://ton.org/download/ton_symbol.svg" alt="TON" className="w-4 h-4 mr-1" />
                        <span className="font-mono font-medium">{offer.tonPrice}</span>
                      </div>
                      <div className="text-xs text-gray-400">or {offer.flamePrice} FC</div>
                    </div>
                    <Button 
                      className="px-4 py-1.5 rounded bg-flame-600 hover:bg-flame-500 transition-colors text-sm font-medium"
                      onClick={() => handleTrade(offer.id)}
                    >
                      Trade Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-dark-800 rounded-xl border border-flame-700/30">
            <p className="text-gray-400 mb-2">No trading offers available</p>
            {searchTerm && <p className="text-sm text-gray-500">Try a different search term</p>}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Button 
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-flame-600 to-flame-500 hover:from-flame-500 hover:to-flame-400 transition-colors font-medium"
          >
            Create Trade Offer
          </Button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
