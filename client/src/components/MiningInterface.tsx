import { useQuery, useMutation } from "@tanstack/react-query";
import { EquipmentCard } from "./EquipmentCard";
import { MiningSite } from "./MiningSite";
import { Equipment, MiningSite as MiningSiteType } from "@shared/schema";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

export function MiningInterface() {
  const [isCollecting, setIsCollecting] = useState(false);
  
  const { data: activeEquipment, isLoading: isLoadingEquipment } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment/active'],
  });
  
  const { data: miningSites, isLoading: isLoadingSites } = useQuery<MiningSiteType[]>({
    queryKey: ['/api/mining/sites'],
  });
  
  const { data: miningStatus, isLoading: isLoadingStatus } = useQuery<{
    isActive: boolean;
    progress: number;
    lastHourReward: number;
  }>({
    queryKey: ['/api/mining/status'],
    refetchInterval: 60000, // Refresh every 60 seconds (1 minute)
  });
  
  const collectMutation = useMutation({
    mutationFn: async () => {
      setIsCollecting(true);
      const response = await apiRequest("POST", "/api/mining/collect", {});
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Mining Rewards Collected",
        description: `You received ${data.amount} Flame Coins!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/status'] });
    },
    onError: (error) => {
      toast({
        title: "Collection Failed",
        description: "Unable to collect mining rewards",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsCollecting(false);
    }
  });
  
  const startMiningMutation = useMutation({
    mutationFn: async (siteId: string) => {
      const response = await apiRequest("POST", "/api/mining/start", { siteId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mining Started",
        description: "You have started mining at this location",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/status'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Start Mining",
        description: "Unable to start mining at this location",
        variant: "destructive",
      });
    }
  });
  
  const handleCollectRewards = () => {
    collectMutation.mutate();
  };
  
  const handleStartMining = (siteId: string) => {
    startMiningMutation.mutate(siteId);
  };
  
  return (
    <div className="mining-tab">
      {/* Current Mining Activity */}
      <div className="bg-dark-800 rounded-xl overflow-hidden border border-flame-700/30 mb-6">
        <div className="p-4 pb-2">
          <h2 className="font-medium text-lg mb-1">Active Mining</h2>
          <p className="text-gray-400 text-sm">Use your equipment to mine Flame Coins</p>
        </div>
        
        {/* Mining Animation and Status */}
        <div className="p-4 flex flex-col items-center bg-dark-700 relative flame-bg">
          <div className="rounded-full h-28 w-28 bg-dark-800/80 border-4 border-flame-500 flex items-center justify-center mb-3 relative overflow-hidden">
            <i className="fas fa-hammer text-4xl text-flame-400 animate-pulse-slow"></i>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-flame-500/20"></div>
          </div>
          
          <div className="w-full max-w-xs">
            {isLoadingStatus ? (
              <div className="w-full bg-dark-900 rounded-full h-2 mb-4 animate-pulse"></div>
            ) : (
              <>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Mining Progress</span>
                  <span>{miningStatus?.progress || 0}%</span>
                </div>
                <div className="w-full bg-dark-900 rounded-full h-2 mb-4">
                  <div 
                    className="bg-flame-500 h-2 rounded-full" 
                    style={{ width: `${miningStatus?.progress || 0}%` }}
                  ></div>
                </div>
                
                <div className="text-center mb-2">
                  <span className="text-flame-300 font-medium">+{miningStatus?.lastHourReward || 0} FC</span> 
                  <span className="text-gray-400 text-sm"> in the last hour</span>
                </div>
                
                <button 
                  className="w-full py-2 rounded-lg bg-flame-600 hover:bg-flame-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCollectRewards}
                  disabled={isCollecting || !miningStatus?.isActive}
                >
                  {isCollecting ? "Collecting..." : "Collect Rewards"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Equipment Being Used */}
      <h2 className="font-montserrat font-medium text-lg mb-3">Active Equipment</h2>
      {isLoadingEquipment ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-800 rounded-lg h-36 animate-pulse"></div>
          <div className="bg-dark-800 rounded-lg h-36 animate-pulse"></div>
        </div>
      ) : activeEquipment && activeEquipment.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {activeEquipment.map((equipment) => (
            <EquipmentCard 
              key={equipment.id} 
              equipment={equipment} 
              showRepair
            />
          ))}
        </div>
      ) : (
        <div className="bg-dark-800 rounded-lg p-4 text-center mb-6 border border-flame-700/30">
          <p className="text-gray-400">No active equipment</p>
          <p className="text-sm text-gray-500">Visit the market to purchase equipment</p>
        </div>
      )}

      {/* Mining Sites Section */}
      <h2 className="font-montserrat font-medium text-lg mb-3">Mining Sites</h2>
      {isLoadingSites ? (
        <div className="space-y-4 mb-6">
          <div className="bg-dark-800 rounded-lg h-28 animate-pulse"></div>
          <div className="bg-dark-800 rounded-lg h-28 animate-pulse"></div>
        </div>
      ) : miningSites && miningSites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 mb-6">
          {miningSites.map((site) => (
            <MiningSite 
              key={site.id} 
              site={site} 
              onMine={() => handleStartMining(site.id)} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-dark-800 rounded-lg p-4 text-center mb-6 border border-flame-700/30">
          <p className="text-gray-400">No mining sites available</p>
        </div>
      )}
    </div>
  );
}
