
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const statusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        online: "bg-city-green-100 text-city-green-800",
        offline: "bg-city-red-100 text-city-red-800",
        warning: "bg-city-amber-100 text-city-amber-800",
        info: "bg-city-blue-100 text-city-blue-800",
        neutral: "bg-city-gray-100 text-city-gray-800",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

const dotVariants = cva("w-2 h-2 rounded-full mr-1.5", {
  variants: {
    variant: {
      online: "bg-city-green-500",
      offline: "bg-city-red-500",
      warning: "bg-city-amber-500",
      info: "bg-city-blue-500",
      neutral: "bg-city-gray-500",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {
  animate?: boolean;
}

export function StatusIndicator({
  className,
  variant,
  children,
  animate = true,
  ...props
}: StatusIndicatorProps) {
  return (
    <span
      className={cn(statusVariants({ variant, className }))}
      {...props}
    >
      {animate ? (
        <motion.span
          className={cn(dotVariants({ variant }))}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      ) : (
        <span className={cn(dotVariants({ variant }))} />
      )}
      {children}
    </span>
  );
}
