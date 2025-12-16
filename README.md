# Venha - Frontend (Next.js)

Interface web para o sistema de convites online Venha, permitindo que anfitriões gerenciem eventos e convidados confirmem presença.

## 📋 Sobre o Projeto

Este é o frontend do sistema Venha, desenvolvido em Next.js 16 com React. Fornece uma interface moderna e responsiva para criação de eventos, gerenciamento de convites e confirmação de presença (RSVP).

### Funcionalidades Principais

**Para Anfitriões:**
- Cadastro e login de usuários
- Dashboard para criação e gerenciamento de eventos
- Visualização de lista de convidados confirmados
- Interface para editar e deletar eventos
- Exportação de lista de convidados

**Para Convidados:**
- Visualização de detalhes do evento via link único
- Formulário de confirmação de presença (RSVP)
- Visualização de mapa com localização do evento
- Previsão do tempo para a data do evento
- Modificação e cancelamento de confirmação

## 🏗️ Arquitetura da Aplicação

O sistema Venha utiliza uma arquitetura de três camadas (Frontend, Backend API, Banco de Dados) com integração a múltiplas APIs externas.

**Diagrama de Arquitetura Completo:** Consulte o arquivo [`ARCHITECTURE.md`](ARCHITECTURE.md) para visualizar o diagrama detalhado da arquitetura, fluxo de dados, decisões de design e integrações com serviços externos.

**Visão Resumida:**
- **Frontend (Next.js):** Interface web responsiva com SSR, páginas públicas (convites) e privadas (dashboard)
- **Backend (Flask REST API):** Lógica de negócio, autenticação, validações e integrações
- **Banco de Dados (SQLite):** Armazenamento de hosts, eventos e confirmações
- **Serviços Externos:** SendGrid (emails), Google Maps/Geocoding (mapas), WeatherAPI (clima), ViaCEP (endereços)

**Comunicação:** HTTP/REST com JSON, autenticação via session cookies, CORS configurado.

## 🛠️ Tecnologias Utilizadas

- **Next.js 16** - Framework React com Turbopack
- **React 19** - Biblioteca de interface
- **Ant Design** - Biblioteca de componentes UI
- **Axios** - Cliente HTTP para requisições à API
- **Google Maps API** - Visualização de mapas
- **WeatherAPI** - Previsão do tempo
- **Tailwind CSS** - Estilização

## 🚀 Como Rodar o Projeto

### Opção 1: Usando Docker (Recomendado)

Esta é a forma mais fácil de rodar o projeto completo (frontend + backend).

#### Pré-requisitos
- Docker Desktop instalado e rodando
- Arquivo `.env` configurado no backend
- Arquivo `.env.local` configurado no frontend

#### Passo 1: Configurar Variáveis de Ambiente

**Frontend (.env.local):**
```bash
cp .env.local.example .env.local
```

