# 📋 Plano de Implementação - Login Google com @react-oauth/google

## 🎯 **Objetivo**

Implementar autenticação via Google OAuth2 usando a biblioteca `@react-oauth/google` com controle de acesso por lista de e-mails autorizados, integrando automaticamente com Google Calendar para sincronização de dados financeiros.

## 🚀 **Por que @react-oauth/google?**

- ✅ **70% menos código** para implementar
- ✅ **Zero redirects** - tudo na mesma página
- ✅ **UX superior** - popup nativo do Google
- ✅ **Manutenção simplificada** - biblioteca oficial
- ✅ **Debugging mais fácil** - menos pontos de falha

## 🏗️ **Arquitetura da Solução SIMPLIFICADA**

### **Fluxo Completo**

```
1. User clica no componente GoogleLogin
2. Google popup abre (gerenciado pela lib)
3. User autoriza no Google (scopes: profile + calendar)
4. Lib retorna JWT token do Google
5. Frontend envia token para /auth/google-login
6. Backend valida token + verifica email permitido
7. Backend retorna JWT próprio + dados do usuário
8. Frontend salva token e redireciona para dashboard
```

---

## 📊 **Mudanças no Banco de Dados (Prisma)**

### **1. Atualizar Model User**

```prisma
model User {
  id               String    @id @default(uuid())
  email            String    @unique
  password         String?   // Opcional agora (Google users não têm senha)
  nome             String
  avatar           String?   // Foto do Google
  googleId         String?   @unique // ID único do Google
  isGoogleUser     Boolean   @default(false)

  // Tokens Google Calendar (criptografados)
  googleAccessToken  String?
  googleRefreshToken String?
  googleTokenExpiry  DateTime?

  // Configurações Calendar
  calendarSyncEnabled Boolean @default(true)
  lastCalendarSync    DateTime?

  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([googleId])
  @@index([email])
}
```

### **2. Criar Tabela de E-mails Permitidos**

```prisma
model AllowedEmail {
  id            String   @id @default(uuid())
  email         String   @unique
  adicionadoPor String   // Email do admin que adicionou
  ativo         Boolean  @default(true)
  createdAt     DateTime @default(now())

  @@index([email])
}
```

### **3. Migration Commands**

```bash
# Gerar migration
npx prisma migrate dev --name add-google-auth

# Aplicar mudanças
npx prisma generate
```

---

## ⚙️ **Configuração Backend**

### **1. Variáveis de Ambiente**

```env
# Google OAuth2 (apenas Client ID necessário para frontend)
GOOGLE_CLIENT_ID=seu_google_client_id

# Lista de emails permitidos (separados por vírgula)
ALLOWED_EMAILS=junior@gmail.com,vivi@gmail.com,familiar@email.com

# Chave para criptografia dos tokens Calendar
GOOGLE_TOKEN_ENCRYPTION_KEY=sua_chave_forte_32_caracteres
```

### **2. Dependências Necessárias**

#### **Frontend**

```json
{
  "dependencies": {
    "@react-oauth/google": "^0.12.1"
  }
}
```

#### **Backend**

```json
{
  "dependencies": {
    "google-auth-library": "^9.4.0",
    "googleapis": "^126.0.1",
    "crypto-js": "^4.2.0"
  }
}
```

### **3. Novos Endpoints na API (SIMPLIFICADOS)**

#### **3.1 Autenticação**

```typescript
// routes/auth.ts
POST / auth / google - login; // Login com token Google (ÚNICO endpoint necessário)
POST / auth / google / disconnect; // Desconectar conta Google
GET / auth / me; // Dados do usuário atual
```

#### **3.2 Gerenciamento de E-mails**

```typescript
// routes/admin.ts (protegido)
GET    /admin/allowed-emails     // Listar emails permitidos
POST   /admin/allowed-emails     // Adicionar email
DELETE /admin/allowed-emails/:id // Remover email
```

#### **3.3 Google Calendar**

```typescript
// routes/calendar.ts
GET / calendar / status; // Status da integração
POST / calendar / sync; // Forçar sincronização
GET / calendar / settings; // Configurações
PUT / calendar / settings; // Atualizar configurações
```

---

## 🔐 **Implementação da Autenticação SIMPLIFICADA**

### **1. Verificação de Token Google**

```typescript
// services/googleAuthService.ts
import { OAuth2Client } from "google-auth-library";

export class GoogleAuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new Error("Invalid token");

      return {
        googleId: payload.sub,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture,
      };
    } catch (error) {
      throw new Error("Token verification failed");
    }
  }
}
```

### **2. Service de Verificação de E-mail**

```typescript
// services/authService.ts
export class AuthService {
  private getAllowedEmails(): string[] {
    return process.env.ALLOWED_EMAILS?.split(",") || [];
  }

  async isEmailAllowed(email: string): Promise<boolean> {
    // 1. Verificar lista hardcoded (.env)
    const envAllowed = this.getAllowedEmails();
    if (envAllowed.includes(email)) return true;

    // 2. Verificar tabela do banco
    const allowedEmail = await prisma.allowedEmail.findFirst({
      where: { email, ativo: true },
    });

    return !!allowedEmail;
  }

  async createOrUpdateGoogleUser(googleData: any): Promise<User> {
    const { googleId, email, name, picture } = googleData;

    return await prisma.user.upsert({
      where: { email },
      update: {
        nome: name,
        avatar: picture,
        googleId,
        isGoogleUser: true,
        updatedAt: new Date(),
      },
      create: {
        email,
        nome: name,
        avatar: picture,
        googleId,
        isGoogleUser: true,
        calendarSyncEnabled: true,
      },
    });
  }
}
```

