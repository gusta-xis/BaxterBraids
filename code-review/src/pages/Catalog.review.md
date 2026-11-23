# Página Catálogo

**Código:** `src/App.tsx:22`  
**Rota:** `/catalogo`

## Fluxo lógico dentro da linha 22

1. `q` armazena o texto de busca.
2. `filter` inicia em `Todos`.
3. `useMemo` filtra serviços por categoria e nome.
4. Header é renderizado.
5. Título apresenta o catálogo.
6. Campo de busca atualiza `q` a cada tecla.
7. Quatro botões atualizam `filter`.
8. Contagem mostra o tamanho de `filtered`.
9. Cards são renderizados dentro de `AnimatePresence`.
10. Footer encerra a página.

## Pontos positivos

- Busca simples e instantânea.
- Filtro e busca funcionam juntos.
- `useMemo` evita recalcular sem mudança de dependências, embora o conjunto seja pequeno.
- Cards possuem links claros para detalhes.

## Problemas

1. Busca não remove acentos. `nago` não encontra `Nagô`.
2. Estado não vai para query string; voltar ou compartilhar perde filtro e busca.
3. “Ordenar: destaques” não é controle e não executa ordenação.
4. `AnimatePresence` não tem animação `exit` nos cards.
5. Categorias dependem da inferência frágil de `data.ts`.
6. Não existe estado vazio orientando a limpar filtros.
7. Imagens não usam lazy loading.

## Acessibilidade

- O input não possui `<label>`; placeholder não substitui rótulo.
- O grupo de filtros poderia usar `aria-pressed`.
- A contagem deveria usar região `aria-live` se a atualização precisar ser anunciada.

## Testes recomendados

- Busca parcial, caixa alta/baixa e acentos.
- Combinações de busca e categoria.
- Resultado vazio.
- Navegação por teclado nos filtros.
- Duas colunas em 375–430 px e uma coluna até 360 px.
