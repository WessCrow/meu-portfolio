# 📊 Estrutura Visual da Pasta `/skills`

```
/skills/
│
├── 📄 README.md                  [Documentação principal]
├── 📄 INDEX.md                   [Navegação rápida]
├── 📄 STRUCTURE.md               [Este arquivo]
│
├── 🛡️  /governance/               [Protocolos obrigatórios]
│   ├── Start.md                  [Framework de decisão de skills]
│   └── gitprotocol.md            [Checklist Git/Deploy]
│
├── 📖 /guidelines/                [Diretrizes e padrões]
│   └── designer2627.md           [Engenheiro de Design Senior]
│
├── 🎨 /templates/                 [Boilerplates e prompts]
│   └── herobanner-prompt.md      [Template: Hero Banner]
│
├── 🔧 /local-skills/              [Skills locais (próprias)]
│   └── web-design-cloner.skill   [Clonar/decompor designs web]
│
└── 🔗 /linked-skills/             [Skills externas (symlinks)]
    ├── design-taste-frontend
    ├── firecrawl-scrape
    ├── full-output-enforcement
    ├── high-end-visual-design
    ├── industrial-brutalist-ui
    ├── kickoff-doc
    ├── minimalist-ui
    ├── redesign-existing-projects
    └── stitch-design-taste
```

---

## 🎯 O que mudou

### ✅ Antes (Desorganizado)
```
/skills/
├── start                              [Mal nomeado!]
├── designer2627.md                    [Arquivo solto]
├── gitprotocol.md                     [Arquivo solto]
├── herobanner-prompt.md               [Arquivo solto]
├── web-design-cloner.skill            [Arquivo solto]
├── design-taste-frontend              [Symlink solto]
├── firecrawl-scrape                   [Symlink solto]
└── [mais 7 symlinks espalhados]
```

### ✅ Depois (Organizado)
```
/skills/
├── governance/                        [Tudo de protocolo junto]
├── guidelines/                        [Tudo de diretrizes junto]
├── templates/                         [Tudo de templates junto]
├── local-skills/                      [Tudo local junto]
└── linked-skills/                     [Todos os symlinks juntos]
```

---

## 📚 Função de Cada Pasta

| Pasta | Descrição | Quem acessa |
|---|---|---|
| **`/governance`** | Protocolos obrigatórios (Start, Git Protocol) | Agente sempre; User antes de crítico |
| **`/guidelines`** | Diretrizes de padrões (design, UX, padrões) | Designer2627 skill; agente na tarefa de design |
| **`/templates`** | Templates prontos para reutilizar | Qualquer skill que precisa boilerplate |
| **`/local-skills`** | Skills proprietary deste projeto | Start para roteamento |
| **`/linked-skills`** | Skills externas remotas | Start para roteamento |

---

## 🔄 Fluxo de Uso

```
┌─────────────────────────────────────────────┐
│ 1. Usuário faz pedido                       │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│ 2. Agente consulta Start.md          │
│    [governance/Start.md]             │
│    → Qual skill usar?                       │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│ 3. Executa skill selecionada                │
│    - Se design → guidelines/designer2627    │
│    - Se template → templates/herobanner     │
│    - Se visual → local-skills/web-cloner    │
│    - Se externo → linked-skills/*           │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│ 4. Se vai fazer commit/push/deploy?         │
│    Consulta governance/gitprotocol.md       │
│    → Tudo seguro e pronto?                  │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│ 5. Resposta entregue ao usuário             │
└─────────────────────────────────────────────┘
```

---

## 📝 Convenções de Nomenclatura

- **Pastas:** `kebab-case` em minúsculas
  - ✅ `/governance`, `/guidelines`, `/local-skills`
  - ❌ `/Governance`, `/GuideLines`, `/LocalSkills`

- **Arquivos de protocolo:** `UPPERCASE.md`
  - ✅ `Start.md`, `gitprotocol.md`

- **Diretrizes:** `lowercase.md`
  - ✅ `designer2627.md`

- **Templates:** `kebab-case.md`
  - ✅ `herobanner-prompt.md`

- **Skills:** `kebab-case.skill` ou `kebab-case.md`
  - ✅ `web-design-cloner.skill`

---

## 🚀 Adicionar Novos Arquivos

### Novo Documento de Governance
```bash
touch governance/novo-protocolo.md
```

### Nova Diretriz de Design
```bash
touch guidelines/nova-diretriz.md
```

### Novo Template
```bash
touch templates/novo-template.md
```

### Novo Skill Local
```bash
touch local-skills/novo-skill.skill
```

### Novo Symlink de Skill Externa
```bash
ln -s /caminho/para/skill linked-skills/nome-skill
```

---

## ✅ Checklist de Integridade

- [x] Arquivo "start" renomeado para `governance/Start.md`
- [x] `gitprotocol.md` movido para `/governance`
- [x] `designer2627.md` movido para `/guidelines`
- [x] `herobanner-prompt.md` movido para `/templates`
- [x] `web-design-cloner.skill` movido para `/local-skills`
- [x] Todos os 9 symlinks movidos para `/linked-skills`
- [x] `README.md` criado com documentação completa
- [x] `INDEX.md` criado com navegação rápida
- [x] `STRUCTURE.md` criado (este arquivo)
- [x] Verificado que não há referências quebradas

---

**Data:** 11 de abril de 2026
**Status:** ✅ Estrutura organizada e documentada
