import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserStats } from "@/components/UserStats";
import { EquipmentCard } from "@/components/EquipmentCard";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Inventory() {
  const { data: inventory, isLoading } = useQuery<Equipment[]>({
    queryKey: ['/api/inventory'],
  });
  
  const equipMutation = useMutation({
    mutationFn: async (equipmentId: string) => {
      const response = await apiRequest("POST", "/api/equipment/equip", { equipmentId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Equipment Equipped",
        description: "The item has been added to your active equipment",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/equipment/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Equip",
        description: "Unable to equip this item",
        variant: "destructive",
      });
    }
  });
  
  const unequipMutation = useMutation({
    mutationFn: async (equipmentId: string) => {
      const response = await apiRequest("POST", "/api/equipment/unequip", { equipmentId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Equipment Removed",
        description: "The item has been removed from your active equipment",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/equipment/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Remove",
        description: "Unable to remove this item",
        variant: "destructive",
      });
    }
  });
  
  const handleEquip = (equipmentId: string) => {
    equipMutation.mutate(equipmentId);
  };
  
  const handleUnequip = (equipmentId: string) => {
    unequipMutation.mutate(equipmentId);
  };
  
  // Filter equipment by whether they're equipped
  const equippedItems = inventory?.filter(item => item.isEquipped) || [];
  const unequippedItems = inventory?.filter(item => !item.isEquipped) || [];
  
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-24">
        <UserStats />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Inventory</h1>
          <p className="text-gray-400">Manage your equipment</p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="equipped">Equipped</TabsTrigger>
            <TabsTrigger value="unequipped">Unequipped</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-800 rounded-lg h-40 animate-pulse"></div>
                <div className="bg-dark-800 rounded-lg h-40 animate-pulse"></div>
                <div className="bg-dark-800 rounded-lg h-40 animate-pulse"></div>
                <div className="bg-dark-800 rounded-lg h-40 animate-pulse"></div>
              </div>
            ) : inventory && inventory.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {inventory.map(item => (
                  <div key={item.id} className="relative">
                    <EquipmentCard equipment={item} showRepair />
                    <div className="mt-2">
                      <Button 
                        className="w-full text-xs"
                        variant={item.isEquipped ? "destructive" : "default"}
                        onClick={() => item.isEquipped ? handleUnequip(item.id) : handleEquip(item.id)}
                        disabled={equipMutation.isPending || unequipMutation.isPending}
                      >
                        {item.isEquipped ? "Unequip" : "Equip"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-dark-800 rounded-xl border border-flame-700/30">
                <p className="text-gray-400 mb-2">No equipment in your inventory</p>
                <p className="text-sm text-gray-500">Visit the marketplace to purchase equipment</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="equipped">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-800 rounded-lg h-40 animate-pulse"></div>
                <div className="bg-dark-800 rounded-lg h-40 animate-pulse"></div>
              </div>
            ) : equippedItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {equippedItems.map(item => (
                  <div key={item.id} className="relative">
                    <EquipmentCard equipment={item} showRepair />
                    <div className="mt-2">
                      <Button 
                        className="w-full text-xs"
                        variant="destructive"
                        onClick={() => handleUnequip(item.id)}
                        disabled={unequipMutation.isPending}
                      >
                        Unequip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-dark-800 rounded-xl border border-flame-700/30">
                <p className="text-gray-400">No equipment currently equipped</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unequipped">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-800 rounded-lg h-40 animate-pulse"></div>
                <div className="bg-dark-800 rounded-lg h-40 animate-pulse"></div>
              </div>
            ) : unequippedItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {unequippedItems.map(item => (
                  <div key={item.id} className="relative">
                    <EquipmentCard equipment={item} showRepair />
                    <div className="mt-2">
                      <Button 
                        className="w-full text-xs"
                        onClick={() => handleEquip(item.id)}
                        disabled={equipMutation.isPending}
                      >
                        Equip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-dark-800 rounded-xl border border-flame-700/30">
                <p className="text-gray-400">All your equipment is currently equipped</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
