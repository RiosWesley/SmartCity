
import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layout/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ChartCard } from "@/components/ChartCard";
import Map from "@/components/Map";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Leaf, Thermometer, DropletIcon, Wind, AlertCircle, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for environment page
const airQualityData = [
  { name: "00:00", aqi: 42 },
  { name: "04:00", aqi: 38 },
  { name: "08:00", aqi: 45 },
  { name: "12:00", aqi: 58 },
  { name: "16:00", aqi: 62 },
  { name: "20:00", aqi: 55 },
  { name: "24:00", aqi: 48 },
];

const temperatureData = [
  { name: "00:00", temp: 22 },
  { name: "04:00", temp: 21 },
  { name: "08:00", temp: 23 },
  { name: "12:00", temp: 26 },
  { name: "16:00", temp: 28 },
  { name: "20:00", temp: 25 },
  { name: "24:00", temp: 23 },
];

const humidityData = [
  { name: "00:00", humidity: 65 },
  { name: "04:00", humidity: 68 },
  { name: "08:00", humidity: 62 },
  { name: "12:00", humidity: 55 },
  { name: "16:00", humidity: 52 },
  { name: "20:00", humidity: 58 },
  { name: "24:00", humidity: 62 },
];

const noiseData = [
  { name: "00:00", noise: 45 },
  { name: "04:00", noise: 38 },
  { name: "08:00", noise: 65 },
  { name: "12:00", noise: 72 },
  { name: "16:00", noise: 70 },
  { name: "20:00", noise: 68 },
  { name: "24:00", noise: 52 },
];

const environmentalZones = [
  { 
    id: 1, 
    name: "Parque Ibirapuera", 
    airQuality: "Boa", 
    aqi: 42, 
    temp: 24, 
    humidity: 65, 
    noise: 45
  },
  { 
    id: 2, 
    name: "Centro", 
    airQuality: "Moderada", 
    aqi: 75, 
    temp: 26, 
    humidity: 58, 
    noise: 70
  },
  { 
    id: 3, 
    name: "Zona Leste", 
    airQuality: "Ruim", 
    aqi: 95, 
    temp: 27, 
    humidity: 62, 
    noise: 65
  },
  { 
    id: 4, 
    name: "Zona Norte", 
    airQuality: "Boa", 
    aqi: 48, 
    temp: 25, 
    humidity: 60, 
    noise: 55
  },
  { 
    id: 5, 
    name: "Zona Sul", 
    airQuality: "Boa", 
    aqi: 52, 
    temp: 24, 
    humidity: 63, 
    noise: 50
  },
  { 
    id: 6, 
    name: "Zona Oeste", 
    airQuality: "Moderada", 
    aqi: 65, 
    temp: 26, 
    humidity: 59, 
    noise: 60
  },
];

const airQualityLevels = [
  { label: "Boa", range: "0-50", description: "Qualidade do ar satisfatória, risco mínimo à saúde." },
  { label: "Moderada", range: "51-100", description: "Qualidade do ar aceitável, risco moderado para pessoas sensíveis." },
  { label: "Ruim", range: "101-150", description: "Pessoas sensíveis podem sofrer efeitos na saúde." },
  { label: "Muito Ruim", range: "151-200", description: "Toda a população pode sofrer efeitos na saúde." },
  { label: "Péssima", range: ">200", description: "Alerta de saúde: todos podem sofrer efeitos graves." },
];

