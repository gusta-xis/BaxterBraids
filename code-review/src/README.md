# Revisão da pasta `src`

## Responsabilidade

`src` contém toda a aplicação executável:

- `main.tsx`: inicialização do React;
- `App.tsx`: componentes, páginas, rotas e fluxo;
- `data.ts`: catálogo e formatação monetária;
- `styles.css`: tokens, layout, animações e responsividade;
- `vite-env.d.ts`: tipos das variáveis Vite.

## Fluxo

```text
index.html
  → main.tsx
    → BrowserRouter
      → App.tsx
        → data.ts
        → styles.css
        → public/assets
        → WhatsApp externo
```

## Diagnóstico estrutural

O maior problema é concentração. `App.tsx` reúne componentes reutilizáveis, cinco páginas, navegação, estado e rotas. `styles.css` reúne toda a cascata em um arquivo parcialmente minificado. Para o tamanho atual ainda é executável, mas qualquer evolução — agenda real, backend, autenticação ou edição do catálogo — aumentará muito o custo de manutenção.

## Estrutura recomendada futura

```text
src/
├── app/
│   ├── App.tsx
│   └── router.tsx
├── components/
│   ├── Brand.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Button.tsx
│   └── ServiceCard.tsx
├── pages/
│   ├── Home.tsx
│   ├── Catalog.tsx
│   ├── Detail.tsx
│   ├── Schedule.tsx
│   └── Confirmation.tsx
├── data/
│   └── services.ts
├── styles/
│   ├── tokens.css
│   ├── global.css
│   └── pages/
└── main.tsx
```

Essa reorganização é recomendação, não requisito para o deploy atual.
