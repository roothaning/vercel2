import React from 'react';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { apiRequest, queryClient } from './queryClient';

// Sabit cüzdan adresi - tüm TON ödemeleri bu adrese gidecek
export const OWNER_WALLET_ADDRESS = "UQAQ2v-hrLbgJ2CRAyTXJbr5cNpXOrbuiOn0vOYuVotzoP1Y" as string;

export interface TONWallet {
  address: string;
  shortAddress: string;
  balance: number;
}

interface TONContextType {
  wallet: TONWallet | null;
  isConnecting: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  sendTransaction: (to: string, amount: number) => Promise<boolean>;
}

const TONContext = createContext<TONContextType>({
  wallet: null,
  isConnecting: false,
  connect: async () => false,
  disconnect: () => {},
  sendTransaction: async () => false,
});

export const useTON = () => useContext(TONContext);

interface TONProviderProps {
  children: ReactNode;
}

export const TONProvider: React.FC<TONProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<TONWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Load wallet from local storage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('ton_wallet');
    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet));
      } catch (error) {
        console.error('Failed to parse saved wallet', error);
        localStorage.removeItem('ton_wallet');
      }
    }
  }, []);

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const connect = async () => {
    setIsConnecting(true);
    try {
      // In a real implementation, we would integrate with TON Connect SDK
      // For now, we'll simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock address - in a real implementation this would come from the wallet
      const mockAddress = 'UQBFXZrsMvcKgHJkXPPOLfv-9O4jJrZbTJR51zEaLQQKXVC3';
      
      const newWallet = {
        address: mockAddress,
        shortAddress: shortenAddress(mockAddress),
        balance: 3.45
      };
      
      setWallet(newWallet);
      localStorage.setItem('ton_wallet', JSON.stringify(newWallet));
      
      // Notify the server about wallet connection
      await apiRequest('POST', '/api/wallet/connect', { address: mockAddress });
      
      // Refresh related data
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      return true;
    } catch (error) {
      console.error('Failed to connect wallet', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet(null);
    localStorage.removeItem('ton_wallet');
    queryClient.invalidateQueries({ queryKey: ['/api/user'] });
  };

  const sendTransaction = async (to: string, amount: number): Promise<boolean> => {
    if (!wallet) return false;
    
    try {
      // In a real implementation, we would use TON SDK to send a transaction
      // For now, we'll simulate the transaction
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Notify the server about the transaction
      await apiRequest('POST', '/api/transactions', { 
        from: wallet.address, 
        to, 
        amount 
      });
      
      // Refresh related data
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      
      return true;
    } catch (error) {
      console.error('Failed to send transaction', error);
      return false;
    }
  };

  return (
    <TONContext.Provider
      value={{
        wallet,
        isConnecting,
        connect,
        disconnect,
        sendTransaction
      }}
    >
      {children}
    </TONContext.Provider>
  );
};
