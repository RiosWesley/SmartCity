
import React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statsCardVariants = cva(
  "rounded-xl p-4 transition-all duration-300 h-full",
  {
    variants: {
      variant: {
        default: "glass-card",
        blue: "glass-card border-city-blue-200",
        green: "glass-card border-city-green-200",
        amber: "glass-card border-city-amber-200",
        red: "glass-card border-city-red-200",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface StatsCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statsCardVariants> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive?: boolean;
  };
  subtitle?: string;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  (
    {
      className,
      variant,
      size,
      title,
      value,
      icon,
      trend,
      subtitle,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ translateY: -4 }}
        className={cn(statsCardVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="mt-1 text-2xl font-semibold">{value}</h3>
            {subtitle && (
              <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-full bg-city-blue-50 text-city-blue-500">
              {icon}
            </div>
          )}
        </div>
        
        {trend && (
          <div className="mt-3 flex items-center">
            <span
              className={`text-xs ${
                trend.positive
                  ? "text-city-green-500"
                  : "text-city-red-500"
              }`}
            >
              {trend.positive ? "+" : ""}
              {trend.value}%
            </span>
            <span className="ml-1.5 text-xs text-gray-500">
              desde o último mês
            </span>
          </div>
        )}
      </motion.div>
    );
  }
);

StatsCard.displayName = "StatsCard";

export { StatsCard };
