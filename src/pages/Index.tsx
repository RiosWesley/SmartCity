import useFirebaseData from "@/hooks/useFirebaseData";
import React, { useMemo } from "react"; // Importar useMemo
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

// Mock data for our dashboard (manter para gráficos que ainda não usam Firebase)
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


const Index = () => {
  const { data: alertsDataFirebase, loading: alertsLoading, error: alertsError } = useFirebaseData('/alerts');
  const { data: deviceStatusDataFirebase, loading: deviceStatusLoading, error: deviceStatusError } = useFirebaseData('/device_status');
  // Alterar o hook para usar /lightning_devices
  const { data: lightningDevicesDataFirebase, loading: lightningDevicesLoading, error: lightningDevicesError } = useFirebaseData('/lightning_devices');
  const { data: trafficSensorsDataFirebase, loading: trafficSensorsLoading, error: trafficSensorsError } = useFirebaseData('/traffic_sensors');
  const { data: environmentalSensorsDataFirebase, loading: environmentalSensorsLoading, error: environmentalSensorsError } = useFirebaseData('/environmental_sensors');


  // Convert alerts object to array for mapping
  const alerts = alertsDataFirebase ? Object.keys(alertsDataFirebase).map(key => ({
    id: key, // Use Firebase key as ID
    ...alertsDataFirebase[key]
  })) : [];

  // Calculate device counts (ainda usando device_status para total e online/offline geral)
  const totalDevices = deviceStatusDataFirebase ? Object.keys(deviceStatusDataFirebase).length : 0;
  const onlineDevices = deviceStatusDataFirebase ? Object.values(deviceStatusDataFirebase).filter((device: any) => device.status === 'ONLINE').length : 0;
  const offlineDevices = totalDevices - onlineDevices;

  // Calculate lighting stats using /lightning_devices
  const totalLightingDevices = lightningDevicesDataFirebase ? Object.keys(lightningDevicesDataFirebase).length : 0;
  const lightsOn = lightningDevicesDataFirebase ? Object.values(lightningDevicesDataFirebase).filter((light: any) => light.status === 'ONLINE').length : 0; // Assumindo status ONLINE/OFFLINE em lightning_devices
  const lightsOnPercentage = totalLightingDevices > 0 ? ((lightsOn / totalLightingDevices) * 100).toFixed(0) : 0;


  // Calculate traffic stats (ainda usando dados antigos)
  const totalTrafficSensors = deviceStatusDataFirebase ? Object.values(deviceStatusDataFirebase).filter((device: any) => device.deviceType === 'traffic_sensor').length : 0;
  const monitoredRoads = trafficSensorsDataFirebase ? Object.keys(trafficSensorsDataFirebase).length : 0;
  // Simple aggregation for traffic flow (can be improved)
  const trafficFlows = trafficSensorsDataFirebase ? Object.values(trafficSensorsDataFirebase).map((sensor: any) => sensor.traffic_flow?.flow_intensity).filter(Boolean) : [];
  const trafficFlowSummary = trafficFlows.length > 0 ? trafficFlows.reduce((acc: any, flow: string) => {
    acc[flow] = (acc[flow] || 0) + 1;
    return acc;
  }, {}) : {};
  const dominantTrafficFlow = Object.keys(trafficFlowSummary).sort((a, b) => trafficFlowSummary[b] - trafficFlowSummary[a])[0] || 'N/A';


  // Calculate environmental stats (ainda usando dados antigos)
  const totalEnvironmentalSensors = deviceStatusDataFirebase ? Object.values(deviceStatusDataFirebase).filter((device: any) => device.deviceType === 'environmental_sensor').length : 0;
  const airQualityLevels = environmentalSensorsDataFirebase ? Object.values(environmentalSensorsDataFirebase).map((sensor: any) => sensor.readings?.air_quality?.general_aqi_level).filter(Boolean) : [];
  const airQualitySummary = airQualityLevels.length > 0 ? airQualityLevels.reduce((acc: any, level: string) => {
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {}) : {};
  const dominantAirQuality = Object.keys(airQualitySummary).sort((a, b) => airQualitySummary[b] - airQualitySummary[a])[0] || 'N/A';

  const temperatures = environmentalSensorsDataFirebase ? Object.values(environmentalSensorsDataFirebase).map((sensor: any) => sensor.readings?.temperature?.celsius).filter(value => value !== undefined) : [];
  const averageTemperature = temperatures.length > 0 ? (temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length).toFixed(1) : 'N/A';

  const humidities = environmentalSensorsDataFirebase ? Object.values(environmentalSensorsDataFirebase).map((sensor: any) => sensor.readings?.humidity?.percentage).filter(value => value !== undefined) : [];
  const averageHumidity = humidities.length > 0 ? (humidities.reduce((sum, humidity) => sum + humidity, 0) / humidities.length).toFixed(1) : 'N/A';


  // Combine data for the map (precisa ser ajustado para usar lightning_devices)
  const devicesForMap = useMemo(() => {
    const mapDevices: any[] = [];

    // Add lighting devices from /lightning_devices
    if (lightningDevicesDataFirebase) {
      Object.keys(lightningDevicesDataFirebase).forEach(key => {
        const deviceData = lightningDevicesDataFirebase[key];
        if (deviceData.location && deviceData.location.lat !== undefined && deviceData.location.lng !== undefined) {
           mapDevices.push({
             id: key,
             lat: deviceData.location.lat,
             lng: deviceData.location.lng,
             type: 'lighting', // Explicitly set type
             status: deviceData.status, // Use status from lightning_devices
             location: { description: deviceData.location.description || 'Localização desconhecida' }
           });
        }
      });
    }

    // Add traffic sensors from /traffic_sensors (assuming they have location and type)
     if (trafficSensorsDataFirebase) {
       Object.keys(trafficSensorsDataFirebase).forEach(key => {
         const deviceData = trafficSensorsDataFirebase[key];
         if (deviceData.location && deviceData.location.lat !== undefined && deviceData.location.lng !== undefined) {
            mapDevices.push({
              id: key,
              lat: deviceData.location.lat,
              lng: deviceData.location.lng,
              type: 'traffic', // Explicitly set type
              status: deviceData.status, // Use status from traffic_sensors if available
              flow_intensity: deviceData.traffic_flow?.flow_intensity, // Include flow intensity
              location: { description: deviceData.location.description || 'Localização desconhecida' }
            });
         }
       });
     }

     // Add environmental sensors from /environmental_sensors (assuming they have location and type)
      if (environmentalSensorsDataFirebase) {
        Object.keys(environmentalSensorsDataFirebase).forEach(key => {
          const deviceData = environmentalSensorsDataFirebase[key];
          if (deviceData.location && deviceData.location.lat !== undefined && deviceData.location.lng !== undefined) {
             mapDevices.push({
               id: key,
               lat: deviceData.location.lat,
               lng: deviceData.location.lng,
               type: 'environmental', // Explicitly set type
               status: deviceData.status, // Use status from environmental_sensors if available
               location: { description: deviceData.location.description || 'Localização desconhecida' }
             });
          }
        });
      }


    return mapDevices;
  }, [lightningDevicesDataFirebase, trafficSensorsDataFirebase, environmentalSensorsDataFirebase]); // Dependências do useMemo


  // Handle loading and error states for all data
  if (alertsLoading || deviceStatusLoading || lightningDevicesLoading || trafficSensorsLoading || environmentalSensorsLoading) {
    return <DashboardLayout><div>Carregando dados do Firebase...</div></DashboardLayout>;
  }

  if (alertsError || deviceStatusError || lightningDevicesError || trafficSensorsError || environmentalSensorsError) {
    return <DashboardLayout><div>Erro ao carregar dados do Firebase: {alertsError?.message || deviceStatusError?.message || lightningDevicesError?.message || trafficSensorsError?.message || environmentalSensorsError?.message}</div></DashboardLayout>;
  }


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
          value={totalDevices.toString()}
          trend={{ value: 5.2, positive: true }} // Keep mock trend for now
          icon={<Signal size={18} />}
        />
        <StatsCard
          title="Dispositivos Online"
          value={onlineDevices.toString()}
          trend={{ value: 2.8, positive: true }} // Keep mock trend for now
          variant="green"
          icon={<Wifi size={18} />}
        />
        <StatsCard
          title="Alertas Ativos"
          value={alerts.length.toString()}
          trend={{ value: 1.5, positive: false }} // Keep mock trend for now
          variant="amber"
          icon={<AlertCircle size={18} />}
        />
        <StatsCard
          title="Consumo de Energia"
          value="1240 kWh" // Keep mock value for now
          trend={{ value: 3.2, positive: false }} // Keep mock trend for now
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
                <StatusIndicator variant="online">{`Online (${onlineDevices})`}</StatusIndicator>
                <StatusIndicator variant="offline">{`Offline (${offlineDevices})`}</StatusIndicator>
              </div>
            </div>
            {/* Map component using combined real data */}
            <Map
              height="400px"
              devices={devicesForMap}
              showDevices={true}
              centerLat={-12.2368} // Latitude de Feira de Santana
              centerLng={-38.9567} // Longitude de Feira de Santana
              zoom={12} // Ajustar zoom para a cidade
            />
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
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                message={alert.description || alert.message} // Use description from Firebase if available
                timestamp={new Date(alert.creationTimestamp).toLocaleString()} // Format timestamp
                location={alert.location?.description || 'N/A'} // Use location description
                severity={alert.severity.toLowerCase() as any} // Ensure severity is lowercase
                onView={() => console.log("View alert", alert.id)}
              />
            ))}
          </div>
        </div>
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
              <StatusIndicator variant="online">{`${totalLightingDevices} dispositivos`}</StatusIndicator>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Consumo atual</span>
                <span>1240 kWh</span> {/* Keep mock data */}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Luzes ligadas</span>
                <span>{`${lightsOn} (${lightsOnPercentage}%)`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Economia mensal</span>
                <span className="text-city-green-500">12%</span> {/* Keep mock data */}
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
              <StatusIndicator variant="online">{`${totalTrafficSensors} dispositivos`}</StatusIndicator>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Vias monitoradas</span>
                <span>{monitoredRoads}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fluxo atual</span>
                <span>{dominantTrafficFlow}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tempo médio</span>
                <span>18 min</span> {/* Keep mock data */}
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
              {/* Status indicator variant based on dominant air quality? */}
              <StatusIndicator variant={dominantAirQuality === 'GOOD' ? 'online' : dominantAirQuality === 'MODERATE' ? 'warning' : 'offline'}>{`${totalEnvironmentalSensors} dispositivos`}</StatusIndicator>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Qualidade do ar</span>
                <span>{`${dominantAirQuality} ${dominantAirQuality !== 'N/A' ? '(Estimado)' : ''}`}</span> {/* Indicate estimated */}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Temperatura média</span>
                <span>{`${averageTemperature}°C`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Umidade</span>
                <span>{`${averageHumidity}%`}</span>
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