### **3. Controller SIMPLIFICADO**

```typescript
// controllers/authController.ts
export class AuthController {
  // POST /auth/google-login
  async googleLogin(req: Request, res: Response) {
    try {
      const { googleToken } = req.body;

      if (!googleToken) {
        return res.status(400).json({ error: "Google token required" });
      }

      // 1. Verificar token com Google
      const googleUser = await googleAuthService.verifyGoogleToken(googleToken);

      // 2. Verificar se email é permitido
      const isAllowed = await authService.isEmailAllowed(googleUser.email);
      if (!isAllowed) {
        return res.status(403).json({
          error: "Email não autorizado",
          message: "Entre em contato com o administrador para solicitar acesso",
        });
      }

      // 3. Criar/atualizar usuário
      const user = await authService.createOrUpdateGoogleUser(googleUser);

      // 4. Gerar JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

      // 5. Retornar dados
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
```

---

## 🎨 **Mudanças no Frontend**

### **1. Setup da Biblioteca**

```typescript
// main.tsx - Configurar GoogleOAuthProvider
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router />
    </GoogleOAuthProvider>
  );
}
```

### **2. Variáveis de Ambiente Frontend**

```env
# .env
VITE_GOOGLE_CLIENT_ID=seu_google_client_id
```

### **3. Novas Telas (REDUZIDAS)**

```
src/presentation/pages/
└── Settings/
    └── GoogleCalendar/     // Configurações do Calendar
```

### **4. Novos Use Cases (Domain) - SIMPLIFICADOS**

```typescript
// domain/usecases/auth/
export interface LoginWithGoogleUseCase {
  login: (googleToken: string) => Promise<LoginWithGoogleModel>;
}

export type LoginWithGoogleModel = {
  token: string;
  user: {
    id: string;
    email: string;
    nome: string;
    avatar?: string;
  };
};

export type LoginWithGoogleParams = {
  googleToken: string;
};

// domain/models/
export interface GoogleAuthStatus {
  isConnected: boolean;
  userEmail?: string;
  calendarSyncEnabled?: boolean;
  lastSync?: string;
}
```

### **5. Componente de Login SIMPLIFICADO**

```typescript
// presentation/components/GoogleLoginButton.tsx
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useLoginWithGoogle } from '@/presentation/hooks/api';

export const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: loginWithGoogle, isPending } = useLoginWithGoogle();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const result = await loginWithGoogle({
        googleToken: credentialResponse.credential!
      });

      // Salvar token e dados do usuário
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('Email não autorizado. Entre em contato com o administrador.');
      } else {
        alert('Erro no login. Tente novamente.');
      }
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      theme="outline"
      size="large"
      text="signin_with"
      shape="rectangular"
      logo_alignment="left"
    />
  );
};
```

### **6. Hook React Query**

```typescript
// presentation/hooks/api/auth/useLoginWithGoogle.ts
import { useMutation } from "@tanstack/react-query";
import { makeLoginWithGoogleFactory } from "@/main/factories/usecases";

export const useLoginWithGoogle = () => {
  const loginWithGoogle = makeLoginWithGoogleFactory();

  return useMutation({
    mutationFn: (params: { googleToken: string }) =>
      loginWithGoogle.login(params.googleToken),
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });
};
```

### **7. Tela de Login Atualizada**

```typescript
// presentation/pages/Login/Login.tsx
import { Box, Divider } from '@rarui-react/components';
import { GoogleLoginButton } from '@/presentation/components';

export const Login: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" gap="$md" padding="$lg">
      <h1>Entrar no Sistema</h1>

      {/* Login Google - Prioridade */}
      <GoogleLoginButton />

      <Divider>ou</Divider>

      {/* Login tradicional */}
      <LoginForm />
    </Box>
  );
};
```

---

## 🔄 **Integração Google Calendar**

### **1. Service de Sincronização**

```typescript
// services/googleCalendarService.ts
export class GoogleCalendarService {
  async syncCalendar(userId: string): Promise<void> {
    const user = await this.getUserWithTokens(userId);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Buscar dados do calendário financeiro atual
    const calendarData = await this.getFinancialCalendarData(user.id);

    // Sincronizar cada dia do mês
    for (const dia of calendarData.diasDoMes) {
      if (dia.transacoes.length > 0) {
        await this.createOrUpdateCalendarEvent(calendar, dia);
      }
    }

    // Atualizar última sincronização
    await prisma.user.update({
      where: { id: userId },
      data: { lastCalendarSync: new Date() },
    });
  }

  private async createOrUpdateCalendarEvent(calendar: any, dia: DiaCalendario) {
    const eventData = {
      summary: `💰 Finanças - ${dia.data} - R$ ${dia.totalDespesas / 100}`,
      description: this.buildEventDescription(dia),
      start: { date: dia.data },
      end: { date: dia.data },
      extendedProperties: {
        private: {
          source: "financas-system",
          systemDayId: dia.data,
        },
      },
    };

    // Verificar se evento já existe
    const existingEvent = await this.findExistingEvent(calendar, dia.data);

    if (existingEvent) {
      await calendar.events.update({
        calendarId: "primary",
        eventId: existingEvent.id,
        resource: eventData,
      });
    } else {
      await calendar.events.insert({
        calendarId: "primary",
        resource: eventData,
      });
    }
  }
}
```

