# Página Solicitação de horário

**Código:** `src/App.tsx:24`  
**Rota atual:** `/agendar/:id`

## Fluxo lógico dentro da linha 24

1. Lê o serviço da URL.
2. Usa o primeiro serviço como fallback.
3. Inicializa dia em `20`.
4. Inicializa horário em `14:00`.
5. Inicializa observação vazia.
6. Exibe cinco números de dia fixos: 18–22.
7. Exibe quatro horários fixos.
8. Mostra resumo do serviço.
9. Coleta observação.
10. Navega para confirmação levando `{day,time,notes}` em memória.

## Problema central

Esta tela não conhece disponibilidade. O texto “Horários disponíveis” é uma afirmação que o sistema não consegue provar. No máximo, são opções de preferência.

## Falhas de dados

- Dia não contém mês nem ano.
- Dias da semana são fixos e podem não corresponder ao calendário.
- Datas podem estar no passado.
- Fuso horário não existe.
- Horários não são bloqueados quando outra pessoa solicita.
- Observação é coletada, mas descartada na confirmação.
- Recarregar apaga tudo.

## Decisão necessária

### Opção simples

Chamar os campos de “data preferida” e “horário preferido”, gerar datas reais dos próximos dias e deixar claro que a profissional confirma.

### Opção de agenda real

Adicionar backend/banco, horários de trabalho, exceções, timezone, reservas temporárias, prevenção de conflito e painel administrativo.

## Acessibilidade

- Grupos de datas/horários deveriam usar rótulo de grupo.
- Seleções deveriam expor `aria-pressed`.
- Botão voltar precisa de nome acessível.
- Textarea precisa de label programático, não apenas título visual separado.

## Testes recomendados

- Todos os dias e horários.
- Observação vazia e longa.
- ID inválido.
- Mobile 320, 375, 390 e 430 px.
- Recarregamento e botão voltar.
