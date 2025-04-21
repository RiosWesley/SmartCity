import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api"; // Import Google Maps components

// Mock data for our city devices
// const mockDevices = [
//   { id: 1, lat: -23.5489, lng: -46.6388, type: "lighting", status: "online" },
//   { id: 2, lat: -23.5505, lng: -46.6333, type: "lighting", status: "offline" },
//   { id: 3, lat: -23.5559, lng: -46.6410, type: "traffic", status: "warning" },
//   { id: 4, lat: -23.5475, lng: -46.6460, type: "traffic", status: "online" },
//   { id: 5, lat: -23.5530, lng: -46.6480, type: "environmental", status: "online" },
//   { id: 6, lat: -23.5520, lng: -46.6370, type: "environmental", status: "warning" },
// ];

interface MapProps {
  className?: string;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  height?: string;
  showDevices?: boolean;
  deviceTypes?: ("lighting" | "traffic" | "environmental")[];
  devices?: { // Add devices prop
    id: string;
    lat: number;
    lng: number;
    type: "lighting" | "traffic" | "environmental";
    status?: string; // Device status (online/offline)
    flow_intensity?: "LOW" | "HIGH"; // Traffic flow intensity
    location?: { // Add location property to device type
      description?: string;
    };
  }[];
}

const Map: React.FC<MapProps> = ({
  className,
  centerLat = -23.5505,
  centerLng = -46.6380,
  zoom = 14,
  height = "400px",
  showDevices = true,
  deviceTypes = ["lighting", "traffic", "environmental"],
  devices, // Destructure devices prop
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the API key from environment variables
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Assuming Vite for environment variables

  useEffect(() => {
    // Simulate map loading (can be removed once Google Maps API is fully integrated)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Filter devices based on deviceTypes and use provided devices or empty array if none
  const devicesToDisplay = devices || []; // Use provided devices or empty array if none
  const filteredDevices = devicesToDisplay.filter(device => deviceTypes.includes(device.type));

  // Get marker color based on device type, status, and flow intensity (using Google Maps standard colors)
  const getMarkerColor = (device: { type: string; status?: string; flow_intensity?: "LOW" | "HIGH" }) => {
    if (device.status === "OFFLINE") return "red"; // Red for offline

    switch (device.type) {
      case "lighting":
        return device.status === "WARNING" ? "yellow" : "blue"; // Yellow or Blue
      case "traffic":
        // Use flow_intensity for traffic color
        if (device.flow_intensity === "HIGH") return "red"; // Red for high congestion
        if (device.flow_intensity === "LOW") return "green"; // Green for low congestion
        return "yellow"; // Yellow for moderate or unknown
      case "environmental":
        return device.status === "WARNING" ? "yellow" : "green"; // Yellow or Green
      default:
        return "blue"; // Blue
    }
  };

  const containerStyle = {
    width: '100%',
    height: height, // Use the height prop
  };

  const center = {
    lat: centerLat,
    lng: centerLng,
  };

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden glass-card border border-white/30",
        className
      )}
      style={{ height }}
    >
      {/* Remove isLoading check and static map once Google Maps is ready */}
      {/* {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-city-blue-200 border-t-city-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-city-gray-500">Carregando mapa...</p>
          </div>
        </div>
      ) : ( */}
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
          >
            {/* Device markers */}
            {showDevices && filteredDevices.map(device => (
              <Marker
                key={device.id}
                position={{ lat: device.lat, lng: device.lng }}
                icon={{
                  // Using default Google Maps marker colors for now
                  // More advanced customization would require custom icons
                  url: `http://maps.google.com/mapfiles/ms/icons/${getMarkerColor(device)}.png`,
                }}
                title={device.location?.description || device.id} // Add title for tooltip
              />
            ))}
          </GoogleMap>
        </LoadScript>
      {/* )} */}

      {/* Map controls (can be integrated into Google Maps options if needed) */}
      {/* <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition-colors">
          +
        </button>
        <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition-colors">
          −
        </button>
      </div> */}
    </div>
  );
};

export default Map;
