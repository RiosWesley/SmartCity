import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import useFirebaseData from '../hooks/useFirebaseData'; // Importar o hook useFirebaseData
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSendCommand } from '../hooks/useSendCommand'; // Importar o hook useSendCommand
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Importar componentes de Select
import { Checkbox } from "@/components/ui/checkbox"; // Importar Checkbox
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Importar Card
import { Badge } from "@/components/ui/badge"; // Importar Badge
import { WifiHigh, Monitor, Loader2, Info } from "lucide-react"; // Importar ícones
import Map from '@/components/Map'; // Importar componente Map

interface Pole {
  id: string;
  location: string; // Manter como string para exibição na tabela
  status: 'Online' | 'Offline' | 'Maintenance';
  type: "lighting" | "traffic" | "environmental"; // Adicionar propriedade type
  // TODO: Adicionar histórico de status, consumo de energia e agendamentos do Firebase
  statusHistory?: { timestamp: string; status: string }[];
  energyConsumption?: { date: string; value: number }[]; // kWh
  schedules?: { day: string; time: string; lightLevel: number }[];
  rssi?: number; // Adicionar RSSI para exibir sinal
  macAddress?: string; // Adicionar MAC Address
  lat: number; // Latitude agora é obrigatória
  lng: number; // Longitude agora é obrigatória
}

// Cores e labels para status, similar a Devices.tsx
const statusColor = {
  Online: "bg-city-green-500 text-white",
  Maintenance: "bg-city-amber-500 text-white",
  Offline: "bg-city-red-500 text-white",
};

const statusLabel = {
  Online: "Online",
  Maintenance: "Manutenção",
  Offline: "Offline",
};

const PoleStatusBadge = ({ status }: { status: 'Online' | 'Offline' | 'Maintenance' }) => (
  <span className={`py-0.5 px-2 rounded-md text-xs font-semibold ${statusColor[status]}`}>
    {statusLabel[status]}
  </span>
);


