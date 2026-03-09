import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { walletService } from '@/services/walletService';

interface WalletContextType {
    balance: number;
    isLoading: boolean;
    refreshWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['wallet-balance'],
        queryFn: async () => {
            const response = await walletService.getBalance();
            return Number(response.balance);
        },
        staleTime: 30000, // 30 seconds
        enabled: !!localStorage.getItem('token'),
    });

    const refreshWallet = () => {
        queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        refetch();
    };

    return (
        <WalletContext.Provider value={{ balance: data || 0, isLoading, refreshWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
