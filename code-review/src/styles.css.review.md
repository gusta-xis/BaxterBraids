# Revisão de `src/styles.css`

## Estrutura real

O arquivo possui duas camadas:

1. linhas 1–5: base antiga altamente minificada, incluindo quase todo o desktop e breakpoints;
2. linhas 7–158: tokens do design, correções de marca e endurecimento mobile.

Essa estratégia preservou o visual durante as alterações, mas acumulou sobrescritas. O navegador resolve pela cascata; o desenvolvedor precisa reconstruir mentalmente qual regra vence.

## Linhas 1–4 — base minificada

### Linha 1

Contém reset, tokens antigos, container, header, botões, hero, marquee, cards, Sobre, processo, CTA, footer, catálogo, detalhes, solicitação e confirmação. É funcional, porém inadequado para revisão e manutenção.

Principais grupos presentes:

- globais: `:root`, `*`, `html`, `body`, links e controles;
- layout: `.wrap`, `.header`, `.hero`, grids e footer;
- componentes: `.button`, `.service-card`, `.summary`, `.round`;
- páginas: `.catalog`, `.detail`, `.schedule`, `.confirmation`;
- estados: hover, active, favorito e seleções.

### Linha 2

Define ajustes até `1000px`. Reduz hero, cards e converte algumas grades, mas ainda mantém layouts de duas colunas.

### Linha 3

Define ajustes até `680px`. Antes do endurecimento posterior, várias seções continuavam com regras desktop e causavam sensação de zoom/overflow.

### Linha 4

Importa fontes do Google Fonts. Import dentro do CSS pode atrasar descoberta da fonte; `<link rel="preconnect">` e `<link>` no HTML seriam mais controláveis. Também cria dependência externa e possível impacto de privacidade/disponibilidade.

### Linha 5

Desativa animações e transições para `prefers-reduced-motion`. É uma decisão correta de acessibilidade.

## Linhas 7–54 — tokens

- 9–23: cores de canvas, superfícies, destaque, texto e borda.
- 24–32: escala de espaçamento.
- 33–38: escala de raios.
- 39–44: durações de animação.
- 45–53: aliases para compatibilidade com a base antiga.

Ponto positivo: centraliza valores oficiais. Ponto negativo: a base ainda contém vários valores literais que não usam os tokens.

## Linhas 55–75 — normalização visual

- 55–61 aplicam cores e estados dos botões.
- 62 e 69–71 controlam o marquee contínuo.
- 63–68 unificam raios, cores secundárias e duração de imagem.
- 72–75 ajustam footer, ícones sociais e cabeçalho de seção.

### Erro sutil

Na linha 58, `.header nav a:after,.eyebrow{color:...}` define `color` no pseudo-elemento, mas a linha base usa `background` para o sublinhado. A cor do sublinhado continua vindo da regra base; a primeira parte dessa sobrescrita não produz o efeito esperado.

## Linhas 77–87 — marca e navegação

- 78–79 dimensionam texto e máscara da marca.
- 80–81 incluem assinatura horizontal no footer.
- 82 torna o selo oliva.
- 83 adapta marca e assinatura no mobile.
- 84 fixa a navbar em todas as páginas.
- 85–87 afastam a seta do título na solicitação.

## Linhas 89–158 — responsividade reforçada

- 90 limita imagens globalmente.
- 91 cria margem para âncoras sob navbar fixa.
- 92–146 tratam telas até 680px.
- 147–158 tratam telas muito estreitas, até 360px.

### Grupos mobile

| Linhas | Área | Resultado |
|---|---|---|
| 93–103 | viewport, header e hero | Impede largura excedente e escala títulos/CTAs. |
| 104–106 | cards | Duas colunas seguras e quebra de nomes. |
| 107–111 | Sobre | Converte para uma coluna e reorganiza benefícios. |
| 112–116 | Processo e CTA | Processo vira coluna; imagem deixa de bloquear interação. |
| 117–121 | Footer e catálogo | Ajusta largura, redes, assinatura e metadados. |
| 122–131 | Detalhes | Converte split desktop em fluxo vertical. |
| 132–141 | Solicitação | Remove seta absoluta, cria grades fluidas e reduz textarea. |
| 142–145 | Confirmação | Centraliza verticalmente e limita largura. |
| 147–158 | até 360px | Uma coluna de cards/benefícios e métricas. |

## Riscos

1. `overflow-x:hidden` evita rolagem global, mas pode esconder regressões futuras. A revisão visual atual confirmou largura igual à viewport.
2. Regras duplicadas de `@media(max-width:680px)` dificultam saber qual vence.
3. Hover e transições não distinguem dispositivos sem hover.
4. Não existem estados claros de foco com `:focus-visible` para teclado.
5. CSS global aumenta chance de colisão de nomes.

## Refatoração recomendada

1. Formatar e desminificar a base.
2. Mesclar cada seletor com sua regra final, eliminando sobrescritas.
3. Separar tokens, globais, componentes e páginas.
4. Adicionar `:focus-visible` consistente.
5. Usar `@media (hover:hover)` para efeitos exclusivos de mouse.
6. Considerar CSS Modules ou convenção de nomes se o projeto crescer.
