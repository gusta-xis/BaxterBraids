# Revisão de `package.json`

| Linha | Conteúdo | Revisão |
|---|---|---|
| 1 | Abre o objeto JSON. | Estrutural. |
| 2 | Nome `baxter-braids`. | Válido para npm. |
| 3 | `private: true`. | Evita publicação acidental no registro npm. |
| 4 | Versão `1.0.0`. | Convencional; não é usada no produto. |
| 5 | `type: module`. | Permite módulos ES no Node/Vite. |
| 6 | Node `>=20.19.0`. | Compatível com a versão atual do Vite; limite superior não definido. |
| 7 | Scripts `dev`, `build` e `preview`. | `build` executa TypeScript antes do Vite, o que é correto. Falta `test`, `lint` e `format`. |
| 8 | Abre dependências. | Estrutural. |
| 9 | `@vitejs/plugin-react`. | Está em dependências de produção e não existe `vite.config` usando o plugin. Deve ser configurado ou removido/movido para devDependency. |
| 10 | `framer-motion`. | Usado em animações, reveal e progresso. |
| 11 | `lucide-react`. | Usado para ícones. |
| 12–13 | React e React DOM. | Núcleo da interface. |
| 14 | React Router. | Responsável pelas rotas SPA. |
| 15 | Fecha dependências. | Estrutural. |
| 16 | TypeScript, Vite e tipos. | Correto como ferramentas de desenvolvimento. Usar `latest` reduz previsibilidade; preferir faixas explícitas. |
| 17 | Fecha o JSON. | Estrutural. |

## Riscos

- `latest` pode introduzir quebra em uma reinstalação que regenere o lockfile.
- Não existe validação de formatação ou lint no CI.
- O bundle JavaScript principal fica relativamente grande por incluir animação e ícones, embora ainda aceitável para esta escala.
