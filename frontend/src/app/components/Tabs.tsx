import React from 'react';

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ items, activeTab, onChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-8">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`
              relative pb-4 px-1 transition-colors
              ${activeTab === item.id
                ? 'text-blue-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.count}
              </span>
            )}
            {activeTab === item.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
