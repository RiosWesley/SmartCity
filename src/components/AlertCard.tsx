
import React from "react";
import { motion } from "framer-motion";
import { Bell, Info, AlertTriangle, AlertOctagon, ArrowRight, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const alertCardVariants = cva(
  "rounded-xl p-4 transition-all duration-300 border",
  {
    variants: {
      severity: {
        info: "bg-city-blue-50/50 border-city-blue-200",
        warning: "bg-city-amber-50/50 border-city-amber-200",
        critical: "bg-city-red-50/50 border-city-red-200",
      },
    },
    defaultVariants: {
      severity: "info",
    },
  }
);

export interface AlertCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertCardVariants> {
  title: string;
  message: string;
  timestamp: string;
  location?: string;
  onDismiss?: () => void;
  onView?: () => void;
}

export function AlertCard({
  className,
  severity,
  title,
  message,
  timestamp,
  location,
  onDismiss,
  onView,
  ...props
}: AlertCardProps) {
  const getIcon = () => {
    switch (severity) {
      case "info":
        return <Info className="text-city-blue-500" size={20} />;
      case "warning":
        return <AlertTriangle className="text-city-amber-500" size={20} />;
      case "critical":
        return <AlertOctagon className="text-city-red-500" size={20} />;
      default:
        return <Bell className="text-city-blue-500" size={20} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(alertCardVariants({ severity, className }))}
      {...props}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-1 text-sm text-gray-600">{message}</div>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span>{timestamp}</span>
            {location && (
              <>
                <span className="mx-1">•</span>
                <span>{location}</span>
              </>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        )}
      </div>
      
      {onView && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
            className="text-xs flex items-center gap-1.5"
          >
            Ver detalhes
            <ArrowRight size={12} />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
