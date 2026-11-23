# Code review — Baxter Braids

## Objetivo

Esta pasta documenta o projeto sem alterar o comportamento da aplicação. A estrutura acompanha as áreas do repositório original e acrescenta uma seção específica para as páginas que hoje estão concentradas em `src/App.tsx`.

Os números de linha se referem ao código no commit em que esta revisão foi criada. Como vários arquivos foram compactados em uma única linha física, a análise também divide essas linhas em blocos lógicos. Uma revisão estritamente baseada apenas na quebra física atual esconderia complexidade em vez de explicá-la.

## Mapa

```text
code-review/
├── README.md                         visão geral e riscos
├── root-files.review.md              arquivos e configurações da raiz
├── index.html.review.md
├── package.json.review.md
├── tsconfig.json.review.md
├── vercel.json.review.md
├── src/
│   ├── README.md
│   ├── App.tsx.review.md
│   ├── data.ts.review.md
│   ├── main.tsx.review.md
│   ├── styles.css.review.md
│   ├── vite-env.d.ts.review.md
│   └── pages/
│       ├── README.md
│       ├── Home.review.md
│       ├── Catalog.review.md
│       ├── Detail.review.md
│       ├── Schedule.review.md
│       └── Confirmation.review.md
├── public/
│   ├── README.md
│   └── assets/README.md
└── docs/
    ├── README.md
    └── Jornada-do-Usuario.review.md
```

## Resumo executivo

O projeto é uma SPA React/Vite pequena, visualmente funcional e implantável na Vercel. O código compila, as rotas têm fallback de SPA e a responsividade foi validada entre 320 e 430 px. Isso não significa que o fluxo comercial esteja pronto como sistema de agenda.

### Problemas de prioridade alta

1. **Agenda fictícia:** datas `18–22` e horários são constantes em `App.tsx:24`. Não existe calendário, fuso horário, consulta de disponibilidade ou bloqueio de conflito.
2. **Confirmação não persistida:** a página final depende de `location.state`. Recarregar ou abrir a URL diretamente substitui os dados por `dia 20` e `14:00` (`App.tsx:25`).
3. **Fallbacks escondem erro:** um ID inexistente abre outro serviço em vez de mostrar “não encontrado” (`App.tsx:23–25`).
4. **Duração semanticamente errada:** em parte dos serviços, `duration` recebe `até 1 mês e meio`, que descreve durabilidade/manutenção, não tempo de execução (`data.ts:6`).
5. **Dados comerciais artificiais:** preços, duração, manutenção e textos são derivados de arrays e fórmulas, não de dados confirmados da profissional.

### Problemas de prioridade média

1. Todos os componentes e páginas estão em um único `App.tsx`, com quase cada componente em uma linha física.
2. O CSS combina uma base minificada com várias camadas de sobrescrita. Funciona, mas a cascata ficou difícil de auditar.
3. Não existem testes automatizados, lint, formatação automática ou validação de dados.
4. Imagens somam aproximadamente 28 MB no build; várias passam de 1,5 MB.
5. Dependências usam `latest`, tornando atualizações futuras menos previsíveis apesar do `package-lock.json`.
6. Botões apenas com ícone não possuem nomes acessíveis explícitos.

## O que está bem resolvido

- TypeScript está em modo estrito.
- A aplicação usa rotas claras e fallback da Vercel.
- O número do WhatsApp é normalizado antes de gerar a URL.
- O favicon e a marca usam assets próprios.
- Há suporte a `prefers-reduced-motion`.
- O layout móvel não produz overflow horizontal nas páginas testadas.
- Links externos do Instagram usam `rel="noreferrer"`.

## Ordem recomendada de correção

1. Confirmar dados reais de catálogo, preços e durações.
2. Decidir se a tela de horário é apenas preferência ou disponibilidade real.
3. Modelar datas completas em ISO e gerar os próximos dias dinamicamente.
4. Persistir a solicitação na URL, sessão ou backend.
5. Criar página de “não encontrado”.
6. Separar páginas, componentes, dados e estilos.
7. Otimizar imagens e adicionar carregamento lazy.
8. Adicionar testes de comportamento e acessibilidade.

## Limites desta revisão

- Arquivos binários não têm linhas revisáveis; são inventariados em `public/assets/README.md`.
- `package-lock.json` é gerado pelo npm; a revisão se concentra no manifesto `package.json` e em riscos de dependência.
- `node_modules`, `dist`, `.git`, caches e `.vercel` não fazem parte do código-fonte revisado.
