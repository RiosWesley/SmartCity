
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

import { useFirebaseData } from "@/hooks/useFirebaseData";

const Traffic = () => {
  const { data: trafficFlowData, loading: loadingTrafficFlow, error: errorTrafficFlow } = useFirebaseData("sensors/traffic/flow");
  const { data: trafficTrendData, loading: loadingTrafficTrend, error: errorTrafficTrend } = useFirebaseData("sensors/traffic/trend");
  const { data: trafficCongestionData, loading: loadingTrafficCongestion, error: errorTrafficCongestion } = useFirebaseData("sensors/traffic/congestion");
  const { data: trafficHotspots, loading: loadingTrafficHotspots, error: errorTrafficHotspots } = useFirebaseData("sensors/traffic/hotspots");
  const { data: trafficControls, loading: loadingTrafficControls, error: errorTrafficControls } = useFirebaseData("devices"); // Assuming traffic controls are devices
  const { data: trafficStats, loading: loadingTrafficStats, error: errorTrafficStats } = useFirebaseData("stats/traffic");
  const { data: trafficOverview, loading: loadingTrafficOverview, error: errorTrafficOverview } = useFirebaseData("overview/traffic");

  // Filter traffic controls from devices
  const trafficDevices = Object.entries(trafficControls || {})
    .map(([id, device]) => {
      if (typeof device === 'object' && device !== null && (device as any).deviceType === 'traffic_light') { // Assuming deviceType 'traffic_light'
        return { id, ...(device as any) };
      }
      return null;
    })
    .filter(device => device !== null);

  if (loadingTrafficFlow || loadingTrafficTrend || loadingTrafficCongestion || loadingTrafficHotspots || loadingTrafficControls || loadingTrafficStats || loadingTrafficOverview) {
    return <DashboardLayout><div>Carregando dados de tráfego...</div></DashboardLayout>;
  }

  if (errorTrafficFlow || errorTrafficTrend || errorTrafficCongestion || errorTrafficHotspots || errorTrafficControls || errorTrafficStats || errorTrafficOverview) {
    return <DashboardLayout><div>Erro ao carregar dados de tráfego: {errorTrafficFlow?.message || errorTrafficTrend?.message || errorTrafficCongestion?.message || errorTrafficHotspots?.message || errorTrafficControls?.message || errorTrafficStats?.message || errorTrafficOverview?.message}</div></DashboardLayout>;
  }

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
          value={(trafficStats as any)?.total_sensors?.toString() || 'N/A'}
          icon={<Car size={18} />}
          variant="blue"
        />
        <StatsCard
          title="Fluxo Total (hoje)"
          value={(trafficStats as any)?.total_flow?.toLocaleString() || 'N/A'}
          subtitle="veículos"
          icon={<Activity size={18} />}
          variant="blue"
          trend={(trafficStats as any)?.flow_trend}
        />
        <StatsCard
          title="Tempo Médio de Espera"
          value={(trafficStats as any)?.avg_wait_time || 'N/A'}
          trend={(trafficStats as any)?.wait_time_trend}
          icon={<Clock size={18} />}
          variant="amber"
        />
        <StatsCard
          title="Áreas Congestionadas"
          value={(trafficStats as any)?.congested_areas?.toString() || 'N/A'}
          trend={(trafficStats as any)?.congestion_trend}
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
              {/* Assuming trafficCongestionData is an object like { clear: 55, light: 25, moderate: 12, severe: 8 } */}
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-city-green-500 h-full" style={{ width: `${(trafficCongestionData as any)?.clear || 0}%` }}></div>
                  <div className="bg-city-amber-400 h-full" style={{ width: `${(trafficCongestionData as any)?.light || 0}%` }}></div>
                  <div className="bg-city-amber-600 h-full" style={{ width: `${(trafficCongestionData as any)?.moderate || 0}%` }}></div>
                  <div className="bg-city-red-500 h-full" style={{ width: `${(trafficCongestionData as any)?.severe || 0}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Fluido ({(trafficCongestionData as any)?.clear || 0}%)</span>
                <span>Leve ({(trafficCongestionData as any)?.light || 0}%)</span>
                <span>Moderado ({(trafficCongestionData as any)?.moderate || 0}%)</span>
                <span>Severo ({(trafficCongestionData as any)?.severe || 0}%)</span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Veículos/Hora</div>
                  <div className="text-lg font-semibold">{(trafficOverview as any)?.vehicles_per_hour?.toLocaleString() || 'N/A'}</div>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Vel. Média</div>
                  <div className="text-lg font-semibold">{(trafficOverview as any)?.avg_speed || 'N/A'} km/h</div>
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
                    className={`
                      ${(trafficOverview as any)?.forecast_level === 'severe' ? 'bg-city-red-100 text-city-red-800 border-city-red-200' : ''}
                      ${(trafficOverview as any)?.forecast_level === 'moderate' ? 'bg-city-amber-100 text-city-amber-800 border-city-amber-200' : ''}
                      ${(trafficOverview as any)?.forecast_level === 'light' ? 'bg-city-amber-50 text-city-amber-600 border-city-amber-100' : ''}
                      ${(trafficOverview as any)?.forecast_level === 'clear' ? 'bg-city-green-100 text-city-green-800 border-city-green-200' : ''}
                    `}
                  >
                    {(trafficOverview as any)?.forecast_level === 'severe' && 'Severo'}
                    {(trafficOverview as any)?.forecast_level === 'moderate' && 'Moderado'}
                    {(trafficOverview as any)?.forecast_level === 'light' && 'Leve'}
                    {(trafficOverview as any)?.forecast_level === 'clear' && 'Fluido'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${(trafficOverview as any)?.forecast_level === 'severe' ? 'bg-city-red-500' : (trafficOverview as any)?.forecast_level === 'moderate' ? 'bg-city-amber-400' : (trafficOverview as any)?.forecast_level === 'light' ? 'bg-city-amber-400' : 'bg-city-green-500'}`}
                        style={{ width: `${(trafficOverview as any)?.forecast_percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium">{(trafficOverview as any)?.forecast_percentage || 0}%</span>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  {(trafficOverview as any)?.forecast_message || 'N/A'}
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
                  {Object.entries(trafficHotspots || {}).map(([id, hotspot]) => (
                    <tr key={id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{(hotspot as any).location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={`
                            ${(hotspot as any).status === 'severe' ? 'bg-city-red-100 text-city-red-800 border-city-red-200' : ''}
                            ${(hotspot as any).status === 'moderate' ? 'bg-city-amber-100 text-city-amber-800 border-city-amber-200' : ''}
                            ${(hotspot as any).status === 'light' ? 'bg-city-amber-50 text-city-amber-600 border-city-amber-100' : ''}
                            ${(hotspot as any).status === 'clear' ? 'bg-city-green-100 text-city-green-800 border-city-green-200' : ''}
                          `}
                        >
                          {(hotspot as any).status === 'severe' && 'Severo'}
                          {(hotspot as any).status === 'moderate' && 'Moderado'}
                          {(hotspot as any).status === 'light' && 'Leve'}
                          {(hotspot as any).status === 'clear' && 'Fluido'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{(hotspot as any).flow} v/h</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{(hotspot as any).avgSpeed} km/h</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{(hotspot as any).waitTime}</div>
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
            {trafficDevices.map((control) => (
              <div key={control.id} className="glass-card rounded-xl p-4 border border-white/30">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${(control as any).status === 'ONLINE' ? 'bg-city-green-100 text-city-green-600' : 'bg-city-red-100 text-city-red-600'}`}>
                    <Car size={16} />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{(control as any).location?.description || control.id}</span> {/* Use location or id */}
                      <StatusIndicator
                        variant={(control as any).status === 'ONLINE' ? 'online' : 'offline'}
                        animate={(control as any).status === 'ONLINE'}
                      >
                        {(control as any).status || 'Desconhecido'}
                      </StatusIndicator>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Modo atual: <span className="font-medium">{(control as any).mode || 'N/A'}</span> {/* Assuming mode is available */}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500">Modo de Operação</label>
                    {(control as any).status === 'ONLINE' && (
                      <Select defaultValue={(control as any).mode}>
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
                    disabled={(control as any).status !== 'ONLINE'}
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

