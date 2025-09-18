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
3. O sistema estará pronto para uso com múltiplos utilizadores
