# FitTracker Monorepo

Este é um monorepo que contém tanto a versão web quanto a versão mobile do FitTracker.

## Estrutura

```
FitTracker/
├── apps/
│   ├── web/          # Versão web (React + Vite)
│   └── mobile/       # Versão mobile (React Native + Expo)
├── packages/
│   ├── shared/       # Código compartilhado (dados, utils)
│   └── ui/          # Componentes UI compartilhados
└── turbo.json       # Configuração do Turborepo
```

## Pré-requisitos

1. **Node.js** (versão 18 ou superior)
2. **npm** ou **yarn**
3. **Expo CLI** (para desenvolvimento mobile)

## Instalação

### 1. Instalar Node.js
- Baixar de: https://nodejs.org/
- Versão recomendada: 18.x ou superior

### 2. Instalar dependências
```bash
npm install
```

### 3. Instalar Expo CLI (para mobile)
```bash
npm install -g @expo/cli
```

## Desenvolvimento

### Web App
```bash
npm run dev --workspace=@fittracker/web
```

### Mobile App
```bash
npm run dev --workspace=@fittracker/mobile
```

### Ambos simultaneamente
```bash
npm run dev
```

## Build

### Web App
```bash
npm run build --workspace=@fittracker/web
```

### Mobile App
```bash
npm run build --workspace=@fittracker/mobile
```

## Testes Mobile

1. Instalar **Expo Go** no telemóvel
2. Executar `npm run dev --workspace=@fittracker/mobile`
3. Escanear QR code com Expo Go

## Deploy

### Web (Vercel)
- A app web continua a ser deployada no Vercel
- Configuração automática via GitHub

### Mobile (App Stores)
- iOS: Apple App Store
- Android: Google Play Store
- Usar EAS Build para builds nativas

## Código Compartilhado

- **@fittracker/shared**: Dados, utils, lógica de negócio
- **@fittracker/ui**: Componentes UI reutilizáveis

## Próximos Passos

1. ✅ Setup monorepo
2. 🔄 Migrar app web para apps/web
3. 🔄 Criar app mobile com Expo
4. 🔄 Implementar código compartilhado
5. 🔄 Testes e otimizações
