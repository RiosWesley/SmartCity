
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layout/DashboardLayout";
import { StatusIndicator } from "@/components/StatusIndicator";
import { AlertCard } from "@/components/AlertCard";
import { StatsCard } from "@/components/StatsCard";
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  CheckCircle2, 
  Filter, 
  Clock, 
  Search 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock alerts data
const activeAlerts = [
  {
    id: 1,
    title: "Falha no sensor de iluminação",
    message: "O sensor de iluminação ID-3245 não está respondendo há 15 minutos.",
    timestamp: "Há 35 minutos",
    location: "Av. Paulista, 1000",
    severity: "warning",
    system: "lighting",
  },
  {
    id: 2,
    title: "Congestionamento severo detectado",
    message: "Tráfego intenso detectado na região central. Tempo de espera estimado: 25 min.",
    timestamp: "Há 12 minutos",
    location: "Av. Rebouças",
    severity: "critical",
    system: "traffic",
  },
  {
    id: 3,
    title: "Qualidade do ar abaixo do ideal",
    message: "Níveis de poluição acima do normal detectados na zona leste.",
    timestamp: "Há 1 hora",
    location: "Zona Leste",
    severity: "info",
    system: "environment",
  },
  {
    id: 4,
    title: "Luminosidade insuficiente",
    message: "Detectada iluminação abaixo do nível mínimo no setor 5B.",
    timestamp: "Há 25 minutos",
    location: "Setor 5B, Centro",
    severity: "warning",
    system: "lighting",
  },
  {
    id: 5,
    title: "Fluxo de tráfego anormal",
    message: "Padrão de tráfego anormal detectado. Possível acidente ou bloqueio.",
    timestamp: "Há 5 minutos",
    location: "Marginal Pinheiros, km 15",
    severity: "critical",
    system: "traffic",
  },
];

const resolvedAlerts = [
  {
    id: 101,
    title: "Falha no semáforo",
    message: "Semáforo ID-7890 operando em modo de emergência.",
    timestamp: "Resolvido há 2h",
    location: "Cruzamento Rua Augusta",
    severity: "warning",
    system: "traffic",
  },
  {
    id: 102,
    title: "Nível de ruído elevado",
    message: "Níveis de ruído acima de 85dB detectados na zona central.",
    timestamp: "Resolvido há 4h",
    location: "Centro",
    severity: "info",
    system: "environment",
  },
  {
    id: 103,
    title: "Falha de energia em poste",
    message: "Poste ID-2341 sem energia elétrica.",
    timestamp: "Resolvido há 6h",
    location: "Av. Paulista, 1200",
    severity: "warning",
    system: "lighting",
  },
];

const alertCategories = [
  { value: "all", label: "Todos" },
  { value: "critical", label: "Críticos" },
  { value: "warning", label: "Alertas" },
  { value: "info", label: "Informações" },
];

const systemTypes = [
  { value: "all", label: "Todos os Sistemas" },
  { value: "lighting", label: "Iluminação" },
  { value: "traffic", label: "Tráfego" },
  { value: "environment", label: "Ambiente" },
];

