# Documentação: Projeto Smart City com ESP32

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
```

### 2.2 Componentes Principais

1. **Dispositivos de Campo**: Módulos ESP32 equipados com sensores diversos para coleta de dados e atuadores para controle de dispositivos.

2. **Firebase Cloud Services**:
   - Realtime Database: Armazenamento e sincronização de dados em tempo real
   - Authentication: Gestão de usuários e autenticação
   - Cloud Functions: Processamento de lógica de negócio
   - Cloud Messaging: Sistema de notificações push

3. **Aplicação Web/Mobile**:
   - Frontend em React/TypeScript
   - Visualização dos dados em tempo real
   - Interface de controle e configuração
   - Geração de relatórios e análises

### 2.3 Fluxo de Dados

1. **Coleta de Dados**: Os sensores conectados ao ESP32 coletam dados do ambiente, processam localmente e enviam para o Firebase.

2. **Armazenamento e Processamento**: O Firebase Realtime Database armazena os dados, que são processados para análise e alertas.

3. **Visualização e Controle**: A aplicação web/mobile obtém dados do Firebase em tempo real, permitindo visualização e controle.

---

## 3. Componentes de Hardware

### 3.1 Microcontroladores

**ESP32**:
- Processador dual-core Xtensa LX6 (até 240MHz)
- WiFi e Bluetooth integrados
- 520KB SRAM
- Interface para GPIO, ADC, DAC, I2C, SPI, etc.

**Quantidade necessária**: Mínimo 3 unidades (iluminação, tráfego, ambiental)

### 3.2 Sensores

| Sensor | Finalidade | Quantidade |
|--------|------------|------------|
| LDR/Fotocélula | Detecção de luminosidade | 3-5 |
| MQ-135 | Qualidade do ar | 1-2 |
| KY-038 | Detecção de ruído | 1-2 |
| HC-SR04 | Ultrassônico para detecção de veículos | 3-4 |
| DHT22 | Temperatura e umidade | 1-2 |
| Sensor de chuva | Detecção de precipitação | 1 |

### 3.3 Atuadores

| Atuador | Finalidade | Quantidade |
|---------|------------|------------|
| Módulo Relé | Controle de iluminação | 3-4 |
| LEDs RGB | Simulação de semáforos | 3-4 sets |
| Buzzer | Alarmes e alertas | 1-2 |

---

## 4. Ambiente de Desenvolvimento

### 4.1 Configuração do Ambiente para ESP32

1. **Arduino IDE** ou **PlatformIO** com suporte a ESP32 e bibliotecas relevantes:
   - FirebaseESP32
   - ArduinoJson
   - PubSubClient (para MQTT)
   - DHT sensor library (para DHT22)
   - WiFiManager

### 4.2 Configuração do Ambiente para Frontend

**Baseado na estrutura observada no projeto:**

1. **Node.js e npm/bun**: Ferramentas para o desenvolvimento web.

2. **Vite + React com TypeScript**: Framework de desenvolvimento.

3. **Dependências Principais**:
   - React/ReactDOM: Biblioteca de UI
   - React Router DOM: Roteamento
   - Lucide React: Ícones
   - Framer Motion: Animações
   - Tailwind CSS: Framework CSS
   - ShadCN UI: Componentes UI
   - Recharts: Biblioteca de gráficos
   - Firebase (a ser adicionado): Integração com o backend

### 4.3 Configuração do Firebase

1. **Criar Projeto no Firebase Console**
2. **Ativar serviços necessários**:
   - Authentication
   - Realtime Database
   - Cloud Functions (se necessário)
3. **Configuração de Regras de Segurança**
4. **Obtenção de Credenciais para a aplicação web e ESP32**

---

## 5. Backend: Firebase

### 5.1 Estrutura do Banco de Dados

```
smart-city/
│
├── devices/                  # Informações sobre dispositivos
│   ├── [deviceId]/
│       ├── type: "lighting"|"traffic"|"environmental"
│       ├── status: "online"|"offline"
│       └── location: {lat, lng}
│
├── sensors/                  # Leituras dos sensores
│   ├── lighting/
│   ├── traffic/
│   └── environmental/
│
├── alerts/                   # Sistema de alertas
│   ├── [alertId]/
│       ├── type: "warning"|"critical"|"info"
│       └── message: String
│
└── commands/                 # Comandos para dispositivos
    └── [commandId]/
