# Revisão de `src/data.ts`

## Revisão linha a linha

| Linha | Função | Avaliação |
|---|---|---|
| 1 | Declara o tipo `Service`. | Campos são todos obrigatórios; adequado. `category` deveria ser união literal, não `string`. |
| 2 | Lista 18 nomes. | Dados reais ficam presos a posição; qualquer reordenação exige sincronizar outros arrays. |
| 3 | Lista 18 preços. | Mesmo risco de índice. Não há validação que garanta o mesmo tamanho de `names`. |
| 4 | Mapeia nomes para serviços. | Geração reduz repetição, mas esconde dados individuais e cria valores artificiais. |
| 5 | Gera ID, categoria e preço. | Categoria é inferida por texto e falha em variações de capitalização: `Boxeadora com cachos` funciona por “cachos”, mas regras dependem do nome. |
| 6 | Gera duração, manutenção e caminho de imagem. | Problema crítico: `até 1 mês e meio` entra como duração do serviço. Caminho começa em `catalog-02`, deixando `catalog-01` fora e associando por posição. |
| 7 | Repete uma descrição para todos. | A tela sugere conteúdo específico, mas entrega texto genérico. |
| 8 | Repete cuidados para todos. | Alguns estilos podem exigir cuidados diferentes. |
| 9 | Fecha o `map`. | Estrutural. |
| 10 | Formata BRL. | Implementação correta para português brasileiro. |

## Risco de integridade

Arrays paralelos não possuem vínculo estrutural. Exemplo: remover um nome sem remover o preço correspondente desloca todos os preços seguintes sem erro de TypeScript.

## Modelo recomendado

Usar objetos explícitos:

```ts
const services: Service[] = [
  {
    id: 'boxeadora-sem-jumbo',
    name: 'Boxeadora sem jumbo',
    category: 'Box braids',
    price: 75,
    duration: '2–3h',
    maintenance: '3–5 semanas',
    image: '/assets/catalog-01.jpg',
    description: '...',
    care: '...'
  }
];
```

Isso ocupa mais linhas, mas elimina associação silenciosa por índice.
