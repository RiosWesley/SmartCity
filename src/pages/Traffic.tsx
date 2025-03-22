
import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layout/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ChartCard } from "@/components/ChartCard";
import Map from "@/components/Map";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Car, Activity, Clock, AlertTriangle, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for traffic page
const trafficFlowData = [
  { name: "00:00", flow: 120 },
  { name: "04:00", flow: 80 },
  { name: "08:00", flow: 520 },
  { name: "12:00", flow: 380 },
  { name: "16:00", flow: 440 },
  { name: "20:00", flow: 350 },
  { name: "24:00", flow: 180 },
];

const trafficTrendData = [
  { name: "Seg", vehicles: 12450 },
  { name: "Ter", vehicles: 13280 },
  { name: "Qua", vehicles: 12890 },
  { name: "Qui", vehicles: 13520 },
  { name: "Sex", vehicles: 14780 },
  { name: "Sáb", vehicles: 10240 },
  { name: "Dom", vehicles: 8950 },
];

const trafficCongestionData = [
  { name: "Sem Congestionamento", value: 55 },
  { name: "Leve", value: 25 },
  { name: "Moderado", value: 12 },
  { name: "Severo", value: 8 },
];

const trafficHotspots = [
  { 
    id: 1, 
    location: "Av. Paulista x Av. Rebouças", 
    status: "severe", 
    flow: 720, 
    avgSpeed: 12, 
    waitTime: "25 min",
    congestionLevel: 85
  },
  { 
    id: 2, 
    location: "Av. 23 de Maio", 
    status: "moderate", 
    flow: 850, 
    avgSpeed: 23, 
    waitTime: "12 min",
    congestionLevel: 60
  },
  { 
    id: 3, 
    location: "Marginal Tietê Zona Norte", 
    status: "light", 
    flow: 920, 
    avgSpeed: 35, 
    waitTime: "8 min",
    congestionLevel: 40
  },
  { 
    id: 4, 
    location: "Av. Faria Lima", 
    status: "clear", 
    flow: 680, 
    avgSpeed: 45, 
    waitTime: "2 min",
    congestionLevel: 15
  },
];

const trafficControls = [
  { id: 1, crossroad: "Av. Paulista x Rua Augusta", mode: "adaptive", status: "online" },
  { id: 2, crossroad: "Av. Brigadeiro x Av. Rebouças", mode: "fixed", status: "online" },
  { id: 3, crossroad: "Rua Oscar Freire x Rua Haddock Lobo", mode: "adaptive", status: "offline" },
];

