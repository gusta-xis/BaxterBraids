# Página Home

**Código:** `src/App.tsx:14–21`  
**Rota:** `/`

## Estrutura linha a linha

| Linha | Bloco | Função |
|---|---|---|
| 14 | Início | Renderiza Header e abre `main`. |
| 15 | Hero | Apresenta proposta, duas CTAs e ilustração. |
| 16 | Marquee | Reforça a linguagem de marca em loop. |
| 17 | Destaques | Exibe os quatro primeiros serviços. |
| 18 | Sobre | Explica proposta, benefícios e mostra o selo. |
| 19 | Processo | Mostra três etapas até o WhatsApp. |
| 20 | CTA final | Repete entrada para catálogo. |
| 21 | Fechamento | Fecha `main` e inclui Footer. |

## Pontos positivos

- Hierarquia comercial clara.
- CTAs conduzem ao catálogo.
- Seções possuem títulos compreensíveis.
- Texto alternativo existe nas imagens informativas.
- Responsividade reorganiza Sobre e Processo em uma coluna.

## Problemas

1. As duas CTAs do hero levam ao mesmo destino e têm pouca diferença funcional.
2. Destaques são apenas os quatro primeiros itens, não uma seleção editorial explícita.
3. A ilustração hero de aproximadamente 1,4 MB impacta carregamento inicial.
4. `home-07.jpg` também é pesado, aproximadamente 1,6 MB.
5. O marquee consome animação contínua; reduced motion o neutraliza, o que é positivo.
6. O README promete recursos além dos apresentados nesta página.

## Testes recomendados

- Header continua legível entre 320 e 1440 px.
- CTAs abrem `/catalogo`.
- Links Sobre e Contato param abaixo do header fixo.
- Marquee não cria overflow horizontal.
- Conteúdo permanece acessível com reduced motion.
- Imagens ausentes não destroem o layout.
