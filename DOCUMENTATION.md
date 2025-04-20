# Documentação Detalhada do Projeto Smart City

## Análise do Sistema

O projeto Smart City é um sistema de monitoramento urbano que integra dispositivos ESP32, Firebase e uma interface web React/TypeScript. **Atualmente, o sistema frontend utiliza dados mockados para simular o funcionamento.** O objetivo principal desta documentação é guiar o processo para tornar o sistema totalmente funcional, conectando a interface web aos dados reais coletados pelos dispositivos ESP32 e armazenados no Firebase.

### Arquitetura do Sistema

A arquitetura do sistema é dividida em três camadas principais:

1.  **Dispositivos de Campo (ESP32):** Responsáveis pela coleta de dados dos sensores e controle dos atuadores. Comunicam-se com o Firebase para enviar dados e receber comandos.
2.  **Backend (Firebase Cloud Services):** Utilizado para armazenamento de dados em tempo real (Realtime Database), autenticação de usuários, processamento de dados (Cloud Functions) e envio de notificações (Cloud Messaging).
3.  **Frontend (React/TypeScript):** Interface web e mobile para visualização dos dados, controle do sistema e geração de relatórios. **Atualmente, esta camada está utilizando dados mockados para demonstração e desenvolvimento da interface.**

### Componentes Principais

*   **ESP32:** Microcontrolador dual-core com WiFi e Bluetooth integrados, utilizado nos dispositivos de campo para coletar dados dos sensores e controlar os atuadores.
*   **Sensores:** Diversos sensores para monitorar diferentes parâmetros urbanos, como LDR (luminosidade), MQ-135 (qualidade do ar), KY-038 (ruído), HC-SR04 (ultrassônico para tráfego), DHT22 (temperatura e umidade) e sensor de chuva.
*   **Atuadores:** Dispositivos para controlar o ambiente urbano, como módulos relé (iluminação), LEDs RGB (semáforos) e buzzer (alarmes).
*   **Firebase Realtime Database:** Banco de dados NoSQL em tempo real para armazenar e sincronizar os dados coletados pelos dispositivos ESP32. **Este componente será fundamental para substituir os dados mockados por dados reais.**
*   **React/TypeScript:** Biblioteca e linguagem para construir a interface web e mobile do sistema.
*   **Tailwind CSS:** Framework CSS para estilização rápida e responsiva da interface.
*   **ShadCN UI:** Biblioteca de componentes React UI para construir a interface de usuário.

### Funcionalidades Implementadas (Interface Web/Mobile - Mockada)

*   **Dashboard Central:** Visão geral do sistema com KPIs, mapa interativo e alertas **(dados mockados)**.
*   **Monitoramento de Iluminação:** Status e controle da iluminação pública **(dados mockados)**.
*   **Monitoramento de Tráfego:** Fluxo de tráfego e controle de semáforos **(dados mockados)**.
*   **Monitoramento Ambiental:** Qualidade do ar, ruído, temperatura e umidade **(dados mockados)**.
*   **Sistema de Alertas:** Notificações em tempo real e histórico de alertas **(dados mockados)**.
*   **Relatórios e Análises:** Gráficos históricos e exportação de dados **(dados mockados)**.

**É importante notar que todas as funcionalidades da interface web apresentadas até o momento utilizam dados mockados para fins de demonstração e desenvolvimento visual. O próximo passo crucial é substituir esses dados mockados por dados reais provenientes do Firebase e dos dispositivos ESP32.**

### Próximos Passos Essenciais para Tornar o Sistema Funcional (Ordem Lógica Sugerida)

1.  **Implementar a integração completa com o Firebase no Frontend React:** **(Prioridade Máxima)**
    *   [ ] Adicionar o SDK do Firebase ao projeto React: `npm install firebase` ou `bun add firebase`.
    *   [ ] Configurar um projeto no Firebase Console e obter as credenciais de configuração (API Key, Auth Domain, Database URL, etc.).
    *   [x] Criar um arquivo de configuração Firebase (e.g., `src/lib/firebase-config.ts`) no projeto React com as credenciais obtidas (garantir que este arquivo seja adicionado ao `.gitignore` se contiver informações sensíveis).
    *   [x] Inicializar o Firebase no ponto de entrada principal da aplicação React (`src/main.tsx` ou `src/App.tsx`).
    *   [x] Configurar a autenticação de usuários no frontend (Firebase Authentication), se necessário para proteger o acesso ao dashboard.
    *   [x] Definir a estrutura de dados (schema) no Firebase Realtime Database (e.g., `/devices`, `/sensors/lighting`, `/sensors/traffic`, `/commands`).
    *   [x] Criar hooks React personalizados (e.g., `src/hooks/useFirebaseData.ts`, `src/hooks/useSendCommand.ts`) para encapsular a lógica de acesso ao Firebase Realtime Database.
    *   [x] Implementar hooks React para leitura de dados em tempo real do Firebase Realtime Database, utilizando `onValue` ou APIs similares do Firebase SDK.
    *   [x] Substituir dados mockados na página Dashboard (`src/pages/Index.tsx`).
    *   [ ] Substituir dados mockados na página Iluminação (`src/pages/Lighting.tsx`).
    *   [ ] Substituir dados mockados na página Tráfego (`src/pages/Traffic.tsx`).
    *   [ ] Substituir dados mockados na página Ambiente (`src/pages/Environment.tsx`).
    *   [ ] Substituir dados mockados na página Alertas (`src/pages/Alerts.tsx`).
    *   [ ] Substituir dados mockados na página Relatórios (`src/pages/Reports.tsx`).
    *   [ ] Substituir dados mockados na página Configurações (`src/pages/Settings.tsx`).
    *   [ ] Implementar a funcionalidade de envio de comandos do frontend para os dispositivos ESP32 através da escrita de dados em um nó específico do Firebase Realtime Database (e.g., `/commands/[deviceId]`).

