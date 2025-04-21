import React, { useState } from "react";
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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardLayout from "@/layout/DashboardLayout";

// MOCK DATA - Ajuda a simular integração Firestore/RTDB
const devices = [
  {
    id: "ESP32-001",
    name: "Sensor Ambiental - Praça Central",
    type: "environmental",
    status: "online",
    battery: 86,
    signal: -65,
    lastSeen: "Agora",
    location: "Praça Central",
    firmware: "v1.2.3",
    kpis: {
      tempC: 23.7,
      humP: 58.2,
      aqi: 15,
      noiseDB: 34.5,
      memoryKb: 124
    }
  },
  {
    id: "ESP32-002",
    name: "Semáforo Principal",
    type: "traffic",
    status: "online",
    battery: 92,
    signal: -57,
    lastSeen: "Agora",
    location: "Av. Paulista",
    firmware: "v1.2.3",
    kpis: {
      vehicles: 350,
      congestion: 0.21,
      memoryKb: 136
    }
  },
  {
    id: "ESP32-003",
    name: "Farol Praça Sul",
    type: "lighting",
    status: "warning",
    battery: 40,
    signal: -74,
    lastSeen: "Há 20 min",
    location: "Praça Sul",
    firmware: "v1.2.2",
    kpis: {
      status: "Ligado",
      onTimeH: 12.6,
      memoryKb: 110
    }
  },
  {
    id: "ESP32-004",
    name: "Sensor Tráfego - Norte",
    type: "traffic",
    status: "offline",
    battery: 0,
    signal: 0,
    lastSeen: "Ontem",
    location: "R. Norte",
    firmware: "v1.2.1",
    kpis: {}
  }
];

// Ícones por tipo
const typeIcon = {
  environmental: <Cpu size={18} className="text-city-green-400" />,
  traffic: <Network size={18} className="text-city-blue-400" />,
  lighting: <Monitor size={18} className="text-city-amber-400" />,
};

const statusColor = {
  online: "bg-city-green-500 text-white",
  warning: "bg-city-amber-500 text-white",
  offline: "bg-city-red-500 text-white",
};

const statusLabel = {
  online: "Online",
  warning: "Atenção",
  offline: "Offline",
};

const DeviceStatusBadge = ({ status }: { status: "online" | "warning" | "offline" }) => (
  <span className={`py-0.5 px-2 rounded-md text-xs font-semibold ${statusColor[status]}`}>
    {statusLabel[status]}
  </span>
);

const DeviceCard = ({ device }: { device: typeof devices[0] }) => (
  <Card className="glass-card p-4 border border-white/20 flex flex-col md:flex-row gap-3 relative">
    <div className="flex flex-col flex-1 min-w-[150px]">
      <div className="flex items-center gap-2">
        <div>{typeIcon[device.type]}</div>
        <div className="font-semibold text-base">{device.name}</div>
        <DeviceStatusBadge status={device.status as any} />
      </div>
      <div className="text-xs text-gray-500">{device.id} | {device.location}</div>
      <div className="mt-2 flex gap-4 items-center text-sm">
        <span className="flex items-center gap-1"><WifiHigh size={14} /> {device.signal} dBm</span>
        <span className="flex items-center gap-1"><BatteryCharging size={14} /> {device.battery}%</span>
        <span className="flex items-center gap-1"><HardDrive size={14} /> FW: {device.firmware}</span>
      </div>
    </div>

    <div className="flex flex-row flex-wrap gap-2 md:gap-4 text-xs mt-2 md:mt-0 md:items-center">
      {device.type === "environmental" && (
        <>
          <Badge>{device.kpis.tempC}°C</Badge>
          <Badge>{device.kpis.humP}% Umid.</Badge>
          <Badge>AQI {device.kpis.aqi}</Badge>
          <Badge>{device.kpis.noiseDB} dB</Badge>
        </>
      )}
      {device.type === "traffic" && (
        <>
          <Badge>{device.kpis.vehicles ?? "-"} veículos</Badge>
          <Badge>Cong: {(device.kpis.congestion*100).toFixed(0) ?? 0}%</Badge>
        </>
      )}
      {device.type === "lighting" && (
        <>
          <Badge>{device.kpis.status}</Badge>
          <Badge>{device.kpis.onTimeH ?? "-"} h ON</Badge>
        </>
      )}
      <Badge variant="outline">Mem: {device.kpis.memoryKb ?? "-"} KB</Badge>
    </div>
    <div className="flex flex-col md:ml-auto gap-2 items-end">
      <Button size="sm" variant="outline">Detalhes</Button>
      <Button size="sm" variant="default" className="flex gap-1"><Edit size={14} /> Editar</Button>
      <Button size="sm" variant="destructive" className="flex gap-1"><Trash2 size={14} /> Remover</Button>
    </div>
  </Card>
);

const DevicesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
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
            <TabsTrigger value="environmental">Ambientais</TabsTrigger>
            <TabsTrigger value="traffic">Tráfego</TabsTrigger>
            <TabsTrigger value="lighting">Iluminação</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => {setSearch(""); setTab("all")}} variant="outline" size="sm">Limpar</Button>
      </div>

      {/* Lista de dispositivos */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((device) => <DeviceCard key={device.id} device={device} />)
        ) : (
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
