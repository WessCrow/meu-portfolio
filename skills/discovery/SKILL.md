---
name: discovery
description: >
  Ativar quando o usuário usar a tag [DISCOVERY]. Gera documentos de discovery
  estruturados em HTML com apresentação densa, editorial e orientada a blocos
  de informação: cover, metadata, seções numeradas, grid de cards, tabelas
  comparativas e blocos de gap/oportunidade. Output sempre via present_files.
trigger: "[DISCOVERY]"
version: "1.0"
author: joao
depends_on: figma-html
---

# SKILL: [DISCOVERY] — Discovery Document

## Quando ativar
Ativado pela tag `[DISCOVERY]` em qualquer mensagem. Produz um documento de discovery estruturado em HTML com apresentação densa, editorial e orientada a blocos de informação, no estilo dos documentos de referência do João.

---

## Output obrigatório
Sempre gerar um arquivo HTML completo. Usar o skill `figma-html` como base técnica para garantir compatibilidade com importação no Figma via html.to.figma. O output final deve ser apresentado via `present_files`.

---

## Estrutura do documento

Todo documento [DISCOVERY] segue esta sequência de seções. Nem todas precisam aparecer, mas a ordem deve ser respeitada quando presentes.

### 1. COVER / HERO
- Título grande com variação de peso tipográfico: parte em light/regular, parte em bold (ex: "Shum no **Atma**")
- Subtítulo em parágrafo curto (2-4 linhas), descritivo do escopo do documento
- Background claro (#F5F5F3 ou similar), sem imagens

### 2. METADATA BAR (opcional)
- Faixa horizontal com 3-5 métricas curtas: número de apps analisados, gaps, recomendações, porcentagem de cobertura
- Layout: números grandes + label pequena abaixo
- Separados visualmente por linha vertical ou espaço

### 3. SEÇÕES NUMERADAS
Cada seção segue este padrão:
```
[número] — [LABEL EM CAIXA ALTA E PEQUENA]
Título da seção em tipografia maior
Parágrafo lead opcional
```
Separador horizontal fino antes de cada seção.

### 4. GRID DE CARDS
Layout em 2 colunas (ou 1 coluna para cards destacados). Variantes de card:

**Card padrão:**
- Fundo branco, borda `#E0E0DE`, border-radius 12px
- Título em bold (14-16px)
- Corpo em regular (13-14px), cor #444
- Badge(s) no rodapé

**Card pull quote (destaque conceitual):**
- Fundo branco ou levemente tintado
- Label em caixa alta pequena (10-11px, tracking largo), cor de acento
- Texto grande (18-22px), regular ou light
- Sem badges

**Card insight de produto:**
- Fundo tintado (#F0F0EE)
- Borda esquerda de 3px com cor #555553
- Texto em bold + regular misturado
- Prefixo explícito: "Por que isso importa para o produto:"

### 5. TABELAS COMPARATIVAS
Para benchmarks e comparações entre apps/produtos:
- Cabeçalho: colunas com labels (APP, DIFERENCIAL, APRENDIZADO PARA O X)
- Linhas zebradas levemente (#FAFAFA / branco)
- Nome do app em bold, restante em regular
- Badges de categoria à esquerda do nome (ex: label de cor para tier/tipo)
- Máximo 4-5 colunas para não quebrar leitura

### 6. BLOCOS DE GAP / OPORTUNIDADE
Cards numerados com prefixo G01, G02... ou O01, O02...:
- Layout: bloco principal à esquerda + anotação lateral à direita (2 colunas, ~70/30)
- Bloco principal: label numerada, título do gap, corpo explicativo
- Anotação lateral: fundo colorido suave, texto de implicação ou recomendação direta
- Separados por linha horizontal fina

### 7. SEÇÃO "O QUE X FAZ / NÃO FAZ"
Tabela ou grid com colunas:
- Padrão / Feature / Comportamento
- Quem tem / evidência
- Como adaptar para o produto

---

## Sistema de badges / tags

Usar chips pequenos (padding 4px 8px, border-radius 4px, font-size 11px, font-weight 600, uppercase, letter-spacing 0.05em).

Os badges são a única exceção à paleta monocromática do documento. As cores saturadas são intencionais: cada cor carrega significado semântico (verde = verificado, âmbar = estimado, roxo = inferência, vermelho = problema). Não substituir por tons neutros.

| Tag | Cor fundo | Cor texto | Uso |
|---|---|---|---|
| DADO | #D1FAE5 | #065F46 | Informação verificada, fonte primária |
| ESTIMADO | #FEF3C7 | #92400E | Dado calculado ou interpolado |
| INFERÊNCIA | #EDE9FE | #5B21B6 | Conclusão analítica sem fonte direta |
| FONTE PRIMÁRIA | #D1FAE5 | #065F46 | + texto da fonte em caixa alta |
| OPORTUNIDADE | #DBEAFE | #1E40AF | Implicação de produto |
| GAP | #FEE2E2 | #991B1B | Problema identificado |

---

## Tipografia

```css
--font: 'Inter', system-ui, sans-serif;

--title-hero: 48px / light 300 + bold 700 (mixed in same element via <strong>)
--title-section: 28-32px / regular 400
--label-section: 11px / semibold 600 / uppercase / letter-spacing 0.1em / cor #888
--card-title: 14-15px / bold 700
--card-body: 13-14px / regular 400 / cor #444 / line-height 1.6
--meta-number: 32px / bold 700
--meta-label: 12px / regular 400 / cor #888
--pull-quote: 18-22px / regular 400 / line-height 1.5
```

---

## Paleta base

```css
--bg-page: #F5F5F3
--bg-card: #FFFFFF
--bg-tinted-light: #F0F0EE      /* fundo de cards de destaque */
--bg-tinted-mid: #E8E8E6        /* fundo de cards de insight */
--border: #E0E0DE
--border-strong: #C8C8C6        /* borda de destaque, ex: borda esquerda de insight */
--text-primary: #1A1A1A
--text-secondary: #444444
--text-muted: #888888
--accent-border: #555553        /* neutro escuro para bordas de acento */
```

---

## Regras de redação dentro do documento

- Sem travessões onde vírgula, ponto ou dois-pontos resolvem
- Sem quebra de linha artificial dentro de parágrafos
- Títulos de seção: sentença nominal, não pergunta
- Labels de cards: substantivo ou frase nominal curta
- Badges sempre em caixa alta

---

## Integração com outros modos

- Se o conteúdo vier de `[DEEP RESEARCH]`, usar as notações DADO/ESTIMADO/INFERÊNCIA mapeadas para os badges correspondentes.
- Para seções de benchmark competitivo, reutilizar estrutura de tabela do template `[COMPETITOR]`.
- O HTML gerado deve ser compatível com `figma-html` skill (sem dependências externas, fontes via Google Fonts CDN, layout em px, não em viewport units).
- **A paleta definida neste skill sobrescreve integralmente os tokens de cor do figma-html.** Não usar os tokens dark do figma-html (`--bg`, `--s1`, `--s2`, `--t1`, `--t2`, `--ac` etc.). Os tokens válidos são os definidos na seção "Paleta base" acima.

---

## Exemplo de chamada

```
[DISCOVERY] Análise competitiva do fluxo de onboarding de apps de meditação brasileiros, foco em retenção D1-D7.
```

Claude deve:
1. Ler este SKILL.md
2. Ler `/mnt/skills/user/figma-html/SKILL.md` para regras técnicas de HTML
3. Estruturar o conteúdo nos blocos acima conforme relevância
4. Gerar HTML completo e apresentar via `present_files`
