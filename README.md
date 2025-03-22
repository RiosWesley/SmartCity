# Documentação Completa: Projeto CityNexus (Smart City com ESP32)

## Sumário
1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Componentes de Hardware](#3-componentes-de-hardware)
4. [Ambiente de Desenvolvimento](#4-ambiente-de-desenvolvimento)
5. [Backend: Firebase](#5-backend-firebase)
6. [Frontend: React/TypeScript](#6-frontend-reacttypescript)
7. [Firmware para ESP32](#7-firmware-para-esp32)
8. [Integração dos Componentes](#8-integração-dos-componentes)
9. [Funcionalidades Implementadas](#9-funcionalidades-implementadas)
10. [Benchmark e Análise de Desempenho](#10-benchmark-e-análise-de-desempenho)
11. [Cronograma de Desenvolvimento](#11-cronograma-de-desenvolvimento)
12. [Segurança e Boas Práticas](#12-segurança-e-boas-práticas)
---

## 1. Visão Geral do Projeto

### 1.1 Introdução

O projeto Smart City é parte do Projeto de Extensão Interdisciplinar (PEI) da disciplina de Arquitetura de Computadores. O objetivo é implementar um sistema integrado de monitoramento urbano que utiliza microcontroladores ESP32, sensores diversos, comunicação com banco de dados em nuvem e uma interface web/mobile para visualização e controle.

### 1.2 Objetivos

- Implementar um sistema embarcado utilizando ESP32
- Monitorar parâmetros urbanos como iluminação pública, tráfego e poluição
- Integrar o ESP32 com Firebase Real-time Database
- Desenvolver uma interface web/mobile com React e TypeScript
- Realizar benchmark do ESP32 para analisar desempenho
- Produzir documentação e artigo técnico sobre o desenvolvimento

### 1.3 Escopo do Projeto

O projeto abrange:
- Monitoramento da iluminação pública com controle automático
- Monitoramento de tráfego com semáforos inteligentes
- Monitoramento ambiental (qualidade do ar, ruído)
- Dashboard centralizado com visualização em tempo real
- Sistema de notificações para eventos críticos
- Análises e relatórios com histórico de dados

---

## 2. Arquitetura do Sistema

### 2.1 Visão Geral da Arquitetura

```
┌─────────────────┐      ┌────────────────┐      ┌─────────────────┐
│  Dispositivos   │      │   Firebase     │      │  Aplicação      │
│  de Campo       │<────>│   Cloud        │<────>│  Web/Mobile     │
│  (ESP32)        │      │   Services     │      │  (React/TS)     │
└─────────────────┘      └────────────────┘      └─────────────────┘
       │                       │                         │
       │                       │                         │
       v                       v                         v
┌─────────────────┐      ┌────────────────┐      ┌─────────────────┐
│  Sensores e     │      │  Banco de Dados│      │  Interface do   │
│  Atuadores      │      │  Realtime      │      │  Usuário        │
└─────────────────┘      └────────────────┘      └─────────────────┘
```

### 2.2 Componentes Principais

1. **Dispositivos de Campo**: Módulos ESP32 equipados com sensores diversos para coleta de dados e atuadores para controle de dispositivos.

2. **Firebase Cloud Services**:
   - Realtime Database: Armazenamento e sincronização de dados em tempo real
   - Authentication: Gestão de usuários e autenticação
   - Cloud Functions: Processamento de lógica de negócio
   - Cloud Messaging: Sistema de notificações push
   - Storage: Armazenamento de logs e relatórios

3. **Aplicação Web/Mobile**:
   - Frontend em React/TypeScript
   - Visualização dos dados em tempo real
   - Interface de controle e configuração
   - Geração de relatórios e análises

### 2.3 Fluxo de Dados

1. **Coleta de Dados**:
   - Os sensores conectados ao ESP32 coletam dados do ambiente
   - Os dados são processados localmente (filtragem, média, etc.)
   - Os dados são enviados para o Firebase via WiFi/MQTT

2. **Armazenamento e Processamento**:
   - O Firebase Realtime Database armazena os dados
   - Cloud Functions processam dados para análise e alertas
   - Os dados históricos são mantidos para relatórios

3. **Visualização e Controle**:
   - A aplicação web/mobile obtém dados do Firebase em tempo real
   - O usuário visualiza o status dos sistemas
   - O usuário pode enviar comandos aos atuadores
   - Alertas são enviados quando limiares são ultrapassados

---

## 3. Componentes de Hardware

### 3.1 Microcontroladores

**ESP32**:
- Processador dual-core Xtensa LX6 (até 240MHz)
- WiFi e Bluetooth integrados
- 520KB SRAM
- Interface para GPIO, ADC, DAC, I2C, SPI, etc.
- Modos de baixo consumo para economia de energia

**Quantidade necessária**: Mínimo 3 unidades (iluminação, tráfego, ambiental)

### 3.2 Sensores

| Sensor | Finalidade | Quantidade | Interface | Especificação |
|--------|------------|------------|-----------|---------------|
| LDR/Fotocélula | Detecção de luminosidade | 3-5 | Analógica | GL5539 |
| MQ-135 | Qualidade do ar (CO2, CO, NH3) | 1-2 | Analógica | MQ-135 |
| KY-038 | Detecção de ruído | 1-2 | Analógica | Sensibilidade ajustável |
| HC-SR04 | Ultrassônico para detecção de veículos | 3-4 | Digital | Alcance: 2-400cm |
| DHT22 | Temperatura e umidade | 1-2 | Digital | Precisão: ±0.5°C, ±2% UR |
| Sensor de chuva | Detecção de precipitação | 1 | Analógica | YL-83 |

### 3.3 Atuadores

| Atuador | Finalidade | Quantidade | Especificação |
|---------|------------|------------|---------------|
| Módulo Relé | Controle de iluminação | 3-4 | 5V, 1 ou 2 canais |
| LEDs RGB | Simulação de semáforos | 3-4 sets | 5mm, comum cátodo |
| Buzzer | Alarmes e alertas | 1-2 | 5V ativo |

### 3.4 Lista de Componentes Adicionais

- Resistores diversos (220Ω, 1kΩ, 10kΩ)
- Capacitores (100nF, 10µF)
- Placas de prototipagem (breadboard)
- Fios jumper M/M, M/F, F/F
- Fonte de alimentação 5V/2A
- Caixas para proteção dos circuitos
- Cartão microSD (para módulo SD)
- Cabos USB para programação

### 3.5 Diagrama de Conexão Básico

**Nó de Iluminação**:
```
ESP32 ──┬── LDR (GPIO 36) ─── GND
        ├── Relé (GPIO 22) ─── GND
        └── LED status (GPIO 2) ─── GND
```

**Nó de Tráfego**:
```
ESP32 ──┬── HC-SR04 Trig (GPIO 5) 
        ├── HC-SR04 Echo (GPIO 18)
        ├── LED Vermelho (GPIO 25)
        ├── LED Amarelo (GPIO 26)
        └── LED Verde (GPIO 27)
```

**Nó Ambiental**:
```
ESP32 ──┬── MQ-135 (GPIO 39) ─── GND
        ├── KY-038 (GPIO 34) ─── GND
        ├── DHT22 (GPIO 21) ─── GND
        └── Buzzer (GPIO 23) ─── GND
```

---

## 4. Ambiente de Desenvolvimento

### 4.1 Configuração do Ambiente para ESP32

1. **Arduino IDE**:
   - Download: [Arduino IDE](https://www.arduino.cc/en/software)
   - Adicionar suporte ao ESP32:
     - Abrir Arduino IDE
     - Ir para Arquivo > Preferências
     - Adicionar ao "URLs adicionais para gerenciadores de placas":
       `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
     - Ir para Ferramentas > Placa > Gerenciador de Placas
     - Pesquisar e instalar "ESP32"
   
   - Bibliotecas necessárias:
     - FirebaseESP32 (by Mobizt)
     - ArduinoJson (by Benoit Blanchon)
     - PubSubClient (para MQTT)
     - DHT sensor library (para DHT22)
     - WiFiManager (para configuração WiFi)

2. **Alternativa: PlatformIO**:
   - Instalar VSCode: [Visual Studio Code](https://code.visualstudio.com/)
   - Instalar extensão PlatformIO
   - Criar novo projeto:
     - Placa: ESP32 Dev Module
     - Framework: Arduino
   - Adicionar dependências no arquivo `platformio.ini`:
     ```ini
     [env:esp32dev]
     platform = espressif32
     board = esp32dev
     framework = arduino
     lib_deps = 
         mobizt/Firebase ESP32 Client
         bblanchon/ArduinoJson
         knolleary/PubSubClient
         adafruit/DHT sensor library
         tzapu/WiFiManager
     ```

### 4.2 Configuração do Ambiente para Frontend

1. **Node.js e npm**:
   - Download e instalação: [Node.js](https://nodejs.org/) (versão LTS recomendada)
   - Verificar instalação:
     ```bash
     node -v
     npm -v
     ```

2. **Criar Projeto React com TypeScript**:
   ```bash
   npx create-react-app smart-city-frontend --template typescript
   cd smart-city-frontend
   ```

3. **Instalar Dependências**:
   ```bash
   npm install firebase
   npm install react-router-dom @types/react-router-dom
   npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
   npm install chart.js react-chartjs-2
   npm install axios
   npm install @reduxjs/toolkit react-redux
   npm install localforage
   ```

### 4.3 Configuração do Firebase

1. **Criar Projeto no Firebase**:
   - Acessar [Firebase Console](https://console.firebase.google.com/)
   - Clicar em "Adicionar projeto"
   - Seguir o assistente de criação
   - Ativar serviços necessários:
     - Authentication
     - Realtime Database
     - Storage
     - Cloud Functions (se necessário)

2. **Configuração do Realtime Database**:
   - No console, acessar "Realtime Database"
   - Clicar em "Criar banco de dados"
   - Selecionar modo de segurança (iniciar em modo de teste)
   - Definir regras de segurança iniciais:
     ```json
     {
       "rules": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
     ```

3. **Configuração da Autenticação**:
   - No console, acessar "Authentication"
   - Ativar métodos de login (Email/Senha, Google, etc.)
   - Configurar domínios autorizados

4. **Obter Credenciais do Firebase**:
   - No console, acessar "Configurações do projeto" > "Configurações gerais"
   - Rolar até "Seus aplicativos" e clicar em "Web" (ícone `</>`)
   - Seguir o assistente de registro
   - Copiar as credenciais geradas:
     ```javascript
     const firebaseConfig = {
       apiKey: "...",
       authDomain: "...",
       databaseURL: "...",
       projectId: "...",
       storageBucket: "...",
       messagingSenderId: "...",
       appId: "..."
     };
     ```

---

## 5. Backend: Firebase

### 5.1 Estrutura do Banco de Dados

```
smart-city/
│
├── devices/
│   ├── [deviceId]/
│   │   ├── type: "lighting"|"traffic"|"environmental"
│   │   ├── name: String
│   │   ├── location: {lat: Number, lng: Number}
│   │   ├── status: "online"|"offline"|"maintenance"
│   │   ├── lastUpdate: Timestamp
│   │   └── config: Object
│
├── sensors/
│   ├── lighting/
│   │   ├── [sensorId]/
│   │   │   ├── deviceId: String
│   │   │   ├── value: Number
│   │   │   ├── timestamp: Timestamp
│   │   │   └── status: "on"|"off"|"error"
│   │
│   ├── traffic/
│   │   ├── [sensorId]/
│   │   │   ├── deviceId: String
│   │   │   ├── vehicleCount: Number
│   │   │   ├── congestionLevel: Number
│   │   │   ├── timestamp: Timestamp
│   │   │   └── status: String
│   │
│   └── environmental/
│       ├── [sensorId]/
│       │   ├── deviceId: String
│       │   ├── airQuality: Number
│       │   ├── noiseLevel: Number
│       │   ├── temperature: Number
│       │   ├── humidity: Number
│       │   ├── timestamp: Timestamp
│       │   └── status: String
│
├── alerts/
│   ├── [alertId]/
│   │   ├── deviceId: String
│   │   ├── type: "warning"|"critical"|"info"
│   │   ├── message: String
│   │   ├── timestamp: Timestamp
│   │   ├── resolved: Boolean
│   │   └── resolvedTimestamp: Timestamp
│
├── commands/
│   ├── [commandId]/
│   │   ├── deviceId: String
│   │   ├── type: String
│   │   ├── parameters: Object
│   │   ├── status: "pending"|"executed"|"failed"
│   │   ├── timestamp: Timestamp
│   │   └── response: Object
│
└── users/
    ├── [userId]/
    │   ├── role: "admin"|"operator"|"viewer"
    │   ├── name: String
    │   ├── email: String
    │   ├── preferences: Object
    │   └── lastLogin: Timestamp
```

### 5.2 Regras de Segurança

```json
{
  "rules": {
    "devices": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "sensors": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "alerts": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "commands": {
      ".read": "auth != null",
      ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'operator')"
    },
    "users": {
      "$uid": {
        ".read": "auth != null && ($uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null && ($uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin')"
      }
    }
  }
}
```

### 5.3 Cloud Functions

Arquivo `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Função para processar alertas baseados em threshold
exports.processEnvironmentalAlerts = functions.database.ref('/sensors/environmental/{sensorId}')
    .onWrite(async (change, context) => {
        const data = change.after.val();
        if (!data) return null;
        
        // Verificar thresholds
        const alerts = [];
        
        if (data.airQuality > 150) {
            alerts.push({
                type: 'warning',
                message: `Air quality critical: ${data.airQuality}`,
                deviceId: data.deviceId
            });
        }
        
        if (data.noiseLevel > 80) {
            alerts.push({
                type: 'warning',
                message: `Noise level high: ${data.noiseLevel} dB`,
                deviceId: data.deviceId
            });
        }
        
        // Criar alertas no banco
        const alertsRef = admin.database().ref('/alerts');
        
        for (const alert of alerts) {
            await alertsRef.push({
                ...alert,
                timestamp: admin.database.ServerValue.TIMESTAMP,
                resolved: false
            });
        }
        
        return null;
    });

// Otimizar semáforos com base no tráfego
exports.optimizeTrafficLights = functions.https.onCall(async (data, context) => {
    // Verificar autenticação
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    
    const { intersectionId } = data;
    
    // Buscar dados do tráfego
    const trafficRef = admin.database().ref(`/sensors/traffic/${intersectionId}`);
    const snapshot = await trafficRef.once('value');
    const trafficData = snapshot.val();
    
    // Algoritmo simples de otimização
    let greenDuration = 30; // Duração padrão
    
    if (trafficData.congestionLevel > 70) {
        greenDuration = 60;
    } else if (trafficData.congestionLevel > 40) {
        greenDuration = 45;
    }
    
    // Enviar comando para o dispositivo
    const commandRef = admin.database().ref('/commands').push();
    await commandRef.set({
        deviceId: trafficData.deviceId,
        type: 'SET_TRAFFIC_TIMING',
        parameters: { greenDuration },
        status: 'pending',
        timestamp: admin.database.ServerValue.TIMESTAMP
    });
    
    return { success: true, greenDuration };
});
```

### 5.4 Inicialização do Firebase no Frontend

Arquivo `src/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const db = getDatabase(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

export default app;
```

---

## 6. Frontend: React/TypeScript

### 6.1 Estrutura de Diretórios

```
src/
├── assets/            # Imagens, ícones, etc.
├── components/        # Componentes reutilizáveis
│   ├── common/        # Botões, cards, etc.
│   ├── dashboard/     # Componentes específicos do dashboard
│   ├── lighting/      # Componentes para monitoramento de iluminação
│   ├── traffic/       # Componentes para monitoramento de tráfego
│   └── environmental/ # Componentes para monitoramento ambiental
├── contexts/          # Context API para gerenciamento de estado
├── hooks/             # Custom hooks
├── pages/             # Páginas da aplicação
├── services/          # Serviços de integração com APIs
├── store/             # Redux store (opcional)
├── types/             # Tipos e interfaces TypeScript
├── utils/             # Funções utilitárias
├── App.tsx            # Componente principal
├── index.tsx          # Ponto de entrada
└── firebase.ts        # Configuração do Firebase
```

### 6.2 Configuração das Rotas

Arquivo `src/App.tsx`:

```tsx
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SmartCityProvider } from './contexts/SmartCityContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LightingMonitor from './pages/LightingMonitor';
import TrafficMonitor from './pages/TrafficMonitor';
import EnvironmentalMonitor from './pages/EnvironmentalMonitor';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <SmartCityProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/lighting" element={
                <ProtectedRoute>
                  <LightingMonitor />
                </ProtectedRoute>
              } />
              
              <Route path="/traffic" element={
                <ProtectedRoute>
                  <TrafficMonitor />
                </ProtectedRoute>
              } />
              
              <Route path="/environmental" element={
                <ProtectedRoute>
                  <EnvironmentalMonitor />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </SmartCityProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
```

### 6.3 Contexto de Autenticação

Arquivo `src/contexts/AuthContext.tsx`:

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { ref, get } from 'firebase/database';

interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Buscar o papel do usuário no database
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserRole(snapshot.val().role);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await signOut(auth);
  }

  async function register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  const value = {
    currentUser,
    userRole,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

### 6.4 Componente Protegido

Arquivo `src/components/common/ProtectedRoute.tsx`:

```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### 6.5 Contexto Smart City

Arquivo `src/contexts/SmartCityContext.tsx`:

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, off, set, push } from 'firebase/database';
import { db } from '../firebase';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import localforage from 'localforage';

// Tipos
import { Device, Sensor, Alert, Command } from '../types';

interface SmartCityContextType {
  devices: Device[];
  lightingSensors: Sensor[];
  trafficSensors: Sensor[];
  environmentalSensors: Sensor[];
  alerts: Alert[];
  isOnline: boolean;
  toggleStreetlight: (deviceId: string, status: boolean) => Promise<void>;
  setTrafficLightMode: (deviceId: string, mode: string) => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
}

const SmartCityContext = createContext<SmartCityContextType | null>(null);

export function useSmartCity() {
  const context = useContext(SmartCityContext);
  if (!context) {
    throw new Error('useSmartCity must be used within a SmartCityProvider');
  }
  return context;
}

export function SmartCityProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [lightingSensors, setLightingSensors] = useState<Sensor[]>([]);
  const [trafficSensors, setTrafficSensors] = useState<Sensor[]>([]);
  const [environmentalSensors, setEnvironmentalSensors] = useState<Sensor[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const isOnline = useNetworkStatus();

  // Buscar dados iniciais
  useEffect(() => {
    // Devices
    const devicesRef = ref(db, 'devices');
    onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const devicesList = Object.entries(data).map(([id, device]) => ({
          id,
          ...device as object
        })) as Device[];
        
        setDevices(devicesList);
      }
    });

    // Sensores de iluminação
    const lightingRef = ref(db, 'sensors/lighting');
    onValue(lightingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sensorsList = Object.entries(data).map(([id, sensor]) => ({
          id,
          ...sensor as object
        })) as Sensor[];
        
        setLightingSensors(sensorsList);
      }
    });

    // Sensores de tráfego
    const trafficRef = ref(db, 'sensors/traffic');
    onValue(trafficRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sensorsList = Object.entries(data).map(([id, sensor]) => ({
          id,
          ...sensor as object
        })) as Sensor[];
        
        setTrafficSensors(sensorsList);
      }
    });

    // Sensores ambientais
    const environmentalRef = ref(db, 'sensors/environmental');
    onValue(environmentalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sensorsList = Object.entries(data).map(([id, sensor]) => ({
          id,
          ...sensor as object
        })) as Sensor[];
        
        setEnvironmentalSensors(sensorsList);
      }
    });

    // Alertas
    const alertsRef = ref(db, 'alerts');
    onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alertsList = Object.entries(data)
          .map(([id, alert]) => ({
            id,
            ...alert as object
          }))
          .filter(alert => !alert.resolved)
          .sort((a, b) => b.timestamp - a.timestamp) as Alert[];
        
        setAlerts(alertsList);
      }
    });

    // Cleanup
    return () => {
      off(devicesRef);
      off(lightingRef);
      off(trafficRef);
      off(environmentalRef);
      off(alertsRef);
    };
  }, []);

  // Processar operações pendentes
  useEffect(() => {
    const processPendingOperations = async () => {
      if (!isOnline) return;
      
      const pendingOps = await localforage.getItem<Command[]>('pendingOperations') || [];
      if (pendingOps.length === 0) return;
      
      for (const op of pendingOps) {
        if (op.type === 'TOGGLE_STREETLIGHT') {
          const { deviceId, parameters } = op;
          await set(ref(db, `devices/${deviceId}/status`), parameters.status ? 'on' : 'off');
        }
        // Outros tipos de operações...
      }
      
      await localforage.setItem('pendingOperations', []);
    };
    
    if (isOnline) {
      processPendingOperations();
    }
  }, [isOnline]);

  // Funções de controle
  async function toggleStreetlight(deviceId: string, status: boolean) {
    try {
      if (isOnline) {
        // Enviar comando
        const commandRef = push(ref(db, 'commands'));
        await set(commandRef, {
          deviceId,
          type: 'TOGGLE_STREETLIGHT',
          parameters: { status },
          status: 'pending',
          timestamp: Date.now()
        });
        
        // Atualizar status do dispositivo (para feedback imediato na UI)
        await set(ref(db, `devices/${deviceId}/status`), status ? 'on' : 'off');
      } else {
        // Armazenar para execução posterior
        const pendingOps = await localforage.getItem<Command[]>('pendingOperations') || [];
        pendingOps.push({
          id: Date.now().toString(),
          deviceId,
          type: 'TOGGLE_STREETLIGHT',
          parameters: { status },
          status: 'pending',
          timestamp: Date.now()
        });
        
        await localforage.setItem('pendingOperations', pendingOps);
      }
    } catch (error) {
      console.error('Error toggling streetlight:', error);
    }
  }

  async function setTrafficLightMode(deviceId: string, mode: string) {
    try {
      if (isOnline) {
        const commandRef = push(ref(db, 'commands'));
        await set(commandRef, {
          deviceId,
          type: 'SET_TRAFFIC_MODE',
          parameters: { mode },
          status: 'pending',
          timestamp: Date.now()
        });
      } else {
        const pendingOps = await localforage.getItem<Command[]>('pendingOperations') || [];
        pendingOps.push({
          id: Date.now().toString(),
          deviceId,
          type: 'SET_TRAFFIC_MODE',
          parameters: { mode },
          status: 'pending',
          timestamp: Date.now()
        });
        
        await localforage.setItem('pendingOperations', pendingOps);
      }
    } catch (error) {
      console.error('Error setting traffic light mode:', error);
    }
  }

  async function acknowledgeAlert(alertId: string) {
    try {
      await set(ref(db, `alerts/${alertId}/resolved`), true);
      await set(ref(db, `alerts/${alertId}/resolvedTimestamp`), Date.now());
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  }

  const value = {
    devices,
    lightingSensors,
    trafficSensors,
    environmentalSensors,
    alerts,
    isOnline,
    toggleStreetlight,
    setTrafficLightMode,
    acknowledgeAlert
  };

  return (
    <SmartCityContext.Provider value={value}>
      {children}
    </SmartCityContext.Provider>
  );
}
```

### 6.6 Hook para Status de Rede

Arquivo `src/hooks/useNetworkStatus.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}
```

### 6.7 Tipos

Arquivo `src/types/index.ts`:

```typescript
export interface Device {
  id: string;
  type: 'lighting' | 'traffic' | 'environmental';
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'online' | 'offline' | 'maintenance' | 'on' | 'off';
  lastUpdate: number;
  config: Record<string, any>;
}

