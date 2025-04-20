import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layout/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ChartCard } from "@/components/ChartCard";
import Map from "@/components/Map";
import { StatusIndicator } from "@/components/StatusIndicator";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { Lightbulb, Power, Clock, BarChart3, Settings, MailWarning } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";


const Lighting = () => {
  const { data: lightingStatus, loading: loadingLightingStatus, error: errorLightingStatus } = useFirebaseData("lighting_status");
  const { data: deviceStatus, loading: loadingDeviceStatus, error: errorDeviceStatus } = useFirebaseData("device_status");

  // Process data for stats and table
  const lightingDevices = Object.entries(lightingStatus || {})
    .map(([id, status]) => {
      // Ensure status is an object before spreading
      if (typeof status === 'object' && status !== null) {
        // Explicitly cast status to an object type if needed, or ensure the type of lightingStatus is correct
        return { id, ...(status as any) }; // Using 'any' as a temporary workaround if type inference is the issue
      }
      return null; // Or handle appropriately if status is not an object
    })
    .filter(device => device !== null && deviceStatus?.[device.id]?.deviceType === 'lighting');

  const totalDevices = lightingDevices.length;
  const connectedDevices = lightingDevices.filter(device => deviceStatus?.[device.id]?.status === 'ONLINE').length;
  const devicesWithIssues = lightingDevices.filter(device => device.error_code !== null || deviceStatus?.[device.id]?.sysErr !== null).length;
  const devicesOn = lightingDevices.filter(device => device.status === true).length;
  const devicesOff = totalDevices - devicesOn;

  // Mock data for lighting page
  const energyConsumptionData = [
    { name: "00:00", consumption: 320 },
    { name: "04:00", consumption: 280 },
    { name: "08:00", consumption: 180 },
    { name: "12:00", consumption: 60 },
    { name: "16:00", consumption: 50 },
    { name: "20:00", consumption: 340 },
    { name: "24:00", consumption: 330 },
  ];

  const monthlyConsumptionData = [
    { name: "Jan", consumption: 8240 },
    { name: "Fev", consumption: 7850 },
    { name: "Mar", consumption: 8120 },
    { name: "Abr", consumption: 7940 },
    { name: "Mai", consumption: 7430 },
    { name: "Jun", consumption: 6980 },
    { name: "Jul", consumption: 7240 },
  ];

  const lightingDeviceIssues = [
    { id: 1, deviceId: "LT-2389", issue: "Sem resposta", location: "Av. Paulista, 1500", since: "2h 15m" },
    { id: 2, deviceId: "LT-4501", issue: "Baixa voltagem", location: "R. Augusta, 300", since: "48m" },
    { id: 3, deviceId: "LT-1276", issue: "Falha no sensor", location: "Pq. Ibirapuera", since: "1h 30m" },
  ];

  if (loadingLightingStatus || loadingDeviceStatus) {
    return <DashboardLayout><div>Carregando dados de iluminação...</div></DashboardLayout>;
  }

  if (errorLightingStatus || errorDeviceStatus) {
    return <DashboardLayout><div>Erro ao carregar dados de iluminação: {errorLightingStatus?.message || errorDeviceStatus?.message}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Monitoramento de Iluminação</h1>
          <p className="text-gray-500">Gerencie e monitore o sistema de iluminação pública</p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total de Luminárias"
          value={totalDevices.toString()}
          icon={<Lightbulb size={18} />}
          variant="blue"
        />
        <StatsCard
          title="Luminárias Ligadas"
          value={devicesOn.toString()}
          subtitle={`${((devicesOn / totalDevices) * 100).toFixed(0)}% do total`}
          icon={<Power size={18} />}
          variant="green"
        />
        <StatsCard
          title="Consumo Atual"
          value="1240 kWh" // Keep mock data for now
          trend={{ value: 3.2, positive: false }} // Keep mock data for now
          icon={<BarChart3 size={18} />}
        />
        <StatsCard
          title="Dispositivos com Falha"
          value={devicesWithIssues.toString()}
          trend={{ value: 1, positive: true }} // Keep mock data for now
          icon={<MailWarning size={18} />}
          variant="amber"
        />
      </div>

      {/* Map and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mapa de Iluminação</h2>
            <div className="flex items-center gap-2">
              <StatusIndicator variant="online">Ligadas ({devicesOn})</StatusIndicator>
              <StatusIndicator variant="offline">Desligadas ({devicesOff})</StatusIndicator>
            </div>
          </div>
          <Map height="400px" deviceTypes={["lighting"]} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Controle Central</h2>
          <Card className="glass-card p-5 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Estado Global</h3>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Lightbulb size={18} className="mr-2 text-city-amber-400" />
                  Todas as Luminárias
                </span>
                <Switch defaultChecked /> {/* Keep mock functionality for now */}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Brilho Global</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="75" // Keep mock functionality for now
                  className="w-full h-2 bg-city-blue-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Programação</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Ligar</label>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-500" />
                    <input
                      type="time"
                      defaultValue="18:00" // Keep mock functionality for now
                      className="p-1.5 text-sm bg-white/50 border border-gray-200 rounded-md w-full"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Desligar</label>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-500" />
                    <input
                      type="time"
                      defaultValue="06:00" // Keep mock functionality for now
                      className="p-1.5 text-sm bg-white/50 border border-gray-200 rounded-md w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button size="sm">Aplicar Configurações</Button> {/* Keep mock functionality for now */}
            </div>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Consumo de Energia (Hoje)"
          description="kWh por período do dia"
          data={energyConsumptionData}
          type="area"
          dataKeys={["consumption"]}
          colors={["#0064FF"]}
          yAxisFormatter={(value) => `${value} kWh`}
        />
        <ChartCard
          title="Consumo Mensal"
          description="Total de kWh por mês"
          data={monthlyConsumptionData}
          type="bar"
          dataKeys={["consumption"]}
          colors={["#0064FF"]}
          yAxisFormatter={(value) => `${Math.floor(value / 1000)}k`}
        />
      </div>

      {/* Lighting Zones & Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zones */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Dispositivos de Iluminação</h2>
          <div className="overflow-hidden rounded-xl glass-card border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID do Dispositivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status (Iluminação)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status (Dispositivo)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Luminosidade Reportada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Atualização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código de Erro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lightingDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{device.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={device.status ? "default" : "outline"}>
                          {device.status ? "Ligado" : "Desligado"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={deviceStatus?.[device.id]?.status === 'ONLINE' ? "default" : "destructive"}>
                           {deviceStatus?.[device.id]?.status || 'Desconhecido'}
                         </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{device.reported_luminosity || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{device.last_update_timestamp ? new Date(device.last_update_timestamp).toLocaleString() : 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{device.location?.description || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{device.error_code || deviceStatus?.[device.id]?.sysErr || 'Nenhum'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-city-blue-500 hover:text-city-blue-700 mr-3">
                          Editar
                        </button>
                        <button className="text-city-blue-500 hover:text-city-blue-700">
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Issues */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Dispositivos com Problemas</h2>
          <div className="space-y-4">
            {lightingDeviceIssues.map((issue) => ( // Keep mock data for now
              <div key={issue.id} className="glass-card rounded-xl p-4 border border-city-amber-200">
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-city-amber-100 text-city-amber-600">
                    <MailWarning size={16} />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{issue.deviceId}</span>
                      <Badge variant="outline" className="ml-2 bg-city-amber-50 text-city-amber-600 border-city-amber-200">
                        {issue.issue}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{issue.location}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>Duração: {issue.since}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Ignorar
                  </Button>
                  <Button size="sm" className="text-xs">
                    Resolver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Lighting;
