# Database Schema & Migrations

Esta pasta contém os ficheiros SQL para a base de dados do FitTracker.

## Ficheiros

### `supabase-schema.sql`
- Schema inicial da base de dados
- Contém as tabelas principais: `exercises`, `workout_plans`, `workouts`, `workout_exercises`

### `supabase-migration-force.sql`
- **MIGRAÇÃO PRINCIPAL** - Execute este ficheiro para aplicar o sistema normalizado
- Migra de sistema com `user_id` nas tabelas principais para sistema com tabelas de referência
- Cria tabelas `user_exercises` e `user_workout_plans`
- Configura RLS (Row Level Security) adequadamente
- **IMPORTANTE**: Execute este script no Supabase SQL Editor

### `migrate-existing-data.sql`
- **VERIFICAÇÃO DE MIGRAÇÃO** - Execute este ficheiro para verificar o estado atual
- Mostra estatísticas das tabelas e referências existentes
- Identifica exercícios e planos sem referências de usuário
- **IMPORTANTE**: Execute APÓS o `supabase-migration-force.sql`

### `migrate-legacy-data.sql`
- **MIGRAÇÃO DE DADOS LEGADOS** - Execute APENAS se necessário
- Migra dados existentes que ainda têm colunas `user_id`
- Inclui verificações de segurança antes da migração
- **IMPORTANTE**: Execute APENAS se `migrate-existing-data.sql` mostrar dados órfãos

### `migrate-user-data.sql`
- **MIGRAÇÃO MANUAL DE DADOS** - Para migrar exercícios e planos específicos
- Permite migração manual de exercícios e planos para usuários específicos
- Inclui exemplos de comandos SQL para migração individual e em lote
- **IMPORTANTE**: Use quando precisar migrar dados específicos (ex: exercícios criados manualmente)

## Sistema Normalizado

O sistema usa uma arquitetura normalizada onde:

- **Tabelas principais**: `exercises`, `workout_plans` (sem `user_id`)
- **Tabelas de referência**: `user_exercises`, `user_workout_plans` (ligam users aos dados)
- **Vantagens**: 
  - Dados únicos na base de dados
  - Referências leves por utilizador
  - Melhor performance e organização

## Como usar

1. Execute `supabase-schema.sql` para criar o schema inicial
2. Execute `supabase-migration-force.sql` para aplicar o sistema normalizado
3. Execute `migrate-existing-data.sql` para verificar o estado da migração
4. Se necessário, execute `migrate-legacy-data.sql` para migrar dados órfãos
5. Se necessário, execute `migrate-user-data.sql` para migrar dados específicos
6. O sistema estará pronto para uso com múltiplos utilizadores

## Ordem de execução

**IMPORTANTE**: Execute os scripts nesta ordem exata:

1. `supabase-schema.sql` (se for uma instalação nova)
2. `supabase-migration-force.sql` (migração principal)
3. `migrate-existing-data.sql` (verificação do estado)
4. `migrate-legacy-data.sql` (APENAS se necessário)
5. `migrate-user-data.sql` (APENAS se necessário - para dados específicos)
