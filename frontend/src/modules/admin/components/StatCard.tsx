import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Trend {
  value: number;
  isPositive: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: Trend;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200">
      
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </h2>
        </div>

        {/* FIXED ICON SECTION */}
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Trend Section */}
      {trend && (
        <div className="mt-4 flex items-center text-xs font-medium">
          {trend.isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
          )}

          <span
            className={
              trend.isPositive
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {trend.value}%
          </span>

          <span className="text-gray-400 ml-2">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;