# Página Confirmação

**Código:** `src/App.tsx:25`  
**Rota:** `/confirmacao/:id`

## Fluxo lógico dentro da linha 25

1. Busca serviço pelo ID ou usa o primeiro.
2. Lê `location.state`.
3. Declara apenas `day` e `time` no tipo lido.
4. Monta texto codificado para WhatsApp.
5. Renderiza Header e check visual.
6. Mostra resumo.
7. Abre `wa.me` com mensagem.
8. Oferece retorno para Home.

## Problemas críticos

1. O tipo elimina `notes`, apesar de a tela anterior enviar esse campo.
2. A mensagem não inclui observação.
3. Acesso direto ou reload usa dia 20 e 14:00 sem avisar.
4. O fallback de serviço também mascara ID inválido.
5. “Solicitação pronta” é adequado; ela só é realmente transmitida quando a pessoa clica no WhatsApp.

## Comportamento externo

O link `wa.me` sai da aplicação. O sistema não sabe se a mensagem foi enviada, recebida ou confirmada. Portanto, não deve registrar conversão como agendamento concluído apenas pela visita a esta página.

## Recomendação mínima

- Persistir uma estrutura completa da solicitação.
- Se faltar estado, voltar para a seleção com aviso.
- Incluir observação na mensagem.
- Usar data completa formatada.
- Abrir WhatsApp em nova aba se a intenção for preservar o site.

## Testes recomendados

- Mensagem com caracteres acentuados.
- Observação longa.
- Número de WhatsApp presente e ausente.
- Reload e link direto.
- ID inválido.
