
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layout/DashboardLayout";
import { ChartCard } from "@/components/ChartCard";
import {
  Download,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  FileText,
  Share2,
  RefreshCcw,
  Printer,
  Mail,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import useFirebaseData from "@/hooks/useFirebaseData"; // Import the hook

const Reports = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [dateRange, setDateRange] = useState("last-6-months");

  // Fetch data from Firebase
  const { data: deviceStatusData, loading: loadingDevices, error: errorDevices } = useFirebaseData('/device_status');
  const { data: trafficSensorsData, loading: loadingTraffic, error: errorTraffic } = useFirebaseData('/traffic_sensors');
  const { data: environmentalSensorsData, loading: loadingEnvironment, error: errorEnvironment } = useFirebaseData('/environmental_sensors');
  const { data: alertsData, loading: loadingAlerts, error: errorAlerts } = useFirebaseData('/alerts');

  // Combine loading and error states
  const loading = loadingDevices || loadingTraffic || loadingEnvironment || loadingAlerts;
  const error = errorDevices || errorTraffic || errorEnvironment || errorAlerts;

  // Process data for charts and reports (Placeholder - detailed processing needed)
  const monthlyDeviceData = useMemo(() => {
    if (!deviceStatusData) return [];
    // TODO: Implement logic to process deviceStatusData into monthly totals, online, and offline counts based on dateRange
    return []; // Replace with processed data
  }, [deviceStatusData, dateRange]);

  const energyConsumptionData = useMemo(() => {
    // TODO: Determine Firebase path and implement logic for energy consumption data
    return []; // Replace with processed data
  }, [dateRange]); // Add relevant Firebase data dependency

  const trafficVolumeData = useMemo(() => {
    if (!trafficSensorsData) return [];
    // TODO: Implement logic to process trafficSensorsData into monthly volume based on dateRange
    return []; // Replace with processed data
  }, [trafficSensorsData, dateRange]);

  const airQualityTrendData = useMemo(() => {
    if (!environmentalSensorsData) return [];
    // TODO: Implement logic to process environmentalSensorsData into monthly AQI average based on dateRange
    return []; // Replace with processed data
  }, [environmentalSensorsData, dateRange]);

  const alertsTrendData = useMemo(() => {
    if (!alertsData) return [];
    // TODO: Implement logic to process alertsData into monthly counts by severity based on dateRange
    return []; // Replace with processed data
  }, [alertsData, dateRange]);

  const recentReports = useMemo(() => {
    // TODO: Determine Firebase path and implement logic for recent reports data
    return []; // Replace with processed data
  }, []); // Add relevant Firebase data dependency


  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-city-blue-500" />
          <span className="ml-3 text-lg text-gray-600">Carregando relatórios...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Erro ao carregar relatórios</h3>
          <p className="text-gray-500">
            Ocorreu um erro ao buscar os dados de relatórios do Firebase: {error.message}
          </p>
        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Relatórios e Análises</h1>
          <p className="text-gray-500">Visualize dados históricos e gere relatórios</p>
        </motion.div>
      </div>

      {/* Report Controls */}
      <div className="mb-6">
        <div className="glass-card rounded-xl p-4 border border-white/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-medium">Período:</span>
              <Select
                value={dateRange}
                onValueChange={setDateRange}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-month">Último Mês</SelectItem>
                  <SelectItem value="last-3-months">Últimos 3 Meses</SelectItem>
                  <SelectItem value="last-6-months">Últimos 6 Meses</SelectItem>
                  <SelectItem value="last-year">Último Ano</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Calendar size={16} />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <RefreshCcw size={16} />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={16} />
                Exportar
              </Button>
              <Button size="sm" className="gap-1">
                <FileText size={16} />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="w-full mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">Análise de Dados</h2>
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full sm:w-auto">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="lighting">Iluminação</TabsTrigger>
            <TabsTrigger value="traffic">Tráfego</TabsTrigger>
            <TabsTrigger value="environment">Ambiente</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartCard
              title="Crescimento do Sistema"
              description="Total de dispositivos ao longo do tempo"
              data={monthlyDeviceData} // Use processed data
              type="line"
              dataKeys={["total", "online", "offline"]}
              colors={["#0064FF", "#00E673", "#FF6E65"]}
            />
            <ChartCard
              title="Tendência de Alertas"
              description="Alertas por categoria ao longo do tempo"
              data={alertsTrendData} // Use processed data
              type="bar"
              dataKeys={["critical", "warning", "info"]}
              colors={["#FF6E65", "#FFC000", "#0064FF"]}
              yAxisFormatter={(value) => `${value}`}
            />
          </div>
          {/* System Summary - Placeholder for data from deviceStatusData */}
          <div className="glass-card rounded-xl p-6 border border-white/30 mb-6">
            <h3 className="font-semibold mb-4">Resumo do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Dispositivos</span>
                  {/* TODO: Use actual data from deviceStatusData */}
                  <span className="text-xs text-city-blue-600 bg-city-blue-50 px-2 py-0.5 rounded-full">+5.2%</span>
                </div>
                {/* TODO: Use actual data from deviceStatusData */}
                <div className="text-2xl font-bold mb-1">---</div>
                {/* TODO: Use actual data from deviceStatusData */}
                <div className="text-xs text-gray-500">Comparado ao período anterior</div>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Disponibilidade</span>
                   {/* TODO: Use actual data from deviceStatusData */}
                  <span className="text-xs text-city-green-600 bg-city-green-50 px-2 py-0.5 rounded-full">+1.3%</span>
                </div>
                 {/* TODO: Use actual data from deviceStatusData */}
                <div className="text-2xl font-bold mb-1">---</div>
                 {/* TODO: Use actual data from deviceStatusData */}
                <div className="text-xs text-gray-500">Comparado ao período anterior</div>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Tempo de Resposta</span>
                   {/* TODO: Use actual data from alertsData or other relevant source */}
                  <span className="text-xs text-city-green-600 bg-city-green-50 px-2 py-0.5 rounded-full">-15%</span>
                </div>
                 {/* TODO: Use actual data from alertsData or other relevant source */}
                <div className="text-2xl font-bold mb-1">---</div>
                 {/* TODO: Use actual data from alertsData or other relevant source */}
                <div className="text-xs text-gray-500">Comparado ao período anterior</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Lighting Tab */}
        <TabsContent value="lighting" className="mt-0">
          <ChartCard
            title="Consumo de Energia"
            description="kWh por mês"
            data={energyConsumptionData} // Use processed data
            type="area"
            dataKeys={["consumption"]}
            colors={["#0064FF"]}
            yAxisFormatter={(value) => `${Math.floor(value / 1000)}k`}
          />
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="mt-0">
          <ChartCard
            title="Volume de Tráfego"
            description="Veículos por mês"
            data={trafficVolumeData} // Use processed data
            type="bar"
            dataKeys={["volume"]}
            colors={["#0BC9C0"]}
            yAxisFormatter={(value) => `${Math.floor(value / 1000)}k`}
          />
        </TabsContent>

        {/* Environment Tab */}
        <TabsContent value="environment" className="mt-0">
          <ChartCard
            title="Qualidade do Ar"
            description="Índice AQI médio por mês"
            data={airQualityTrendData} // Use processed data
            type="line"
            dataKeys={["aqi"]}
            colors={["#00E673"]}
            yAxisFormatter={(value) => `${value}`}
          />
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="mt-0">
          <ChartCard
            title="Tendência de Alertas"
            description="Alertas por categoria ao longo do tempo"
            data={alertsTrendData} // Use processed data
            type="bar"
            dataKeys={["critical", "warning", "info"]}
            colors={["#FF6E65", "#FFC000", "#0064FF"]}
            yAxisFormatter={(value) => `${value}`}
          />
        </TabsContent>
      </Tabs>

      {/* Recent Reports */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Relatórios Recentes</h2>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl glass-card border border-white/30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamanho
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentReports.map((report, index) => ( // Use processed data
                  <tr key={index} className="hover:bg-gray-50/50"> {/* Use index as key for now, replace with unique ID if available */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText size={18} className="text-city-blue-500 mr-2" />
                        <div className="text-sm font-medium">{report.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{report.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`
                          ${report.type === 'system' ? 'bg-city-blue-50 text-city-blue-700 border-city-blue-100' : ''}
                          ${report.type === 'lighting' ? 'bg-city-blue-50 text-city-blue-700 border-city-blue-100' : ''}
                          ${report.type === 'traffic' ? 'bg-city-teal-50 text-city-teal-700 border-city-teal-100' : ''}
                          ${report.type === 'environment' ? 'bg-city-green-50 text-city-green-700 border-city-green-100' : ''}
                          ${report.type === 'alerts' ? 'bg-city-amber-50 text-city-amber-700 border-city-amber-100' : ''}
                        `}
                      >
                        {report.type === 'system' && 'Sistema'}
                        {report.type === 'lighting' && 'Iluminação'}
                        {report.type === 'traffic' && 'Tráfego'}
                        {report.type === 'environment' && 'Ambiente'}
                        {report.type === 'alerts' && 'Alertas'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{report.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Printer size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Report Generator */}
      <div>
        <div className="glass-card rounded-xl p-6 border border-white/30">
          <h2 className="text-lg font-semibold mb-4">Gerador de Relatórios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Tipo de Relatório</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/50 rounded-lg cursor-pointer border-2 border-city-blue-500">
                  <div className="flex flex-col items-center">
                    <BarChart3 size={24} className="text-city-blue-500 mb-2" />
                    <span className="text-sm font-medium">Sumário Executivo</span>
                  </div>
                </div>
                <div className="p-3 bg-white/50 rounded-lg cursor-pointer hover:border-2 hover:border-city-blue-300">
                  <div className="flex flex-col items-center">
                    <PieChart size={24} className="text-gray-500 mb-2" />
                    <span className="text-sm">Detalhado</span>
                  </div>
                </div>
                <div className="p-3 bg-white/50 rounded-lg cursor-pointer hover:border-2 hover:border-city-blue-300">
                  <div className="flex flex-col items-center">
                    <LineChart size={24} className="text-gray-500 mb-2" />
                    <span className="text-sm">Análise de Tendências</span>
                  </div>
                </div>
                <div className="p-3 bg-white/50 rounded-lg cursor-pointer hover:border-2 hover:border-city-blue-300">
                  <div className="flex flex-col items-center">
                    <Mail size={24} className="text-gray-500 mb-2" />
                    <span className="text-sm">Relatório por Email</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Opções do Relatório</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm">Incluir Gráficos</span>
                  <div className="bg-white w-6 h-6 rounded flex items-center justify-center">
                    <div className="w-4 h-4 bg-city-blue-500 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm">Incluir Dados Brutos</span>
                  <div className="bg-white w-6 h-6 rounded flex items-center justify-center">
                    <div className="w-4 h-4 bg-city-blue-500 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm">Enviar por Email</span>
                  <div className="bg-white w-6 h-6 rounded"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm">Programar Recorrência</span>
                  <div className="bg-white w-6 h-6 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>
              <FileText size={16} className="mr-1" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
