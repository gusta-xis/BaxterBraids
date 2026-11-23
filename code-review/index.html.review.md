# Revisão de `index.html`

O arquivo inteiro está na linha 1. A tabela abaixo separa os elementos lógicos.

| Elemento | Função | Revisão |
|---|---|---|
| `<!doctype html>` | Ativa HTML moderno. | Correto. |
| `<html lang="pt-BR">` | Define português brasileiro para leitores de tela e buscadores. | Correto. |
| `charset="UTF-8"` | Permite acentos e símbolos. | Correto. |
| `viewport` | Faz o CSS usar a largura real do aparelho. | Essencial; correto. |
| `theme-color` | Define preto para interface do navegador em dispositivos compatíveis. | Coerente com a marca. |
| `description` | Resumo básico para SEO. | Bom começo, mas genérico e sem localização/serviço específico. |
| `icon` e `shortcut icon` | Carregam `/favicon.svg`. | Redundância intencional para compatibilidade. |
| `<title>` | Nome exibido na aba. | Correto, mas poderia incluir cidade/região se SEO local for prioridade. |
| `<div id="root">` | Ponto onde o React monta a aplicação. | Correto. |
| script `/src/main.tsx` | Entrada do Vite em desenvolvimento e build. | Correto. |

## Problema de manutenção

Tudo está em uma linha. O navegador não se importa, mas revisões e diffs ficam piores. Formatar o HTML não altera o resultado e melhoraria manutenção.

## SEO ausente

- Open Graph para compartilhamento.
- Twitter Card.
- URL canônica.
- imagem social.
- dados estruturados de negócio local.

Esses itens só devem ser adicionados quando domínio, localização e imagem oficial estiverem definidos.
