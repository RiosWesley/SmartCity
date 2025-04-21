import React, { useState, useMemo } from "react"; // Import useState and useMemo
import { motion } from "framer-motion";
import DashboardLayout from "@/layout/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ChartCard } from "@/components/ChartCard";
import Map from "@/components/Map";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Car, Activity, Clock, AlertTriangle, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"; // Import icons for pagination
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
  // Fetch data from Firebase
  const { data: trafficSensorsData, loading: loadingTrafficSensors, error: errorTrafficSensors } = useFirebaseData("traffic_sensors");
  const { data: intersectionControlData, loading: loadingIntersectionControl, error: errorIntersectionControl } = useFirebaseData("intersection_control");
  const { data: deviceStatusData, loading: loadingDeviceStatus, error: errorDeviceStatus } = useFirebaseData("device_status");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // Process data to match expected structure for components and map
  const {
    processedTrafficStats,
    processedTrafficCongestionData,
    processedTrafficOverview,
    processedTrafficHotspots,
    processedTrafficDevices,
    processedTrafficFlowData,
    processedTrafficTrendData,
    devicesForMap,
  } = useMemo(() => {
    const processedTrafficStats: any = {};
    const processedTrafficCongestionData: any = {};
    const processedTrafficOverview: any = {};
    const processedTrafficHotspots: any = {};
    const processedTrafficDevices: any[] = [];
    const processedTrafficFlowData: any[] = []; // Cannot be filled with real-time data from current RTDB structure
    const processedTrafficTrendData: any[] = []; // Cannot be filled with real-time data from current RTDB structure
    const devicesForMap: any[] = []; // Array to hold devices for the map

    // --- Process trafficSensorsData ---
    const sensors = Object.entries(trafficSensorsData || {});
    processedTrafficStats.total_sensors = sensors.length;

    let totalFlowPerMinute = 0;
    let totalSpeed = 0;
    let sensorsWithFlowCount = 0;
    let congestedAreasCount = 0;
    const congestionLevels: { [key: string]: number } = { LOW: 0, HIGH: 0 };

    sensors.forEach(([id, sensor]: [string, any]) => {
      if (sensor.traffic_flow) {
        totalFlowPerMinute += sensor.traffic_flow.vehicles_per_minute || 0;
        totalSpeed += sensor.traffic_flow.average_speed_kph || 0;
        sensorsWithFlowCount++;

        if (sensor.traffic_flow.flow_intensity === 'HIGH') {
          congestedAreasCount++;
        }
        if (sensor.traffic_flow.flow_intensity in congestionLevels) {
          congestionLevels[sensor.traffic_flow.flow_intensity]++;
        }

        // Data for Hotspots table
        processedTrafficHotspots[id] = {
          location: sensor.location?.description || 'N/A',
          status: sensor.traffic_flow.flow_intensity === 'HIGH' ? 'severe' : 'light', // Mapping LOW/HIGH to severe/light
          flow: sensor.traffic_flow.vehicles_per_minute || 0,
          avgSpeed: sensor.traffic_flow.average_speed_kph || 0,
          waitTime: 'N/A', // Not available in RTDB structure
        };

        // Add sensor to devices for map
        if (sensor.location?.lat && sensor.location?.lng) {
          devicesForMap.push({
            id: id,
            lat: sensor.location.lat,
            lng: sensor.location.lng,
            type: 'traffic', // Type for map component
            flow_intensity: sensor.traffic_flow.flow_intensity,
            status: (deviceStatusData as any)?.[id]?.status, // Get online/offline status from deviceStatusData
            location: sensor.location // Include location object for tooltip description
          });
        }
      }
    });

    processedTrafficStats.total_flow = totalFlowPerMinute * 60; // Convert per minute to per hour for display
    processedTrafficStats.avg_wait_time = 'N/A'; // Not available
    processedTrafficStats.congested_areas = congestedAreasCount;
    processedTrafficStats.flow_trend = undefined; // Not available
    processedTrafficStats.wait_time_trend = undefined; // Not available
    processedTrafficStats.congestion_trend = undefined; // Not available

    // Data for Congestion bar (mapping LOW/HIGH to 4 levels)
    const lowPercentage = sensorsWithFlowCount > 0 ? (congestionLevels.LOW / sensorsWithFlowCount) * 100 : 0;
    const highPercentage = sensorsWithFlowCount > 0 ? (congestionLevels.HIGH / sensorsWithFlowCount) * 100 : 0;

    // Distribute percentages across 4 levels (arbitrary mapping)
    processedTrafficCongestionData.clear = lowPercentage * 0.5; // 50% of LOW
    processedTrafficCongestionData.light = lowPercentage * 0.5; // 50% of LOW
    processedTrafficCongestionData.moderate = highPercentage * 0.5; // 50% of HIGH
    processedTrafficCongestionData.severe = highPercentage * 0.5; // 50% of HIGH


    // Data for Traffic Overview
    processedTrafficOverview.vehicles_per_hour = totalFlowPerMinute * 60; // Convert per minute to per hour
    processedTrafficOverview.avg_speed = sensorsWithFlowCount > 0 ? totalSpeed / sensorsWithFlowCount : 'N/A';
    processedTrafficOverview.forecast_level = undefined; // Not available
    processedTrafficOverview.forecast_percentage = undefined; // Not available
    processedTrafficOverview.forecast_message = 'Dados de previsão não disponíveis'; // Not available

    // --- Process intersectionControlData and deviceStatusData for Traffic Controls ---
    const devices = Object.entries(deviceStatusData || {});
    const intersectionControls = Object.values(intersectionControlData || {});

    devices.forEach(([deviceId, device]: [string, any]) => {
      if (device.deviceType === 'intersection_controller') {
        const intersectionControl = intersectionControls.find((control: any) => control.control_status?.controller_device_id === deviceId);
        // Apply the fix here: cast intersectionControl to any
        processedTrafficDevices.push({ id: deviceId, status: device.status, location: device.location, mode: (intersectionControl as any)?.control_status?.current_mode || 'N/A' });

        // Add intersection controller to devices for map (if it has location)
        if (device.location?.lat && device.location?.lng) {
           devicesForMap.push({
             id: deviceId,
             lat: device.location.lat,
             lng: device.location.lng,
             type: 'traffic', // Type for map component (can be 'intersection_controller' if map supports it)
             status: device.status, // Online/offline status
             location: device.location // Include location object for tooltip description
             // flow_intensity is not applicable to controllers directly
           });
         }
      }
    });

    return {
      processedTrafficStats,
      processedTrafficCongestionData,
      processedTrafficOverview,
      processedTrafficHotspots,
      processedTrafficDevices,
      processedTrafficFlowData,
      processedTrafficTrendData,
      devicesForMap,
    };
  }, [trafficSensorsData, intersectionControlData, deviceStatusData]); // Dependencies for useMemo


  // Pagination logic for devicesForMap
  const totalDevices = devicesForMap.length;
  const totalPages = Math.ceil(totalDevices / itemsPerPage);

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
  const loading = loadingTrafficSensors || loadingIntersectionControl || loadingDeviceStatus;
  const error = errorTrafficSensors || errorIntersectionControl || errorDeviceStatus;


  if (loading) {
    return <DashboardLayout><div>Carregando dados de tráfego...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div>Erro ao carregar dados de tráfego: {error?.message}</div></DashboardLayout>;
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
          value={processedTrafficStats?.total_sensors?.toString() || 'N/A'}
          icon={<Car size={18} />}
          variant="blue"
        />
        <StatsCard
          title="Fluxo Total (hoje)"
          value={processedTrafficStats?.total_flow?.toLocaleString() || 'N/A'}
          subtitle="veículos"
          icon={<Activity size={18} />}
          variant="blue"
          trend={processedTrafficStats?.flow_trend}
        />
        <StatsCard
          title="Tempo Médio de Espera"
          value={processedTrafficStats?.avg_wait_time || 'N/A'}
          trend={processedTrafficStats?.wait_time_trend}
          icon={<Clock size={18} />}
          variant="amber"
        />
        <StatsCard
          title="Áreas Congestionadas"
          value={processedTrafficStats?.congested_areas?.toString() || 'N/A'}
          trend={processedTrafficStats?.congestion_trend}
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
          </div> {/* Closing tag for the flex container */}
          <Map height="400px" deviceTypes={["traffic"]} devices={currentDevicesForMap} /> {/* Pass paginated devices */}
           {/* Pagination Controls */}
           <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Itens por página:</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Anterior
              </Button>
              <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próximo
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div> {/* Closing tag for lg:col-span-2 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Visão Geral do Tráfego</h2>
          <Card className="glass-card p-5 h-[400px] flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Nível de Congestionamento</h3>
              {/* Assuming trafficCongestionData is an object like { clear: 55, light: 25, moderate: 12, severe: 8 } */}
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-city-green-500 h-full" style={{ width: `${processedTrafficCongestionData?.clear || 0}%` }}></div>
                  <div className="bg-city-amber-400 h-full" style={{ width: `${processedTrafficCongestionData?.light || 0}%` }}></div>
                  <div className="bg-city-amber-600 h-full" style={{ width: `${processedTrafficCongestionData?.moderate || 0}%` }}></div>
                  <div className="bg-city-red-500 h-full" style={{ width: `${processedTrafficCongestionData?.severe || 0}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Fluido ({processedTrafficCongestionData?.clear?.toFixed(1) || 0}%)</span>
                <span>Leve ({processedTrafficCongestionData?.light?.toFixed(1) || 0}%)</span>
                <span>Moderado ({processedTrafficCongestionData?.moderate?.toFixed(1) || 0}%)</span>
                <span>Severo ({processedTrafficCongestionData?.severe?.toFixed(1) || 0}%)</span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Veículos/Hora</div>
                  <div className="text-lg font-semibold">{processedTrafficOverview?.vehicles_per_hour?.toLocaleString() || 'N/A'}</div>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Vel. Média</div>
                  <div className="text-lg font-semibold">{processedTrafficOverview?.avg_speed || 'N/A'} km/h</div>
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
                      ${processedTrafficOverview?.forecast_level === 'severe' ? 'bg-city-red-100 text-city-red-800 border-city-red-200' : ''}
                      ${processedTrafficOverview?.forecast_level === 'moderate' ? 'bg-city-amber-100 text-city-amber-800 border-city-amber-200' : ''}
                      ${processedTrafficOverview?.forecast_level === 'light' ? 'bg-city-amber-50 text-city-amber-600 border-city-amber-100' : ''}
                      ${processedTrafficOverview?.forecast_level === 'clear' ? 'bg-city-green-100 text-city-green-800 border-city-green-200' : ''}
                    `}
                  >
                    {processedTrafficOverview?.forecast_level === 'severe' && 'Severo'}
                    {processedTrafficOverview?.forecast_level === 'moderate' && 'Moderado'}
                    {processedTrafficOverview?.forecast_level === 'light' && 'Leve'}
                    {processedTrafficOverview?.forecast_level === 'clear' && 'Fluido'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${processedTrafficOverview?.forecast_level === 'severe' ? 'bg-city-red-500' : processedTrafficOverview?.forecast_level === 'moderate' ? 'bg-city-amber-400' : processedTrafficOverview?.forecast_level === 'light' ? 'bg-city-amber-400' : 'bg-city-green-500'}`}
                        style={{ width: `${processedTrafficOverview?.forecast_percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium">{processedTrafficOverview?.forecast_percentage || 0}%</span>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  {processedTrafficOverview?.forecast_message || 'N/A'}
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
          data={processedTrafficFlowData} // Using processed data
          type="area"
          dataKeys={["flow"]}
          colors={["#0BC9C0"]}
          yAxisFormatter={(value) => `${value}`}
        />
        <ChartCard
          title="Tendência Semanal"
          description="Total de veículos por dia"
          data={processedTrafficTrendData} // Using processed data
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
                  {Object.entries(processedTrafficHotspots || {}).map(([id, hotspot]) => (
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
            {processedTrafficDevices.map((control) => (
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