```

### 5.2 Regras de Segurança

Configurações básicas para garantir que apenas usuários autenticados tenham acesso adequado.

### 5.3 Cloud Functions

Funções para processamento automatizado de dados:
- Detecção de alertas baseados em thresholds
- Otimização de semáforos baseado no fluxo de tráfego
- Processamento de dados históricos para relatórios

---

## 6. Frontend: React/TypeScript

### 6.1 Estrutura de Diretórios (Atual)

```
src/
├── assets/             # Imagens e recursos estáticos
├── components/         # Componentes reutilizáveis
│   ├── ui/             # Componentes base (ShadCN UI)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── AlertCard.tsx   # Cartão de alerta
│   ├── ChartCard.tsx   # Cartão de gráfico 
│   ├── Map.tsx         # Componente de mapa
│   ├── StatsCard.tsx   # Cartão de estatísticas
│   └── StatusIndicator.tsx  # Indicador de status
├── hooks/              # Hooks personalizados
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── layout/             # Layouts de página
│   └── DashboardLayout.tsx
├── lib/                # Utilitários
│   └── utils.ts
├── pages/              # Páginas da aplicação
│   ├── Alerts.tsx      # Página de alertas
│   ├── Environment.tsx # Página de ambiente
│   ├── Index.tsx       # Dashboard principal
│   ├── Lighting.tsx    # Página de iluminação
│   ├── NotFound.tsx    # Página 404
│   ├── Reports.tsx     # Página de relatórios
│   ├── Settings.tsx    # Página de configurações  
│   └── Traffic.tsx     # Página de tráfego
├── App.tsx             # Componente principal
├── App.css             # Estilos globais
├── index.css           # Estilos Tailwind e configurações
└── main.tsx            # Ponto de entrada
```

### 6.2 Componentes Principais

1. **DashboardLayout**: Layout base com sidebar e navbar

2. **Páginas**:
   - **Index**: Dashboard principal com visão geral
   - **Lighting**: Monitoramento e controle de iluminação
   - **Traffic**: Monitoramento e controle de tráfego
   - **Environment**: Monitoramento ambiental
   - **Alerts**: Sistema de alertas
   - **Reports**: Geração de relatórios
   - **Settings**: Configurações do sistema

3. **Componentes Reutilizáveis**:
   - **StatsCard**: Cards de estatísticas
   - **ChartCard**: Visualização de gráficos
   - **Map**: Mapa interativo com dispositivos
   - **AlertCard**: Notificações de alerta
   - **StatusIndicator**: Indicador de status online/offline

### 6.3 Estilos e Design

- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Estilos personalizados** para efeitos glass morphism
- **Design System** com cores e componentes consistentes
- **Layout responsivo** para desktop e mobile

### 6.4 Integração com Firebase (A ser implementada)

- Autenticação de usuários
- Hooks para dados em tempo real
- Upload e download de dados
- Sistema de comandos para dispositivos

---

## 7. Firmware para ESP32

### 7.1 Estrutura Básica

Para cada tipo de nó (iluminação, tráfego, ambiental):
- Configuração de WiFi e Firebase
- Leitura periódica de sensores
- Envio de dados para Firebase
- Recebimento e execução de comandos
- Geração de alertas

### 7.2 Características Principais

- Modularidade para extensibilidade
- Modo de baixo consumo para economia de energia
- Recuperação de falhas de conexão
- Processamento local para decisões rápidas
- Sincronização de tempo via NTP

---

## 8. Integração dos Componentes

### 8.1 Fluxo de Comunicação

```
┌─────────────────┐      ┌────────────────┐      ┌─────────────────┐
│     ESP32       │      │    Firebase    │      │     React       │
│    Firmware     │ ───> │  Realtime DB   │ ───> │    Frontend     │
└─────────────────┘      └────────────────┘      └─────────────────┘
         ▲                      │                        │
         │                      │                        │
         └──────────────────────┴────────────────────────┘
                            Commands