Edite `.env.local` e configure:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua-chave-google-maps-aqui
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WEATHER_API_KEY=sua-chave-weatherapi-aqui
```

**Backend (../backend/.env):**
Certifique-se de que o backend tem o arquivo `.env` configurado. Veja instruções no README do backend.

#### Passo 2: Rodar com Docker Compose

```bash
docker-compose up --build
```

Aguarde o build das imagens (pode levar alguns minutos na primeira vez).

#### Passo 3: Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Documentação Swagger:** http://localhost:5000/api/docs

#### Comandos Úteis do Docker

**Ver logs em tempo real:**
```bash
docker-compose logs -f
```

**Ver logs apenas do frontend:**
```bash
docker-compose logs -f frontend
```

**Ver logs apenas do backend:**
```bash
docker-compose logs -f backend
```

**Parar os containers:**
```bash
docker-compose down
```

**Reiniciar apenas o frontend:**
```bash
docker restart venha_frontend
```

**Reiniciar apenas o backend:**
```bash
docker restart venha_backend
```

**Acessar o terminal dentro do container:**
```bash
docker exec -it venha_frontend sh
docker exec -it venha_backend bash
```

### Opção 2: Desenvolvimento Local (sem Docker)

Se preferir rodar sem Docker, siga estas instruções:

#### Pré-requisitos
- Node.js 20 ou superior
- npm ou yarn
- Backend rodando em http://localhost:5000

#### Passo 1: Instalar Dependências

```bash
npm install
```

#### Passo 2: Configurar Variáveis de Ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas chaves de API.

#### Passo 3: Rodar em Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em http://localhost:3000

#### Outros Comandos

**Build para produção:**
```bash
npm run build
npm start
```

**Verificar erros de linting:**
```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   └── app/
│       ├── components/          # Componentes React reutilizáveis
│       │   ├── EventMap.js     # Mapa do Google
│       │   └── WeatherWidget.js # Widget de clima
│       ├── dashboard/           # Páginas do dashboard do anfitrião
│       │   └── page.js
│       ├── invite/[slug]/       # Página pública do convite
│       │   └── page.js
│       ├── login/               # Página de login
│       │   └── page.js
│       ├── rsvp/[slug]/        # Página de gerenciamento de RSVP
│       │   └── page.js
│       ├── signup/              # Página de cadastro
│       │   └── page.js
│       ├── layout.js            # Layout principal
│       └── page.js              # Página inicial
├── public/                      # Arquivos estáticos
├── docker-compose.yml           # Configuração Docker Compose
├── Dockerfile                   # Dockerfile do frontend
├── .env.local.example           # Template de variáveis de ambiente
├── .env.local                   # Variáveis de ambiente (não versionado)
├── package.json                 # Dependências npm
└── README.md                    # Este arquivo
```

## 🔑 Variáveis de Ambiente

### NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

Chave de API do Google Maps para exibição de mapas.

**Como obter:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Ative a API "Maps JavaScript API"
4. Vá em "Credenciais" → "Criar credenciais" → "Chave de API"
5. Copie a chave gerada
6. (Opcional) Configure restrições de domínio para segurança

### NEXT_PUBLIC_API_URL

URL do backend da aplicação. Em desenvolvimento local, use `http://localhost:5000`.

**Importante:** Esta variável começa com `NEXT_PUBLIC_` porque é acessada no navegador (client-side).

### NEXT_PUBLIC_WEATHER_API_KEY

Chave de API do WeatherAPI.com para exibição de previsão do tempo nos convites.

