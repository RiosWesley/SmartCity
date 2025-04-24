import React, { useState, useMemo, useEffect } from "react"; // Import useState, useMemo, useEffect
import { motion } from "framer-motion";
import DashboardLayout from "@/layout/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ChartCard } from "@/components/ChartCard";
import Map from "@/components/Map";
import { StatusIndicator } from "@/components/StatusIndicator";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { Lightbulb, Power, Clock, BarChart3, Settings, MailWarning, ChevronLeft, ChevronRight } from "lucide-react"; // Import icons for pagination
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// Interface para a estrutura dos dados de postes de iluminação em /lightning_devices
interface LightningDevice {
  id: string;
  deviceType: "lighting";
  status: "ONLINE" | "OFFLINE" | "WARNING"; // Status do dispositivo (online/offline/warning)
  last_update_timestamp: number;
  location: {
    lat: number;
    lng: number;
    description: string;
  };
  reported_luminosity: number;
  error_code: string | null;
  macAddress?: string;
  rssi?: number;
  uptimeS?: number;
  freeHeapB?: number;
  batteryP?: number | null;
  fwVersion?: string;
  sysErr?: string | null;
  // Adicionar outros campos conforme a estrutura em /lightning_devices
}


const Lighting = () => {
  // Usar apenas o hook para /lightning_devices
  const { data: lightningDevicesDataFirebase, loading: loadingLightningDevices, error: errorLightningDevices } = useFirebaseData("/lightning_devices");

  // Processar dados para stats e tabela usando apenas lightningDevicesDataFirebase
  const lightingDevices: LightningDevice[] = useMemo(() => {
    if (!lightningDevicesDataFirebase) return [];
    return Object.keys(lightningDevicesDataFirebase).map(key => ({
      id: key,
      ...lightningDevicesDataFirebase[key] as any // Usar 'any' temporariamente se a inferência de tipo for um problema
    }));
  }, [lightningDevicesDataFirebase]);


  const totalDevices = lightingDevices.length;
  const connectedDevices = lightingDevices.filter(device => device.status === 'ONLINE').length; // Usar status de lightning_devices
  const devicesWithIssues = lightingDevices.filter(device => device.error_code !== null || device.sysErr !== null).length; // Usar error_code e sysErr de lightning_devices
  const devicesOn = lightingDevices.filter(device => device.reported_luminosity > 0).length; // Assumindo que reported_luminosity > 0 significa ligado
  const devicesOff = totalDevices - devicesOn;

  // Mock data for lighting page (manter para gráficos que ainda não usam Firebase)
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
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // Processar dados para o mapa usando apenas lightningDevices
  const devicesForMap = useMemo(() => {
    const devices: any[] = [];

    lightingDevices.forEach(device => {
      if (device.location?.lat !== undefined && device.location?.lng !== undefined) {
         devices.push({
           id: device.id,
           lat: device.location.lat,
           lng: device.location.lng,
           type: 'lighting', // Explicitly set type
           status: device.status, // Use status from lightning_devices
           location: { description: device.location.description || 'Localização desconhecida' } // Transformar location string para objeto
         });
      }
    });

    return devices;
  }, [lightingDevices]); // Dependência do useMemo


  // Pagination logic for devicesForMap
  const totalDevicesForMap = devicesForMap.length;
  const totalPages = Math.ceil(totalDevicesForMap / itemsPerPage);

  const currentDevicesForMap = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return devicesForMap.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, devicesForMap]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };


  // Combine loading and error states for conditional rendering
  const loading = loadingLightningDevices;
  const error = errorLightningDevices;


  const lightingDeviceIssues = [
    // TODO: Obter dados de problemas de dispositivos de iluminação do Firebase (talvez do nó /alerts filtrando por sourceDeviceType: "lighting")
    { id: 1, deviceId: "LT-2389", issue: "Sem resposta", location: "Av. Paulista, 1500", since: "2h 15m" }, // Mock data
    { id: 2, deviceId: "LT-4501", issue: "Baixa voltagem", location: "R. Augusta, 300", since: "48m" }, // Mock data
    { id: 3, deviceId: "LT-1276", issue: "Falha no sensor", location: "Pq. Ibirapuera", since: "1h 30m" }, // Mock data
  ];

  if (loading) {
    return <DashboardLayout><div>Carregando dados de iluminação...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div>Erro ao carregar dados de iluminação: {error.message}</div></DashboardLayout>;
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
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mapa de Iluminação</h2>
            <div className="flex items-center gap-2">
              <StatusIndicator variant="online">Ligadas ({devicesOn})</StatusIndicator>
              <StatusIndicator variant="offline">Desligadas ({devicesOff})</StatusIndicator>
            </div>
          </div>
          <Map
            height="400px"
            deviceTypes={["lighting"]}
            devices={currentDevicesForMap}
            showDevices={true}
            centerLat={-12.2368} // Latitude de Feira de Santana
            centerLng={-38.9567} // Longitude de Feira de Santana
            zoom={12} // Ajustar zoom para a cidade
          />

        </div> {/* Closing tag for lg:col-span-2 */}
      </div> {/* Closing tag for grid */}
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

      {/* Lighting Devices Table and Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices Table */}
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
                  {currentDevicesForMap.map((device) => ( // Usar currentDevicesForMap para a tabela paginada
                    <tr key={device.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{device.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Assumindo que status de iluminação é baseado em reported_luminosity > 0 */}
                        <Badge variant={device.reported_luminosity > 0 ? "default" : "outline"}>
                          {device.reported_luminosity > 0 ? "Ligado" : "Desligado"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Usar status do dispositivo (ONLINE/OFFLINE/WARNING) */}
                        <Badge variant={device.status === 'ONLINE' ? "default" : device.status === 'WARNING' ? "secondary" : "destructive"}>
                           {device.status || 'Desconhecido'}
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
                        <div className="text-sm">{device.error_code || device.sysErr || 'Nenhum'}</div>
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
             {/* Pagination Controls */}
             <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Itens por página:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder={itemsPerPage} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
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
