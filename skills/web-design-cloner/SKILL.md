---
name: web-design-cloner
description: >
  Clona o design, interações e animações de componentes de sites reais a partir de uma URL.
  Use esta skill SEMPRE que o usuário quiser "copiar", "replicar", "inspirar no", "clonar" ou 
  "roubar o design/animação/estilo" de um site ou componente específico — como hero banners, 
  navbars, cards, sliders, seções de texto animado, etc. Acione também quando o usuário mandar 
  uma URL e pedir para reproduzir o visual, a interação ou o comportamento de algum elemento.
  Também aciona quando o usuário quiser gerar ASCII art de foto, efeito matrix, cursor magnético,
  poeira estelar, ou qualquer efeito de partícula em canvas. Use quando o usuário usar termos 
  como "quero um negócio igual a esse", "faz parecido com esse site", "copia esse efeito", 
  "gera minha foto em ASCII", "efeito matrix", "cursor que explode".
---

# Web Design Cloner

Skill para analisar sites reais e reproduzir seus componentes com fidelidade visual,
interações e animações — em HTML/CSS/JS puro ou React.

---

## Fluxo de Trabalho

### 1. Buscar e analisar o site
Use `web_fetch` na URL com `html_extraction_method: "markdown"`.
Se o usuário não especificou qual componente, use `ask_user_input_v0`.

### 2. Identificar elementos

**Visual:** tipografia, cores, layout, imagens  
**Interações:** hover, scroll, cursor, transições  
**Tom:** editorial, brutalist, dark, minimal, experimental

### 3. Construir com fidelidade
- Implemente as animações — nunca deixe "adicione animação aqui"
- Use fontes reais (Google Fonts ou equivalente)
- Preserve o espaçamento e ritmo visual do original
- Adicione comentários `/* 🎨 CUSTOMIZE: */` nos pontos editáveis

### 4. Entregar
- Simples (< 200 linhas): use `show_widget` do Visualizer  
- Maior ou React: arquivo em `/mnt/user-data/outputs/` + `present_files`

---

## Padrões Visuais Aprendidos

### ASCII Art Typography (estilo artefakt.mov)
Sites que usam letras formadas por caracteres de bloco:
```css
pre.ascii-art {
  font-family: 'Courier New', monospace;
  font-size: clamp(7px, 1.05vw, 13px);
  line-height: 1.2;
  letter-spacing: 0.02em;
  white-space: pre; /* OBRIGATÓRIO */
}
```
Chars para construir letras: `█ ▓ ░ ╔ ╗ ╚ ╝ ║ ═`  
Chars de ruído/fundo: `░░░░` com `opacity: 0.18`

---

## Efeito Photo → ASCII com Física de Partículas

### Processamento da foto (Python/Pillow)
```python
from PIL import Image, ImageEnhance, ImageFilter

img = Image.open("photo.png").convert("L")

# Compensar proporção: chars monospace são ~0.55 de largura/altura
# ROWS = COLS × (h/w) × 0.55  — mantém proporção visual correta
COLS = 160
char_ratio = 0.55
ROWS = int(COLS * (img.height/img.width) * char_ratio)

# Boost contraste para ASCII ficar definido
img = ImageEnhance.Contrast(img).enhance(2.4)
img = ImageEnhance.Brightness(img).enhance(1.05)
img = img.filter(ImageFilter.SHARPEN).filter(ImageFilter.SHARPEN)
img_r = img.resize((COLS, ROWS), Image.LANCZOS)

# 5 níveis de brilho → 0-4
data = []
for p in img_r.getdata():
    if p < 15:    data.append(0)   # background
    elif p < 65:  data.append(1)   # dark shadow  → '.-:,'
    elif p < 120: data.append(2)   # mid shadow   → '+=-;"'
    elif p < 175: data.append(3)   # mid bright   → 'RF3T@#%*'
    else:         data.append(4)   # highlight    → 'RF3T@#%*&W'

compact = "".join(str(v) for v in data)
```

### Canvas ASCII render
```js
const POOLS = ['', '.-:,', '+=-;"', 'RF3T@#%*', 'RF3T@#%*&W'];
const rc = lv => { const p=POOLS[lv]; return p[Math.floor(Math.random()*p.length)]; };
const FONT_PX = 5.6, CHAR_W = FONT_PX*0.60, CHAR_H = FONT_PX*1.12;
// ctx.font = `bold ${FONT_PX}px 'Courier New',monospace`  ← bold SEMPRE
```

---

## Cursor Magnético com Poeira Estelar (Tron)

