# Database Schema

Esta pasta contém os ficheiros SQL essenciais para a base de dados do FitTracker.

## Ficheiros

### `supabase-schema.sql`
- Schema inicial da base de dados
- Contém as tabelas principais: `exercises`, `workout_plans`, `workouts`, `workout_exercises`
- Use para instalações novas

### `supabase-migration-force.sql`
- **MIGRAÇÃO PRINCIPAL** - Execute este ficheiro para aplicar o sistema normalizado
- Migra de sistema com `user_id` nas tabelas principais para sistema com tabelas de referência
- Cria tabelas `user_exercises` e `user_workout_plans`
- Configura RLS (Row Level Security) adequadamente
- **IMPORTANTE**: Execute este script no Supabase SQL Editor para migrar sistemas existentes

## Sistema Normalizado

O sistema usa uma arquitetura normalizada onde:

- **Tabelas principais**: `exercises`, `workout_plans` (sem `user_id`)
- **Tabelas de referência**: `user_exercises`, `user_workout_plans` (ligam users aos dados)
- **Vantagens**: 
  - Dados únicos na base de dados
  - Referências leves por utilizador
  - Melhor performance e organização

## Como usar

### Para instalações novas:
1. Execute `supabase-schema.sql` para criar o schema inicial
2. O sistema estará pronto para uso

### Para migrar sistemas existentes:
1. Execute `supabase-migration-force.sql` para aplicar o sistema normalizado
2. O sistema estará migrado e pronto para uso