**Como obter:**
1. Acesse [WeatherAPI.com](https://www.weatherapi.com/)
2. Crie uma conta gratuita (Free plan: 1 milhão de chamadas/mês)
3. Vá em "My Account" → "API Keys"
4. Copie a chave gerada
5. Cole no arquivo `.env.local`

**Limitações:** A versão gratuita fornece previsão de até 3 dias. Eventos com data superior a 3 dias no futuro não exibirão previsão do tempo.

## 🌐 APIs Externas

O sistema Venha integra-se com **4 APIs externas** para fornecer funcionalidades completas. Abaixo está a documentação detalhada de cada integração:

### 1. Google Maps JavaScript API

**URL:** https://developers.google.com/maps/documentation/javascript

**Propósito:** Exibição de mapas interativos nas páginas de convite e criação de eventos, permitindo que convidados visualizem a localização exata do evento.

**Licença/Custo:**
- Plano gratuito com crédito mensal de $200 USD
- Primeiras 28.000 carregamentos de mapa dinâmico/mês são gratuitos
- Cobrança baseada em uso acima do limite gratuito
- Licença: Proprietária (Google)

**Registro:**
1. Criar conta no [Google Cloud Console](https://console.cloud.google.com)
2. Criar ou selecionar um projeto
3. Ativar a API "Maps JavaScript API"
4. Criar credenciais (Chave de API)
5. (Recomendado) Configurar restrições de domínio/aplicativo

**Uso no Frontend:**
- Componente: [src/app/components/EventMap.js](src/app/components/EventMap.js)
- Biblioteca: `@react-google-maps/api`
- Funcionalidade: Renderização de mapa com marcador na localização do evento
- Páginas que utilizam: `/invite/[slug]` (página do convite), `/eventos/novo` (validação de endereço)

**Endpoints/Features utilizados:**
- Maps JavaScript API para renderização de mapas
- Marker API para posicionamento de marcadores

---

### 2. WeatherAPI

**URL:** https://www.weatherapi.com/

**Propósito:** Exibição de previsão do tempo na página do convite, mostrando as condições climáticas esperadas para a data do evento.

**Licença/Custo:**
- Plano gratuito: 1.000.000 chamadas/mês
- Previsão até 3 dias no futuro (plano gratuito)
- Planos pagos disponíveis para previsões mais longas
- Licença: Proprietária

**Registro:**
1. Acessar [WeatherAPI.com](https://www.weatherapi.com/)
2. Criar conta gratuita
3. Acessar "My Account" → "API Keys"
4. Copiar a chave gerada

**Uso no Frontend:**
- Componente: [src/app/components/WeatherWidget.js](src/app/components/WeatherWidget.js)
- Biblioteca: `axios` para requisições HTTP
- Funcionalidade: Exibir temperatura, condição climática e ícone do tempo
- Páginas que utilizam: `/invite/[slug]` (página do convite)

**Endpoints utilizados:**
- `GET /v1/forecast.json` - Previsão do tempo para uma data específica
  - Parâmetros: `key`, `q` (coordenadas lat,lon), `dt` (data do evento), `lang=pt`

**Limitações:**
- Apenas eventos com data até 3 dias no futuro exibirão previsão (limitação do plano gratuito)
- Requer coordenadas geográficas (obtidas via Google Geocoding no backend)

---

### 3. Google Geocoding API (via Backend)

**URL:** https://developers.google.com/maps/documentation/geocoding

**Propósito:** Conversão de endereços completos em coordenadas geográficas (latitude/longitude) para exibição em mapas e previsão do tempo.

**Licença/Custo:**
- Integrado ao mesmo plano do Google Maps
- Plano gratuito com crédito mensal de $200 USD
- Primeiras 40.000 requisições/mês são gratuitas
- Licença: Proprietária (Google)

**Registro:**
- Mesma configuração do Google Maps (mesma chave de API pode ser usada)
- Ativar "Geocoding API" no Google Cloud Console

**Uso:**
- **Backend:** Converte endereços em coordenadas ao criar eventos
- **Frontend:** Solicita geocoding em tempo real durante criação de evento para validação

**Endpoints utilizados (via Backend):**
- Backend expõe: `POST /api/events/geocode` que internamente chama Google Geocoding API
- Fallback: Usa Nominatim (OpenStreetMap) se Google Geocoding falhar

---

### 4. ViaCEP

**URL:** https://viacep.com.br/

**Propósito:** Busca automática de endereços brasileiros a partir do CEP, facilitando o preenchimento de formulários de evento.

**Licença/Custo:**
- API pública e completamente gratuita
- Sem necessidade de registro ou chave de API
- Sem limites de requisições documentados oficialmente
- Licença: Livre (domínio público)

**Registro:**
- Não requer registro ou autenticação

**Uso no Frontend:**
- Arquivos: [src/app/eventos/novo/page.js](src/app/eventos/novo/page.js), [src/app/eventos/[id]/editar/page.js](src/app/eventos/[id]/editar/page.js)
- Funcionalidade: Busca automática de endereço ao digitar CEP
- Chamada: **Direta do frontend** (não passa pelo backend)

**Endpoint externo utilizado:**
- `GET https://viacep.com.br/ws/{cep}/json/`
  - Retorna: `logradouro`, `complemento`, `bairro`, `localidade`, `uf`, `cep`

**Implementação:**
```javascript
const response = await axios.get(
  `https://viacep.com.br/ws/${cleanCep}/json/`
);
```

**Validação:**
- CEP deve ter exatamente 8 dígitos
- Aceita com ou sem hífen
- Exibe feedback em tempo real (incompleto/não encontrado/encontrado)

**Limitações:**
- Apenas CEPs brasileiros
- Alguns CEPs muito novos podem não estar disponíveis

---

## 📧 Notificações por Email (Melhoria Futura)

Atualmente, o sistema **simula** o envio de emails. Quando um convidado confirma, modifica ou cancela presença, o backend **imprime o email no console** ao invés de enviar de fato.

**Modo Atual (Simulação):**
- Emails são logados no console/Docker logs
- Anfitrião **não recebe** notificações reais por email
- Útil para desenvolvimento e testes sem configuração adicional

**Melhoria Futura - Integração SendGrid:**

Para habilitar envio real de emails em produção, o sistema está preparado para integração com SendGrid:

- **API:** [SendGrid Email API](https://sendgrid.com/)
- **Plano gratuito:** 100 emails/dia
- **Configuração:** Adicionar `SENDGRID_API_KEY` e `SENDER_EMAIL` no backend
- **Documentação completa:** Veja instruções no README do backend

---

## 🛠️ Configuração de Desenvolvimento

Para facilitar o desenvolvimento, o sistema possui comportamento gracioso quando APIs não estão configuradas:

- **Sem Google Maps:** Mapa não é exibido, restante da aplicação funciona normalmente
- **Sem WeatherAPI:** Widget de clima não é exibido no convite
- **Sem Google Geocoding:** Sistema usa Nominatim como fallback (backend)
- **ViaCEP:** API pública e gratuita, sempre disponível (não requer configuração)
- **Emails:** Sistema sempre usa modo simulação (logs no console)

## 🐳 Como Funciona o Docker

### Arquitetura

O `docker-compose.yml` orquestra dois containers:

1. **venha_backend** (Flask)
   - Porta: 5000
   - Imagem: Python 3.11
   - Volume: `../backend:/app` (código montado para edição em tempo real)

2. **venha_frontend** (Next.js)
   - Porta: 3000
   - Imagem: Node 20 Alpine
   - Volume: `.:/app` (código montado para edição em tempo real)

### Volumes

Os volumes permitem que você edite o código localmente e veja as mudanças refletidas nos containers automaticamente:

- **Frontend:** Hot reload do Next.js funciona normalmente
- **Backend:** Auto-reload do Flask detecta mudanças

### Rede

Os containers se comunicam através da rede `venha_network`:

- O frontend acessa o backend via `http://localhost:5000` (do ponto de vista do seu navegador)
- Internamente, os containers podem se comunicar pelos nomes dos serviços

## 🧪 Testando a Aplicação

### Fluxo Completo de Teste

1. **Criar uma conta:**
   - Acesse http://localhost:3000/signup
   - Preencha o formulário de cadastro
   - Faça login

2. **Criar um evento:**
   - No dashboard, clique em "Criar Novo Evento"
   - Preencha os detalhes do evento
   - Copie o link de convite gerado

3. **Confirmar presença como convidado:**
   - Abra o link de convite em uma aba anônima
   - Preencha o formulário de RSVP
   - Verifique o email do anfitrião (se SendGrid estiver configurado)

4. **Gerenciar confirmação:**
   - Use o mesmo WhatsApp para buscar sua confirmação
   - Modifique ou cancele a presença

## ⚠️ Solução de Problemas

### Erro: "Cannot connect to the Docker daemon"

Docker Desktop não está rodando. Inicie o Docker Desktop e aguarde a baleia ficar verde/estável.

### Erro: "Port 3000 is already in use"

Você tem o Next.js rodando localmente. Pare o servidor local antes de rodar o Docker:

```bash
lsof -ti:3000 | xargs kill -9
```

### Erro: "Network Error" ou CORS

O backend não está acessível. Verifique:
1. O container `venha_backend` está rodando: `docker ps`
2. Logs do backend: `docker logs venha_backend`
3. NEXT_PUBLIC_API_URL está correto em `.env.local`

### Mudanças no código não aparecem

**Frontend:**
- O Next.js pode demorar alguns segundos para recompilar
- Verifique os logs: `docker-compose logs -f frontend`
- Em último caso, reinicie: `docker restart venha_frontend`

**Backend:**
- Verifique se o Flask detectou a mudança nos logs
- Reinicie se necessário: `docker restart venha_backend`

### Google Maps não aparece

1. Verifique se `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` está configurado
2. Certifique-se de que a API do Google Maps está ativa no seu projeto
3. Verifique o console do navegador para erros
4. Reinicie o frontend após alterar `.env.local`

## 📝 Notas para Avaliadores

Este projeto foi desenvolvido como parte da Sprint de Arquitetura de Software da Pós-Graduação em Engenharia de Software da PUC-Rio.

### Para rodar o projeto completo:

1. Clone ambos os repositórios (backend e frontend) no mesmo diretório pai:
   ```
   projeto/
   ├── backend/
   └── frontend/
   ```

2. Configure os arquivos `.env`:
   - `backend/.env` (veja backend/README.md)
   - `frontend/.env.local` (veja acima)

3. A partir da pasta `frontend/`, rode:
   ```bash
   docker-compose up --build
   ```

4. Acesse http://localhost:3000

### Testando sem Google Maps:

O mapa é opcional. Se não configurar a chave do Google Maps, o evento simplesmente não exibirá o mapa (comportamento gracioso).

### Testando sem SendGrid:

O backend pode ser configurado para apenas imprimir emails no console. Veja instruções no README do backend.

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

## 👤 Autora

Fernanda Franco

PUC-Rio - Pós-Graduação em Engenharia de Software

Sprint de Arquitetura de Software - 2025
