import React, { useState, useMemo } from "react";
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
  Search,
  Loader2
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

import useFirebaseData from "@/hooks/useFirebaseData"; // Import the hook

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

  // Fetch alerts data from Firebase
  const { data: alertsData, loading, error } = useFirebaseData('/alerts');

  // Convert Firebase object data to array and filter
  const allAlerts = useMemo(() => {
    if (!alertsData) return [];
    return Object.keys(alertsData).map(key => ({
      id: key, // Use Firebase key as ID
      ...alertsData[key],
      // Map Firebase severity to local severity if needed, assuming they match for now
      severity: alertsData[key].severity.toLowerCase(),
      // Map Firebase sourceDeviceType to local system type
      system: alertsData[key].sourceDeviceType.replace('_sensor', '').replace('_controller', ''),
      // Format timestamp (example, adjust as needed)
      timestamp: new Date(alertsData[key].creationTimestamp).toLocaleString(),
      location: alertsData[key].location?.description || 'Localização desconhecida',
    }));
  }, [alertsData]);

  const activeAlerts = useMemo(() => {
    return allAlerts.filter(alert => alert.status === 'NEW');
  }, [allAlerts]);

  const resolvedAlerts = useMemo(() => {
    return allAlerts.filter(alert => alert.status !== 'NEW');
  }, [allAlerts]);


  // Filter active alerts based on the current filters
  const filteredActiveAlerts = useMemo(() => {
    return activeAlerts.filter(alert => {
      // Apply search filter
      const matchesSearch = searchQuery === "" ||
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) || // Use description from Firebase
        alert.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply category filter
      const matchesCategory = categoryFilter === "all" || alert.severity === categoryFilter;

      // Apply system filter
      const matchesSystem = systemFilter === "all" || alert.system === systemFilter;

      return matchesSearch && matchesCategory && matchesSystem;
    });
  }, [activeAlerts, searchQuery, categoryFilter, systemFilter]);

  // Filter resolved alerts based on the current filters (optional, but good for consistency)
  const filteredResolvedAlerts = useMemo(() => {
    return resolvedAlerts.filter(alert => {
      // Apply search filter
      const matchesSearch = searchQuery === "" ||
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) || // Use description from Firebase
        alert.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply category filter
      const matchesCategory = categoryFilter === "all" || alert.severity === categoryFilter;

      // Apply system filter
      const matchesSystem = systemFilter === "all" || alert.system === systemFilter;

      return matchesSearch && matchesCategory && matchesSystem;
    });
  }, [resolvedAlerts, searchQuery, categoryFilter, systemFilter]);


  // Calculate stats
  const totalAlertsCount = allAlerts.length;
  const criticalAlertsCount = allAlerts.filter(alert => alert.severity === 'critical').length;
  const warningAlertsCount = allAlerts.filter(alert => alert.severity === 'warning').length;
  const infoAlertsCount = allAlerts.filter(alert => alert.severity === 'info').length;


  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-city-blue-500" />
          <span className="ml-3 text-lg text-gray-600">Carregando alertas...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Erro ao carregar alertas</h3>
          <p className="text-gray-500">
            Ocorreu um erro ao buscar os dados de alertas do Firebase: {error.message}
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
          <h1 className="text-2xl font-bold">Sistema de Alertas</h1>
          <p className="text-gray-500">Monitore e gerencie alertas de todos os sistemas</p>
        </motion.div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total de Alertas"
          value={totalAlertsCount.toString()}
          icon={<Bell size={18} />}
        />
        <StatsCard
          title="Alertas Críticos"
          value={criticalAlertsCount.toString()}
          variant="red"
          icon={<AlertOctagon size={18} />}
        />
        <StatsCard
          title="Alertas de Aviso"
          value={warningAlertsCount.toString()}
          variant="amber"
          icon={<AlertTriangle size={18} />}
        />
        <StatsCard
          title="Alertas Informativos"
          value={infoAlertsCount.toString()}
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
                Ativos ({filteredActiveAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="flex items-center gap-2">
                <CheckCircle2 size={14} />
                Resolvidos ({filteredResolvedAlerts.length})
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
                  message={alert.description} // Use description from Firebase
                  timestamp={alert.timestamp}
                  location={alert.location}
                  severity={alert.severity as any}
                  onDismiss={() => console.log("Dismiss alert", alert.id)} // Implement Firebase update later
                  onView={() => console.log("View alert", alert.id)} // Implement view logic later
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
            {filteredResolvedAlerts.length > 0 ? (
              filteredResolvedAlerts.map((alert) => (
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
                      <div className="mt-1 text-sm text-gray-600">{alert.description}</div> {/* Use description */}
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
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <CheckCircle2 size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum alerta resolvido encontrado</h3>
                <p className="text-gray-500">
                  Não foram encontrados alertas resolvidos que correspondam aos seus filtros.
                </p>
              </div>
            )}
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
      {/* These stats are still mock data. Need to implement calculation based on Firebase data. */}
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
