
import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layout/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ChartCard } from "@/components/ChartCard";
import { AlertCard } from "@/components/AlertCard";
import Map from "@/components/Map";
import {
  LayoutDashboard,
  Lightbulb,
  Car,
  Leaf,
  AlertCircle,
  Signal,
  Wifi,
  ArrowRight,
} from "lucide-react";
import { StatusIndicator } from "@/components/StatusIndicator";

// Mock data for our dashboard
const deviceStats = [
  { name: "Jan", value: 342 },
  { name: "Fev", value: 385 },
  { name: "Mar", value: 410 },
  { name: "Abr", value: 458 },
  { name: "Mai", value: 486 },
  { name: "Jun", value: 512 },
  { name: "Jul", value: 538 },
];

const deviceStatusData = [
  { name: "Jan", online: 300, offline: 42 },
  { name: "Fev", online: 350, offline: 35 },
  { name: "Mar", online: 370, offline: 40 },
  { name: "Abr", online: 420, offline: 38 },
  { name: "Mai", online: 450, offline: 36 },
  { name: "Jun", online: 490, offline: 22 },
  { name: "Jul", online: 510, offline: 28 },
];

const deviceTypeData = [
  { name: "Iluminação", value: 215 },
  { name: "Tráfego", value: 198 },
  { name: "Ambiental", value: 125 },
];

const energyConsumptionData = [
  { name: "Jan", consumption: 1240 },
  { name: "Fev", consumption: 1380 },
  { name: "Mar", consumption: 1280 },
  { name: "Abr", consumption: 1430 },
  { name: "Mai", consumption: 1520 },
  { name: "Jun", consumption: 1380 },
  { name: "Jul", consumption: 1240 },
];

const alertsData = [
  {
    id: 1,
    title: "Falha no sensor de iluminação",
    message: "O sensor de iluminação ID-3245 não está respondendo há 15 minutos.",
    timestamp: "Há 35 minutos",
    location: "Av. Paulista, 1000",
    severity: "warning",
  },
  {
    id: 2,
    title: "Congestionamento severo detectado",
    message: "Tráfego intenso detectado na região central. Tempo de espera estimado: 25 min.",
    timestamp: "Há 12 minutos",
    location: "Av. Rebouças",
    severity: "critical",
  },
  {
    id: 3,
    title: "Qualidade do ar abaixo do ideal",
    message: "Níveis de poluição acima do normal detectados na zona leste.",
    timestamp: "Há 1 hora",
    location: "Zona Leste",
    severity: "info",
  },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Monitore e controle os sistemas da cidade em tempo real</p>
        </motion.div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total de Dispositivos"
          value="538"
          trend={{ value: 5.2, positive: true }}
          icon={<Signal size={18} />}
        />
        <StatsCard
          title="Dispositivos Online"
          value="510"
          trend={{ value: 2.8, positive: true }}
          variant="green"
          icon={<Wifi size={18} />}
        />
        <StatsCard
          title="Alertas Ativos"
          value="8"
          trend={{ value: 1.5, positive: false }}
          variant="amber"
          icon={<AlertCircle size={18} />}
        />
        <StatsCard
          title="Consumo de Energia"
          value="1240 kWh"
          trend={{ value: 3.2, positive: false }}
          variant="blue"
          icon={<Lightbulb size={18} />}
        />
      </div>

      {/* Map and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Mapa da Cidade</h2>
              <div className="flex items-center gap-2">
                <StatusIndicator variant="online">Online (510)</StatusIndicator>
                <StatusIndicator variant="offline">Offline (28)</StatusIndicator>
              </div>
            </div>
            <Map height="400px" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Alertas Recentes</h2>
            <button className="text-sm text-city-blue-500 hover:underline flex items-center gap-1">
              Ver todos
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {alertsData.map((alert) => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                message={alert.message}
                timestamp={alert.timestamp}
                location={alert.location}
                severity={alert.severity as any}
                onView={() => console.log("View alert", alert.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Dispositivos por Tempo"
          description="Crescimento mensal da rede"
          data={deviceStats}
          type="area"
          dataKeys={["value"]}
          colors={["#0064FF"]}
        />
        <ChartCard
          title="Status dos Dispositivos"
          description="Dispositivos online vs offline"
          data={deviceStatusData}
          type="bar"
          dataKeys={["online", "offline"]}
          colors={["#00E673", "#FF6E65"]}
        />
      </div>

      {/* Monitoring Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Monitoramento em Tempo Real</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-5 border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-city-blue-100 text-city-blue-500 mr-3">
                  <Lightbulb size={20} />
                </div>
                <h3 className="font-medium">Iluminação</h3>
              </div>
              <StatusIndicator variant="online">215 dispositivos</StatusIndicator>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Consumo atual</span>
                <span>1240 kWh</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Luzes ligadas</span>
                <span>178 (83%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Economia mensal</span>
                <span className="text-city-green-500">12%</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm text-city-blue-500 hover:text-city-blue-600 hover:bg-city-blue-50 rounded-lg transition-colors flex items-center justify-center">
              Ver detalhes
              <ArrowRight size={14} className="ml-1" />
            </button>
          </div>

          <div className="glass-card rounded-xl p-5 border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-city-teal-100 text-city-teal-500 mr-3">
                  <Car size={20} />
                </div>
                <h3 className="font-medium">Tráfego</h3>
              </div>
              <StatusIndicator variant="online">198 dispositivos</StatusIndicator>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Vias monitoradas</span>
                <span>85</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fluxo atual</span>
                <span>Moderado</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tempo médio</span>
                <span>18 min</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm text-city-teal-500 hover:text-city-teal-600 hover:bg-city-teal-50 rounded-lg transition-colors flex items-center justify-center">
              Ver detalhes
              <ArrowRight size={14} className="ml-1" />
            </button>
          </div>

          <div className="glass-card rounded-xl p-5 border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-city-green-100 text-city-green-500 mr-3">
                  <Leaf size={20} />
                </div>
                <h3 className="font-medium">Ambiente</h3>
              </div>
              <StatusIndicator variant="warning">125 dispositivos</StatusIndicator>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Qualidade do ar</span>
                <span>Boa (AQI 52)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Temperatura média</span>
                <span>24°C</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Umidade</span>
                <span>65%</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm text-city-green-500 hover:text-city-green-600 hover:bg-city-green-50 rounded-lg transition-colors flex items-center justify-center">
              Ver detalhes
              <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
