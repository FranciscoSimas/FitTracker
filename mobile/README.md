# 📱 FitTracker Mobile

**FitTracker Mobile** é a aplicação móvel nativa do FitTracker, construída com Flutter para iOS e Android.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Autenticação** - Login com Google OAuth
- **Navegação** - Bottom navigation com 4 seções principais
- **Design System** - Tema consistente com a web app
- **Estrutura Base** - Arquitetura limpa e escalável

### 🔄 Em Desenvolvimento
- **Planos de Treino** - Lista e gestão de planos
- **Treino Ativo** - Timer e tracking de exercícios
- **Exercícios** - Biblioteca de exercícios
- **Evolução** - Gráficos e estatísticas
- **Perfil** - Configurações do utilizador

## 🛠️ Tecnologias

- **Flutter** - Framework cross-platform
- **Riverpod** - State management
- **Go Router** - Navegação
- **Supabase** - Backend e autenticação
- **Google Fonts** - Tipografia
- **FL Chart** - Gráficos e visualizações

## 📁 Estrutura do Projeto

```
lib/
├── core/
│   ├── constants/          # Constantes da app
│   ├── services/           # Serviços (Supabase, etc.)
│   ├── theme/              # Tema e cores
│   └── router/             # Configuração de rotas
├── features/
│   ├── auth/               # Autenticação
│   ├── workouts/           # Planos de treino
│   ├── exercises/          # Exercícios
│   ├── evolution/          # Evolução e gráficos
│   └── profile/            # Perfil do utilizador
├── shared/
│   ├── presentation/       # Layouts e widgets compartilhados
│   ├── widgets/            # Componentes reutilizáveis
│   └── models/             # Modelos de dados
└── main.dart              # Entry point
```

## 🚀 Setup e Instalação

### Pré-requisitos
- Flutter SDK (>=3.10.0)
- Dart SDK (>=3.0.0)
- Android Studio / Xcode
- Conta Google para OAuth

### Instalação
1. **Clone o repositório**
2. **Instale dependências:**
   ```bash
   flutter pub get
   ```
3. **Configure Supabase:**
   - Atualize `lib/core/constants/app_constants.dart`
   - Adicione URL e chave do Supabase
4. **Execute a app:**
   ```bash
   flutter run
   ```

## 🔧 Configuração

### Supabase
Atualize as constantes em `lib/core/constants/app_constants.dart`:
```dart
static const String supabaseUrl = 'https://your-project.supabase.co';
static const String supabaseAnonKey = 'your-anon-key';
```

### Google OAuth
1. Configure OAuth no Google Cloud Console
2. Adicione package name e SHA-1 fingerprint
3. Configure redirect URIs

## 📱 Screenshots

*Screenshots serão adicionadas quando as funcionalidades estiverem implementadas*

## 🎨 Design System

### Cores
- **Primary:** #3B82F6 (Blue)
- **Secondary:** #8B5CF6 (Purple)
- **Success:** #10B981 (Green)
- **Warning:** #F59E0B (Yellow)
- **Error:** #EF4444 (Red)

### Tipografia
- **Font:** Inter
- **Weights:** Regular, Medium, SemiBold, Bold

## 🔄 Estado do Desenvolvimento

### FASE 1 - Setup Base ✅
- [x] Estrutura do projeto
- [x] Configuração Flutter
- [x] Integração Supabase
- [x] Design system
- [x] Navegação base
- [x] Autenticação Google

### FASE 2 - Core Features 🔄
- [ ] Planos de treino
- [ ] Treino ativo
- [ ] Exercícios
- [ ] Evolução
- [ ] Perfil

### FASE 3 - Polish 📋
- [ ] Animações
- [ ] Performance
- [ ] Testes
- [ ] Deploy

## 🤝 Contribuição

Este projeto está em desenvolvimento ativo. Para contribuir:

1. Fork o repositório
2. Crie uma branch para a feature
3. Commit as mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e está em desenvolvimento.

## 📞 Suporte

Para suporte ou questões, contacte o desenvolvedor principal.

---

**Desenvolvido com ❤️ usando Flutter**