const Environment = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Monitoramento Ambiental</h1>
          <p className="text-gray-500">Acompanhe condições ambientais e qualidade do ar</p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Sensores Ambientais"
          value="125"
          icon={<Leaf size={18} />}
          variant="green"
        />
        <StatsCard
          title="Qualidade do Ar (Média)"
          value="52 AQI"
          subtitle="Moderada"
          icon={<Wind size={18} />}
          variant="amber"
        />
        <StatsCard
          title="Temperatura Média"
          value="24°C"
          trend={{ value: 1.2, positive: true }}
          icon={<Thermometer size={18} />}
          variant="red"
        />
        <StatsCard
          title="Umidade Média"
          value="62%"
          trend={{ value: 2.5, positive: false }}
          icon={<DropletIcon size={18} />}
          variant="blue"
        />
      </div>

      {/* Map and Air Quality Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mapa Ambiental</h2>
            <div className="flex items-center gap-2">
              <StatusIndicator variant="online">Sensores Ativos (118)</StatusIndicator>
              <StatusIndicator variant="offline">Inativos (7)</StatusIndicator>
            </div>
          </div>
          <Map height="400px" deviceTypes={["environmental"]} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Índice de Qualidade do Ar</h2>
          <Card className="glass-card p-5 h-[400px] flex flex-col overflow-auto">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Média da Cidade</h3>
                <div className="py-1 px-2 rounded-full bg-city-amber-100 text-city-amber-800 text-xs font-medium">
                  Moderada
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="text-3xl font-bold">52</div>
                <div className="text-sm text-gray-500">Índice de Qualidade do Ar</div>
              </div>
              
              <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500"
                  style={{ width: "52%" }}
                ></div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Níveis de Qualidade do Ar</h3>
              <div className="space-y-3">
                {airQualityLevels.map((level, index) => (
                  <div key={index} className="flex p-2 rounded-lg hover:bg-white/50 transition-colors">
                    <div className="w-1 mr-2 self-stretch rounded-full" 
                      style={{ 
                        backgroundColor: 
                          index === 0 ? "#22c55e" : 
                          index === 1 ? "#eab308" : 
                          index === 2 ? "#f97316" : 
                          index === 3 ? "#ef4444" : 
                          "#7f1d1d" 
                      }}
                    ></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{level.label}</span>
                        <span className="text-xs text-gray-500">AQI {level.range}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-3">
              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 size={14} className="mr-1" />
                Ver Relatório Completo
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Environment Data Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="air-quality" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Dados Ambientais</h2>
            <TabsList className="grid grid-cols-4 w-auto">
              <TabsTrigger value="air-quality">Qualidade do Ar</TabsTrigger>
              <TabsTrigger value="temperature">Temperatura</TabsTrigger>
              <TabsTrigger value="humidity">Umidade</TabsTrigger>
              <TabsTrigger value="noise">Ruído</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="air-quality" className="mt-0">
            <ChartCard
              title="Qualidade do Ar (Hoje)"
              description="Índice AQI durante o dia"
              data={airQualityData}
              type="line"
              dataKeys={["aqi"]}
              colors={["#00B359"]}
              yAxisFormatter={(value) => `${value}`}
            />
          </TabsContent>
          
          <TabsContent value="temperature" className="mt-0">
            <ChartCard
              title="Temperatura (Hoje)"
              description="°C durante o dia"
              data={temperatureData}
              type="line"
              dataKeys={["temp"]}
              colors={["#E50D00"]}
              yAxisFormatter={(value) => `${value}°C`}
            />
          </TabsContent>
          
          <TabsContent value="humidity" className="mt-0">
            <ChartCard
              title="Umidade (Hoje)"
              description="% durante o dia"
              data={humidityData}
              type="line"
              dataKeys={["humidity"]}
              colors={["#0064FF"]}
              yAxisFormatter={(value) => `${value}%`}
            />
          </TabsContent>
          
          <TabsContent value="noise" className="mt-0">
            <ChartCard
              title="Nível de Ruído (Hoje)"
              description="dB durante o dia"
              data={noiseData}
              type="line"
              dataKeys={["noise"]}
              colors={["#FFC000"]}
              yAxisFormatter={(value) => `${value} dB`}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Environmental Zones */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Zonas Monitoradas</h2>
        <div className="overflow-hidden rounded-xl glass-card border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zona
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qualidade do Ar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AQI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Umidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ruído
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {environmentalZones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{zone.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${zone.airQuality === 'Boa' ? 'bg-city-green-100 text-city-green-800 border-city-green-200' : ''}
                          ${zone.airQuality === 'Moderada' ? 'bg-city-amber-100 text-city-amber-800 border-city-amber-200' : ''}
                          ${zone.airQuality === 'Ruim' ? 'bg-city-red-100 text-city-red-800 border-city-red-200' : ''}
                        `}
                      >
                        {zone.airQuality}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{zone.aqi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{zone.temp}°C</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{zone.humidity}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{zone.noise} dB</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-city-green-600 hover:text-city-green-800">
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
    </DashboardLayout>
  );
};

export default Environment;
