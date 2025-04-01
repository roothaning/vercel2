import { useState } from "react";
import { useLocation } from "wouter";

interface TabNavigationProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onChange }: TabNavigationProps) {
  const tabs = [
    { id: 'mine', label: 'MINE' },
    { id: 'market', label: 'MARKET' },
    { id: 'inventory', label: 'INVENTORY' },
    { id: 'trade', label: 'TRADE' },
  ];

  return (
    <div className="flex border-b border-flame-700/30 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 py-3 text-center font-medium text-sm ${
            activeTab === tab.id ? 'tab-active' : 'text-gray-400'
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
