
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock data for our city devices
const mockDevices = [
  { id: 1, lat: -23.5489, lng: -46.6388, type: "lighting", status: "online" },
  { id: 2, lat: -23.5505, lng: -46.6333, type: "lighting", status: "offline" },
  { id: 3, lat: -23.5559, lng: -46.6410, type: "traffic", status: "warning" },
  { id: 4, lat: -23.5475, lng: -46.6460, type: "traffic", status: "online" },
  { id: 5, lat: -23.5530, lng: -46.6480, type: "environmental", status: "online" },
  { id: 6, lat: -23.5520, lng: -46.6370, type: "environmental", status: "warning" },
];

interface MapProps {
  className?: string;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  height?: string;
  showDevices?: boolean;
  deviceTypes?: ("lighting" | "traffic" | "environmental")[];
}

const Map: React.FC<MapProps> = ({
  className,
  centerLat = -23.5505,
  centerLng = -46.6380,
  zoom = 14,
  height = "400px",
  showDevices = true,
  deviceTypes = ["lighting", "traffic", "environmental"],
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Filter devices based on deviceTypes
  const filteredDevices = mockDevices.filter(device => deviceTypes.includes(device.type as any));

  // Get marker color based on device type and status
  const getMarkerColor = (type: string, status: string) => {
    if (status === "offline") return "#FF6E65"; // city-red-500
    
    switch (type) {
      case "lighting":
        return status === "warning" ? "#FFC000" : "#0064FF"; // amber-400 or blue-500
      case "traffic":
        return status === "warning" ? "#FFC000" : "#0BC9C0"; // amber-400 or teal-500
      case "environmental":
        return status === "warning" ? "#FFC000" : "#00E673"; // amber-400 or green-600
      default:
        return "#0064FF"; // city-blue-500
    }
  };

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden glass-card border border-white/30", 
        className
      )}
      style={{ height }}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-city-blue-200 border-t-city-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-city-gray-500">Carregando mapa...</p>
          </div>
        </div>
      ) : (
        <>
          {/* This would be a real map in production */}
          <div 
            ref={mapRef} 
            className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-46.6380,-23.5505,12,0/1200x800?access_token=pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xtYXAifQ.example')] bg-cover bg-center"
          ></div>
          
          {/* Map overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none"></div>
          
          {/* Device markers */}
          {showDevices && filteredDevices.map(device => {
            // Convert lat/lng to relative positions 
            // This is a simplified approach - in a real map you'd use proper conversion
            const left = ((device.lng - (centerLng - 0.02)) / 0.04) * 100;
            const top = ((device.lat - (centerLat + 0.02)) / -0.04) * 100;
            
            return (
              <motion.div
                key={device.id}
                className="absolute z-10"
                style={{ left: `${left}%`, top: `${top}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: Math.random() * 0.5 }}
              >
                <div className="relative">
                  <div 
                    className={`w-3 h-3 rounded-full ${device.status === 'offline' ? '' : 'animate-pulse-slow'}`}
                    style={{ backgroundColor: getMarkerColor(device.type, device.status) }}
                  ></div>
                  <div 
                    className="absolute -inset-1 rounded-full opacity-30"
                    style={{ backgroundColor: getMarkerColor(device.type, device.status) }}
                  ></div>
                </div>
              </motion.div>
            );
          })}
          
          {/* Map controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition-colors">
              +
            </button>
            <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition-colors">
              −
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Map;