### Repulsão com anel suave + pulso pulsante
```js
let pulsePhase = 0;

function physics() {
  pulsePhase += 0.045;
  const pulse = 0.55 + 0.45 * Math.sin(pulsePhase); // força respira

  for (let i = 0; i < N; i++) {
    const dx = px[i]-mouseX, dy = py[i]-mouseY;
    const distN = Math.sqrt((dx/RCX)**2 + (dy/RCY)**2);

    if (distN < 1.2) {
      // RING: centro suave, pico a ~50% do raio
      const ring = Math.sin(distN * Math.PI * 0.85);
      const force = ring * pulse * 2.8;
      const angle = aOff[i] + frame * 0.018; // ângulo único → poeira divergente
      vx[i] += Math.cos(angle) * force * (0.6 + Math.random() * 1.2);
      vy[i] += Math.sin(angle) * force * (0.22 + Math.random() * 0.44); // Y menor = expansão lateral
    }

    vx[i] += (ox[i]-px[i]) * (isHover ? 0.011 : 0.026); // restore lento/rápido
    vy[i] += (oy[i]-py[i]) * (isHover ? 0.011 : 0.026);
    vx[i] *= 0.79; vy[i] *= 0.79;
    px[i] += vx[i]; py[i] += vy[i];
  }
}
```

### Raios (em px, converter: `RCX = raio / CHAR_W`)
| Uso | Raio |
|-----|------|
| Padrão | 32px |
| -20% (recomendado) | 26px |
| +20% | 38px |

### Cores Tron — 5 faixas de distância
```js
if (dist < 0.06)     { ctx.fillStyle=`rgba(${b},${b-4},${b-16},0.93)`;  } // estável — branco
else if (dist < 0.5) { ctx.fillStyle=`rgba(${b},${b},${b-18},0.90)`;    } // micro — branco
else if (dist < 2.0) { ctx.fillStyle=`rgba(255,${255-t*65},${200-t*185},0.90)`; } // âmbar
else if (dist < 6)   { ctx.fillStyle=`rgba(255,${210-t*80},0,${0.92-t*0.30})`; } // Tron amarelo
else if (dist < 18)  { ctx.fillStyle=`rgba(255,${170-t*120},0,${0.60-t*0.56})`; } // laranja poeira
else if (dist < 28)  { ctx.fillStyle=`rgba(255,60,0,${0.18-t*0.16})`;   } // brasas sumindo
```

---

## Clusters de Código Ambiente (Typing Effect)

Blocos de código que digitam e deletam em cantos alternados da tela:

```js
class Cluster {
  constructor(x, y) {
    this.full  = makeLines().join('\n'); // 3-5 linhas de chars aleatórios
    this.visible = 0;
    this.state = 'typing'; // typing | hold | deleting | done
    this.typeSpeed    = 3;   // frames por char (digitar)
    this.deleteSpeed  = 2;   // frames por char (deletar — mais rápido)
    this.holdDuration = 160; // frames de pausa
    this.alpha = 0.52;
  }

  tick() {
    if (this.state === 'typing') {
      if (++this.typeDelay >= this.typeSpeed) {
        this.typeDelay = 0;
        this.visible = Math.min(this.visible+1, this.total);
        if (this.visible >= this.total) this.state = 'hold';
      }
    } else if (this.state === 'hold') {
      if (++this.holdTimer >= this.holdDuration) this.state = 'deleting';
    } else if (this.state === 'deleting') {
      if (++this.typeDelay >= this.deleteSpeed) {
        this.typeDelay = 0;
        this.visible = Math.max(this.visible-1, 0);
        if (this.visible <= 0) this.state = 'done';
      }
    }
  }

  draw(ctx) {
    const rows = this.full.slice(0, this.visible).split('\n');
    const blink = Math.floor(Date.now()/400) % 2 === 0;
    rows.forEach((row, li) => {
      const isLast = li === rows.length-1;
      const text = row + (isLast && this.state !== 'hold' && blink ? '█' : '');
      ctx.fillStyle = `rgba(200,195,172,${this.alpha})`;
      ctx.fillText(text, this.x, this.y + li * 8.5);
    });
  }
}

// 4 zonas em sequência, novo cluster a cada ~380 frames
const ZONES = [
  {nx:0.80, ny:0.06},  // top-right
  {nx:0.04, ny:0.80},  // bottom-left
  {nx:0.06, ny:0.06},  // top-left
  {nx:0.82, ny:0.78},  // bottom-right
];
```

---

## Regras de qualidade

- **Nunca omita animações** — implemente todas
- **bold obrigatório** em canvas ASCII: `ctx.font = 'bold Xpx Courier New'`
- **Proporção da foto**: `ROWS = COLS × (h/w) × 0.55` — compensa aspecto do char
- **Sem cinza fantasma**: `if (sx < -12 || sx > CW+12) continue` — clip fora dos bounds
- **Dois canvas separados**: `bg` para clusters ambientes, `main` para foto/interação