const Poles: React.FC = () => {
  // Alterar o caminho do hook useFirebaseData para /lightning_devices
  const { data: firebasePolesData, loading: firebaseLoading, error: firebaseError } = useFirebaseData('/lightning_devices');

  const [poles, setPoles] = useState<Pole[]>([]);
  const [selectedPole, setSelectedPole] = useState<Pole | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedPoles, setSelectedPoles] = useState<string[]>([]); // Estado para seleção múltipla

  const [isAddPoleModalOpen, setIsAddPoleModalOpen] = useState(false); // Estado para visibilidade do modal
  const [newPoleData, setNewPoleData] = useState({
    id: "",
    locationDescription: "",
    macAddress: "",
    lat: 0, // Adicionar Latitude ao estado
    lng: 0, // Adicionar Longitude ao estado
  });

  const [tempPoleMarker, setTempPoleMarker] = useState<any[]>([]); // Estado para a marcação temporária no mapa


  const { sendCommand, loading: commandLoading, error: commandError, success } = useSendCommand(); // Usar o hook

  useEffect(() => {
    if (firebasePolesData) {
      // Transformar os dados do Firebase em um array de Pole
      const transformedPoles: Pole[] = Object.keys(firebasePolesData).map(key => {
        const poleData = firebasePolesData[key];
        // Map Firebase status string to Pole status type
        let poleStatus: 'Online' | 'Offline' | 'Maintenance' = 'Offline'; // Default to Offline
        if (poleData.status === 'ONLINE') {
          poleStatus = 'Online';
        } else if (poleData.status === 'OFFLINE') {
          poleStatus = 'Offline';
        } else if (poleData.error_code) { // Assuming error_code indicates maintenance
           poleStatus = 'Maintenance';
        }
        // Add other potential status mappings if needed based on Firebase data

        return {
          id: key,
          location: poleData.location?.description || 'Localização desconhecida',
          status: poleStatus, // Use the mapped status
          type: "lighting", // Definir o tipo como lighting
          rssi: poleData.rssi || 0, // Adicionar RSSI
          macAddress: poleData.macAddress || 'N/A', // Adicionar MAC Address
          lat: poleData.location?.lat || 0, // Adicionar Latitude
          lng: poleData.location?.lng || 0, // Adicionar Longitude
          // TODO: Popular statusHistory, energyConsumption, schedules com dados reais do Firebase se disponíveis em outros nós
          statusHistory: [], // Dados mockados temporariamente
          energyConsumption: [], // Dados mockados temporariamente
          schedules: [], // Dados mockados temporariamente
        };
      });
      setPoles(transformedPoles);
    }
  }, [firebasePolesData]);

  useEffect(() => {
    if (selectedPole) {
      // Atualizar currentLightLevel ao selecionar um poste (mantido para compatibilidade, embora não usado para controle)
      // setCurrentLightLevel(selectedPole.lightLevel);
    }
  }, [selectedPole]);

  // Atualizar a marcação temporária no mapa ao mudar lat/lng no modal
  useEffect(() => {
    if (isAddPoleModalOpen && newPoleData.lat !== undefined && newPoleData.lng !== undefined) {
      setTempPoleMarker([{
        id: 'temp-pole', // ID temporário
        lat: newPoleData.lat,
        lng: newPoleData.lng,
        type: 'lighting', // Tipo lighting para o ícone correto
        status: 'Online', // Status online para cor verde no mapa (pode ser ajustado)
        location: { description: newPoleData.locationDescription || 'Nova Localização' }
      }]);
    } else {
      setTempPoleMarker([]); // Remover marcação se modal fechado ou coordenadas inválidas
    }
  }, [isAddPoleModalOpen, newPoleData.lat, newPoleData.lng, newPoleData.locationDescription]);


  const handleRowClick = (pole: Pole) => {
    setSelectedPole(pole);
  };

  const handleTurnOn = async () => {
    if (selectedPole) {
      const path = `/lighting_commands/${selectedPole.id}`;
      const commandData = { target_status: 'ON', command_timestamp: Date.now(), requested_by: 'web_user' /* TODO: Obter ID do usuário autenticado */ };
      await sendCommand(path, commandData);
       // Atualizar estado local otimisticamente ou com base no resultado do comando
       if (!commandError) {
        setSelectedPole({ ...selectedPole, status: 'Online' });
        setPoles(poles.map(p => p.id === selectedPole.id ? { ...p, status: 'Online' } : p));
       }
    }
  };

  const handleTurnOff = async () => {
    if (selectedPole) {
      const path = `/lighting_commands/${selectedPole.id}`;
      const commandData = { target_status: 'OFF', command_timestamp: Date.now(), requested_by: 'web_user' /* TODO: Obter ID do usuário autenticado */ };
      await sendCommand(path, commandData);
       // Atualizar estado local otimisticamente ou com base no resultado do comando
       if (!commandError) {
        setSelectedPole({ ...selectedPole, status: 'Offline' });
        setPoles(poles.map(p => p.id === selectedPole.id ? { ...p, status: 'Offline' } : p));
       }
    }
  };

  const handleSelectPole = (poleId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPoles([...selectedPoles, poleId]);
    } else {
      setSelectedPoles(selectedPoles.filter(id => id !== poleId));
    }
  };

  const handleSelectAllPoles = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedPoles(filteredPoles.map(pole => pole.id));
    } else {
      setSelectedPoles([]);
    }
  };

  const handleTurnOnSelected = async () => {
    for (const poleId of selectedPoles) {
      const path = `/lighting_commands/${poleId}`;
      const commandData = { target_status: 'ON', command_timestamp: Date.now(), requested_by: 'web_user' /* TODO: Obter ID do usuário autenticado */ };
      await sendCommand(path, commandData);
      // TODO: Handle potential errors for individual commands
    }
    // TODO: Update local state based on command results
    console.log(`Turning on selected poles: ${selectedPoles.join(', ')}`);
  };

  const handleTurnOffSelected = async () => {
    for (const poleId of selectedPoles) {
      const path = `/lighting_commands/${poleId}`;
      const commandData = { target_status: 'OFF', command_timestamp: Date.now(), requested_by: 'web_user' /* TODO: Obter ID do usuário autenticado */ };
      await sendCommand(path, commandData);
      // TODO: Handle potential errors for individual commands
    }
     // TODO: Update local state based on command results
    console.log(`Turning off selected poles: ${selectedPoles.join(', ')}`);
  };

  const handleAddPole = async () => {
    if (!newPoleData.id || !newPoleData.locationDescription || !newPoleData.macAddress || newPoleData.lat === undefined || newPoleData.lng === undefined) {
      console.error("Por favor, preencha todos os campos.");
      // TODO: Add a more user-friendly error message (e.g., toast)
      return;
    }

    // Alterar o caminho para o novo nó /lightning_devices
    const polePath = `/lightning_devices/${newPoleData.id}`;
    const polePayload = {
      id: newPoleData.id, // Incluir ID no payload
      deviceType: "lighting", // Definir o tipo como lighting
      status: "OFFLINE", // Novos postes começam como offline
      last_update_timestamp: Date.now(), // Usar last_update_timestamp conforme DOCUMENTATION.md
      location: {
        lat: newPoleData.lat, // Usar Latitude do estado
        lng: newPoleData.lng, // Usar Longitude do estado
        description: newPoleData.locationDescription,
      },
      reported_luminosity: 0, // Adicionar campo de luminosidade inicial
      error_code: null, // Adicionar campo de erro inicial
      macAddress: newPoleData.macAddress, // Incluir MAC Address no payload
      // Adicionar outros campos iniciais conforme a estrutura desejada para /lightning_devices
      rssi: 0, // Adicionar RSSI inicial
      uptimeS: 0, // Adicionar uptime inicial
      freeHeapB: 0, // Adicionar freeHeapB inicial
      batteryP: null, // Adicionar batteryP inicial
      fwVersion: "N/A", // Adicionar fwVersion inicial
      sysErr: null, // Adicionar sysErr inicial
    };

    await sendCommand(polePath, polePayload);

    if (commandError) {
      console.error("Erro ao adicionar poste:", commandError);
      // TODO: Show error to user
    } else if (success) {
      console.log("Poste adicionado com sucesso!");
      // Fechar modal em caso de sucesso
      setIsAddPoleModalOpen(false);
      // Resetar formulário
      setNewPoleData({ id: "", locationDescription: "", macAddress: "", lat: 0, lng: 0 });
    }
  };


  const filteredPoles = useMemo(() => {
    let filtered = poles;

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(pole => pole.status === filterStatus);
    }

    // Filter by search term (ID or Location)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(pole =>
        pole.id.toLowerCase().includes(lowerCaseSearchTerm) ||
        pole.location.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return filtered;
  }, [poles, searchTerm, filterStatus]);


  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8"> {/* Added padding */}
        <h1 className="text-2xl font-semibold mb-6">Gerenciamento de Postes</h1> {/* Increased bottom margin */}

        <Card className="mb-6 glass-card border border-white/20"> {/* Added glass-card and border */}
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Responsive grid */}
              <div>
                <Label htmlFor="search">Buscar por ID ou Localização:</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Buscar postes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="status-filter">Filtrar por Status:</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status-filter" className="w-full md:w-[180px] mt-1"> {/* Full width on small screens, fixed on md+ */}
                    <SelectValue placeholder="Filtrar por Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Todos</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedPoles.length > 0 && (
          <Card className="mb-6 glass-card border border-white/20"> {/* Added glass-card and border */}
             <CardHeader>
               <CardTitle>Ações em Massa ({selectedPoles.length} selecionado(s))</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4"> {/* Responsive layout */}
                  <div className="flex space-x-4">
                    <Button onClick={handleTurnOnSelected} disabled={commandLoading}>Ligar Selecionados</Button>
                    <Button onClick={handleTurnOffSelected} disabled={commandLoading}>Desligar Selecionados</Button>
                  </div>
               </div>
               {commandLoading && <p className="text-blue-500 mt-2">Enviando comandos em massa...</p>}
               {commandError && <p className="text-red-500 mt-2">Erro ao enviar comandos em massa: {commandError.message}</p>}
               {success && <p className="text-green-500 mt-2">Comandos em massa enviados com sucesso!</p>}
             </CardContent>
          </Card>
        )}

        {/* Botão para adicionar novo poste */}
        <div className="flex justify-end mb-6">
          <Button onClick={() => setIsAddPoleModalOpen(true)} size="sm">Adicionar Poste</Button>
        </div>


        <Card className="glass-card border border-white/20"> {/* Added glass-card and border */}
          <CardHeader>
            <CardTitle>Lista de Postes</CardTitle>
          </CardHeader>
          <CardContent>
            {firebaseLoading && (
               <div className="p-8 flex flex-col items-center justify-center text-center">
                 <Loader2 size={42} className="mb-2 animate-spin" />
                 <h3 className="text-lg font-medium">Carregando postes...</h3>
               </div>
            )}

            {firebaseError && (
               <div className="p-8 flex flex-col items-center justify-center text-center border-red-500 text-red-500">
                 <Info size={42} className="mb-2" />
                 <h3 className="text-lg font-medium">Erro ao carregar postes</h3>
                 <div className="text-sm">{firebaseError.message}</div>
               </div>
            )}

            {!firebaseLoading && !firebaseError && filteredPoles.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"> {/* Fixed width for checkbox column */}
                        <Checkbox
                          checked={selectedPoles.length === filteredPoles.length && filteredPoles.length > 0}
                          onCheckedChange={handleSelectAllPoles}
                        />
                      </TableHead>
                      <TableHead className="w-[100px]">ID</TableHead> {/* Fixed width for ID */}
                      <TableHead>Localização</TableHead> {/* Takes remaining space */}
                      <TableHead className="w-[120px]">Status</TableHead> {/* Fixed width */}
                      <TableHead className="w-[100px]">Sinal (RSSI)</TableHead> {/* Added Signal column */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPoles.map((pole) => (
                      <TableRow
                        key={pole.id}
                        onClick={() => handleRowClick(pole)}
                        className={selectedPole?.id === pole.id ? 'bg-gray-100 dark:bg-gray-700 cursor-pointer' : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}
                      >
                         <TableCell>
                          <Checkbox
                            checked={selectedPoles.includes(pole.id)}
                            onCheckedChange={(isChecked) => handleSelectPole(pole.id, isChecked as boolean)}
                            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
                          />
                        </TableCell>
                        <TableCell className="font-medium">{pole.id}</TableCell>
                        <TableCell>{pole.location}</TableCell>
                        <TableCell><PoleStatusBadge status={pole.status} /></TableCell> {/* Use Badge for status */}
                        <TableCell className="flex items-center gap-1"><WifiHigh size={14} /> {pole.rssi} dBm</TableCell> {/* Display RSSI */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : !firebaseLoading && !firebaseError && (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <Monitor size={42} className="mb-2" />
                <h3 className="text-lg font-medium">Nenhum poste encontrado</h3>
                <div className="text-gray-500 text-sm">Tente ajustar a busca ou filtros.</div>
              </div>
            )}
          </CardContent>
        </Card>


        {selectedPole && (
          <Card className="mt-6 glass-card border border-white/20"> {/* Added glass-card and border */}
            <CardHeader>
              <CardTitle>Detalhes do Poste: {selectedPole.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Responsive grid for details */}
                <div>
                  <p><strong>Localização:</strong> {selectedPole.location}</p>
                  <p><strong>Status:</strong> <PoleStatusBadge status={selectedPole.status} /></p> {/* Use Badge for status */}
                  <p className="flex items-center gap-1"><strong>Sinal (RSSI):</strong> <WifiHigh size={14} /> {selectedPole.rssi} dBm</p> {/* Display RSSI */}
                  <p><strong>MAC Address:</strong> {selectedPole.macAddress || 'N/A'}</p> {/* Display MAC Address */}
                  <p><strong>Latitude:</strong> {selectedPole.lat}</p> {/* Display Latitude */}
                  <p><strong>Longitude:</strong> {selectedPole.lng}</p> {/* Display Longitude */}
                </div>
                <div className="mt-4 md:mt-0"> {/* Adjust margin on medium screens */}
                  <h3 className="text-lg font-semibold mb-2">Controle Individual:</h3>
                  <div className="flex space-x-4">
                    <Button onClick={handleTurnOn} disabled={selectedPole.status === 'Online' || commandLoading}>Ligar</Button>
                    <Button onClick={handleTurnOff} disabled={selectedPole.status === 'Offline' || commandLoading}>Desligar</Button>
                  </div>
                  {commandLoading && <p className="text-blue-500 mt-2">Enviando comando...</p>}
                  {commandError && <p className="text-red-500 mt-2">Erro ao enviar comando: {commandError.message}</p>}
                  {success && <p className="text-green-500 mt-2">Comando enviado com sucesso!</p>}
                </div>
              </div>

              {/* Mapa na tela de detalhes */}
              {selectedPole.lat !== undefined && selectedPole.lng !== undefined && (
                 <div className="mt-6">
                   <h3 className="text-lg font-semibold mb-2">Localização no Mapa:</h3>
                   <Map
                     centerLat={selectedPole.lat}
                     centerLng={selectedPole.lng}
                     zoom={16} // Zoom maior para ver a localização exata
                     height="200px"
                     showDevices={true}
                     devices={selectedPole ? [{ // Transformar selectedPole para o formato esperado pelo Map
                        id: selectedPole.id,
                        lat: selectedPole.lat,
                        lng: selectedPole.lng,
                        type: selectedPole.type, // Usar o tipo do poste
                        status: selectedPole.status, // Usar o status do poste
                        location: { description: selectedPole.location } // Transformar location string para objeto
                     }] : []}
                   />
                 </div>
              )}


              {/* TODO: Implementar exibição de histórico, consumo e agendamentos com dados reais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"> {/* Responsive grid for history/consumption/schedules */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Histórico de Status:</h3>
                  <p>Dados de histórico de status virão do Firebase.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Consumo de Energia (kWh):</h3>
                   <p>Dados de consumo de energia virão do Firebase.</p>
                </div>
                <div className="md:col-span-2"> {/* Span across two columns on medium screens */}
                  <h3 className="text-lg font-semibold mt-4 mb-2">Agendamentos:</h3>
                  <p>Dados de agendamentos virão do Firebase.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal para adicionar novo poste */}
      {isAddPoleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Poste</h2>
            <div className="space-y-4">
              <Input
                placeholder="ID do Poste (Ex: light_pole_003)"
                value={newPoleData.id}
                onChange={(e) => setNewPoleData({ ...newPoleData, id: e.target.value })}
              />
              <Input
                placeholder="Descrição da Localização (Ex: Praça Central Esq. Rua A)"
                value={newPoleData.locationDescription}
                onChange={(e) => setNewPoleData({ ...newPoleData, locationDescription: e.target.value })}
              />
               <Input
                placeholder="MAC Address (Ex: A1:B2:C3:D4:E5:F6)"
                value={newPoleData.macAddress}
                onChange={(e) => setNewPoleData({ ...newPoleData, macAddress: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Latitude (Ex: -23.5505)" // Placeholder mais descritivo
                value={newPoleData.lat}
                onChange={(e) => setNewPoleData({ ...newPoleData, lat: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Longitude (Ex: -46.6333)" // Placeholder mais descritivo
                value={newPoleData.lng}
                onChange={(e) => setNewPoleData({ ...newPoleData, lng: parseFloat(e.target.value) })}
              />
              {/* Outros campos conforme necessário */}
            </div>
             {/* Mapa para visualização da coordenada */}
             <div className="mt-4">
               <Map
                 centerLat={newPoleData.lat}
                 centerLng={newPoleData.lng}
                 zoom={16} // Zoom maior para ver a localização exata
                 height="200px"
                 showDevices={true}
                 devices={tempPoleMarker} // Passar a marcação temporária
               />
             </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setIsAddPoleModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddPole} disabled={commandLoading}>
                {commandLoading ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                Salvar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Poles;