```

### 8.2 Próximos Passos para Integração

1. **Frontend com Firebase**:
   - Adicionar Firebase SDK ao projeto React
   - Implementar autenticação
   - Criar hooks para leitura em tempo real
   - Desenvolver funções de envio de comandos

2. **Testes de Integração**:
   - Verificar fluxo de dados de ESP32 para frontend
   - Testar envio e execução de comandos
   - Validar sistema de alertas
   - Medir latência e performance

---

## 9. Funcionalidades Implementadas

### 9.1 Interface Web/Mobile (Atual)

1. **Dashboard Central**:
   - Visão geral de todos os sistemas
   - KPIs e estatísticas em tempo real
   - Mapa interativo com dispositivos
   - Alertas ativos

2. **Monitoramento de Iluminação**:
   - Status das luminárias
   - Controle manual e automático
   - Acompanhamento de consumo

3. **Monitoramento de Tráfego**:
   - Fluxo e congestionamento
   - Controle de semáforos
   - Análise de padrões

4. **Monitoramento Ambiental**:
   - Qualidade do ar
   - Níveis de ruído
   - Temperatura e umidade

5. **Sistema de Alertas**:
   - Notificações em tempo real
   - Categorização por severidade
   - Histórico e gerenciamento

6. **Relatórios e Análises**:
   - Gráficos históricos
   - Exportação de dados
   - Comparação de períodos

### 9.2 Funcionalidades a Implementar

1. **Integração com Firebase**:
   - Autenticação e autorização
   - Leitura e escrita de dados reais
   - Sincronização em tempo real

2. **Conexão com ESP32**:
   - Processamento dos dados dos sensores
   - Envio de comandos para dispositivos
   - Sistema de alertas baseado em thresholds

---

## 10. Benchmark e Análise de Desempenho

### 10.1 Metodologia de Benchmark

Testes a serem realizados para avaliar o desempenho do sistema:
- Consumo de CPU, memória e energia do ESP32
- Latência de comunicação ESP32-Firebase-Frontend
- Tempo de resposta a comandos
- Precisão das leituras de sensores

### 10.2 Métricas de Avaliação

- Tempo de resposta do sistema
- Confiabilidade da comunicação
- Eficiência energética dos dispositivos
- Escalabilidade da solução

---

## 11. Cronograma de Desenvolvimento

### 11.1 Fase Atual: Desenvolvimento da Interface (Semanas 1-3)

- Implementação das telas e componentes
- Design responsivo e UX
- Preparação para integração com Firebase

### 11.2 Próximas Fases

1. **Integração com Firebase** (Semanas 4-5):
   - Configuração do banco de dados
   - Implementação da autenticação
   - Hooks para dados em tempo real

2. **Desenvolvimento do Firmware ESP32** (Semanas 6-8):
   - Configuração de sensores
   - Comunicação com Firebase
   - Testes de campo

3. **Integração dos Componentes** (Semanas 9-10):
   - Testes end-to-end
   - Refinamentos da interface
   - Otimizações de performance

4. **Finalização e Documentação** (Semanas 11-12):
   - Testes finais
   - Documentação completa
   - Preparação para apresentação

---

## 12. Segurança e Boas Práticas

### 12.1 Segurança de Dados

- Autenticação robusta para acesso ao sistema
- Comunicação criptografada
- Regras de segurança no Firebase
- Proteção contra ataques comuns

### 12.2 Boas Práticas de Desenvolvimento

- Código modular e reutilizável
- Versionamento com Git
- Tratamento adequado de erros
- Testes automatizados

### 12.3 Otimização de Recursos

- Redução do consumo de energia nos ESP32
- Minimização de chamadas ao banco de dados
- Carregamento eficiente de dados no frontend
- Gestão adequada de memória e armazenamento