const Traffic = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Monitoramento de Tráfego</h1>
          <p className="text-gray-500">Analise o fluxo de tráfego e gerencie semáforos</p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Sensores de Tráfego"
          value="198"
          icon={<Car size={18} />}
          variant="teal"
        />
        <StatsCard
          title="Fluxo Total (hoje)"
          value="124,850"
          subtitle="veículos"
          icon={<Activity size={18} />}
          variant="blue"
          trend={{ value: 4.2, positive: true }}
        />
        <StatsCard
          title="Tempo Médio de Espera"
          value="12 min"
          trend={{ value: 2.1, positive: false }}
          icon={<Clock size={18} />}
          variant="amber"
        />
        <StatsCard
          title="Áreas Congestionadas"
          value="8"
          trend={{ value: 1, positive: true }}
          icon={<AlertTriangle size={18} />}
          variant="red"
        />
      </div>

      {/* Map and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mapa de Tráfego</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-city-green-500"></div>
                <span className="text-xs">Fluido</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-city-amber-400"></div>
                <span className="text-xs">Moderado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-city-red-500"></div>
                <span className="text-xs">Intenso</span>
              </div>
            </div>
          </div>
          <Map height="400px" deviceTypes={["traffic"]} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Visão Geral do Tráfego</h2>
          <Card className="glass-card p-5 h-[400px] flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Nível de Congestionamento</h3>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-city-green-500 h-full" style={{ width: "55%" }}></div>
                  <div className="bg-city-amber-400 h-full" style={{ width: "25%" }}></div>
                  <div className="bg-city-amber-600 h-full" style={{ width: "12%" }}></div>
                  <div className="bg-city-red-500 h-full" style={{ width: "8%" }}></div>
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Fluido (55%)</span>
                <span>Leve (25%)</span>
                <span>Moderado (12%)</span>
                <span>Severo (8%)</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Veículos/Hora</div>
                  <div className="text-lg font-semibold">7,854</div>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Vel. Média</div>
                  <div className="text-lg font-semibold">28 km/h</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Previsão</h3>
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs text-gray-500">Próximas 2 horas</div>
                  <Badge 
                    variant="outline" 
                    className="bg-city-amber-50 text-city-amber-700 border-city-amber-200"
                  >
                    Moderado
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="bg-city-amber-400 h-full" 
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium">65%</span>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  Expectativa de aumento no congestionamento após às 17:00
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Ver Análise Detalhada
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Fluxo de Tráfego (Hoje)"
          description="Veículos por hora"
          data={trafficFlowData}
          type="area"
          dataKeys={["flow"]}
          colors={["#0BC9C0"]}
          yAxisFormatter={(value) => `${value}`}
        />
        <ChartCard
          title="Tendência Semanal"
          description="Total de veículos por dia"
          data={trafficTrendData}
          type="bar"
          dataKeys={["vehicles"]}
          colors={["#0BC9C0"]}
          yAxisFormatter={(value) => `${Math.floor(value / 1000)}k`}
        />
      </div>

      {/* Traffic Hotspots & Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hotspots */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Pontos de Congestionamento</h2>
          <div className="overflow-hidden rounded-xl glass-card border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fluxo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vel. Média
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tempo Espera
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trafficHotspots.map((hotspot) => (
                    <tr key={hotspot.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{hotspot.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${hotspot.status === 'severe' ? 'bg-city-red-100 text-city-red-800 border-city-red-200' : ''}
                            ${hotspot.status === 'moderate' ? 'bg-city-amber-100 text-city-amber-800 border-city-amber-200' : ''}
                            ${hotspot.status === 'light' ? 'bg-city-amber-50 text-city-amber-600 border-city-amber-100' : ''}
                            ${hotspot.status === 'clear' ? 'bg-city-green-100 text-city-green-800 border-city-green-200' : ''}
                          `}
                        >
                          {hotspot.status === 'severe' && 'Severo'}
                          {hotspot.status === 'moderate' && 'Moderado'}
                          {hotspot.status === 'light' && 'Leve'}
                          {hotspot.status === 'clear' && 'Fluido'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{hotspot.flow} v/h</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{hotspot.avgSpeed} km/h</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{hotspot.waitTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-city-teal-500 hover:text-city-teal-700">
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Traffic Controls */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Controle de Semáforos</h2>
          <div className="space-y-4">
            {trafficControls.map((control) => (
              <div key={control.id} className="glass-card rounded-xl p-4 border border-white/30">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${control.status === 'online' ? 'bg-city-green-100 text-city-green-600' : 'bg-city-red-100 text-city-red-600'}`}>
                    <Car size={16} />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{control.crossroad}</span>
                      <StatusIndicator 
                        variant={control.status === 'online' ? 'online' : 'offline'} 
                        animate={control.status === 'online'}
                      >
                        {control.status === 'online' ? 'Online' : 'Offline'}
                      </StatusIndicator>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Modo atual: <span className="font-medium">{control.mode === 'adaptive' ? 'Adaptativo' : 'Fixo'}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500">Modo de Operação</label>
                    {control.status === 'online' && (
                      <Select defaultValue={control.mode}>
                        <SelectTrigger className="w-32 h-7 text-xs">
                          <SelectValue placeholder="Selecionar modo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adaptive">Adaptativo</SelectItem>
                          <SelectItem value="fixed">Fixo</SelectItem>
                          <SelectItem value="emergency">Emergência</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs mt-2"
                    disabled={control.status !== 'online'}
                  >
                    Configurar Tempos
                  </Button>
                </div>
              </div>
            ))}
            <Button size="sm" className="w-full">
              <BarChart3 size={14} className="mr-1" />
              Ver Relatório de Eficiência
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Traffic;
