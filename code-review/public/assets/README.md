# Revisão de `public/assets`

## Resumo

- Tamanho total aproximado: **27,62 MB**.
- As imagens são o principal custo de transferência do projeto.
- Não existe pipeline de otimização, WebP/AVIF responsivo ou `srcset`.

## Assets de marca

| Arquivo | Uso | Revisão |
|---|---|---|
| `brand-mark.svg` | Símbolo no Header via máscara CSS. | Correto; branco sólido no arquivo e cor controlada pelo CSS. |
| `baxter-signature.svg` | Assinatura grande no Footer. | Funciona, mas 33 KB é alto para SVG e pode ser simplificado. |
| `instagram.svg` | Ícone do Instagram. | Usado no Footer. |
| `whatsapp.svg` | Ícone do WhatsApp. | Usado no Footer. |

## Imagens usadas diretamente

| Grupo | Uso |
|---|---|
| `home-04.png` | Hero e CTA final. |
| `home-07.jpg` | Seção Sobre. |
| `catalog-02.jpg` até `catalog-19.jpg` | Gerados por índice em `data.ts`. |

## Arquivos atualmente sem referência no código

- `catalog-01.png`
- `catalog-20.jpg`
- `detail-01.jpg`
- `detail-02.jpg`
- `home-01.png`
- `home-02.jpg`
- `home-03.png`
- `home-05.jpg`
- `home-06.png`
- `home-08.jpg`
- `home-09.jpg`
- `home-10.png`
- `home-11.png`
- `home-12.jpg`

Esses arquivos ainda entram no deploy. Não devem ser apagados sem confirmar se são reserva de conteúdo ou material futuro.

## Arquivos acima de 1 MB

- `catalog-15.jpg`: ~2,48 MB
- `catalog-13.jpg`: ~2,22 MB
- `catalog-16.jpg`: ~2,13 MB
- `detail-01.jpg`: ~2,13 MB, atualmente sem uso
- `catalog-02.jpg`: ~2,04 MB
- `catalog-18.jpg`: ~1,98 MB
- `catalog-05.jpg`: ~1,84 MB
- `catalog-10.jpg`: ~1,80 MB
- `catalog-09.jpg`: ~1,65 MB
- `home-07.jpg`: ~1,65 MB
- `catalog-19.jpg`: ~1,65 MB
- `home-04.png`: ~1,48 MB

## Problemas

1. Imagens do catálogo carregam sem `loading="lazy"`.
2. Não há dimensões `width`/`height` no HTML para reservar proporção.
3. Associação serviço–imagem depende de número calculado.
4. Assets não usados aumentam deploy e clone.
5. PNG do hero pode ser adequado por transparência, mas merece compressão.

## Recomendação

1. Confirmar quais imagens realmente pertencem ao catálogo.
2. Converter fotografias para WebP/AVIF com fallback quando necessário.
3. Gerar tamanhos para mobile e desktop.
4. Adicionar lazy loading fora do hero.
5. Tornar o caminho da imagem explícito em cada serviço.
6. Remover assets sem uso somente após aprovação da dona do projeto.
