import { MiningSite as MiningSiteType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useTON } from "@/lib/ton.jsx";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface MiningSiteProps {
  site: MiningSiteType;
  onMine: () => void;
}

export function MiningSite({ site, onMine }: MiningSiteProps) {
  const { wallet } = useTON();
  const [isMining, setIsMining] = useState(false);
  
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  const handleMine = () => {
    if (!wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your TON wallet to start mining",
        variant: "destructive",
      });
      return;
    }
    
    if (site.isPremium && (!user?.premiumTier || user?.premiumTier === 'none')) {
      toast({
        title: "Premium Required",
        description: "This mining site requires a premium subscription",
        variant: "destructive",
      });
      return;
    }
    
    if (site.seasonalEvent && !site.isEventActive) {
      toast({
        title: "Event Not Active",
        description: "This seasonal event is not currently active",
        variant: "destructive",
      });
      return;
    }
    
    if (user && user.miningPower < site.minPower) {
      toast({
        title: "Insufficient Mining Power",
        description: `You need at least ${site.minPower} mining power for this site`,
        variant: "destructive",
      });
      return;
    }
    
    setIsMining(true);
    onMine();
    setTimeout(() => setIsMining(false), 1000);
  };
  
  const getButtonStyle = () => {
    if (site.isPremium) {
      return "bg-dark-700 hover:bg-dark-600";
    }
    if (site.seasonalEvent) {
      return "bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500";
    }
    return "bg-flame-600 hover:bg-flame-500";
  };
  
  return (
    <div className="bg-dark-800 rounded-lg overflow-hidden border border-flame-700/30 flex relative">
      <div 
        className={`w-28 h-28 bg-cover bg-center ${site.isPremium && (!user?.premiumTier || user?.premiumTier === 'none') ? 'filter grayscale' : ''}`} 
        style={{ backgroundImage: `url('${site.imageUrl}')` }}
      ></div>
      <div className="p-3 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{site.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            site.isPremium ? 'bg-yellow-800 text-yellow-200' : 
            site.seasonalEvent ? 'bg-purple-800 text-purple-200' : 
            'bg-green-800 text-green-200'
          }`}>
            {site.isPremium ? 'Premium' : site.seasonalEvent ? 'Season Event' : 'Active'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-xs">
            <span className="text-gray-400">Yield Rate:</span>
            <span className="ml-1">{site.yieldRate} FC/hour</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-400">Difficulty:</span>
            <span className="ml-1">{site.difficulty}</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-400">Min Power:</span>
            <span className="ml-1">{site.minPower} MP</span>
          </div>
          <div className="text-xs">
            {site.seasonalEvent && site.remainingTime ? (
              <>
                <span className="text-gray-400">Remaining:</span>
                <span className="ml-1 text-red-400">{site.remainingTime}</span>
              </>
            ) : (
              <>
                <span className="text-gray-400">Active Miners:</span>
                <span className="ml-1">{site.activeMiners}</span>
              </>
            )}
          </div>
        </div>
        
        <Button 
          className={`w-full py-1.5 rounded text-sm font-medium transition-colors ${getButtonStyle()}`}
          onClick={handleMine}
          disabled={isMining}
        >
          {site.isPremium && (!user?.premiumTier || user?.premiumTier === 'none') ? (
            <>
              <i className="fas fa-crown text-yellow-300 mr-1"></i> Unlock with Premium
            </>
          ) : site.seasonalEvent ? (
            <>
              <i className="fas fa-gem mr-1"></i> Enter Event
            </>
          ) : (
            <>Mine Here</>
          )}
        </Button>
      </div>
      
      {/* Premium Lock Overlay */}
      {site.isPremium && (!user?.premiumTier || user?.premiumTier === 'none') && (
        <div className="absolute inset-0 flex items-center justify-center blur-overlay">
          <div className="bg-dark-900/80 rounded-full p-3">
            <i className="fas fa-lock text-xl text-yellow-400"></i>
          </div>
        </div>
      )}
    </div>
  );
}
