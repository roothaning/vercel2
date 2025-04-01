import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useTON } from "@/lib/ton.jsx";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const { wallet } = useTON();
  
  const subscribeMutation = useMutation({
    mutationFn: async ({ tier, paymentType }: { tier: 'standard' | 'vip', paymentType: 'ton' | 'flame' }) => {
      const response = await apiRequest("POST", "/api/premium/subscribe", { tier, paymentType });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Successful",
        description: `You are now a ${data.tier === 'vip' ? 'VIP' : 'Standard'} Premium member!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Subscription Failed",
        description: "Unable to complete the subscription. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubscribe = (tier: 'standard' | 'vip', paymentType: 'ton' | 'flame') => {
    if (!wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your TON wallet first.",
        variant: "destructive",
      });
      return;
    }
    
    subscribeMutation.mutate({ tier, paymentType });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-dark-800 border-flame-700/30 text-white max-w-md pt-16 px-5 relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-flame-600 flex items-center justify-center">
            <i className="fas fa-crown text-4xl text-white"></i>
          </div>
        </div>
        
        <div className="pt-10 text-center mb-6">
          <h2 className="font-montserrat font-bold text-2xl mb-2">Upgrade to Premium</h2>
          <p className="text-gray-300">Boost your mining power and unlock exclusive benefits</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="bg-dark-700 rounded-lg p-4 border border-flame-700/30">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Standard Premium</h3>
              <span className="px-3 py-1 bg-flame-600 rounded-full text-sm">Monthly</span>
            </div>
            
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span className="text-sm">20% Faster Mining Rate</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span className="text-sm">Access to Premium Mining Areas</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span className="text-sm">5% Marketplace Fee Discount</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span className="text-sm">Weekly Bonus: 50 Flame Coins</span>
              </li>
            </ul>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <img src="https://ton.org/download/ton_symbol.svg" alt="TON" className="w-4 h-4 mr-1" />
                  <span className="font-mono font-medium">2.5 / month</span>
                </div>
                <div className="text-xs text-gray-400">or 1,000 FC / month</div>
              </div>
              <Button 
                className="px-4 py-1.5 rounded bg-flame-600 hover:bg-flame-500 transition-colors text-sm font-medium"
                onClick={() => handleSubscribe('standard', 'ton')}
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? "Processing..." : "Subscribe"}
              </Button>
            </div>
          </div>
          
          <div className="bg-dark-700 rounded-lg p-4 border border-yellow-500/40 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/20 rounded-full"></div>
            
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">VIP Premium</h3>
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full text-sm">Yearly</span>
            </div>
            
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span className="text-sm">50% Faster Mining Rate</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span className="text-sm">Access to All Mining Areas</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span className="text-sm">15% Marketplace Fee Discount</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span className="text-sm">Weekly Bonus: 150 Flame Coins</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span className="text-sm">Exclusive Legendary NFT (x3)</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span className="text-sm">Priority Support & Seasonal Rewards</span>
              </li>
            </ul>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <img src="https://ton.org/download/ton_symbol.svg" alt="TON" className="w-4 h-4 mr-1" />
                  <span className="font-mono font-medium">25 / year</span>
                </div>
                <div className="text-xs text-flame-300">16% discount vs monthly</div>
              </div>
              <Button 
                className="px-4 py-1.5 rounded bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 transition-colors text-sm font-medium"
                onClick={() => handleSubscribe('vip', 'ton')}
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? "Processing..." : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="w-full py-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors font-medium"
          onClick={onClose}
        >
          Maybe Later
        </Button>
      </DialogContent>
    </Dialog>
  );
}