2.  **Desenvolver o firmware para os dispositivos ESP32 (Após configuração do Firebase):**
    *   [ ] Configurar o ambiente de desenvolvimento para ESP32 (Arduino IDE ou PlatformIO) com as bibliotecas necessárias (e.g., `FirebaseESP32`, `WiFi`, `ArduinoJson`, bibliotecas de sensores específicos).
    *   [ ] Configurar a conexão WiFi no firmware do ESP32 para conectar-se à rede local.
    *   [ ] Configurar a comunicação com o Firebase Realtime Database no firmware do ESP32, utilizando as mesmas credenciais e URL do banco de dados configurado na etapa 1.
    *   [ ] Implementar a leitura dos sensores conectados ao ESP32 (LDR, MQ-135, HC-SR04, etc.) em intervalos regulares.
    *   [ ] Implementar o envio dos dados dos sensores para os nós correspondentes no Firebase Realtime Database (e.g., `/sensors/lighting/[deviceId]`, `/sensors/traffic/[deviceId]`), estruturando os dados conforme o schema definido.
    *   [ ] Implementar a escuta (listener) de comandos no nó específico do Firebase Realtime Database (e.g., `/commands/[deviceId]`) no firmware do ESP32.
    *   [ ] Implementar a lógica para executar os comandos recebidos (e.g., acionar relés, mudar LEDs de semáforos) e atualizar o status no Firebase, se necessário.
    *   [ ] Implementar um sistema de alertas no firmware para detectar eventos críticos (e.g., valores de sensores fora da faixa esperada) e enviar notificações para um nó específico no Firebase (e.g., `/alerts`).

3.  **Integrar os componentes e realizar testes (Após Frontend e Firmware estarem prontos):**
    *   [ ] Implantar o firmware desenvolvido na etapa 2 nos dispositivos ESP32 físicos.
    *   [ ] Executar a aplicação React frontend (`npm run dev` ou `bun run dev`).
    *   [ ] **Testar Fluxo de Dados (Sensor -> Firebase -> Frontend):** Verificar se os dados dos sensores coletados pelos ESP32 são corretamente enviados para o Firebase e exibidos na interface web em tempo real.
    *   [ ] **Testar Fluxo de Comandos (Frontend -> Firebase -> ESP32):** Verificar se os comandos enviados da interface web são recebidos pelo Firebase, lidos pelo ESP32 e executados corretamente nos atuadores.
    *   [ ] **Validar Sistema de Alertas:** Verificar se os alertas gerados pelos ESP32 são corretamente enviados ao Firebase e exibidos na interface web.
    *   [ ] **Medir Latência e Desempenho:** Avaliar o tempo de resposta do sistema em diferentes condições.
    *   [ ] **Refinar Interface:** Ajustar a visualização dos dados, controles e usabilidade com base nos dados reais e testes.
    *   [ ] **Otimizar Desempenho:** Identificar e corrigir gargalos no ESP32, Firebase (regras, estrutura) e Frontend.

4.  **Documentação e Testes Finais:**
    *   [ ] Documentar o código final do firmware ESP32 e do frontend React, incluindo detalhes da integração com Firebase, esquema do banco de dados e lógica de negócios.
    *   [ ] Criar um guia de configuração e implantação completo do sistema Smart City.
    *   [ ] Realizar testes exaustivos do sistema integrado em diferentes cenários e condições operacionais.

### Acompanhamento do Andamento e Conclusão de Tasks

Para acompanhar o andamento do projeto e marcar as tasks como concluídas, utilize a checklist detalhada na seção "Próximos Passos Essenciais para Tornar o Sistema Funcional (Ordem Lógica Sugerida)". À medida que cada item for concluído, marque-o com um "x" dentro dos colchetes, como `[x]`. Isso permitirá acompanhar visualmente o progresso do projeto e identificar claramente as etapas restantes para tornar o sistema Smart City totalmente funcional com dados reais.

Este documento agora serve como um guia centralizado e **focado na transição do sistema mockado para um sistema funcional**, detalhando os passos essenciais para a integração com Firebase e ESP32 na ordem lógica de dependência. Utilize este guia para acompanhar o progresso e garantir que todas as etapas necessárias sejam concluídas para alcançar um sistema Smart City operacional e eficiente.
