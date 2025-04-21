import React, { useState, useMemo } from "react";
import {
  Cpu,
  Server,
  BatteryCharging,
  BatteryLow,
  WifiHigh,
  WifiLow,
  Smartphone,
  Settings,
  Info,
  Trash2,
  CircleCheck,
  Edit,
  Monitor,
  List,
  HardDrive,
  Network,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardLayout from "@/layout/DashboardLayout";
import { useFirebaseData } from "@/hooks/useFirebaseData"; // Import useFirebaseData hook

// Ícones por tipo
const typeIcon = {
  environmental: <Cpu size={18} className="text-city-green-400" />,
  traffic: <Network size={18} className="text-city-blue-400" />,
  lighting: <Monitor size={18} className="text-city-amber-400" />,
};

const statusColor = {
  ONLINE: "bg-city-green-500 text-white",
  WARNING: "bg-city-amber-500 text-white",
  OFFLINE: "bg-city-red-500 text-white",
};

const statusLabel = {
  ONLINE: "Online",
  WARNING: "Atenção",
  OFFLINE: "Offline",
};

// Define a type for the device data from Firebase
interface FirebaseDevice {
  deviceType: string;
  status: "ONLINE" | "WARNING" | "OFFLINE";
  last_seen_timestamp: number;
  location: {
    lat: number;
    lng: number;
    description: string;
  };
  rssi: number;
  uptimeS: number;
  freeHeapB: number;
  batteryP: number | null;
  fwVersion: string;
  sysErr: string | null;
  // Add other potential fields from the Firebase structure if needed for display
  reported_luminosity?: number; // Example from lighting_status
  traffic_flow?: any; // Example from traffic_sensors
  readings?: any; // Example from environmental_sensors
}

// Define a type for the transformed device data used in the component
interface Device {
  id: string;
  name: string; // We'll need to derive or add this
  type: string;
  status: "online" | "warning" | "offline"; // Map Firebase status to component status
  battery: number | null;
  signal: number;
  lastSeen: string; // We'll need to format this
  location: string; // Use description from Firebase
  firmware: string;
  kpis: any; // This will vary by device type
}

import { useSendCommand } from "@/hooks/useSendCommand"; // Import useSendCommand hook


const DeviceStatusBadge = ({ status }: { status: "online" | "warning" | "offline" }) => (
  <span className={`py-0.5 px-2 rounded-md text-xs font-semibold ${statusColor[status.toUpperCase() as keyof typeof statusColor]}`}>
    {statusLabel[status.toUpperCase() as keyof typeof statusLabel]}
  </span>
);

const DeviceCard = ({ device }: { device: Device }) => {
  const { sendCommand, loading: sendingCommand, error: sendError, success: sendSuccess } = useSendCommand();

  const handleToggleLighting = async () => {
    const targetStatus = device.kpis?.status === true ? "OFF" : "ON";
    const commandData = {
      target_status: targetStatus,
      command_timestamp: Date.now(),
      requested_by: "frontend_user", // Placeholder
    };
    const commandPath = `/lighting_commands/${device.id}`;
    await sendCommand(commandPath, commandData);
    // Basic feedback - could be replaced with a toast notification
    if (sendError) {
      console.error("Erro ao enviar comando:", sendError);
    } else if (sendSuccess) {
      console.log("Comando enviado com sucesso!");
    }
  };


  return (
    <Card className="glass-card p-4 border border-white/20 flex flex-col md:flex-row gap-3 relative">
      <div className="flex flex-col flex-1 min-w-[150px]">
        <div className="flex items-center gap-2">
          <div>{typeIcon[device.type as keyof typeof typeIcon]}</div>
          <div className="font-semibold text-base">{device.name}</div>
          <DeviceStatusBadge status={device.status} />
        </div>
        <div className="text-xs text-gray-500">{device.id} | {device.location}</div>
        <div className="mt-2 flex gap-4 items-center text-sm">
          <span className="flex items-center gap-1"><WifiHigh size={14} /> {device.signal} dBm</span>
          {device.battery !== null && (
             <span className="flex items-center gap-1">
               {device.battery > 20 ? <BatteryCharging size={14} /> : <BatteryLow size={14} />}
               {device.battery}%
             </span>
          )}
          <span className="flex items-center gap-1"><HardDrive size={14} /> FW: {device.firmware}</span>
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-2 md:gap-4 text-xs mt-2 md:mt-0 md:items-center">
        {device.type === "environmental_sensor" && device.kpis?.readings && (
          <>
            <Badge>{device.kpis.readings.temperature?.celsius}°C</Badge>
            <Badge>{device.kpis.readings.humidity?.percentage}% Umid.</Badge>
            <Badge>AQI {device.kpis.readings.air_quality?.general_aqi_level}</Badge>
            <Badge>{device.kpis.readings.noise_level?.estimated_dba_avg} dB</Badge>
          </>
        )}
        {device.type === "traffic_sensor" && device.kpis?.traffic_flow && (
          <>
            <Badge>{device.kpis.traffic_flow.vehicle_count_last_period ?? "-"} veículos</Badge>
            <Badge>Fluxo: {device.kpis.traffic_flow.flow_intensity ?? "-"}</Badge>
          </>
        )}
         {device.type === "lighting" && device.kpis?.status !== undefined && (
          <>
            <Badge>{device.kpis.status ? "Ligado" : "Desligado"}</Badge>
            {/* Assuming onTimeH is not directly available in device_status, might need another hook or data source */}
            {/* <Badge>{device.kpis.onTimeH ?? "-"} h ON</Badge> */}
          </>
        )}
        {device.kpis?.freeHeapB !== undefined && <Badge variant="outline">Mem: {(device.kpis.freeHeapB / 1024).toFixed(0)} KB</Badge>}
      </div>
      <div className="flex flex-col md:ml-auto gap-2 items-end">
        {device.type === "lighting" && (
           <Button size="sm" variant="secondary" onClick={handleToggleLighting} disabled={sendingCommand}>
             {sendingCommand ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
             {device.kpis?.status ? "Desligar" : "Ligar"}
           </Button>
        )}
        <Button size="sm" variant="outline">Detalhes</Button>
        <Button size="sm" variant="default" className="flex gap-1"><Edit size={14} /> Editar</Button>
        <Button size="sm" variant="destructive" className="flex gap-1"><Trash2 size={14} /> Remover</Button>
      </div>
    </Card>
  );
};

const DevicesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  // Use the hook to fetch device status data
  const { data: firebaseDevicesData, loading, error } = useFirebaseData("/device_status");
  // Use another hook or combine data if needed for full device info (like names, specific sensor readings)
  // For now, we'll use the device_status data and try to map it

  const devices: Device[] = useMemo(() => {
    if (!firebaseDevicesData || typeof firebaseDevicesData !== 'object') return [];

    return Object.entries(firebaseDevicesData).map(([id, deviceData]: [string, any]) => {
      // Attempt to map Firebase data to the component's expected structure
      // This mapping might need refinement based on how other data (like names, full sensor readings) is structured in Firebase
      // For now, we'll use available data from device_status and make some assumptions
      const statusMap: { [key: string]: "online" | "warning" | "offline" } = {
        ONLINE: "online",
        WARNING: "warning",
        OFFLINE: "offline",
      };

      // Placeholder for device name - ideally this would come from a separate 'devices' node or similar
      // For now, use the ID or location description
      const name = deviceData?.location?.description || id;

      // Map deviceType from Firebase to a simpler type if needed, or use directly
      const type = deviceData?.deviceType || "unknown"; // Use deviceType directly, default to unknown

      // Map status
      const status = statusMap[deviceData?.status] || "offline";

      // Format last seen timestamp
      const lastSeen = deviceData?.last_seen_timestamp ? new Date(deviceData.last_seen_timestamp).toLocaleString() : "N/A";

      // Combine relevant KPIs from device_status and potentially other sources if available
      // For this initial implementation, we'll include some basic stats from device_status
      const kpis = {
        memoryKb: deviceData?.freeHeapB,
        uptimeS: deviceData?.uptimeS,
        rssi: deviceData?.rssi,
        batteryP: deviceData?.batteryP,
        // Add other relevant fields from deviceData or other potential data sources
        ...deviceData, // Include all data for now, filter in DeviceCard
      };


      return {
        id,
        name,
        type,
        status: status as "online" | "warning" | "offline", // Cast to expected type
        battery: deviceData?.batteryP,
        signal: deviceData?.rssi,
        lastSeen,
        location: deviceData?.location?.description || "N/A",
        firmware: deviceData?.fwVersion,
        kpis,
      };
    });
  }, [firebaseDevicesData]);


  const filtered = devices.filter(d =>
    (tab === "all" || d.type === tab) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.id.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === "online").length,
    offline: devices.filter(d => d.status === "offline").length,
    warning: devices.filter(d => d.status === "warning").length,
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dispositivos</h1>
        <p className="text-gray-500">Gerencie, monitore e analise os dispositivos conectados ao sistema Smart City.</p>
      </div>

      {/* Indicadores rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card p-4 flex gap-3 items-center">
          <Server /><span className="font-semibold">Total</span><span>{stats.total}</span>
        </Card>
        <Card className="glass-card p-4 flex gap-3 items-center">
          <CircleCheck className="text-city-green-500" /><span className="font-semibold">Online</span><span>{stats.online}</span>
        </Card>
        <Card className="glass-card p-4 flex gap-3 items-center">
          <Info className="text-city-amber-500" /><span className="font-semibold">Atenção</span><span>{stats.warning}</span>
        </Card>
        <Card className="glass-card p-4 flex gap-3 items-center">
          <WifiLow className="text-city-red-500" /><span className="font-semibold">Offline</span><span>{stats.offline}</span>
        </Card>
      </div>

      {/* Filtragem e busca */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <Input className="flex-1" placeholder="Buscar dispositivo por nome ou id..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="environmental_sensor">Ambientais</TabsTrigger>
            <TabsTrigger value="traffic_sensor">Tráfego</TabsTrigger>
            <TabsTrigger value="lighting">Iluminação</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => {setSearch(""); setTab("all")}} variant="outline" size="sm">Limpar</Button>
      </div>

      {/* Lista de dispositivos */}
      <div className="space-y-4">
        {loading && (
           <Card className="glass-card p-8 flex flex-col items-center justify-center text-center">
             <Loader2 size={42} className="mb-2 animate-spin" />
             <h3 className="text-lg font-medium">Carregando dispositivos...</h3>
           </Card>
        )}

        {error && (
           <Card className="glass-card p-8 flex flex-col items-center justify-center text-center border-red-500 text-red-500">
             <Info size={42} className="mb-2" />
             <h3 className="text-lg font-medium">Erro ao carregar dispositivos</h3>
             <div className="text-sm">{error.message}</div>
           </Card>
        )}

        {!loading && !error && filtered.length > 0 ? (
          filtered.map((device) => <DeviceCard key={device.id} device={device} />)
        ) : !loading && !error && (
          <Card className="glass-card p-8 flex flex-col items-center justify-center text-center">
            <Server size={42} className="mb-2" />
            <h3 className="text-lg font-medium">Nenhum dispositivo encontrado</h3>
            <div className="text-gray-500 text-sm">Tente ajustar a busca ou filtros.</div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DevicesPage;
