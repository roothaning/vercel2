import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Equipment } from "@shared/schema";
import { EquipmentCard } from "./EquipmentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MarketplaceModal({ isOpen, onClose }: MarketplaceModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: marketItems, isLoading } = useQuery<Equipment[]>({
    queryKey: ['/api/market/items'],
    enabled: isOpen,
  });
  
  const buyMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest("POST", "/api/market/buy", { itemId });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Purchase Successful",
        description: `You have purchased ${data.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/market/items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: "Unable to complete the purchase",
        variant: "destructive",
      });
    }
  });
  
  const listMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/market/list", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Navigate to Inventory",
        description: "Please select items to list from your inventory",
      });
      onClose();
      // This would typically navigate to inventory with a listing mode
    }
  });
  
  const handleBuy = (itemId: string) => {
    buyMutation.mutate(itemId);
  };
  
  const handleListEquipment = () => {
    listMutation.mutate();
  };
  
  const filteredItems = marketItems?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rarity.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-dark-800 border-flame-700/30 text-white max-w-md max-h-[85vh] overflow-auto p-0">
        <DialogHeader className="sticky top-0 bg-dark-800 p-4 border-b border-flame-700/30">
          <div className="flex justify-between items-center">
            <DialogTitle className="font-montserrat font-bold text-xl">Equipment Market</DialogTitle>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-dark-700 hover:bg-dark-600"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-4">
          {/* Search & Filter */}
          <div className="flex mb-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search equipment..."
                className="w-full bg-dark-700 border-dark-600 rounded-lg pr-8 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute right-3 top-2.5 text-gray-400"></i>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="ml-2 bg-dark-700 rounded-lg"
            >
              <i className="fas fa-filter text-gray-400"></i>
            </Button>
          </div>
          
          {/* Equipment Items */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="bg-dark-700 rounded-lg h-32 animate-pulse"></div>
              <div className="bg-dark-700 rounded-lg h-32 animate-pulse"></div>
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-dark-700 rounded-lg overflow-hidden border border-flame-700/30">
                  <div className={`h-2 rarity-${item.rarity.toLowerCase()}`}></div>
                  <div className="p-3">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-dark-800 rounded-lg flex items-center justify-center">
                        <i className={`fas fa-${item.icon} text-2xl ${
                          item.rarity === 'Legendary' ? 'text-orange-400' : 
                          item.rarity === 'Rare' ? 'text-blue-400' : 
                          item.rarity === 'Exclusive' ? 'text-purple-400' : 'text-gray-400'
                        }`}></i>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.rarity === 'Legendary' ? 'bg-orange-800 text-orange-200' : 
                            item.rarity === 'Rare' ? 'bg-blue-800 text-blue-200' : 
                            item.rarity === 'Exclusive' ? 'bg-purple-800 text-purple-200' : 'bg-gray-800 text-gray-200'
                          }`}>{item.rarity}</span>
                        </div>
                        
                        <div className="mt-1 text-sm">
                          {item.stats.map((stat, index) => (
                            <div key={index} className="flex items-center text-gray-300">
                              <i className={`fas fa-${stat.icon} text-flame-400 mr-1.5 w-4`}></i>
                              <span>{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <img src="https://ton.org/download/ton_symbol.svg" alt="TON" className="w-4 h-4 mr-1" />
                          <span className="font-mono font-medium">{item.tonPrice}</span>
                        </div>
                        <div className="text-xs text-gray-400">or {item.flamePrice} FC</div>
                      </div>
                      <Button 
                        className="px-4 py-1.5 rounded bg-flame-600 hover:bg-flame-500 transition-colors text-sm font-medium"
                        onClick={() => handleBuy(item.id)}
                        disabled={buyMutation.isPending}
                      >
                        {buyMutation.isPending ? "Processing..." : "Buy Now"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-400">No items found</p>
              {searchTerm && <p className="text-sm text-gray-500 mt-2">Try a different search term</p>}
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 bg-dark-800 p-4 border-t border-flame-700/30">
          <Button 
            className="w-full py-2 rounded-lg bg-gradient-to-r from-flame-600 to-flame-500 hover:from-flame-500 hover:to-flame-400 transition-colors font-medium"
            onClick={handleListEquipment}
            disabled={listMutation.isPending}
          >
            {listMutation.isPending ? "Processing..." : "List My Equipment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
