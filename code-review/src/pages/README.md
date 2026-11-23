# Revisão das páginas

As páginas não existem como arquivos separados no código atual. Todas estão em `src/App.tsx`. Esta pasta documental as separa por responsabilidade para tornar o fluxo compreensível.

| Página | Rota | Linha principal |
|---|---|---|
| Home | `/` | `App.tsx:14–21` |
| Catálogo | `/catalogo` | `App.tsx:22` |
| Detalhe | `/estilo/:id` | `App.tsx:23` |
| Solicitação | `/agendar/:id` | `App.tsx:24` |
| Confirmação | `/confirmacao/:id` | `App.tsx:25` |

## Fluxo principal

```text
Home
  → Catálogo
    → Detalhe do estilo
      → Escolha de data/horário
        → Revisão
          → WhatsApp
```

## Verdade operacional

O fluxo não realiza agendamento. Ele coleta uma preferência e prepara uma mensagem. A confirmação real acontece fora do sistema, no WhatsApp. Qualquer texto que sugira disponibilidade ou reserva automática precisa ser tratado com cuidado.
