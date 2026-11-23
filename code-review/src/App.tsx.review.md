# Revisão de `src/App.tsx`

## Visão geral

O arquivo concentra toda a interface e o roteamento. São apenas 29 linhas físicas, mas muitas linhas contêm componentes completos. A densidade reduz legibilidade, dificulta diffs e torna testes isolados praticamente inexistentes.

## Revisão linha a linha

| Linha | Responsabilidade | Avaliação |
|---|---|---|
| 1 | Importa estado, memoização e efeito do React. | Todos são usados. |
| 2 | Importa animações, presença e progresso do Framer Motion. | Usado em cards, transições e barra de progresso. A biblioteca adiciona peso ao bundle. |
| 3 | Importa ícones Lucide. | Todos aparecem no JSX; ícones em botões deveriam receber rótulos acessíveis no botão. |
| 4 | Importa Router, hooks e componentes de rota. | Base da navegação SPA. |
| 5 | Importa catálogo, moeda e tipo `Service`. | Mistura dado estático e apresentação de preço. |
| 6 | Linha em branco. | Separação visual. |
| 7 | Lê `VITE_WHATSAPP_NUMBER` e remove caracteres não numéricos. | Boa normalização. Por ser `VITE_`, o valor é público. |
| 8 | Monta `wa.me`; sem número, usa a raiz do WhatsApp. | Fallback evita URL inválida, mas não alerta configuração ausente. |
| 9 | Define `Brand`. | Reutilizável e simples. O símbolo é decorativo corretamente. |
| 10 | Define navbar e CTA móvel. | Links com hash dependem de `ScrollToTop`. A navbar não indica rota ativa. |
| 11 | Define botão baseado em `Link`. | Só aceita rotas internas; não serve para ações ou links externos sem duplicação. |
| 12 | Define animação `Reveal`. | `once: true` evita animações repetidas. Respeito a reduced motion vem do CSS. |
| 13 | Define card de serviço. | Estrutura correta; falta `loading="lazy"` nas imagens. Hover não agrega em touchscreen. |
| 14 | Inicia `Home`. | Abertura de fragmento, header e conteúdo principal. |
| 15 | Hero, texto, CTAs e ilustração. | Conteúdo forte; a imagem é grande e carregada imediatamente. |
| 16 | Marquee repetido quatro vezes. | Repetição viabiliza loop; duplicatas estão escondidas de tecnologia assistiva. |
| 17 | Destaques com os quatro primeiros serviços. | Ordem é fixa e depende do array, sem campo `featured`. |
| 18 | Seção Sobre, selo e benefícios. | Boa semântica geral. Ícones decorativos não têm `aria-hidden` explícito. |
| 19 | Processo de três etapas gerado por array inline. | Conteúdo deveria ser dado nomeado fora do JSX para facilitar tradução/manutenção. |
| 20 | CTA final. | Imagem usa `alt=""`, adequado por ser decorativa. |
| 21 | Fecha Home e adiciona Footer. | Correto. |
| 22 | Define catálogo, busca, filtros, contagem e grid. | Funciona, mas linha excessivamente complexa; filtro é textual e sensível às categorias derivadas. “Ordenar” é apenas texto, não funcionalidade. |
| 23 | Define detalhe, favorito local e CTA. | ID inválido cai em `services[11]`; isso mascara erro. Favorito desaparece ao sair/recarregar. Texto lead é igual para todo serviço. |
| 24 | Define seleção de data, horário e observação. | Datas e horários são fixos; não representam calendário ou disponibilidade real. Estado não é persistido. |
| 25 | Define confirmação e mensagem do WhatsApp. | `notes` não é incluído na mensagem. Abrir/recarregar diretamente usa valores fictícios padrão. |
| 26 | Define Footer e redes sociais. | Instagram abre nova aba com proteção. WhatsApp abre na mesma aba e poderia usar `target="_blank"`. |
| 27 | Controla topo ou âncora após mudança de rota. | `requestAnimationFrame` aguarda render básico; imagens/layout tardio ainda podem deslocar a âncora. |
| 28 | Define progresso e todas as rotas. | Falta rota curinga `*` para página 404. URLs ainda usam `/agendar` apesar da linguagem visual de “solicitação”. |
| 29 | Exporta App. | Correto. |

## Componentes compartilhados

### `Brand` — linha 9

- Texto funciona como link para Home.
- O símbolo vem de uma máscara CSS, permitindo cor controlada pelo tema.
- O `span` vazio está corretamente oculto com `aria-hidden`.

### `Header` — linha 10

- Está presente em todas as páginas.
- Fica fixo por CSS.
- Em mobile, a navegação completa some e sobra o CTA “Estilos”.
- Não existe menu móvel para Sobre e Contato.
- Não há `aria-label` na navegação nem estado `aria-current`.

### `Button` — linha 11

- Centraliza o visual das CTAs internas.
- O nome “Button” é enganoso porque sempre renderiza um link.
- Uma API futura poderia aceitar `href`, `onClick` ou variantes semânticas.

### `Reveal` — linha 12

- Bom encapsulamento de animação.
- O valor `amount: .18` significa que 18% do elemento precisa entrar na viewport.
- Conteúdo continua no DOM mesmo antes da animação, o que é positivo para acessibilidade/SEO do HTML renderizado no cliente.

### `ServiceCard` — linha 13

- O índice visual é derivado da posição filtrada, não de uma identidade permanente.
- Ao filtrar, os números mudam.
- `AnimatePresence` no pai não produz animação de saída porque o card não declara `exit`.

## Estado e dados

- `Catalog`: `q` e `filter` são locais e se perdem ao navegar.
- `Detail`: `fav` é apenas visual.
- `Schedule`: `day`, `time` e `notes` são locais.
- `Confirmation`: recebe parte do estado pela navegação; `notes` é descartado.

## Falhas funcionais concretas

1. A observação digitada nunca chega ao WhatsApp.
2. A tela chama horários de “disponíveis” sem fonte de disponibilidade.
3. Os dias não possuem mês, ano nem data real.
4. Recarregar a confirmação troca silenciosamente a seleção por valores padrão.
5. IDs inválidos retornam serviços arbitrários.
6. Não existe 404.
7. “Ordenar: destaques” não ordena nada.

## Refatoração mínima recomendada

1. Formatar o arquivo.
2. Extrair cada página.
3. Criar `getServiceById` que retorne `undefined`.
4. Criar uma página NotFound.
5. Modelar `ScheduleRequest` com data ISO, horário, observação e serviço.
6. Incluir observação na mensagem.
7. Renomear rota `/agendar` para `/solicitar`, mantendo redirect da rota antiga.
