# Revisão da pasta `public`

## Responsabilidade

Tudo em `public` é copiado diretamente para a raiz do build e pode ser acessado por URL pública.

## Conteúdo

- `favicon.svg`: ícone quadrado da aba, fundo preto e marca branca.
- `assets/`: imagens do catálogo, imagens institucionais, marca e ícones sociais.

## Implicações

- Não colocar segredos nesta pasta.
- Nomes de arquivo fazem parte da URL pública.
- Assets não recebem hash automático do Vite quando ficam em `public`; trocar um arquivo mantendo o nome pode enfrentar cache antigo.
- Imagens grandes são copiadas integralmente, mesmo quando não são usadas no código.

## `favicon.svg`

- É derivado da marca oficial.
- Usa viewBox quadrado de 193×193.
- O retângulo preto arredondado mantém contraste em abas claras.
- Caminhos brancos desenham o símbolo.
- Como SVG, permanece nítido em diferentes resoluções.
