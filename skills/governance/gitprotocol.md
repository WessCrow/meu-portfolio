# 🛡️ Release Guardian Protocol

> Diretriz obrigatória para qualquer assistente antes de realizar commit, push, Pull Request ou deploy.

---

# 🎯 Objetivo

Garantir que projetos sejam enviados com segurança, organização e padrão profissional, mesmo quando o usuário não for desenvolvedor.

O assistente deve agir como um **guardião técnico**, prevenindo erros comuns, falhas em produção, vazamento de secrets e repositórios desorganizados.

---

# 🚨 Regra Principal

Sempre que o usuário mencionar:

- subir projeto
- enviar para GitHub
- fazer commit
- pushar
- abrir Pull Request
- deployar
- publicar site
- lançar versão
- atualizar produção

O assistente deve interromper o fluxo normal e executar este protocolo completo antes de recomendar qualquer ação.

---

# 🧭 ETAPA 1 — Diagnóstico do Projeto

Identificar automaticamente:

- tipo de projeto (React, Next.js, Node.js, Python, etc.)
- gerenciador de pacotes (npm, pnpm, yarn, pip)
- ambiente de deploy (Vercel, Netlify, Railway, etc.)
- existência de Git inicializado
- branch atual
- arquivos modificados
- existência de testes
- existência de lint/formatadores

Se algo essencial estiver ausente, informar claramente.

---

# 🔐 ETAPA 2 — Segurança Obrigatória

## Nunca permitir envio de:

- `.env`
- `.env.local`
- `.env.production`
- tokens
- chaves API
- senhas
- certificados
- arquivos `.pem`, `.key`, `.crt`

## Verificar:

- secrets hardcoded no código
- variáveis sensíveis em commits
- configs públicas perigosas
- dependências vulneráveis
- pacotes abandonados

## Recomendar quando possível:

- GitHub Secret Scanning
- Dependabot
- Branch Protection
- 2FA

---

# 🧹 ETAPA 3 — Higiene do Repositório

Bloquear arquivos indevidos:

- `node_modules/`
- `dist/`
- `build/`
- `.next/`
- `coverage/`
- logs
- cache
- arquivos temporários
- arquivos de IDE

Validar `.gitignore`.

Se estiver ausente ou incompleto, sugerir correção imediata.

---

# 🧪 ETAPA 4 — Qualidade Técnica

Executar ou recomendar:

- lint
- format
- typecheck
- build
- testes existentes

Também verificar:

- `console.log` esquecidos
- `TODO` críticos
- imports quebrados
- código morto evidente
- arquivos duplicados

Se houver erro relevante, bloquear push/deploy.

---

# 📝 ETAPA 5 — Commits Profissionais

Usar **Conventional Commits**.

## Tipos permitidos:

- `feat:` nova funcionalidade
- `fix:` correção
- `docs:` documentação
- `refactor:` melhoria interna
- `style:` visual/formatação
- `test:` testes
- `chore:` manutenção
- `build:` build/configuração
- `ci:` automação

## Exemplos:

```text
feat: adiciona login com Google
fix: corrige erro no formulário
refactor: simplifica validação de usuário