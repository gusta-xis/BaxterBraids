# Revisão de `src/main.tsx`

| Linha | Função | Avaliação |
|---|---|---|
| 1 | Importa React. | Com `react-jsx`, o import explícito nem sempre é necessário, mas `StrictMode` é usado. |
| 2 | Importa cliente React DOM. | Necessário para montar a aplicação. |
| 3 | Importa `BrowserRouter`. | Habilita URLs normais; exige rewrite na hospedagem, já configurado. |
| 4 | Importa `App`. | Correto. |
| 5 | Importa CSS global. | Toda a aplicação compartilha essa folha. |
| 6 | Linha em branco. | Separação visual. |
| 7 | Busca `#root`, cria a raiz e renderiza App dentro de StrictMode e Router. | Correto. O `!` assume que `#root` sempre existe; index.html garante isso. |

## Observações

- `StrictMode` pode executar efeitos duas vezes em desenvolvimento para revelar efeitos colaterais. Não ocorre em produção.
- Não existe Error Boundary; um erro de renderização pode derrubar toda a SPA.
- Não há providers adicionais, analytics ou gerenciamento global de estado.
