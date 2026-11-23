# Revisão de `tsconfig.json`

O arquivo inteiro está compactado na linha 1.

| Opção | Função | Revisão |
|---|---|---|
| `target: ES2022` | Gera JavaScript moderno. | Adequado para navegadores atuais. |
| `useDefineForClassFields` | Usa semântica moderna de campos de classe. | Padrão adequado. |
| `lib` | Disponibiliza APIs ES2022 e DOM. | Correto para aplicação web. |
| `allowJs: false` | Restringe fonte a TypeScript. | Bom para consistência. |
| `skipLibCheck: true` | Não verifica tipos internos das dependências. | Acelera build, mas pode ocultar incompatibilidades de bibliotecas. |
| `esModuleInterop` e `allowSyntheticDefaultImports` | Facilitam interoperabilidade de módulos. | Compatível com ecossistema React. |
| `strict: true` | Ativa checagem rigorosa. | Ponto positivo. |
| `forceConsistentCasingInFileNames` | Evita erros entre Windows e Linux/Vercel. | Essencial neste contexto. |
| `module: ESNext` | Preserva módulos para o bundler. | Correto. |
| `moduleResolution: Bundler` | Resolve módulos como Vite. | Correto. |
| `resolveJsonModule` | Permite importar JSON. | Não é usado atualmente. |
| `isolatedModules` | Garante compilação independente. | Correto para Vite. |
| `noEmit` | TypeScript só valida; Vite gera o bundle. | Correto. |
| `jsx: react-jsx` | Usa o transform moderno de JSX. | Correto. |
| `include: [src]` | Limita a checagem à aplicação. | Configurações de build fora de `src` não são verificadas pelo TypeScript. |

## Recomendação

Formatar o JSON e, se testes/configurações TypeScript forem adicionados, criar configurações separadas ou ampliar `include`.