---

## 📅 **Cronograma de Implementação OTIMIZADO**

### **Semana 1: Setup e Backend SIMPLIFICADO**

- [x] Configurar Google Cloud Console (apenas Client ID)
- [x] Atualizar schema Prisma e executar migrations
- [x] Implementar endpoint `/auth/google-login`
- [x] Implementar verificação de e-mails permitidos
- [x] Instalar `google-auth-library` no backend

### **Semana 2: Frontend SIMPLIFICADO**

- [x] Instalar `@react-oauth/google`
- [x] Configurar GoogleOAuthProvider no App
- [x] Criar componente GoogleLoginButton
- [x] Atualizar tela de Login
- [x] Criar use cases de autenticação Google
- [x] Testar fluxo completo de login (SEM redirects!)

### **Semana 3: Google Calendar**

- [ ] Implementar service de sincronização
- [ ] Criar endpoints de Calendar
- [ ] Adicionar configurações no frontend
- [ ] Implementar sincronização automática
- [ ] Testes de integração Calendar

### **Semana 4: Finalização**

- [ ] Testes end-to-end completos
- [ ] Documentação da API
- [ ] Deploy e configuração produção
- [ ] Monitoring e logs

---

## ✅ **Lista de E-mails Inicial**

```env
# Configurar no .env do backend
ALLOWED_EMAILS=junior@gmail.com,vivi@gmail.com
```

## 🔑 **Configuração Google Cloud Console SIMPLIFICADA**

### **Passos Iniciais:**

1. Acessar [Google Cloud Console](https://console.cloud.google.com)
2. Criar novo projeto ou selecionar existente
3. Habilitar APIs:
   - Google Calendar API
4. Configurar OAuth2 Credentials:
   - Tipo: Web Application
   - **JavaScript origins**: `http://localhost:5173` (não precisa de redirect URI!)
5. Configurar OAuth consent screen
6. Obter **apenas Client ID** (não precisa de Client Secret!)

### **Escopos Necessários:**

```javascript
["openid", "profile", "email", "https://www.googleapis.com/auth/calendar"];
```

---

## 💾 **Scripts de Configuração**

### **1. Script de População Inicial**

```typescript
// scripts/setup-allowed-emails.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setupAllowedEmails() {
  const emails = process.env.ALLOWED_EMAILS?.split(",") || [];

  for (const email of emails) {
    await prisma.allowedEmail.upsert({
      where: { email: email.trim() },
      update: {},
      create: {
        email: email.trim(),
        adicionadoPor: "system",
        ativo: true,
      },
    });
  }

  console.log(`✅ ${emails.length} emails configurados`);
}

setupAllowedEmails()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### **2. Script de Teste**

```bash
# package.json scripts
{
  "scripts": {
    "setup:emails": "tsx scripts/setup-allowed-emails.ts",
    "dev:frontend": "npm run dev",
    "dev:backend": "npm run start:dev"
  }
}
```

---

## 🔍 **Monitoring e Logs**

### **Eventos para Log:**

- ✅ Login Google bem-sucedido
- ❌ Tentativa de login com email não autorizado
- 🔄 Sincronizações do Calendar
- 🔑 Renovação de tokens
- ⚠️ Erros de API Google

### **Métricas para Acompanhar:**

- Número de logins Google por dia
- Taxa de rejeição (emails não autorizados)
- Frequência de sincronização Calendar
- Tempo de resposta das APIs Google

---

## 🎯 **Benefícios da Solução SIMPLIFICADA**

- ✅ **UX Superior**: Popup nativo, sem redirects
- ✅ **70% menos código**: Apenas 1 endpoint de auth
- ✅ **Manutenção fácil**: Biblioteca oficial Google
- ✅ **Debug simples**: Menos pontos de falha
- ✅ **Segurança**: OAuth2 + controle de acesso
- ✅ **Calendar Automático**: Sincronização transparente
- ✅ **Custo Zero**: Dentro das cotas gratuitas

---

## 🚨 **Considerações de Segurança**

### **Dados Sensíveis:**

- Tokens Google sempre criptografados
- ID tokens validados no servidor
- Logs não devem conter tokens

### **Rate Limiting:**

- Implementar limite de tentativas de login
- Respeitar rate limits da API Google
- Cache para reduzir chamadas desnecessárias

### **Backup:**

- Backup regular dos dados de usuário
- Plano de recuperação em caso de perda de acesso
- Documentar processo de revogação manual

---
