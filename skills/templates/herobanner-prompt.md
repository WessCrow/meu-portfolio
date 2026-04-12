# PROMPT — Hero Banner: ASCII Photo + Tron Particle Effect

## Contexto
Crie um hero banner fullscreen em HTML/CSS/JS puro com os seguintes elementos:

---

## 1. Estrutura visual

- Fundo: `#060606` (quase preto)
- **Dois canvas sobrepostos** (position absolute):
  - `canvas#bg` — renderiza clusters de código ambiente (z-index baixo, pointer-events: none)
  - `canvas#main` — renderiza a foto ASCII + física de partículas (z-index alto, cursor: crosshair)
- Nav minimalista: logo à esquerda, tag à direita, fonte monospace 9-10px, cor `rgba(210,205,185,0.28)`
- Rodapé: subtítulo à esquerda, CTA à direita, separados por `border-top: 1px solid rgba(210,205,185,0.06)`

---

## 2. Foto em ASCII (canvas#main)

### Conversão da imagem
A foto deve ser convertida em um mapa de brilho com 5 níveis (0–4) usando Python/Pillow:

```python
from PIL import Image, ImageEnhance, ImageFilter
img = Image.open("foto.png").convert("L")

COLS = 160
char_ratio = 0.55  # compensar aspecto monospace
ROWS = int(COLS * (img.height / img.width) * char_ratio)

img = ImageEnhance.Contrast(img).enhance(2.4)
img = ImageEnhance.Brightness(img).enhance(1.05)
img = img.filter(ImageFilter.SHARPEN).filter(ImageFilter.SHARPEN)
img = img.resize((COLS, ROWS), Image.LANCZOS)

data = []
for p in img.getdata():
    if p < 15:    data.append(0)
    elif p < 65:  data.append(1)
    elif p < 120: data.append(2)
    elif p < 175: data.append(3)
    else:         data.append(4)

RAW = "".join(str(v) for v in data)
# Embed RAW como string no JS
```

### Render no canvas
```js
const POOLS = ['', '.-:,', '+=-;"', 'RF3T@#%*', 'RF3T@#%*&W'];
const rc = lv => { const p=POOLS[lv]; return p[Math.floor(Math.random()*p.length)]; };
const FONT_PX = 5.6, CHAR_W = FONT_PX*0.60, CHAR_H = FONT_PX*1.12;
// ctx.font = `bold ${FONT_PX}px 'Courier New', monospace`  ← bold SEMPRE
// Refresh lento: a cada 9 frames, 1.2% das células trocam de char (foto "respira")
```

---

## 3. Física de partículas — cursor magnético

### Configuração
- Cada célula visível (bitmap[i] > 0) é uma partícula com posição, velocidade e origem
- Cada partícula tem `angleOffset` aleatório fixo → trajetórias divergentes (poeira estelar)
- **Raio de influência: 26px** (`RCX = 26 / CHAR_W`, `RCY = 26 / CHAR_H`)

### Loop de física
```js
let pulsePhase = 0;

function physics() {
  pulsePhase += 0.045;
  const pulse = 0.55 + 0.45 * Math.sin(pulsePhase); // força pulsa como onda

  for (let i = 0; i < N; i++) {
    if (!bitmap[i]) continue;

    const dx = px[i] - mouseX, dy = py[i] - mouseY;
    const distN = Math.sqrt((dx/RCX)**2 + (dy/RCY)**2);

    if (distN < 1.2) {
      // ANEL: força zero no centro, pico a ~50% do raio → centro fica suave
      const ring = Math.sin(distN * Math.PI * 0.85);
      const force = ring * pulse * 2.8;
      const angle = aOff[i] + frame * 0.018;

      vx[i] += Math.cos(angle) * force * (0.6 + Math.random() * 1.2);
      vy[i] += Math.sin(angle) * force * (0.22 + Math.random() * 0.44);
      // Y menor que X → expansão lateral (poeira vai para os lados)
    }

    // Spring: volta para origem
    vx[i] += (ox[i] - px[i]) * (isHover ? 0.011 : 0.026);
    vy[i] += (oy[i] - py[i]) * (isHover ? 0.011 : 0.026);
    vx[i] *= 0.79; vy[i] *= 0.79;
    px[i] += vx[i]; py[i] += vy[i];
  }
}
```

### Cores por distância de deslocamento (Tron amarelo)
```js
// b = brilho base: 150 + nivel * 25
if (dist < 0.06)      rgba(b, b-4, b-16, 0.93)          // estável — branco
else if (dist < 0.5)  rgba(b, b, b-18, 0.90)             // micro drift — branco
else if (dist < 2.0)  rgba(255, 255-t*65, 200-t*185, 0.90) // âmbar quente
else if (dist < 6)    rgba(255, 210-t*80, 0, 0.92-t*0.30) // Tron AMARELO puro
else if (dist < 18)   rgba(255, 170-t*120, 0, 0.60-t*0.56) // laranja poeira expansiva
else if (dist < 28)   rgba(255, 60, 0, 0.18-t*0.16)      // brasas sumindo
// Nada além de dist=28 — sem cinza fantasma
```

---

## 4. Clusters de código ambiente (canvas#bg)

Blocos de texto que aparecem em cantos alternados da tela, digitando e deletando:

### Zonas (em % do canvas)
```
TR: (80%, 6%)  →  BL: (4%, 80%)  →  TL: (6%, 6%)  →  BR: (82%, 78%)
Novo cluster a cada ~380 frames
```

### State machine por cluster
```
typing → hold (160 frames) → deleting → done
```

### Comportamento
- **Typing**: 1 char a cada 3 frames, cursor `█` piscando no fim (400ms)
- **Deleting**: 1 char a cada 2 frames (deletar é mais rápido que digitar)
- **Alpha**: `0.52`, cor `rgba(200, 195, 172, alpha)`
- **Font**: `bold 6px 'Courier New'`, line-height `8.5px`
- **Chars**: pool `'RF3T@#%+=-:.0123456789'`
- Cada cluster: 3–5 linhas de 7–15 chars aleatórios

---

## 5. Detalhes técnicos

```
- Fundo: #060606
- Font canvas: bold 5.6px 'Courier New', monospace
- CHAR_W = 5.6 * 0.60 = 3.36px
- CHAR_H = 5.6 * 1.12 = 6.27px
- Canvas main: COLS*CHAR_W + PAD*2 × ROWS*CHAR_H + PAD*2  (PAD = 16px)
- Canvas bg: 100% width/height do wrapper
- Clip: skip partículas fora de bounds (sx < -12 || sx > CW+12)
- Event listeners: mousemove e mouseleave no canvas#main
- Dois canvas separados: bg (fundo, sem pointer events), main (foto, captura mouse)
```

---

## 6. Checklist de qualidade

- [ ] Fonte em **bold** no canvas
- [ ] Proporção da foto preservada (ROWS = COLS × h/w × 0.55)
- [ ] Sem pixels cinza fora dos bounds
- [ ] Pulso pulsante: `0.55 + 0.45 * sin(phase)`
- [ ] Centro suave: ring falloff via `sin(distN * π * 0.85)`
- [ ] Clusters digitam E deletam char a char
- [ ] Cursor `█` piscando apenas durante typing/deleting (não no hold)
- [ ] Dois canvas separados para evitar flicker
