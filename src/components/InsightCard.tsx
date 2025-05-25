
import React from 'react';

interface InsightCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, value, icon, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-6 card-shadow animate-scale-in ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        {icon && <div className="text-blue-500">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-gray-700">
        {value}
      </div>
    </div>
  );
};

export default InsightCard;