export interface Sensor {
  id: string;
  deviceId: string;
  timestamp: number;
  status: string;
  [key: string]: any; // Propriedades específicas de cada tipo de sensor
}

export interface Alert {
  id: string;
  deviceId: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: number;
  resolved: boolean;
  resolvedTimestamp?: number;
}

export interface Command {
  id: string;
  deviceId: string;
  type: string;
  parameters: Record<string, any>;
  status: 'pending' | 'executed' | 'failed';
  timestamp: number;
  response?: Record<string, any>;
}

export interface User {
  id: string;
  role: 'admin' | 'operator' | 'viewer';
  name: string;
  email: string;
  preferences: Record<string, any>;
  lastLogin: number;
}
```

### 6.8 Página de Dashboard

Arquivo `src/pages/Dashboard.tsx`:

```tsx
import React from 'react';
import {
  Box,
  Grid,
  Heading,
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSmartCity } from '../contexts/SmartCityContext';
import Layout from '../components/common/Layout';
import AlertsWidget from '../components/dashboard/AlertsWidget';
import DeviceStatusChart from '../components/dashboard/DeviceStatusChart';
import SystemOverview from '../components/dashboard/SystemOverview';

const Dashboard: React.FC = () => {
  const { 
    devices,
    lightingSensors,
    trafficSensors,
    environmentalSensors,
    alerts,
  } = useSmartCity();

  // Calcular métricas
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const activeAlerts = alerts.length;
  
  const cardBg = useColorModeValue('white', 'gray.700');
  
  return (
    <Layout title="Dashboard">
      <Box p={4}>
        <Heading mb={6}>Smart City Dashboard</Heading>
        
        {/* KPI Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Total Devices</StatLabel>
                <StatNumber>{totalDevices}</StatNumber>
                <StatHelpText>
                  {onlineDevices} online ({Math.round((onlineDevices/totalDevices)*100)}%)
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Lighting Systems</StatLabel>
                <StatNumber>{lightingSensors.length}</StatNumber>
                <StatHelpText>
                  {lightingSensors.filter(s => s.status === 'on').length} active
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Traffic Monitoring</StatLabel>
                <StatNumber>{trafficSensors.length}</StatNumber>
                <StatHelpText>
                  Avg congestion: {
                    trafficSensors.length > 0 
                      ? Math.round(trafficSensors.reduce((acc, s) => acc + (s.congestionLevel || 0), 0) / trafficSensors.length)
                      : 0
                  }%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Alerts</StatLabel>
                <StatNumber>{activeAlerts}</StatNumber>
                <Flex>
                  <Badge colorScheme="red" mr={2}>
                    {alerts.filter(a => a.type === 'critical').length} Critical
                  </Badge>
                  <Badge colorScheme="yellow">
                    {alerts.filter(a => a.type === 'warning').length} Warning
                  </Badge>
                </Flex>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        {/* Main Content */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          <Box>
            <Card bg={cardBg} mb={6}>
              <CardHeader>
                <Heading size="md">System Overview</Heading>
              </CardHeader>
              <CardBody>
                <SystemOverview />
              </CardBody>
            </Card>
            
            <Card bg={cardBg}>
              <CardHeader>
                <Heading size="md">Device Status</Heading>
              </CardHeader>
              <CardBody>
                <DeviceStatusChart devices={devices} />
              </CardBody>
            </Card>
          </Box>
          
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Active Alerts</Heading>
            </CardHeader>
            <CardBody>
              <AlertsWidget alerts={alerts} />
            </CardBody>
          </Card>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;
```

---

## 7. Firmware para ESP32

### 7.1 Estrutura do Projeto

```
arduino/
├── smart_city_node/          # Projeto principal
│   ├── smart_city_node.ino   # Arquivo principal
│   ├── config.h              # Configurações e credenciais
│   ├── wifi_manager.h        # Gestão de conectividade WiFi
│   ├── firebase_client.h     # Comunicação com Firebase
│   ├── sensors.h             # Gerenciamento de sensores
│   └── system_monitor.h      # Monitoramento do sistema
│
├── lighting_node/            # Nó específico para iluminação
│   ├── lighting_node.ino     # Programa para nó de iluminação
│   └── ...
│
├── traffic_node/             # Nó específico para tráfego
│   ├── traffic_node.ino      # Programa para nó de tráfego
│   └── ...
│
└── environmental_node/       # Nó específico para monitoramento ambiental
    ├── environmental_node.ino # Programa para nó ambiental
    └── ...
```

### 7.2 Configuração Básica

Arquivo `arduino/smart_city_node/config.h`:

```cpp
#ifndef CONFIG_H
#define CONFIG_H

// WiFi Configuration
const char* WIFI_SSID = "YourWiFiSSID";
const char* WIFI_PASSWORD = "YourWiFiPassword";

// Firebase Configuration
#define FIREBASE_HOST "your-project.firebaseio.com"
#define FIREBASE_AUTH "YourFirebaseAuthToken"

// Device Configuration
#define DEVICE_ID "device001"
#define DEVICE_TYPE "lighting" // "lighting", "traffic", or "environmental"
#define DEVICE_NAME "Street Light Controller 1"

// GPS Location (fixed for stationary device)
#define DEVICE_LAT 37.7749
#define DEVICE_LNG -122.4194

// Sensor Pins
#define LDR_PIN 36      // Light sensor
#define RELAY_PIN 22    // Relay control
#define LED_STATUS_PIN 2 // Status LED

// Traffic Control Pins (for traffic node)
#define ULTRASONIC_TRIG_PIN 5
#define ULTRASONIC_ECHO_PIN 18
#define TRAFFIC_RED_PIN 25
#define TRAFFIC_YELLOW_PIN 26
#define TRAFFIC_GREEN_PIN 27

// Environmental Sensor Pins (for environmental node)
#define AIR_QUALITY_PIN 39 // MQ-135
#define NOISE_PIN 34       // KY-038
#define DHT_PIN 21         // DHT22
#define BUZZER_PIN 23      // Alert buzzer

// System Parameters
#define DEEP_SLEEP_TIME 30       // Deep sleep time in seconds (if enabled)
#define SENSOR_READ_INTERVAL 5000 // Milliseconds between sensor readings
#define UPLOAD_INTERVAL 30000    // Milliseconds between data uploads
#define COMMAND_CHECK_INTERVAL 5000 // Milliseconds between command checks

// Debug mode
#define DEBUG_MODE true

#endif // CONFIG_H
```

### 7.3 Firmware para Nó de Iluminação

Arquivo `arduino/lighting_node/lighting_node.ino`:

```cpp
/**
 * Smart City Project - Lighting Node
 * 
 * This firmware implements a smart lighting controller using ESP32.
 * It monitors ambient light levels and controls street lights accordingly,
 * while communicating with Firebase for remote monitoring and control.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ArduinoJson.h>
#include <time.h>
#include "config.h"

// Firebase objects
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// Global variables
unsigned long lastSensorReadTime = 0;
unsigned long lastUploadTime = 0;
unsigned long lastCommandCheckTime = 0;
bool lightStatus = false;
int lightLevel = 0;
String devicePath;
String sensorPath;
String commandPath;

// Function declarations
void setupWiFi();
void setupFirebase();
void readSensors();
void uploadData();
void checkCommands();
void executeCommand(const String& commandType, FirebaseJson& parameters);
void updateLightStatus(bool status);

void setup() {
  Serial.begin(115200);
  if (DEBUG_MODE) {
    Serial.println("\n=== Smart City - Lighting Node ===");
  }
  
  // Initialize pins
  pinMode(LDR_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_STATUS_PIN, OUTPUT);
  
  // Initial state
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LED_STATUS_PIN, LOW);
  
  // Setup connectivity
  setupWiFi();
  setupFirebase();
  
  // Define database paths
  devicePath = "devices/" + String(DEVICE_ID);
  sensorPath = "sensors/lighting/" + String(DEVICE_ID);
  commandPath = "commands";
  
  // Register device if needed
  registerDevice();
  
  if (DEBUG_MODE) {
    Serial.println("Setup completed.");
  }
}

void loop() {
  // Read sensor data
  if (millis() - lastSensorReadTime >= SENSOR_READ_INTERVAL) {
    readSensors();
    lastSensorReadTime = millis();
  }
  
  // Upload data to Firebase
  if (millis() - lastUploadTime >= UPLOAD_INTERVAL) {
    uploadData();
    lastUploadTime = millis();
  }
  
  // Check for incoming commands
  if (millis() - lastCommandCheckTime >= COMMAND_CHECK_INTERVAL) {
    checkCommands();
    lastCommandCheckTime = millis();
  }
  
  // Handle automatic light control based on sensor readings
  automaticLightControl();
  
  // Optional: implement deep sleep mode if needed
}

void setupWiFi() {
  if (DEBUG_MODE) {
    Serial.print("Connecting to WiFi");
  }
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    if (DEBUG_MODE) {
      Serial.print(".");
    }
  }
  
  if (DEBUG_MODE) {
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
  }
}

void setupFirebase() {
  config.host = FIREBASE_HOST;
  config.api_key = FIREBASE_AUTH;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
  if (DEBUG_MODE) {
    Serial.println("Firebase initialized");
  }
}

void registerDevice() {
  FirebaseJson deviceData;
  
  deviceData.set("type", DEVICE_TYPE);
  deviceData.set("name", DEVICE_NAME);
  deviceData.set("status", "online");
  deviceData.set("lastUpdate", time(nullptr));
  
  FirebaseJson location;
  location.set("lat", DEVICE_LAT);
  location.set("lng", DEVICE_LNG);
  deviceData.set("location", location);
  
  if (Firebase.setJSON(firebaseData, devicePath, deviceData)) {
    if (DEBUG_MODE) {
      Serial.println("Device registered successfully");
    }
  } else {
    if (DEBUG_MODE) {
      Serial.print("Device registration failed: ");
      Serial.println(firebaseData.errorReason());
    }
  }
}

void readSensors() {
  // Read light level from LDR
  lightLevel = analogRead(LDR_PIN);
  
  if (DEBUG_MODE) {
    Serial.print("Light level: ");
    Serial.println(lightLevel);
  }
}

void uploadData() {
  FirebaseJson sensorData;
  
  sensorData.set("deviceId", DEVICE_ID);
  sensorData.set("value", lightLevel);
  sensorData.set("timestamp", time(nullptr));
  sensorData.set("status", lightStatus ? "on" : "off");
  
  if (Firebase.setJSON(firebaseData, sensorPath, sensorData)) {
    if (DEBUG_MODE) {
      Serial.println("Sensor data uploaded successfully");
    }
    
    // Update device status
    Firebase.setString(firebaseData, devicePath + "/status", "online");
    Firebase.setInt(firebaseData, devicePath + "/lastUpdate", time(nullptr));
  } else {
    if (DEBUG_MODE) {
      Serial.print("Sensor data upload failed: ");
      Serial.println(firebaseData.errorReason());
    }
  }
}

void checkCommands() {
  if (Firebase.getJSON(firebaseData, commandPath)) {
    FirebaseJson &json = firebaseData.jsonObject();
    size_t len = json.iteratorBegin();
    
    for (size_t i = 0; i < len; i++) {
      FirebaseJson::IteratorValue value = json.valueAt(i);
      
      // Check if this command is for our device
      FirebaseJson commandData;
      commandData.setJsonData(value.value.c_str());
      
      FirebaseJsonData targetDevice;
      commandData.get(targetDevice, "deviceId");
      
      if (targetDevice.success && strcmp(targetDevice.to<const char*>(), DEVICE_ID) == 0) {
        // Check command status
        FirebaseJsonData commandStatus;
        commandData.get(commandStatus, "status");
        
        if (commandStatus.success && strcmp(commandStatus.to<const char*>(), "pending") == 0) {
          // Get command type
          FirebaseJsonData commandType;
          commandData.get(commandType, "type");
          
          // Get parameters
          FirebaseJsonData parametersData;
          commandData.get(parametersData, "parameters");
          
          if (commandType.success && parametersData.success) {
            FirebaseJson parameters;
            parameters.setJsonData(parametersData.to<const char*>());
            
            // Execute command
            executeCommand(commandType.to<const char*>(), parameters);
            
            // Update command status
            String commandKey = value.key.c_str();
            Firebase.setString(firebaseData, commandPath + "/" + commandKey + "/status", "executed");
            
            // Add response
            FirebaseJson response;
            response.set("timestamp", time(nullptr));
            response.set("success", true);
            Firebase.setJSON(firebaseData, commandPath + "/" + commandKey + "/response", response);
          }
        }
      }
    }
    
    json.iteratorEnd();
  }
}

void executeCommand(const String& commandType, FirebaseJson& parameters) {
  if (DEBUG_MODE) {
    Serial.print("Executing command: ");
    Serial.println(commandType);
  }
  
  if (commandType == "TOGGLE_STREETLIGHT") {
    FirebaseJsonData statusData;
    parameters.get(statusData, "status");
    
    if (statusData.success) {
      bool newStatus = statusData.to<bool>();
      updateLightStatus(newStatus);
    }
  }
  // Add more command types as needed
}

void updateLightStatus(bool status) {
  lightStatus = status;
  digitalWrite(RELAY_PIN, status ? HIGH : LOW);
  digitalWrite(LED_STATUS_PIN, status ? HIGH : LOW);
  
  if (DEBUG_MODE) {
    Serial.print("Light status updated to: ");
    Serial.println(status ? "ON" : "OFF");
  }
}

void automaticLightControl() {
  // Example threshold for automatic control (adjust based on your LDR characteristics)
  const int LIGHT_THRESHOLD = 2000;
  
  // Only apply automatic control if in auto mode (implement this flag as needed)
  bool autoMode = true;
  
  if (autoMode) {
    bool shouldBeOn = lightLevel < LIGHT_THRESHOLD;
    
    if (shouldBeOn != lightStatus) {
      updateLightStatus(shouldBeOn);
    }
  }
}
```

### 7.4 Firmware para Nó de Tráfego

Arquivo `arduino/traffic_node/traffic_node.ino`:

```cpp
/**
 * Smart City Project - Traffic Node
 * 
 * This firmware implements a traffic monitoring and control system using ESP32.
 * It monitors traffic flow using ultrasonic sensors and controls traffic lights,
 * while communicating with Firebase for remote monitoring and control.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ArduinoJson.h>
#include <time.h>
#include "config.h"

// Firebase objects
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// Global variables
unsigned long lastSensorReadTime = 0;
unsigned long lastUploadTime = 0;
unsigned long lastCommandCheckTime = 0;
unsigned long trafficLightStartTime = 0;
int vehicleCount = 0;
int congestionLevel = 0;
String trafficLightMode = "AUTO"; // AUTO, FIXED, EMERGENCY
int greenDuration = 30000;  // milliseconds
int yellowDuration = 5000;  // milliseconds
int redDuration = 30000;    // milliseconds
String currentLight = "RED"; // RED, YELLOW, GREEN
String devicePath;
String sensorPath;
String commandPath;

// Function declarations
void setupWiFi();
void setupFirebase();
void readTrafficSensors();
void uploadData();
void checkCommands();
void executeCommand(const String& commandType, FirebaseJson& parameters);
void controlTrafficLights();
void setTrafficLight(const String& light);

void setup() {
  Serial.begin(115200);
  if (DEBUG_MODE) {
    Serial.println("\n=== Smart City - Traffic Node ===");
  }
  
  // Initialize pins
  pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
  pinMode(ULTRASONIC_ECHO_PIN, INPUT);
  pinMode(TRAFFIC_RED_PIN, OUTPUT);
  pinMode(TRAFFIC_YELLOW_PIN, OUTPUT);
  pinMode(TRAFFIC_GREEN_PIN, OUTPUT);
  
  // Initial state - Red light
  digitalWrite(TRAFFIC_RED_PIN, HIGH);
  digitalWrite(TRAFFIC_YELLOW_PIN, LOW);
  digitalWrite(TRAFFIC_GREEN_PIN, LOW);
  trafficLightStartTime = millis();
  
  // Setup connectivity
  setupWiFi();
  setupFirebase();
  
  // Define database paths
  devicePath = "devices/" + String(DEVICE_ID);
  sensorPath = "sensors/traffic/" + String(DEVICE_ID);
  commandPath = "commands";
  
  // Register device if needed
  registerDevice();
  
  if (DEBUG_MODE) {
    Serial.println("Setup completed.");
  }
}

void loop() {
  // Read sensor data
  if (millis() - lastSensorReadTime >= SENSOR_READ_INTERVAL) {
    readTrafficSensors();
    lastSensorReadTime = millis();
  }
  
  // Upload data to Firebase
  if (millis() - lastUploadTime >= UPLOAD_INTERVAL) {
    uploadData();
    lastUploadTime = millis();
  }
  
  // Check for incoming commands
  if (millis() - lastCommandCheckTime >= COMMAND_CHECK_INTERVAL) {
    checkCommands();
    lastCommandCheckTime = millis();
  }
  
  // Control traffic lights
  controlTrafficLights();
}

// ... similar WiFi and Firebase setup functions ...

void readTrafficSensors() {
  // Measure distance using ultrasonic sensor
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  
  long duration = pulseIn(ULTRASONIC_ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2; // in cm
  
  // Example: detect vehicle if distance is less than threshold
  const float VEHICLE_THRESHOLD = 100.0; // cm
  static bool vehicleDetected = false;
  
  if (distance < VEHICLE_THRESHOLD && !vehicleDetected) {
    vehicleDetected = true;
    vehicleCount++;
    
    if (DEBUG_MODE) {
      Serial.print("Vehicle detected. Count: ");
      Serial.println(vehicleCount);
    }
  } else if (distance >= VEHICLE_THRESHOLD) {
    vehicleDetected = false;
  }
  
  // Calculate congestion level (simple example)
  // In a real scenario, use time-based counting and more complex calculations
  congestionLevel = min(100, vehicleCount * 5); // Simple scaling for demo
  
  if (vehicleCount > 20) {
    vehicleCount = 0; // Reset counter periodically
  }
}

void uploadData() {
  FirebaseJson sensorData;
  
  sensorData.set("deviceId", DEVICE_ID);
  sensorData.set("vehicleCount", vehicleCount);
  sensorData.set("congestionLevel", congestionLevel);
  sensorData.set("currentLight", currentLight);
  sensorData.set("mode", trafficLightMode);
  sensorData.set("timestamp", time(nullptr));
  
  if (Firebase.setJSON(firebaseData, sensorPath, sensorData)) {
    if (DEBUG_MODE) {
      Serial.println("Traffic data uploaded successfully");
    }
    
    // Update device status
    Firebase.setString(firebaseData, devicePath + "/status", "online");
    Firebase.setInt(firebaseData, devicePath + "/lastUpdate", time(nullptr));
  } else {
    if (DEBUG_MODE) {
      Serial.print("Traffic data upload failed: ");
      Serial.println(firebaseData.errorReason());
    }
  }
}

void executeCommand(const String& commandType, FirebaseJson& parameters) {
  if (DEBUG_MODE) {
    Serial.print("Executing command: ");
    Serial.println(commandType);
  }
  
  if (commandType == "SET_TRAFFIC_MODE") {
    FirebaseJsonData modeData;
    parameters.get(modeData, "mode");
    
    if (modeData.success) {
      trafficLightMode = modeData.to<String>();
      
      if (DEBUG_MODE) {
        Serial.print("Traffic light mode set to: ");
        Serial.println(trafficLightMode);
      }
    }
  } else if (commandType == "SET_TRAFFIC_TIMING") {
    FirebaseJsonData greenData;
    parameters.get(greenData, "greenDuration");
    
    if (greenData.success) {
      greenDuration = greenData.to<int>() * 1000; // Convert to milliseconds
      
      if (DEBUG_MODE) {
        Serial.print("Green duration set to: ");
        Serial.print(greenDuration / 1000);
        Serial.println(" seconds");
      }
    }
  }
}

void controlTrafficLights() {
  unsigned long currentTime = millis();
  unsigned long elapsedTime = currentTime - trafficLightStartTime;
  
  if (trafficLightMode == "AUTO") {
    // Dynamic timing based on congestion
    int adjustedGreenDuration = map(congestionLevel, 0, 100, 15000, 60000);
    
    if (currentLight == "RED") {
      if (elapsedTime >= redDuration) {
        setTrafficLight("GREEN");
        trafficLightStartTime = currentTime;
      }
    } else if (currentLight == "GREEN") {
      if (elapsedTime >= adjustedGreenDuration) {
        setTrafficLight("YELLOW");
        trafficLightStartTime = currentTime;
      }
    } else if (currentLight == "YELLOW") {
      if (elapsedTime >= yellowDuration) {
        setTrafficLight("RED");
        trafficLightStartTime = currentTime;
      }
    }
  } else if (trafficLightMode == "FIXED") {
    // Fixed timing
    if (currentLight == "RED") {
      if (elapsedTime >= redDuration) {
        setTrafficLight("GREEN");
        trafficLightStartTime = currentTime;
      }
    } else if (currentLight == "GREEN") {
      if (elapsedTime >= greenDuration) {
        setTrafficLight("YELLOW");
        trafficLightStartTime = currentTime;
      }
    } else if (currentLight == "YELLOW") {
      if (elapsedTime >= yellowDuration) {
        setTrafficLight("RED");
        trafficLightStartTime = currentTime;
      }
    }
  } else if (trafficLightMode == "EMERGENCY") {
    // Emergency mode - keep green in main direction
    setTrafficLight("GREEN");
  }
}

void setTrafficLight(const String& light) {
  digitalWrite(TRAFFIC_RED_PIN, light == "RED" ? HIGH : LOW);
  digitalWrite(TRAFFIC_YELLOW_PIN, light == "YELLOW" ? HIGH : LOW);
  digitalWrite(TRAFFIC_GREEN_PIN, light == "GREEN" ? HIGH : LOW);
  
  currentLight = light;
  
  if (DEBUG_MODE) {
    Serial.print("Traffic light set to: ");
    Serial.println(light);
  }
}
```

### 7.5 Firmware para Nó Ambiental

Arquivo `arduino/environmental_node/environmental_node.ino`:

```cpp
/**
 * Smart City Project - Environmental Node
 * 
 * This firmware implements an environmental monitoring system using ESP32.
 * It monitors air quality, noise levels, temperature, and humidity,
 * while communicating with Firebase for remote monitoring and alerts.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <time.h>
#include "config.h"

// Define DHT sensor
#define DHTTYPE DHT22
DHT dht(DHT_PIN, DHTTYPE);

// Firebase objects
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// Global variables
unsigned long lastSensorReadTime = 0;
unsigned long lastUploadTime = 0;
unsigned long lastCommandCheckTime = 0;
int airQuality = 0;
int noiseLevel = 0;
float temperature = 0;
float humidity = 0;
String devicePath;
String sensorPath;
String commandPath;
String alertPath;

// Function declarations
void setupWiFi();
void setupFirebase();
void readSensors();
void uploadData();
void checkCommands();
void executeCommand(const String& commandType, FirebaseJson& parameters);
void checkThresholdsAndAlert();

void setup() {
  Serial.begin(115200);
  if (DEBUG_MODE) {
    Serial.println("\n=== Smart City - Environmental Node ===");
  }
  
  // Initialize pins
  pinMode(AIR_QUALITY_PIN, INPUT);
  pinMode(NOISE_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Start DHT sensor
  dht.begin();
  
  // Setup connectivity
  setupWiFi();
  setupFirebase();
  
  // Define database paths
  devicePath = "devices/" + String(DEVICE_ID);
  sensorPath = "sensors/environmental/" + String(DEVICE_ID);
  commandPath = "commands";
  alertPath = "alerts";
  
  // Register device if needed
  registerDevice();
  
  if (DEBUG_MODE) {
    Serial.println("Setup completed.");
  }
}

void loop() {
  // Read sensor data
  if (millis() - lastSensorReadTime >= SENSOR_READ_INTERVAL) {
    readSensors();
    lastSensorReadTime = millis();
    
    // Check thresholds and create alerts if needed
    checkThresholdsAndAlert();
  }
  
  // Upload data to Firebase
  if (millis() - lastUploadTime >= UPLOAD_INTERVAL) {
    uploadData();
    lastUploadTime = millis();
  }
  
  // Check for incoming commands
  if (millis() - lastCommandCheckTime >= COMMAND_CHECK_INTERVAL) {
    checkCommands();
    lastCommandCheckTime = millis();
  }
}

// ... similar WiFi and Firebase setup functions ...

void readSensors() {
  // Read air quality from MQ-135
  airQuality = analogRead(AIR_QUALITY_PIN);
  // Convert to AQI (simplified calculation - replace with actual calibration)
  airQuality = map(airQuality, 0, 4095, 0, 500);
  
  // Read noise level from KY-038
  noiseLevel = analogRead(NOISE_PIN);
  // Convert to dB (simplified calculation - replace with actual calibration)
  noiseLevel = map(noiseLevel, 0, 4095, 30, 130);
  
  // Read temperature and humidity from DHT22
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  
  // Check if readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    if (DEBUG_MODE) {
      Serial.println("Failed to read from DHT sensor!");
    }
    // Use previous valid readings or set defaults
    humidity = humidity > 0 ? humidity : 50;
    temperature = temperature > 0 ? temperature : 25;
  }
  
  if (DEBUG_MODE) {
    Serial.println("Sensor readings:");
    Serial.print("  Air Quality: ");
    Serial.print(airQuality);
    Serial.println(" AQI");
    Serial.print("  Noise Level: ");
    Serial.print(noiseLevel);
    Serial.println(" dB");
    Serial.print("  Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");
    Serial.print("  Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
  }
}

void uploadData() {
  FirebaseJson sensorData;
  
  sensorData.set("deviceId", DEVICE_ID);
  sensorData.set("airQuality", airQuality);
  sensorData.set("noiseLevel", noiseLevel);
  sensorData.set("temperature", temperature);
  sensorData.set("humidity", humidity);
  sensorData.set("timestamp", time(nullptr));
  
  if (Firebase.setJSON(firebaseData, sensorPath, sensorData)) {
    if (DEBUG_MODE) {
      Serial.println("Environmental data uploaded successfully");
    }
    
    // Update device status
    Firebase.setString(firebaseData, devicePath + "/status", "online");
    Firebase.setInt(firebaseData, devicePath + "/lastUpdate", time(nullptr));
  } else {
    if (DEBUG_MODE) {
      Serial.print("Environmental data upload failed: ");
      Serial.println(firebaseData.errorReason());
    }
  }
}

void executeCommand(const String& commandType, FirebaseJson& parameters) {
  if (DEBUG_MODE) {
    Serial.print("Executing command: ");
    Serial.println(commandType);
  }
  
  if (commandType == "SOUND_ALERT") {
    FirebaseJsonData durationData;
    parameters.get(durationData, "duration");
    
    if (durationData.success) {
      int alertDuration = durationData.to<int>() * 1000; // Convert to milliseconds
      
      // Sound the buzzer
      digitalWrite(BUZZER_PIN, HIGH);
      delay(alertDuration);
      digitalWrite(BUZZER_PIN, LOW);
      
      if (DEBUG_MODE) {
        Serial.print("Alert sounded for ");
        Serial.print(alertDuration / 1000);
        Serial.println(" seconds");
      }
    }
  }
}

void checkThresholdsAndAlert() {
  // Define thresholds
  const int AIR_QUALITY_WARNING = 100;
  const int AIR_QUALITY_CRITICAL = 150;
  const int NOISE_LEVEL_WARNING = 70;
  const int NOISE_LEVEL_CRITICAL = 85;
  const float TEMP_WARNING_HIGH = 35.0;
  const float TEMP_WARNING_LOW = 0.0;
  
  // Check air quality
  if (airQuality > AIR_QUALITY_CRITICAL) {
    createAlert("critical", "Air quality critical level: " + String(airQuality) + " AQI");
    // Sound alert
    digitalWrite(BUZZER_PIN, HIGH);
    delay(1000);
    digitalWrite(BUZZER_PIN, LOW);
  } else if (airQuality > AIR_QUALITY_WARNING) {
    createAlert("warning", "Air quality warning level: " + String(airQuality) + " AQI");
  }
  
  // Check noise level
  if (noiseLevel > NOISE_LEVEL_CRITICAL) {
    createAlert("critical", "Noise level critical: " + String(noiseLevel) + " dB");
  } else if (noiseLevel > NOISE_LEVEL_WARNING) {
    createAlert("warning", "Noise level warning: " + String(noiseLevel) + " dB");
  }
  
  // Check temperature
  if (temperature > TEMP_WARNING_HIGH) {
    createAlert("warning", "High temperature: " + String(temperature) + " °C");
  } else if (temperature < TEMP_WARNING_LOW) {
    createAlert("warning", "Low temperature: " + String(temperature) + " °C");
  }
}

void createAlert(const String& type, const String& message) {
  FirebaseJson alertData;
  
  alertData.set("deviceId", DEVICE_ID);
  alertData.set("type", type);
  alertData.set("message", message);
  alertData.set("timestamp", time(nullptr));
  alertData.set("resolved", false);
  
  String alertId = String(DEVICE_ID) + "_" + String(time(nullptr));
  
  if (Firebase.setJSON(firebaseData, alertPath + "/" + alertId, alertData)) {
    if (DEBUG_MODE) {
      Serial.print("Alert created: ");
      Serial.println(message);
    }
  } else {
    if (DEBUG_MODE) {
      Serial.print("Alert creation failed: ");
      Serial.println(firebaseData.errorReason());
    }
  }
}
```

---

## 8. Integração dos Componentes

### 8.1 Fluxo de Comunicação

```
┌─────────────────┐      ┌────────────────┐      ┌─────────────────┐
│                 │      │                │      │                 │
│     ESP32       │      │    Firebase    │      │     React       │
│    Firmware     │ ───> │  Realtime DB   │ ───> │    Frontend     │
│                 │      │                │      │                 │
└─────────────────┘      └────────────────┘      └─────────────────┘
         ▲                      │                        │
         │                      │                        │
         └──────────────────────┴────────────────────────┘
                            Commands
```

### 8.2 Integração ESP32 com Firebase

1. **Configuração de Credenciais**:
   - Atualizar arquivo `config.h` de cada nó com credenciais do Firebase
   - Configurar nome de dispositivo e tipo para cada ESP32

2. **Estrutura de Dados**:
   - Os ESP32 enviam dados para caminhos específicos no banco:
     - `devices/{deviceId}`: Informações do dispositivo
     - `sensors/{type}/{deviceId}`: Leituras dos sensores
     - `alerts/{alertId}`: Alertas gerados
   - Os ESP32 leem comandos de:
     - `commands/{commandId}`: Comandos pendentes

3. **Autenticação**:
   - Utilizar token de autenticação Firebase para garantir acesso seguro
   - Implementar WiFiManager para configuração inicial das credenciais WiFi

### 8.3 Integração Frontend com Firebase

1. **Inicialização do SDK**:
   - Configurar Firebase no frontend usando chaves de API do projeto
   - Implementar listeners para dados em tempo real

2. **Autenticação de Usuários**:
   - Implementar login com Firebase Authentication
   - Definir diferentes níveis de acesso (admin, operator, viewer)

3. **Operações em Tempo Real**:
   - Utilizar Realtime Database para atualizações instantâneas na interface
   - Implementar cache local para operações offline

4. **Envio de Comandos**:
   - Interface cria comandos no caminho `commands`
   - ESP32 processa e atualiza status dos comandos

### 8.4 Testes de Integração

1. **Teste de Conectividade**:
   - Verificar conexão entre ESP32 e Firebase
   - Verificar recebimento de dados no frontend

2. **Teste de Comandos**:
   - Enviar comandos de controle e verificar execução nos dispositivos
   - Testar latência de resposta

3. **Teste de Alertas**:
   - Simular condições de alerta e verificar notificações
   - Testar reconhecimento e resolução de alertas

4. **Teste de Recuperação**:
   - Simular falhas de conexão e verificar recuperação
   - Testar cache offline e sincronização posterior

---

## 9. Funcionalidades Implementadas

### 9.1 Monitoramento da Iluminação Pública

1. **Detecção Automática de Luminosidade**:
   - Sensor LDR detecta nível de luz ambiente
   - Acionamento automático baseado em thresholds configuráveis

2. **Controle Remoto**:
   - Interface para ligar/desligar manualmente
   - Programação de horários de funcionamento
   - Ajuste de sensibilidade dos sensores

3. **Eficiência Energética**:
   - Monitoramento de tempo de operação
   - Estimativa de consumo energético
   - Relatórios de economia

### 9.2 Monitoramento de Tráfego

1. **Contagem de Veículos**:
   - Sensor ultrassônico detecta passagem de veículos
   - Cálculo de fluxo e congestionamento

2. **Semáforos Inteligentes**:
   - Ajuste automático de tempos baseado em fluxo
   - Modos de operação (automático, fixo, emergência)
   - Sincronização entre semáforos (simulada)

3. **Análise de Padrões**:
   - Identificação de horários de pico
   - Geração de relatórios de fluxo

### 9.3 Monitoramento Ambiental

1. **Qualidade do Ar**:
   - Monitoramento de poluentes (CO2, CO, etc.)
   - Classificação por nível de qualidade
   - Alertas quando acima de limiares

2. **Ruído Urbano**:
   - Medição de níveis de ruído
   - Mapeamento de zonas de ruído
   - Alertas para níveis prejudiciais

3. **Condições Climáticas**:
   - Temperatura e umidade locais
   - Histórico e tendências
   - Influência nas condições urbanas

### 9.4 Dashboard Integrado

1. **Visão Geral**:
   - Status de todos os sistemas em tempo real
   - Mapa de localização dos dispositivos
   - Indicadores de performance (KPIs)

2. **Alertas e Notificações**:
   - Lista de alertas ativos
   - Histórico de alertas
   - Sistema de priorização
   - Reconhecimento e resolução

3. **Controle Centralizado**:
   - Interface unificada para todos os subsistemas
   - Controles de acesso baseados em perfil de usuário
   - Log de ações realizadas

### 9.5 Relatórios e Análises

1. **Relatórios Automáticos**:
   - Geração periódica de relatórios
   - Exportação em formatos PDF e CSV
   - Envio por email (opcional)

2. **Análise de Dados**:
   - Gráficos de tendências
   - Comparação de períodos
   - Identificação de anomalias

3. **Métricas de Desempenho**:
   - Uptime dos dispositivos
   - Tempo de resposta a alertas
   - Eficiência dos sistemas

---

## 10. Benchmark e Análise de Desempenho

### 10.1 Metodologia de Benchmark

1. **Métricas de Hardware**:
   - Consumo de CPU
   - Uso de memória (RAM)
   - Tempo de execução de funções críticas
   - Consumo de energia em diferentes modos

2. **Métricas de Rede**:
   - Latência de comunicação
   - Taxa de transferência
   - Confiabilidade da conexão
   - Overhead do protocolo

3. **Métricas de Sistema**:
   - Tempo de resposta a comandos
   - Frequência de leituras de sensores
   - Precisão de leituras
   - Autonomia da bateria (se aplicável)

### 10.2 Implementação do Benchmark

```cpp
// Adicionar ao firmware do ESP32
#define BENCHMARK_MODE true

// Variáveis para benchmark
unsigned long benchmarkStartTime;
unsigned long benchmarkEndTime;
unsigned long cpuCycles;
size_t memoryUsage;

// Função para iniciar benchmark
void startBenchmark() {
  if (BENCHMARK_MODE) {
    benchmarkStartTime = micros();
    cpuCycles = ESP.getCycleCount();
    memoryUsage = ESP.getFreeHeap();
    Serial.println("Benchmark started");
  }
}

// Função para finalizar benchmark
void endBenchmark(const char* testName) {
  if (BENCHMARK_MODE) {
    benchmarkEndTime = micros();
    unsigned long duration = benchmarkEndTime - benchmarkStartTime;
    unsigned long cycles = ESP.getCycleCount() - cpuCycles;
    size_t memoryDelta = memoryUsage - ESP.getFreeHeap();
    
    Serial.println("===== Benchmark Results =====");
    Serial.print("Test: ");
    Serial.println(testName);
    Serial.print("Duration: ");
    Serial.print(duration);
    Serial.println(" microseconds");
    Serial.print("CPU Cycles: ");
    Serial.println(cycles);
    Serial.print("Memory Used: ");
    Serial.print(memoryDelta);
    Serial.println(" bytes");
    Serial.println("=============================");
    
    // Enviar resultados para Firebase
    FirebaseJson benchmarkData;
    benchmarkData.set("testName", testName);
    benchmarkData.set("duration", duration);
    benchmarkData.set("cpuCycles", cycles);
    benchmarkData.set("memoryUsed", memoryDelta);
    benchmarkData.set("timestamp", time(nullptr));
    
    Firebase.pushJSON(firebaseData, "benchmarks/" + String(DEVICE_ID), benchmarkData);
  }
}

// Uso em funções principais
void sensorReadBenchmark() {
  startBenchmark();
  
  // Operação normal de leitura de sensores
  readSensors();
  
  endBenchmark("sensor_read");
}
```

### 10.3 Testes Específicos

1. **Desempenho de Sensores**:
   - Precisão x Frequência de amostragem
   - Tempo de resposta para mudanças
   - Estabilidade em longo prazo

2. **Comunicação WiFi**:
   - Alcance máximo efetivo
   - Impacto de interferências
   - Reconexão após falhas
   - Consumo de energia durante transmissão

3. **Armazenamento e Processamento**:
   - Capacidade de armazenamento local
   - Eficiência de compressão de dados
   - Velocidade de acesso ao Firebase
   - Uso de memória em diferentes operações

4. **Energia**:
   - Consumo em operação normal
   - Consumo em deep sleep
   - Impacto de diferentes sensores

### 10.4 Análise dos Resultados

1. **Gráficos Comparativos**:
   - Desempenho em diferentes configurações
   - Influência do ambiente (dia/noite, clima)
   - Eficiência energética x Responsividade

2. **Otimizações Identificadas**:
   - Ajustes de frequência de leitura
   - Balanceamento de carga em múltiplas tarefas
   - Melhoria de algoritmos

3. **Limitações Detectadas**:
   - Gargalos de hardware
   - Restrições de conectividade
   - Impacto de fatores ambientais

---

## 11. Cronograma de Desenvolvimento

### 11.1 Fase 1: Preparação (Semanas 1-2)

| Atividade | Descrição | Responsável | Status |
|-----------|-----------|-------------|--------|
| Levantamento de requisitos | Detalhamento das funcionalidades | Todos | Pendente |
| Aquisição de componentes | Compra de ESP32, sensores, etc. | Equipe | Pendente |
| Configuração do ambiente | Setup do Firebase e ferramentas de desenvolvimento | Desenvolvedor Backend | Pendente |
| Prototipação da interface | Wireframes e mockups da UI | Desenvolvedor Frontend | Pendente |

### 11.2 Fase 2: Desenvolvimento Base (Semanas 3-4)

| Atividade | Descrição | Responsável | Status |
|-----------|-----------|-------------|--------|
| Modelagem do banco de dados | Estrutura do Firebase Realtime DB | Desenvolvedor Backend | Pendente |
| Desenvolvimento do frontend básico | Implementação do login e dashboard | Desenvolvedor Frontend | Pendente |
| Firmware básico para ESP32 | Código para leitura de sensores e conectividade | Desenvolvedor IoT | Pendente |
| Testes iniciais | Verificação de comunicação entre componentes | Todos | Pendente |

### 11.3 Fase 3: Integração (Semanas 5-6)

| Atividade | Descrição | Responsável | Status |
|-----------|-----------|-------------|--------|
| Integração ESP32-Firebase | Implementação da comunicação | Desenvolvedor IoT | Pendente |
| Desenvolvimento da UI completa | Implementação de todas as telas | Desenvolvedor Frontend | Pendente |
| Sistema de autenticação | Configuração de roles e permissões | Desenvolvedor Backend | Pendente |
| Testes de integração | Verificação do fluxo completo | Todos | Pendente |

### 11.4 Fase 4: Primeira Entrega (Semanas 7-8)

| Atividade | Descrição | Responsável | Status |
|-----------|-----------|-------------|--------|
| Finalização do frontend | Ajustes de design e usabilidade | Desenvolvedor Frontend | Pendente |
| Documentação da API | Documentação das interfaces | Desenvolvedor Backend | Pendente |
| Testes de usabilidade | Avaliação da interface com usuários | Todos | Pendente |
| Preparação da entrega | Empacotamento da solução | Todos | Pendente |
| **Primeira Entrega** | **Data: 20/03/2025** | **Todos** | **Pendente** |

### 11.5 Fase 5: Implementação de Hardware (Semanas 9-10)

| Atividade | Descrição | Responsável | Status |
|-----------|-----------|-------------|--------|
| Montagem final dos nós | Montagem física dos sensores e ESP32 | Desenvolvedor IoT | Pendente |
| Calibração de sensores | Ajuste fino das leituras | Desenvolvedor IoT | Pendente |
| Testes em ambiente real | Avaliação no local de uso | Todos | Pendente |
| Ajustes e otimizações | Melhorias baseadas nos testes | Todos | Pendente |

### 11.6 Fase 6: Funcionalidades Avançadas (Semanas 11-14)

| Atividade | Descrição | Responsável | Status |
|-----------|-----------|-------------|--------|
| Sistema de alertas | Implementação de notificações | Desenvolvedor Backend | Pendente |
| Relatórios e análises | Desenvolvimento de visualizações | Desenvolvedor Frontend | Pendente |
| Benchmark do ESP32 | Testes de desempenho | Desenvolvedor IoT | Pendente |
| Otimizações | Melhorias de performance | Todos | Pendente |

### 11.7 Fase 7: Finalização (Semanas 15-16)

| Atividade | Descrição | Responsável | Status |
|-----------|-----------|-------------|--------|
| Testes finais | Verificação completa do sistema | Todos | Pendente |
| Documentação final | Manual do usuário e documentação técnica | Todos | Pendente |
| Elaboração do artigo | Redação do artigo técnico | Todos | Pendente |
| Preparação da apresentação | Slides e demonstração | Todos | Pendente |
| **Entrega Final** | **Data: 26/06/2025** | **Todos** | **Pendente** |

---

## 12. Segurança e Boas Práticas

### 12.1 Segurança de Dados

1. **Autenticação**:
   - Utilizar Firebase Authentication para controle de acesso
   - Implementar tokens JWT para comunicação segura
   - Renovação automática de credenciais

2. **Criptografia**:
   - Comunicação via HTTPS/SSL
   - Armazenamento seguro de credenciais no ESP32
   - Não enviar dados sensíveis em texto plano

3. **Regras de Acesso**:
   - Implementar regras de segurança no Firebase
   - Segregação de níveis de acesso (admin, operator, viewer)
   - Controle granular de permissões por recurso

### 12.2 Boas Práticas de Codificação

1. **Clean Code**:
   - Nomenclatura clara e consistente
   - Funções pequenas e com propósito único
   - Comentários explicativos quando necessário

2. **Modularização**:
   - Separação de responsabilidades
   - Interfaces bem definidas entre módulos
   - Reutilização de código comum

3. **Tratamento de Erros**:
   - Validação de entradas
   - Verificação de conectividade antes de operações
   - Recuperação graceful de falhas

### 12.3 Otimização de Recursos

1. **Energia**:
   - Implementação de deep sleep quando possível
   - Redução de frequência de comunicação
   - Otimização de algoritmos

2. **Memória**:
   - Minimização de alocações dinâmicas
   - Liberação de recursos após uso
   - Monitoramento de vazamentos de memória

3. **Rede**:
   - Compressão de dados quando aplicável
   - Otimização do tamanho das mensagens
   - Agrupamento de transmissões quando possível

### 12.4 Manutenibilidade

1. **Versionamento**:
   - Utilização de git para controle de versão
   - Organização de branches por funcionalidade
   - Documentação clara de mudanças

2. **Documentação**:
   - Instruções de setup e execução
   - Diagramas de arquitetura
   - Comentários explicativos no código

3. **Testes**:
   - Testes unitários para funções críticas
   - Testes de integração para fluxos completos
   - Testes de carga para verificar limites

---
