# 📚 Skills & Governance — Estrutura Organizacional

Este diretório contém toda a governança, documentação de skills, templates e referências do projeto PRTIFA.

---

## 📂 Estrutura de Diretórios

```
/skills
  /governance          ← Protocolos e decisões arquiteturais
  /guidelines          ← Diretrizes de design e padrões
  /templates           ← Templates e prompts reutilizáveis
  /local-skills        ← Skills criadas localmente
  /linked-skills       ← Skills externas (symlinks para repositórios remotos)
```

---

## 🛡️ `/governance` — Protocolos Obrigatórios

**Função:** Documentos que definem como o agente deve se comportar em decisões críticas.

| Arquivo | Descrição | Quando usar |
|---|---|---|
| **Start.md** | Framework de decisão para roteamento de skills. Define como identificar ação, domínio, profundidade e selecionar skill ideal. | Antes de qualquer pedido do usuário |
| **gitprotocol.md** | Release Guardian Protocol. Checklist de segurança e qualidade antes de commit/push/deploy. | Antes de qualquer operação Git |

### Como usar:
1. **Start.md:** Sempre que receber um pedido, passar pelas 4 etapas de decisão
2. **Git Protocol:** Sempre que usuário mencionar "commit", "push", "deploy", etc.

---

## 📖 `/guidelines` — Diretrizes de Design

**Função:** Documentação de padrões, princípios e especificações de design.

| Arquivo | Descrição |
|---|---|
| **designer2627.md** | Engenheiro de Design Senior. 5 pilares fundamentais: UX Writing, IA Agêntica, Rigor Técnico (FEER), Acessibilidade (POUR), Tendências 2026. Inclui framework de resposta estruturado. |

### Como usar:
- Para qualquer tarefa de design, UX writing, critiques, acessibilidade
- Siga o formato de resposta: Contexto → Conteúdo → Técnico → Agêntico → Código → Métricas

---

## 🎨 `/templates` — Templates Reutilizáveis

**Função:** Prompts, boilerplates e estruturas prontas para copiar.

| Arquivo | Descrição |
|---|---|
| **herobanner-prompt.md** | Template de prompt estruturado para criação de hero banners. Inclui componentes, estados, acessibilidade. |

### Como usar:
- Copie e adapte conforme necessário
- Mantenha a estrutura base, customize o conteúdo

---

## 🔧 `/local-skills` — Skills Criadas Localmente

**Função:** Skills desenvolvidas especificamente para este projeto.

| Arquivo | Descrição |
|---|---|
| **web-design-cloner.skill** | Skill para clonar/decomposição de designs web. Análise de linguagem visual, paleta, tipografia. |

### Como usar:
- Skills locais estão prontas para execução
- Use quando Start indicar necessidade de design/visual

---

## 🔗 `/linked-skills` — Skills Externas (Remotes)

**Função:** Symlinks para skills mantidas em repositórios externos.

| Skill | Repositório | Descrição |
|---|---|---|
| **design-taste-frontend** | Remoto | Análise e aplicação de design trends de frontend |
| **firecrawl-scrape** | `/claude/pv/.agents/skills/` | Web scraping e extração de dados |
| **full-output-enforcement** | Remoto | Garantir saída completa em tarefas |
| **high-end-visual-design** | Remoto | Design visual de alto padrão |
| **industrial-brutalist-ui** | Remoto | Estética brutalist/industrial |
| **kickoff-doc** | Remoto | Geração de docs de kickoff de projeto |
| **minimalist-ui** | Remoto | Estética minimalista |
| **redesign-existing-projects** | Remoto | Refatoração de designs existentes |
| **stitch-design-taste** | Remoto | Harmonização e síntese de design taste |

### Como usar:
- Skills externas aparecem em Start.md como opções de roteamento
- Seguir roteamento conforme matriz em governance/Start.md

---

## 🔄 Fluxo de Decisão

```
Pedido do usuário
    ↓
[Start] — Qual skill usar?
    ↓
[Executa skill selecionada]
    ↓
[Se houver commit/push/deploy...] → [GIT PROTOCOL] — Tudo pronto?
    ↓
Resposta entregue
```

---

## ✅ Checklist de Manutenção

- [ ] Start.md está sincronizado com skills disponíveis?
- [ ] Novos symlinks em `/linked-skills` estão documentados?
- [ ] Templates em `/templates` são atualizados conforme evolução?
- [ ] Diretrizes em `/guidelines` refletem padrões vigentes?
- [ ] Git protocol está sendo seguido antes de releases?

---

## 📝 Como Adicionar Nova Skill

1. **Se for local:** Criar arquivo em `/local-skills/` com extensão `.skill` ou `.md`
2. **Se for remota:** Criar symlink em `/linked-skills/`
3. **Atualizar Start.md** com nova opção de roteamento
4. **Adicionar linha neste README** na tabela correspondente

---

## 🚀 Próximos Passos

- [ ] Operacionalizar Start.md com scripts de decisão
- [ ] Criar versão visual (Mermaid) de fluxos
- [ ] Expandir Git Protocol com branch strategy e versioning
- [ ] Documentar cada skill com exemplos de uso
- [ ] Criar dashboard de status de skills

---

**Última atualização:** 11 de abril de 2026
**Responsável:** PRTIFA Framework