const Alerts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [systemFilter, setSystemFilter] = useState("all");

  // Filter active alerts based on the current filters
  const filteredActiveAlerts = activeAlerts.filter(alert => {
    // Apply search filter
    const matchesSearch = searchQuery === "" || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = categoryFilter === "all" || alert.severity === categoryFilter;
    
    // Apply system filter
    const matchesSystem = systemFilter === "all" || alert.system === systemFilter;
    
    return matchesSearch && matchesCategory && matchesSystem;
  });

  return (
    <DashboardLayout>
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Sistema de Alertas</h1>
          <p className="text-gray-500">Monitore e gerencie alertas de todos os sistemas</p>
        </motion.div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total de Alertas"
          value="38"
          icon={<Bell size={18} />}
        />
        <StatsCard
          title="Alertas Críticos"
          value="5"
          variant="red"
          icon={<AlertOctagon size={18} />}
        />
        <StatsCard
          title="Alertas de Aviso"
          value="12"
          variant="amber"
          icon={<AlertTriangle size={18} />}
        />
        <StatsCard
          title="Alertas Informativos"
          value="21"
          variant="blue"
          icon={<Info size={18} />}
        />
      </div>

      {/* Alert Filters */}
      <div className="mb-6">
        <div className="glass-card rounded-xl p-4 border border-white/30">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar alertas..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tipo de alerta" />
                </SelectTrigger>
                <SelectContent>
                  {alertCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={systemFilter}
                onValueChange={setSystemFilter}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Sistema" />
                </SelectTrigger>
                <SelectContent>
                  {systemTypes.map((system) => (
                    <SelectItem key={system.value} value={system.value}>
                      {system.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Tabs */}
      <Tabs defaultValue="active" className="w-full mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Lista de Alertas</h2>
          <div className="flex items-center gap-3">
            <TabsList className="grid grid-cols-2 w-auto">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <AlertTriangle size={14} />
                Ativos
              </TabsTrigger>
              <TabsTrigger value="resolved" className="flex items-center gap-2">
                <CheckCircle2 size={14} />
                Resolvidos
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="active" className="mt-0">
          <div className="space-y-4">
            {filteredActiveAlerts.length > 0 ? (
              filteredActiveAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  title={alert.title}
                  message={alert.message}
                  timestamp={alert.timestamp}
                  location={alert.location}
                  severity={alert.severity as any}
                  onDismiss={() => console.log("Dismiss alert", alert.id)}
                  onView={() => console.log("View alert", alert.id)}
                  className="animate-fade-in"
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Bell size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum alerta encontrado</h3>
                <p className="text-gray-500">
                  Não foram encontrados alertas que correspondam aos seus filtros.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-0">
          <div className="space-y-4">
            {resolvedAlerts.map((alert) => (
              <div key={alert.id} className="glass-card rounded-xl p-4 border border-gray-200 animate-fade-in">
                <div className="flex items-start">
                  <div className="flex-shrink-0 opacity-60">
                    {alert.severity === "info" && <Info size={20} className="text-city-blue-500" />}
                    {alert.severity === "warning" && <AlertTriangle size={20} className="text-city-amber-500" />}
                    {alert.severity === "critical" && <AlertOctagon size={20} className="text-city-red-500" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700">{alert.title}</h3>
                      <Badge variant="outline" className="bg-city-green-50 text-city-green-700 border-city-green-200">
                        Resolvido
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">{alert.message}</div>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      <span>{alert.timestamp}</span>
                      {alert.location && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{alert.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Alert Response Guide */}
      <div className="glass-card rounded-xl p-6 border border-white/30 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="sm:w-1/3">
            <h2 className="text-lg font-semibold mb-2">Guia de Resposta</h2>
            <p className="text-gray-600 text-sm">
              Este guia fornece instruções sobre como responder a diferentes tipos de alertas no sistema.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-city-red-50 border border-city-red-100">
              <div className="flex items-center mb-2">
                <AlertOctagon size={16} className="text-city-red-600 mr-2" />
                <h3 className="font-medium text-city-red-800">Alertas Críticos</h3>
              </div>
              <p className="text-sm text-city-red-700">
                Requerem atenção imediata e possivelmente intervenção de equipes de emergência. Responda em 15 minutos.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-city-amber-50 border border-city-amber-100">
              <div className="flex items-center mb-2">
                <AlertTriangle size={16} className="text-city-amber-600 mr-2" />
                <h3 className="font-medium text-city-amber-800">Alertas de Aviso</h3>
              </div>
              <p className="text-sm text-city-amber-700">
                Indicam problemas que precisam de atenção, mas não são críticos. Responda dentro de 1 hora.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-city-blue-50 border border-city-blue-100">
              <div className="flex items-center mb-2">
                <Info size={16} className="text-city-blue-600 mr-2" />
                <h3 className="font-medium text-city-blue-800">Alertas Informativos</h3>
              </div>
              <p className="text-sm text-city-blue-700">
                Fornecem informações sobre o sistema que podem requerer monitoramento contínuo. Revisão periódica.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5 border border-white/30">
          <h3 className="font-semibold mb-4">Distribuição por Sistema</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Iluminação</span>
                <span className="text-sm text-gray-500">45%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-full bg-city-blue-500 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Tráfego</span>
                <span className="text-sm text-gray-500">32%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-full bg-city-teal-500 rounded-full" style={{ width: "32%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Ambiente</span>
                <span className="text-sm text-gray-500">23%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-full bg-city-green-500 rounded-full" style={{ width: "23%" }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border border-white/30">
          <h3 className="font-semibold mb-4">Tempo Médio de Resolução</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Alertas Críticos</span>
                <span className="text-sm text-gray-500">18 minutos</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-full bg-city-red-500 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Alertas de Aviso</span>
                <span className="text-sm text-gray-500">45 minutos</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-full bg-city-amber-500 rounded-full" style={{ width: "62%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Alertas Informativos</span>
                <span className="text-sm text-gray-500">2.3 horas</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-full bg-city-blue-500 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
