<h1 align="center">💈 BaxterBraids</h1>

<p align="center">
  <strong>Landing Page estratégica para profissionalização, divulgação e atração de clientes para serviços de tranças.</strong>
</p>

---

## 📖 Descrição do Projeto

Este projeto consiste no desenvolvimento de uma Landing Page moderna, responsiva e de alta conversão para a marca **Baxter Braids**. A aplicação foi projetada para valorizar a arte do trançado profissional, apresentar o portfólio de serviços, otimizar o fluxo de atendimento e facilitar o contato com potenciais clientes.

A interface está sendo desenvolvida com foco em **experiência do usuário (UX)**, aplicando design visual premium (Dark Mode elegante, tons terrosos, tipografia refinada e micro-animações) e acessibilidade em múltiplos dispositivos.

---

## 🎯 Objetivos Principais

*   **Aumentar a visibilidade:** Estabelecer um ponto de contato centralizado que transmita confiança, higiene e alto profissionalismo.
*   **Otimizar a conversão:** Simplificar o processo de orçamento e agendamento.
*   **Educar o cliente:** Minimizar o esforço operacional da profissional fornecendo orientações de cuidados e durabilidade diretamente na página.

---

## 🔍 Diagnóstico e Problemas Resolvidos

A página foi planejada para mitigar diretamente as dores da profissional no dia a dia:

| Ponto de Dor Identificado | Solução na Landing Page | Impacto no Negócio |
| :--- | :--- | :--- |
| **Excesso de perguntas repetitivas** | Seção interativa de Cuidados e FAQ detalhado. | Redução da sobrecarga de mensagens básicas no WhatsApp. |
| **Desistência no momento do preço** | Tabela de preços transparente acompanhada de valor agregado. | Filtro natural de leads e leads mais qualificados. |
| **Dúvidas sobre durabilidade e cuidados** | Guia interativo Pré e Pós-trança. | Aumento da segurança do cliente antes de agendar. |

---

## 👥 Público-Alvo

Mulheres e homens interessados em tranças e estética capilar que buscam:
*   Estilo, identidade visual marcante e personalização.
*   Praticidade no cuidado diário do cabelo.
*   Transparência em relação ao investimento necessário e à manutenção do visual.

---

## 🚀 Requisitos e Funcionalidades da Página

1.  **Catálogo de Estilos Interativo:** Galeria de modelos categorizados (Feminino, Masculino, Todos) com imagens reais e detalhes de cada estilo.
2.  **Guia de Cuidados (Pré e Pós-trança):** Abas interativas detalhando como preparar o cabelo e como mantê-lo após o serviço.
3.  **FAQ Estratégico:** Acordeão de perguntas frequentes sobre durabilidade, tipos de fibra e prazos.
4.  **Tabela de Preços e Estimativas:** Seção transparente apresentando a base de preços dos serviços principais.
5.  **Assistente de Agendamento Inteligente (Modal):** Formulário interativo onde o cliente escolhe o estilo, comprimento e sugere datas, gerando uma mensagem pré-formatada para enviar diretamente no WhatsApp da profissional.

---

## 📊 Indicadores de Sucesso (KPIs)

*   Redução no tempo gasto respondendo dúvidas elementares em canais de atendimento.
*   Taxa de cliques (CTR) nos botões de conversão e início de agendamento.
*   Aumento no volume de solicitações de orçamentos qualificadas.

---

## 🛠️ Tecnologias Utilizadas

*   **HTML5** (Semântico e estruturado)
*   **CSS3** (Estilização Vanilla com variáveis, HSL, Glassmorphism e animações)
*   **JavaScript** (Interatividade e lógica do assistente de agendamento)

---

## 👥 Equipe do Projeto

*   Lidian
*   Luiz
*   Jhonata

---

🚧 *Projeto em Desenvolvimento*

---

## Deploy na Vercel

O projeto está configurado como uma SPA Vite. O arquivo `vercel.json` define o build, a pasta de saída e o fallback necessário para que rotas como `/catalogo`, `/estilo/:id` e `/agendar/:id` funcionem quando abertas diretamente.

1. Envie o repositório para o GitHub.
2. Na Vercel, selecione **Add New → Project** e importe o repositório.
3. Mantenha o preset **Vite**. As configurações já estão no `vercel.json`:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Em **Settings → Environment Variables**, crie:
   - Nome: `VITE_WHATSAPP_NUMBER`
   - Valor: número completo com DDI e DDD, somente algarismos. Exemplo: `5511999999999`
   - Ambientes: Production, Preview e Development
5. Faça o deploy. Se alterar a variável depois, execute um novo deploy para ela entrar no bundle.

O número do WhatsApp é público por natureza e será incluído no JavaScript enviado ao navegador. Não coloque senhas, tokens ou outras credenciais em variáveis iniciadas por `VITE_`.

## Testar o provador generativo

Com o Worker conectado, o botão **Experimentar na minha foto** aparece nas páginas da Boxeadora com jumbo, Nagô topo e Box Braids. Cada simulação é gerada pelo FLUX.2 Klein 4B usando a foto enviada pela pessoa e a referência do modelo selecionado.

Para gerar com sua selfie localmente, use Node.js 22.12 ou superior e uma conta Cloudflare no plano **Workers Free**.

```sh
npm ci
npx --yes wrangler@4.168.0 login
npm run dev:provador
```

Abra `http://localhost:8787/estilo/estilo-3` e selecione **Experimentar na minha foto**. O comando inicia o Worker local com a conexão remota ao Workers AI.

O build de produção usa `VITE_PROVADOR_API_URL` de `.env.production` para se conectar a `/api/provador` do Worker. Essa variável é pública e pode ser sobrescrita na Vercel para trocar o endpoint. No Worker, configure `TRY_ON_ALLOWED_ORIGIN` com a origem exata do site: protocolo e domínio, sem barra final. `wrangler.jsonc` já contém a origem pública atual do BaxterBraids.

Ao clicar em **Gerar simulação grátis**, o navegador reduz a selfie para até 511 px e a envia ao Worker. O Worker seleciona a referência do catálogo e pede a edição à Cloudflare. A aplicação não salva as imagens e responde com `Cache-Control: private, no-store`. A saída é limitada a 512 px em cada lado, e cada endereço tem até três tentativas por minuto por localidade do Worker.

Mantenha a conta no plano Free para impedir cobranças por excedente. A cota gratuita é compartilhada pela conta. Quando ela acaba, o provador informa a indisponibilidade e mantém o atalho para agendar. [Cota do Workers AI](https://developers.cloudflare.com/workers-ai/platform/pricing/) · [Política de uso de dados](https://developers.cloudflare.com/workers-ai/platform/data-usage/)
