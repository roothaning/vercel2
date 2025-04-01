import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserStats } from "@/components/UserStats";
import { useQuery } from "@tanstack/react-query";
import { User, Transaction } from "@shared/schema";
import { useTON } from "@/lib/ton.jsx";
import { Button } from "@/components/ui/button";
import { PremiumModal } from "@/components/PremiumModal";
import { useState } from "react";

export default function Profile() {
  const { wallet, disconnect } = useTON();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
    enabled: !!wallet,
  });
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-24">
        <UserStats />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account</p>
        </div>
        
        <div className="bg-dark-800 rounded-xl p-4 mb-6 border border-flame-700/30">
          <h2 className="font-medium text-lg mb-3">Account Details</h2>
          
          <div className="space-y-2 mb-4">
            <div>
              <span className="text-gray-400 text-sm">Username:</span>
              <span className="ml-2">{user?.username || 'Not set'}</span>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Wallet:</span>
              <span className="ml-2 font-mono">{wallet?.shortAddress || 'Not connected'}</span>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Premium Status:</span>
              <span className="ml-2">
                {user?.premiumTier === 'standard' ? 'Standard Premium' : 
                 user?.premiumTier === 'vip' ? 'VIP Premium' : 'Free User'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Total Equipment:</span>
              <span className="ml-2">{user?.equipmentCount || 0}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {wallet ? (
              <Button 
                variant="outline" 
                className="bg-dark-700 hover:bg-dark-600 transition-colors"
                onClick={disconnect}
              >
                Disconnect Wallet
              </Button>
            ) : (
              <Button variant="outline" className="bg-dark-700 hover:bg-dark-600 transition-colors">
                Connect Wallet
              </Button>
            )}
            
            <Button 
              className="bg-flame-600 hover:bg-flame-500 transition-colors"
              onClick={() => setShowPremiumModal(true)}
            >
              {user?.premiumTier ? 'Manage Premium' : 'Upgrade to Premium'}
            </Button>
          </div>
        </div>
        
        <div className="bg-dark-800 rounded-xl p-4 mb-6 border border-flame-700/30">
          <h2 className="font-medium text-lg mb-3">Recent Transactions</h2>
          
          {!wallet ? (
            <p className="text-center py-4 text-gray-400">Connect your wallet to see transactions</p>
          ) : isLoadingTransactions ? (
            <div className="space-y-2">
              <div className="h-10 bg-dark-700 rounded animate-pulse"></div>
              <div className="h-10 bg-dark-700 rounded animate-pulse"></div>
              <div className="h-10 bg-dark-700 rounded animate-pulse"></div>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="p-2 rounded bg-dark-700 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{tx.type}</div>
                    <div className="text-xs text-gray-400">{formatDate(tx.timestamp)}</div>
                  </div>
                  <div className={`text-sm font-mono ${tx.type === 'RECEIVE' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'RECEIVE' ? '+' : '-'}{tx.isTon ? `${tx.amount} TON` : `${tx.amount} FC`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-400">No transactions found</p>
          )}
        </div>
      </main>
      
      <BottomNavigation />
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
}
