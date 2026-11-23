# Página Detalhe

**Código:** `src/App.tsx:23`  
**Rota:** `/estilo/:id`

## Fluxo lógico dentro da linha 23

1. Lê `id` da URL.
2. Cria função de navegação.
3. Procura serviço pelo ID.
4. Se não encontrar, usa `services[11]`.
5. Cria favorito local.
6. Renderiza foto, sombra, voltar e favorito.
7. Renderiza Header fixo.
8. Anima o painel de conteúdo.
9. Exibe preço, duração e manutenção.
10. Exibe descrição, cuidados e aviso.
11. Link conduz para `/agendar/:id`.

## Problemas críticos

- O fallback `services[11]` apresenta produto errado para URL inválida. Deve mostrar 404.
- Lead, descrição e cuidados são genéricos; a página parece específica sem ser.
- Favorito não persiste e não possui função comercial.
- O botão de voltar depende do histórico; acesso direto pode voltar para fora do site.
- Não há validação de que `item` existe antes de criar links.

## Layout

- Desktop usa divisão 50/50 com conteúdo rolável.
- Mobile transforma foto e texto em fluxo vertical.
- Métricas viram uma coluna em até 360 px.

## Acessibilidade

- Botões de voltar e favorito têm apenas ícones e precisam de `aria-label`.
- Favorito deveria expor `aria-pressed`.
- A imagem usa o nome do serviço como alt, o que é aceitável, mas poderia descrever o visual.

## Testes recomendados

- ID válido para primeiro e último serviço.
- ID inválido.
- Acesso direto por URL.
- Voltar sem histórico interno.
- Teclado e leitor de tela nos botões de ícone.
