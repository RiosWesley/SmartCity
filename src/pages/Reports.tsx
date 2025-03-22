
import React, { useState } from "react";
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

// Mock data for reports page
const monthlyDeviceData = [
  { name: "Jan", total: 320, online: 290, offline: 30 },
  { name: "Fev", total: 342, online: 315, offline: 27 },
  { name: "Mar", total: 385, online: 350, offline: 35 },
  { name: "Abr", total: 410, online: 380, offline: 30 },
  { name: "Mai", total: 458, online: 430, offline: 28 },
  { name: "Jun", total: 486, online: 460, offline: 26 },
  { name: "Jul", total: 512, online: 485, offline: 27 },
  { name: "Ago", total: 538, online: 510, offline: 28 },
];

const energyConsumptionData = [
  { name: "Jan", consumption: 8240 },
  { name: "Fev", consumption: 7850 },
  { name: "Mar", consumption: 8120 },
  { name: "Abr", consumption: 7940 },
  { name: "Mai", consumption: 7430 },
  { name: "Jun", consumption: 6980 },
  { name: "Jul", consumption: 7240 },
  { name: "Ago", consumption: 7120 },
];

const trafficVolumeData = [
  { name: "Jan", volume: 245600 },
  { name: "Fev", volume: 278300 },
  { name: "Mar", volume: 284500 },
  { name: "Abr", volume: 292100 },
  { name: "Mai", volume: 305800 },
  { name: "Jun", volume: 318400 },
  { name: "Jul", volume: 328900 },
  { name: "Ago", volume: 335200 },
];

const airQualityTrendData = [
  { name: "Jan", aqi: 48 },
  { name: "Fev", aqi: 45 },
  { name: "Mar", aqi: 51 },
  { name: "Abr", aqi: 58 },
  { name: "Mai", aqi: 62 },
  { name: "Jun", aqi: 55 },
  { name: "Jul", aqi: 52 },
  { name: "Ago", aqi: 50 },
];

const alertsTrendData = [
  { name: "Jan", critical: 12, warning: 34, info: 78 },
  { name: "Fev", critical: 8, warning: 29, info: 65 },
  { name: "Mar", critical: 10, warning: 32, info: 70 },
  { name: "Abr", critical: 15, warning: 38, info: 82 },
  { name: "Mai", critical: 11, warning: 36, info: 75 },
  { name: "Jun", critical: 7, warning: 28, info: 68 },
  { name: "Jul", critical: 9, warning: 30, info: 72 },
  { name: "Ago", critical: 8, warning: 27, info: 65 },
];

const recentReports = [
  {
    id: 1,
    title: "Relatório Mensal de Desempenho",
    date: "01/08/2023",
    type: "system",
    size: "4.2 MB",
  },
  {
    id: 2,
    title: "Análise de Consumo de Energia",
    date: "28/07/2023",
    type: "lighting",
    size: "3.8 MB",
  },
  {
    id: 3,
    title: "Tendências de Tráfego - Julho",
    date: "25/07/2023",
    type: "traffic",
    size: "5.1 MB",
  },
  {
    id: 4,
    title: "Relatório de Qualidade do Ar",
    date: "20/07/2023",
    type: "environment",
    size: "2.9 MB",
  },
  {
    id: 5,
    title: "Sumário de Alertas do Sistema",
    date: "15/07/2023",
    type: "alerts",
    size: "3.5 MB",
  },
];

const Reports = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [dateRange, setDateRange] = useState("last-6-months");
  
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
              data={monthlyDeviceData}
              type="line"
              dataKeys={["total", "online", "offline"]}
              colors={["#0064FF", "#00E673", "#FF6E65"]}
            />
            <ChartCard
              title="Tendência de Alertas"
              description="Alertas por categoria ao longo do tempo"
              data={alertsTrendData}
              type="bar"
              dataKeys={["critical", "warning", "info"]}
              colors={["#FF6E65", "#FFC000", "#0064FF"]}
              yAxisFormatter={(value) => `${value}`}
            />
          </div>
          <div className="glass-card rounded-xl p-6 border border-white/30 mb-6">
            <h3 className="font-semibold mb-4">Resumo do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Dispositivos</span>
                  <span className="text-xs text-city-blue-600 bg-city-blue-50 px-2 py-0.5 rounded-full">+5.2%</span>
                </div>
                <div className="text-2xl font-bold mb-1">538</div>
                <div className="text-xs text-gray-500">Comparado a 512 no mês anterior</div>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Disponibilidade</span>
                  <span className="text-xs text-city-green-600 bg-city-green-50 px-2 py-0.5 rounded-full">+1.3%</span>
                </div>
                <div className="text-2xl font-bold mb-1">99.8%</div>
                <div className="text-xs text-gray-500">Comparado a 98.5% no mês anterior</div>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Tempo de Resposta</span>
                  <span className="text-xs text-city-green-600 bg-city-green-50 px-2 py-0.5 rounded-full">-15%</span>
                </div>
                <div className="text-2xl font-bold mb-1">25 min</div>
                <div className="text-xs text-gray-500">Comparado a 30 min no mês anterior</div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Lighting Tab */}
        <TabsContent value="lighting" className="mt-0">
          <ChartCard
            title="Consumo de Energia"
            description="kWh por mês"
            data={energyConsumptionData}
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
            data={trafficVolumeData}
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
            data={airQualityTrendData}
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
            data={alertsTrendData}
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
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50">
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
