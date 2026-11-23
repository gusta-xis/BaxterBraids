# Revisão dos arquivos da raiz

## `.env.example`

| Linha | Função | Revisão |
|---|---|---|
| 1 | Explica que o telefone deve conter DDI e DDD. | Correto e suficiente para onboarding. |
| 2 | Mostra um número brasileiro fictício. | Bom: evita publicar contato pessoal como exemplo genérico. |
| 3 | Declara `VITE_WHATSAPP_NUMBER`. | Tudo com prefixo `VITE_` é público no bundle; adequado para telefone, inadequado para segredos. |

## `.env.production`

| Linha | Função | Revisão |
|---|---|---|
| 1 | Informa que o contato é público. | Evita interpretação errada de “segredo”. |
| 2 | Define `5561984634173`. | O build de produção funciona sem configuração manual na Vercel. Alterações exigem novo deploy. |

## `.gitignore`

- Linhas 1–2 ignoram `wiki/`.
- Linhas 4–8 excluem dependências, build, cache TypeScript e estado local da Vercel.
- Linhas 10–14 excluem ambientes locais, mas permitem `.env.example`.
- Linhas 16–18 excluem lixo de sistema.
- Linhas 20–27 excluem configurações de IDE.

### Observação

`.env.production` não está ignorado de propósito. Isso só é aceitável porque contém um telefone público. Nunca adicionar tokens, senhas ou chaves privadas nesse arquivo.

## `README.md`

O README descreve visão, dores, público e deploy. Parte da seção de requisitos menciona recursos que o código atual não entrega completamente, como FAQ, guia de cuidados em abas e assistente inteligente. Isso cria divergência documental.

### Recomendação

Separar claramente:

- recursos implementados;
- recursos planejados;
- limitações atuais;
- processo de deploy.

## `package-lock.json`

É um artefato gerado pelo npm e deve continuar versionado para instalações reproduzíveis. Não deve ser editado manualmente. A auditoria executada no momento da configuração retornou zero vulnerabilidades conhecidas, mas esse resultado muda com o tempo.
