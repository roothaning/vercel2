import { Equipment } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface EquipmentCardProps {
  equipment: Equipment;
  showRepair?: boolean;
}

export function EquipmentCard({ equipment, showRepair = false }: EquipmentCardProps) {
  const repairMutation = useMutation({
    mutationFn: async (equipmentId: string) => {
      const response = await apiRequest("POST", "/api/equipment/repair", { equipmentId });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Equipment Repaired",
        description: `Durability restored to ${data.durability}%`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/equipment/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error) => {
      toast({
        title: "Repair Failed",
        description: "Unable to repair equipment. Insufficient funds?",
        variant: "destructive",
      });
    }
  });
  
  const handleRepair = () => {
    repairMutation.mutate(equipment.id);
  };
  
  const getDurabilityColor = (durability: number) => {
    if (durability > 70) return "bg-green-500";
    if (durability > 40) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getRarityClass = (rarity: string) => {
    const rarityLower = rarity.toLowerCase();
    return `rarity-${rarityLower}`;
  };
  
  return (
    <div className="bg-dark-800 rounded-lg overflow-hidden border border-flame-700/30">
      <div className={`h-2 ${getRarityClass(equipment.rarity)}`}></div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm">{equipment.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            equipment.rarity === 'Legendary' ? 'bg-orange-800 text-orange-200' : 
            equipment.rarity === 'Rare' ? 'bg-blue-800 text-blue-200' : 
            equipment.rarity === 'Exclusive' ? 'bg-purple-800 text-purple-200' : 'bg-gray-800 text-gray-200'
          }`}>{equipment.rarity}</span>
        </div>
        
        {equipment.stats.map((stat, index) => (
          <div key={index} className="flex items-center mb-2">
            <i className={`fas fa-${stat.icon} text-flame-400 mr-1.5`}></i>
            <span className="text-sm">{stat.value}</span>
          </div>
        ))}
        
        {/* Durability Bar */}
        <div className="text-xs text-gray-400 mb-1 flex justify-between">
          <span>Durability</span>
          <span>{equipment.durability}%</span>
        </div>
        <div className="durability-bar mb-2">
          <div 
            className={`durability-value ${getDurabilityColor(equipment.durability)}`} 
            style={{ width: `${equipment.durability}%` }}
          ></div>
        </div>
        
        {showRepair && (
          <Button 
            variant="outline"
            className="w-full py-1.5 text-xs rounded bg-dark-700 hover:bg-dark-600 transition-colors"
            onClick={handleRepair}
            disabled={repairMutation.isPending || equipment.durability === 100}
          >
            <i className="fas fa-wrench mr-1"></i> Repair ({equipment.repairCost} FC)
          </Button>
        )}
      </div>
    </div>
  );
}
