
import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layout/DashboardLayout";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Server, 
  Globe, 
  Database, 
  Moon,
  Save,
  Undo,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-gray-500">Gerencie as configurações do sistema</p>
        </motion.div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="glass-card p-4 border border-white/30 md:w-64 shrink-0">
            <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
              <TabsTrigger 
                value="general" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-white/70 data-[state=active]:shadow-none" 
              >
                <SettingsIcon size={16} />
                Geral
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-white/70 data-[state=active]:shadow-none" 
              >
                <User size={16} />
                Perfil
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-white/70 data-[state=active]:shadow-none" 
              >
                <Bell size={16} />
                Notificações
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-white/70 data-[state=active]:shadow-none" 
              >
                <Shield size={16} />
                Segurança
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-white/70 data-[state=active]:shadow-none" 
              >
                <Server size={16} />
                Sistema
              </TabsTrigger>
              <TabsTrigger 
                value="integration" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-white/70 data-[state=active]:shadow-none" 
              >
                <Globe size={16} />
                Integrações
              </TabsTrigger>
            </TabsList>
          </Card>

          <div className="flex-1">
            {/* General Settings */}
            <TabsContent value="general" className="mt-0">
              <Card className="glass-card border border-white/30">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Configurações Gerais</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nome do Sistema</label>
                        <Input 
                          defaultValue="CityNexus Smart City" 
                          className="bg-white/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Idioma</label>
                        <Select defaultValue="pt-br">
                          <SelectTrigger className="bg-white/50">
                            <SelectValue placeholder="Selecione o idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Fuso Horário</label>
                      <Select defaultValue="utc-3">
                        <SelectTrigger className="bg-white/50">
                          <SelectValue placeholder="Selecione o fuso horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-3">Brasília (UTC-3)</SelectItem>
                          <SelectItem value="utc-2">Fernando de Noronha (UTC-2)</SelectItem>
                          <SelectItem value="utc-4">Manaus (UTC-4)</SelectItem>
                          <SelectItem value="utc-5">Acre (UTC-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Formato de Data</label>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="date-br" name="date-format" className="w-4 h-4" defaultChecked />
                          <label htmlFor="date-br" className="text-sm">DD/MM/YYYY</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="date-us" name="date-format" className="w-4 h-4" />
                          <label htmlFor="date-us" className="text-sm">MM/DD/YYYY</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="date-iso" name="date-format" className="w-4 h-4" />
                          <label htmlFor="date-iso" className="text-sm">YYYY-MM-DD</label>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Tema Escuro</h3>
                        <p className="text-sm text-gray-500">Alterar para o tema escuro da interface</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Animações</h3>
                        <p className="text-sm text-gray-500">Ativar animações na interface</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50/50 rounded-b-xl border-t border-gray-200 flex justify-end space-x-3">
                  <Button variant="outline">
                    <Undo size={16} className="mr-1" />
                    Cancelar
                  </Button>
                  <Button>
                    <Save size={16} className="mr-1" />
                    Salvar Alterações
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Profile Settings */}
            <TabsContent value="profile" className="mt-0">
              <Card className="glass-card border border-white/30">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Perfil do Usuário</h2>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-city-blue-100 flex items-center justify-center mb-4">
                          <span className="text-city-blue-500 text-4xl font-medium">AD</span>
                        </div>
                        <Button size="sm" variant="outline">Alterar Avatar</Button>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nome</label>
                          <Input defaultValue="Administrador" className="bg-white/50" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Sobrenome</label>
                          <Input defaultValue="do Sistema" className="bg-white/50" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input defaultValue="admin@citynexus.com" className="bg-white/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Cargo</label>
                        <Input defaultValue="Administrador de Sistemas" className="bg-white/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Departamento</label>
                        <Select defaultValue="it">
                          <SelectTrigger className="bg-white/50">
                            <SelectValue placeholder="Selecione o departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="it">TI</SelectItem>
                            <SelectItem value="operations">Operações</SelectItem>
                            <SelectItem value="management">Gerência</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50/50 rounded-b-xl border-t border-gray-200 flex justify-end space-x-3">
                  <Button variant="outline">
                    <Undo size={16} className="mr-1" />
                    Cancelar
                  </Button>
                  <Button>
                    <Save size={16} className="mr-1" />
                    Salvar Alterações
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="mt-0">
              <Card className="glass-card border border-white/30">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Configurações de Notificações</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Canais de Notificação</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div>
                            <span className="font-medium">Email</span>
                            <p className="text-sm text-gray-500">Receber notificações por email</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div>
                            <span className="font-medium">Push</span>
                            <p className="text-sm text-gray-500">Notificações no navegador</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div>
                            <span className="font-medium">SMS</span>
                            <p className="text-sm text-gray-500">Receber SMS para alertas críticos</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Tipos de Notificação</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-city-red-500">Crítico</Badge>
                            <span>Alertas críticos do sistema</span>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-city-amber-400">Aviso</Badge>
                            <span>Alertas de aviso</span>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-city-blue-500">Info</Badge>
                            <span>Notificações informativas</span>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-city-green-500">Sucesso</Badge>
                            <span>Confirmações de ações</span>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Frequência</h3>
                      <Select defaultValue="realtime">
                        <SelectTrigger className="bg-white/50">
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Tempo real</SelectItem>
                          <SelectItem value="hourly">Resumo por hora</SelectItem>
                          <SelectItem value="daily">Resumo diário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50/50 rounded-b-xl border-t border-gray-200 flex justify-end space-x-3">
                  <Button variant="outline">
                    <Undo size={16} className="mr-1" />
                    Cancelar
                  </Button>
                  <Button>
                    <Save size={16} className="mr-1" />
                    Salvar Alterações
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="mt-0">
              <Card className="glass-card border border-white/30">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Segurança</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Alterar Senha</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm mb-1">Senha Atual</label>
                          <Input type="password" className="bg-white/50" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Nova Senha</label>
                          <Input type="password" className="bg-white/50" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Confirmar Nova Senha</label>
                          <Input type="password" className="bg-white/50" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Autenticação de Dois Fatores</h3>
                      <div className="p-3 bg-white/50 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">Ativar 2FA</p>
                          <p className="text-sm text-gray-500">Aumenta a segurança da sua conta</p>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Sessões Ativas</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-white/50 rounded-lg flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">Chrome - Windows</p>
                              <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200 text-xs">
                                Atual
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">Último acesso: Agora</p>
                            <p className="text-xs text-gray-400">IP: 192.168.1.5</p>
                          </div>
                          <Button variant="outline" size="sm">Encerrar</Button>
                        </div>
                        <div className="p-3 bg-white/50 rounded-lg flex items-start justify-between">
                          <div>
                            <p className="font-medium">Safari - macOS</p>
                            <p className="text-sm text-gray-500">Último acesso: 2 dias atrás</p>
                            <p className="text-xs text-gray-400">IP: 192.168.10.15</p>
                          </div>
                          <Button variant="outline" size="sm">Encerrar</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50/50 rounded-b-xl border-t border-gray-200 flex justify-end space-x-3">
                  <Button variant="outline">
                    <Undo size={16} className="mr-1" />
                    Cancelar
                  </Button>
                  <Button>
                    <Save size={16} className="mr-1" />
                    Salvar Alterações
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system" className="mt-0">
              <Card className="glass-card border border-white/30">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Configurações do Sistema</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Informações do Sistema</h3>
                      <div className="bg-white/50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                          <div>
                            <span className="text-sm text-gray-500">Versão</span>
                            <p className="font-medium">CityNexus v2.5.1</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Última Atualização</span>
                            <p className="font-medium">10/08/2023</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Status do Sistema</span>
                            <div className="flex items-center">
                              <StatusIndicator variant="online" className="mt-1">
                                Operacional
                              </StatusIndicator>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Tempo de Atividade</span>
                            <p className="font-medium">45 dias, 12 horas</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Manutenção</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-white/50 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium">Backup Automático</p>
                            <p className="text-sm text-gray-500">Realizar backup dos dados diariamente</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="p-3 bg-white/50 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium">Limpeza de Logs</p>
                            <p className="text-sm text-gray-500">Limpar logs com mais de 30 dias</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Atualizações</h3>
                      <div className="p-3 bg-white/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium">Atualizações Automáticas</p>
                            <p className="text-sm text-gray-500">Atualizações de segurança e correções</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">Verificar Atualizações</Button>
                          <Button variant="outline" size="sm">Ver Histórico</Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Banco de Dados</h3>
                      <div className="p-3 bg-white/50 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">Manutenção do Banco de Dados</p>
                          <p className="text-sm text-gray-500">Otimizar e limpar o banco de dados</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">Otimizar</Button>
                          <Button variant="outline" size="sm">Fazer Backup</Button>
                          <Button variant="outline" size="sm" className="text-city-red-500 hover:text-city-red-700">
                            Limpar Dados
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50/50 rounded-b-xl border-t border-gray-200 flex justify-end space-x-3">
                  <Button variant="outline">
                    <Undo size={16} className="mr-1" />
                    Cancelar
                  </Button>
                  <Button>
                    <Save size={16} className="mr-1" />
                    Salvar Alterações
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Integration Settings */}
            <TabsContent value="integration" className="mt-0">
              <Card className="glass-card border border-white/30">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Integrações</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">APIs de Terceiros</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-white/50 rounded-lg flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                              <Database size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Sistema de Previsão do Tempo</p>
                              <p className="text-sm text-gray-500">Receber dados meteorológicos em tempo real</p>
                              <div className="mt-1">
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                  Conectado
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Configurar</Button>
                            <Button size="sm" variant="outline" className="text-city-red-500 hover:text-city-red-700">
                              Desconectar
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 bg-white/50 rounded-lg flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center">
                              <Globe size={20} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Sistema de Transporte Público</p>
                              <p className="text-sm text-gray-500">Integração com dados de transporte público</p>
                              <div className="mt-1">
                                <Badge variant="outline" className="bg-city-red-50 text-city-red-600 border-city-red-200">
                                  Desconectado
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button size="sm">Conectar</Button>
                        </div>
                        <div className="p-3 bg-white/50 rounded-lg flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center">
                              <Bell size={20} className="text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">Sistema de Alertas Públicos</p>
                              <p className="text-sm text-gray-500">Enviar alertas para sistemas públicos</p>
                              <div className="mt-1">
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                  Conectado
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Configurar</Button>
                            <Button size="sm" variant="outline" className="text-city-red-500 hover:text-city-red-700">
                              Desconectar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">APIs CityNexus</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium">API Access Token</p>
                              <p className="text-sm text-gray-500">Token para integração com outros sistemas</p>
                            </div>
                            <Button size="sm" variant="outline">Gerar Novo</Button>
                          </div>
                          <div className="flex items-center">
                            <Input 
                              className="bg-white font-mono text-sm" 
                              value="c8a612f0e8d54b37a9b8c87d5f4a6e2b" 
                              readOnly
                            />
                            <Button size="sm" variant="ghost" className="ml-2">
                              Copiar
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 bg-white/50 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium">Documentação da API</p>
                            <p className="text-sm text-gray-500">Acesse a documentação completa da API</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Ver Documentação
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Webhooks</h3>
                      <div className="p-3 bg-white/50 rounded-lg flex items-start justify-between">
                        <div>
                          <p className="font-medium">Webhooks</p>
                          <p className="text-sm text-gray-500">Configurar webhooks para eventos do sistema</p>
                        </div>
                        <Button size="sm">Configurar</Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50/50 rounded-b-xl border-t border-gray-200 flex justify-end space-x-3">
                  <Button variant="outline">
                    <Undo size={16} className="mr-1" />
                    Cancelar
                  </Button>
                  <Button>
                    <Save size={16} className="mr-1" />
                    Salvar Alterações
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
