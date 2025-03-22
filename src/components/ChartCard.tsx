
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  data: any[];
  type?: "line" | "area" | "bar";
  dataKeys: string[];
  colors?: string[];
  className?: string;
  height?: number;
  showGrid?: boolean;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => string;
}

const defaultColors = [
  "#0064FF", // city-blue-500
  "#0BC9C0", // city-teal-500
  "#00E673", // city-green-600
  "#FFC000", // city-amber-400
  "#FF6E65", // city-red-500
];

export function ChartCard({
  title,
  description,
  data,
  type = "line",
  dataKeys,
  colors = defaultColors,
  className,
  height = 300,
  showGrid = true,
  yAxisFormatter = (value) => `${value}`,
  tooltipFormatter = (value) => `${value}`,
}: ChartCardProps) {
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              width={40}
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 2, strokeWidth: 2 }}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              width={40}
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={`${colors[index % colors.length]}40`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              width={40}
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn("overflow-hidden glass-card", className)}>
      <div className="p-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="mt-4" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
