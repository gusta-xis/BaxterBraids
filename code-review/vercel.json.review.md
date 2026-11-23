# Revisão de `vercel.json`

| Linha | Função | Revisão |
|---|---|---|
| 1 | Abre a configuração. | Estrutural. |
| 2 | Schema oficial da Vercel. | Ajuda validação e autocomplete. |
| 3 | Declara framework Vite. | Correto. |
| 4 | Executa `npm run build`. | Correto e inclui checagem TypeScript. |
| 5 | Publica `dist`. | Saída padrão do Vite. |
| 6–11 | Rewrite geral para `index.html`. | Necessário para abrir rotas do React Router diretamente. |
| 12–30 | Cabeçalhos HTTP. | Aplicados a todas as rotas. |
| 17–18 | `nosniff`. | Evita interpretação incorreta de MIME. |
| 21–22 | Política de referrer. | Equilíbrio adequado entre privacidade e analytics. |
| 25–26 | `SAMEORIGIN`. | Impede incorporação por sites externos e reduz clickjacking. |
| 31 | Fecha a configuração. | Estrutural. |

## Riscos e ausências

- O rewrite genérico é correto para a SPA, mas qualquer futura API exigirá regra mais específica.
- Não há Content Security Policy. Adicioná-la sem mapear fontes, imagens e estilos pode quebrar o site.
- Não há cache customizado para assets; a Vercel ainda aplica comportamento padrão aceitável.
- Não existe domínio configurado no repositório, pois isso pertence à conta Vercel.
