# 🎬 TRONHERO Shader Service — Product Requirements Document

**Versão:** 1.0  
**Data:** 11 de abril de 2026  
**Status:** 🟢 Proposta de Produto  
**Proprietário:** PRTIFA / Design Engineering

---

## 🎯 Executive Summary

**TRONHERO Shader Service** é uma plataforma web-based para geração em tempo real de efeitos visuais no estilo **Matrix Terminal** com profundidade de campo, integrada a imagens e vídeos.

Transforma qualquer imagem estática ou stream de vídeo em uma renderização de alta densidade de caracteres ASCII animados com física de partículas, efeito de "Matrix digital" e interatividade dinâmica por cursor.

### Valor para o Usuário
- 🎨 **Criatividade Visual:** Criar shaders cinemáticos Matrix sem conhecimento de GLSL/GPU
- ⚡ **Tempo Real:** Processamento instantâneo; preview imediato
- 🎮 **Interatividade:** Cursor influencia partículas; efeito "toque real"
- 📱 **Acessibilidade:** Web-based, sem instalação, funciona em qualquer navegador moderno

---

## 📋 Escopo do Produto

### O que é incluído (MVP)
- ✅ Upload/URL de imagem estática
- ✅ Captura de webcam em tempo real
- ✅ URL de vídeo (YouTube/HLS/MP4/Twitch)
- ✅ Gerador de shader a partir de texto (ascii art)
- ✅ Gerador de ASCII a partir de bitmap
- ✅ Motor de física de partículas (Verlet Lite)
- ✅ Efeito de profundidade (parallax multi-camada)
- ✅ Interatividade por cursor
- ✅ Biblioteca de presets (Tron, Matrix, Terminal Retro, Cyberpunk)
- ✅ Export de vídeo (WebP/MP4)

### O que não é incluído (Futuro)
- ❌ Edição de código GLSL (Roadmap Phase 2)
- ❌ Efeitos 3D full (Roadmap Phase 3)
- ❌ Integração com IA generativa (Roadmap Phase 2)
- ❌ Síntese de áudio reativo (Roadmap Phase 3)

---

## 🏗️ Arquitetura da Solução

### 1. Pillar: Visual Engine (Renderização)

```
┌─────────────────────────────────────────────────┐
│ INPUT LAYER                                     │
├──────────────────┬──────────────────────────────┤
│ • Image Upload   │ • Webcam Stream              │
│ • URL (HLS/MP4)  │ • Canvas Element             │
└──────────────────┴──────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│ BITMAP EXTRACTION                               │
├─────────────────────────────────────────────────┤
│ ImageData → Grayscale Conversion                │
│ (luminosity: 0.299R + 0.587G + 0.114B)         │
│                                                 │
│ Output: Uint8Array [0-255] per pixel           │
└─────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│ QUANTIZATION                                    │
├─────────────────────────────────────────────────┤
│ Map [0-255] → Density Levels [0-4]             │
│                                                 │
│ Level 0: '' (empty)                            │
│ Level 1: '. , -' (light)                       │
│ Level 2: ': ; ~ +' (medium)                    │
│ Level 3: 'x X = * %' (dense)                   │
│ Level 4: '# @ W 8 B M &' (ultra-dense)         │
└─────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│ PARTICLE SYSTEM                                 │
├─────────────────────────────────────────────────┤
│ For each (col, row):                           │
│   • Create Particle(char, density, x, y)       │
│   • Initialize physics (px, py, ox, oy, v)    │
└─────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│ RENDER LOOP (60fps)                             │
├─────────────────────────────────────────────────┤
│ 1. Update Physics (Verlet)                      │
│ 2. Apply Cursor Influence                       │
│ 3. Calculate Depth/Parallax                     │
│ 4. Render to Canvas                             │
│ 5. Request Next Frame                           │
└─────────────────────────────────────────────────┘
```

### 2. Pillar: Physics Engine (Dinâmica)

**Modelo de Integração:** Verlet Integration Lite

```javascript
// Pseudocódigo
for each particle {
  // 1. Spring force: restauração à âncora original
  accel_x = (anchor_x - pos_x) * stiffness
  accel_y = (anchor_y - pos_y) * stiffness
  
  // 2. Damping: amortecimento de velocidade
  vel_x *= damping_factor (0.84)
  vel_y *= damping_factor (0.84)
  
  // 3. Cursor repulsion: empurrão do mouse
  if (distance_to_cursor < RADIUS) {
    push_force = calculate_repulsion(distance_to_cursor)
    vel_x += push_x * push_force
    vel_y += push_y * push_force
  }
  
  // 4. Update position
  pos_x += vel_x
  pos_y += vel_y
}
```

**Parâmetros Ajustáveis (Presets):**

| Preset | Stiffness | Damping | Trail Radius | Efeito |
|---|---|---|---|---|
| **Tron** | 0.15 | 0.82 | 380px | Resposta rápida, dinâmica |
| **Matrix** | 0.08 | 0.88 | 500px | Fluído, natural |
| **Terminal Retro** | 0.25 | 0.75 | 200px | Snappy, computadorizado |
| **Cyberpunk** | 0.12 | 0.80 | 450px | Agressivo, hiperativo |

### 3. Pillar: Depth & Visual Effects

#### Parallax Multi-Camada
```
Layer 1 (Far):    Caracteres menos frequentes (Level 0-1)    [parallax: -8px]
Layer 2 (Mid):    Caracteres médios (Level 2-3)              [parallax: 0px]
Layer 3 (Near):   Caracteres densos (Level 4)                [parallax: +8px]
```

#### Efeito de Profundidade
- **Blur Progressivo:** Caracteres distantes com opacity reduzida
- **Escala Variável:** Caracteres próximos ligeiramente maiores
- **Cor Dinâmica:** Gradient RGB baseado em profundidade

#### Efeito de "Scanning"
```
opacity = 0.5 + 0.5 * sin(global_time * frequency + y_position)
// Simula "varrimento" de linha de CRT
```

---

## 🎮 User Journey & Fluxos Principais

### Fluxo 1: Upload de Imagem Estática

```
1. User abre app
2. Click "Upload Image" / arrastar arquivo
3. App processa:
   a. Carrega imagem
   b. Redimensiona para grid (160x65 padrão)
   c. Extrai grayscale
   d. Quantiza para 5 níveis
   e. Cria partículas
4. Renderização em tempo real
5. User interage com cursor
6. Preview ao vivo
7. Click "Export" → Download MP4/WebP
```

### Fluxo 2: Captura de Webcam

```
1. User click "Live Webcam"
2. Navegador pede permissão de câmera
3. App inicia captura
4. Loop contínuo:
   a. Captura frame de webcam
   b. Processa bitmap
   c. Renderiza shader
   d. ~30-60fps
5. User vê espelho ao vivo estilizado
6. Pode salvar snapshot ou gravar sessão
```

### Fluxo 3: URL de Vídeo (YouTube/HLS/MP4/Twitch)

```
1. User cola URL de vídeo:
   • YouTube: https://youtu.be/... ou youtube.com/watch?v=...
   • MP4 direto: video.mp4
   • HLS stream: stream.m3u8
   • Twitch: twitch.tv/...

2. App valida & carrega stream
3. Extrai metadados (duração, resolução)
4. For each frame:
   a. Captura frame de vídeo
   b. Processa como bitmap
   c. Renderiza shader
   d. Mantém sincronização de áudio (opcional)

5. Output: MP4 renderizado com shader aplicado
6. Progress bar em tempo real
7. Download automático quando pronto
```

### Fluxo 4: Criação de Texto (ASCII Art)

```
1. User click "Create from Text" tab
2. Interface de criação:
   a. Text input (pastebin, textarea)
   b. Font selector (monospace, bitmap fonts)
   c. ASCII art visualizer live
   d. Character pool selector

3. User edita em tempo real:
   a. Coloca seu texto
   b. Vê preview com shader Matrix aplicado
   c. Ajusta fonte/tamanho
   d. Modifica character pool (dense/sparse)

4. Aplica physics ao texto:
   a. Stiffness / Damping sliders
   b. Cursor interaction ativa
   c. Efeito de profundidade

5. Exporta resultado:
   a. PNG estático
   b. MP4 animado (com efeito de "digitação")
   c. GIF loop

Exemplo de entrada:
```
═══════════════════════════════
W E L C O M E   T O   M A T R I X
═══════════════════════════════
```

Output: Texto com efeito de profundidade + física de partículas
```

---

## 🎨 Interface de Usuário

### Layout (Responsivo)

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER: Logo + Tabs [Upload | Webcam | Video URL | Text] │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  CANVAS: Render em Tempo Real (16:9)                     │   │
│  │  TronHero Shader Effect                                  │   │
│  │  (Interactive + Cursor-driven)                           │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│ CONTROLS:                                                        │
│ • Preset Selector (Tron/Matrix/Retro/Cyber)                    │
│ • Stiffness Slider [0-0.5]                                     │
│ • Damping Slider [0.5-0.95]                                    │
│ • Character Pool Selector (Dense/Medium/Light)                  │
│ • Depth Effect Toggle                                          │
│ • Parallax Intensity [0-1]                                     │
│ • Scan Effect Frequency [0-0.05]                              │
│ • Export Button (MP4/WebP/GIF/PNG)                            │
├──────────────────────────────────────────────────────────────────┤
│ TAB-SPECIFIC CONTROLS:                                          │
│                                                                   │
│ [Upload Tab]                                                     │
│  • Drag & drop zone                                             │
│  • File picker                                                  │
│                                                                   │
│ [Webcam Tab]                                                     │
│  • Camera selector (se houver múltiplas)                        │
│  • Record button                                                │
│  • Take snapshot                                                │
│                                                                   │
│ [Video URL Tab]                                                  │
│  • URL input (YouTube/MP4/HLS/Twitch)                          │
│  • Video preview + duration                                     │
│  • Processing progress bar                                      │
│                                                                   │
│ [Text Tab]                                                       │
│  • Text input box (textarea)                                    │
│  • Font selector dropdown                                       │
│  • Font size slider                                             │
│  • ASCII art live preview                                       │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│ STATS (Debug Mode):                                             │
│ • FPS Counter                                                   │
│ • Particle Count                                                │
│ • Memory Usage                                                  │
│ • Render Time per Frame                                         │
│ • Video Bitrate (se aplicável)                                 │
└──────────────────────────────────────────────────────────────────┘
```

### Design System

**Cores:**
- Background: `#0a0a0a` (quasi-black)
- Primary: `#00ff00` (Matrix green)
- Secondary: `#0099ff` (Cyberpunk blue)
- Accent: `#ffff00` (Terminal yellow)

**Tipografia:**
- Mono: `IBM Plex Mono`, `Monaco`, `Courier New`
- Sans: `Inter`, `Helvetica Neue`

**Animações:**
- Transições: 200-300ms easing: cubic-bezier(0.4, 0, 0.2, 1)
- Hover States: Glow effect, scale 1.02

---

## 🛠️ Especificações Técnicas

### Stack Recomendado

**Frontend:**
- React 19 / Next.js 15
- Canvas API (nativo, sem Three.js)
- TailwindCSS + shadcn/ui para UI
- Framer Motion para interações suaves
- MediaStream API para webcam

**Backend (Opcional - Phase 2):**
- Node.js / Express
- FFmpeg para processamento de vídeo
- WebSocket para preview em tempo real de uploads longos
- AWS S3 para armazenamento de renders

**Infraestrutura:**
- Vercel / Netlify para frontend
- CloudFlare Workers para processamento distribuído
- CDN global para assets

### Performance Targets

| Métrica | Target | Limite |
|---|---|---|
| FPS (Canvas Render) | 60 | ≥50 aceitável |
| Initial Load | <2s | <3s tolerável |
| Frame Render Time | <16ms | <20ms máx |
| Memory (idle) | <50MB | <100MB máx |
| Particle Count | 10,400 | + 5,000 stretch goal |

### Compatibilidade de Navegadores

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS 14+, Android 10+)

---

## 🎯 Features Detalhadas

### Feature 1: Preset Manager

**Descrição:** Biblioteca pré-configurada de estilos

```javascript
const PRESETS = {
  tron: {
    stiffness: 0.15,
    damping: 0.82,
    trailRadius: 380,
    colorScheme: 'cyan-green',
    scanFrequency: 0.01,
    depthIntensity: 0.8,
  },
  matrix: {
    stiffness: 0.08,
    damping: 0.88,
    trailRadius: 500,
    colorScheme: 'green-monochrome',
    scanFrequency: 0.02,
    depthIntensity: 0.6,
  },
  // ... mais presets
};
```

### Feature 2: Real-time Stream Processing

**Fluxo de Webcam:**

```
MediaStream (30-60fps) 
  ↓
VideoElement (hidden)
  ↓
Canvas drawImage() from video
  ↓
getImageData() para bitmap
  ↓
Particle system update
  ↓
Render to main canvas
  ↓ (repeat every frame)
```

### Feature 3: Export Engine

**Formatos Suportados:**

1. **MP4 (H.264)**
   - Qualidade: 1080p / 720p / 480p
   - Bitrate: 5Mbps / 2.5Mbps / 1Mbps
   - Codec: libx264 (FFmpeg)
   - Duração: até 60 segundos

2. **WebP Animado**
   - Frame rate: 30fps
   - Tamanho: auto-scaling baseado em duração
   - Qualidade: 80-95 lossy

3. **GIF**
   - Frame rate: 15fps
   - Palette: 256 cores
   - Size: até 10MB

**Implementação:**
- Client-side: Canvas → Blob (WebP/GIF)
- Server-side: MP4 via FFmpeg (opcional)

### Feature 4: Parameter Exploration

**Sliders Interativos:**

```
Stiffness: [━━━●━━━━━━━] 0.15
"Controla como rápido as partículas retornam à posição original"

Damping: [━━━━━━━●━━━] 0.82
"Reduz oscilações; valores altos = movimento suave"

Trail Radius: [━●━━━━━━━━] 380px
"Distância máxima que o cursor influencia partículas"

Parallax Intensity: [━━━━●━━━━━] 0.8
"Força do efeito de profundidade (0 = flat, 1 = máximo)"

Scan Frequency: [━━●━━━━━━━] 0.02
"Velocidade do efeito de varrimento de CRT"
```

### Feature 5: Text-to-Shader Engine

**Descrição:** Converte texto/ASCII art em shader animado com física

```javascript
const textShader = {
  input: "TEXT or ASCII ART",
  fontOptions: {
    family: "monospace|bitmap-fonts",
    size: [8, 10, 12, 14, 16, 20],
    weight: "regular|bold",
    spacing: "compact|normal|spaced"
  },
  characterPool: {
    dense: "# @ W 8 B M &",
    medium: "x X = * %",
    sparse: ". , -"
  },
  animationMode: {
    static: "render estático",
    typing: "efeito de digitação progressiva",
    pulsing: "pulsação rítmica",
    scanning: "linha por linha (CRT)"
  },
  export: {
    png: "imagem estática",
    mp4: "vídeo com animação",
    gif: "loop animado"
  }
};
```

**Fluxo de Processamento:**

```
Texto Input
   ↓
Font Rendering (Canvas text API)
   ↓
Bitmap Extraction (grayscale)
   ↓
Quantização (5 níveis)
   ↓
Particle System
   ↓
Apply Physics + Depth
   ↓
Render com Shader Effect
```

**Exemplos de Saída:**

```
Entrada:
  TERMINAL 2099

Saída com shader:
  ████████████████
  ░▓▒░TERMINAL░▒▓░    (com parallax + physics)
  ████████████████
```

---

## 🎬 Fluxo de Desenvolvimento

### Phase 1: MVP (12 semanas)

**Sprint 1-2: Foundation**
- Setup React + Next.js scaffold
- Implementar Canvas + Bitmap extraction
- Core particle physics (Verlet)
- Render loop básico

**Sprint 3-4: Features Core**
- Preset system (4 presets)
- Cursor interaction (trail system)
- Input sources (image/webcam)
- Text-to-shader engine
- Basic export (WebP)

**Sprint 5: Video Support**
- Video URL parsing (YouTube/MP4/HLS)
- Frame extraction & processing
- Progress tracking
- MP4 export

**Sprint 6-7: Polish**
- UI/UX refinement
- Performance optimization
- Cross-browser testing
- Documentation
- Accessibility audit

**Sprint 8: Deployment**
- Deploy to Vercel
- CDN setup
- Analytics integration
- Official launch

### Phase 2: Advanced (16 semanas)

- [ ] Video stream support (HLS/DASH)
- [ ] Backend MP4 rendering (FFmpeg)
- [ ] Shader parameter editor (visual)
- [ ] AI-powered preset generation
- [ ] Real-time collaboration (WebSocket)
- [ ] User gallery + trending effects

### Phase 3: Enterprise (Roadmap)

- [ ] 3D particle system (Three.js)
- [ ] Audio-reactive mode
- [ ] Custom font/character pools
- [ ] Batch processing API
- [ ] Mobile app (React Native)

---

## 📊 Success Metrics

### Engajement

| Métrica | Target | How to Measure |
|---|---|---|
| Daily Active Users | 500+ | Google Analytics |
| Session Duration | 5+ min | GA Session Time |
| Export Rate | 30% | Events: export_complete |
| Preset Usage | Top 3 = 60% | Event tracking per preset |

### Performance

| Métrica | Target | Tool |
|---|---|---|
| Lighthouse Score | 85+ | PageSpeed Insights |
| CLS (Layout Shift) | <0.1 | Web Vitals |
| FCP (First Paint) | <1s | Web Vitals |
| LCP (Largest Paint) | <2.5s | Web Vitals |

### Produto

| Métrica | Target |
|---|---|
| Feature Adoption | 70% de usuários tentam presets |
| Crash Rate | <0.5% |
| Support Tickets | <10/semana |

---

## 🚀 Roadmap Visual

```
┌─────────────────────────────────────────────────────────┐
│ Q2 2026 - PHASE 1: MVP                                  │
│ ✓ Static Image Upload                                   │
│ ✓ Webcam Live Stream                                    │
│ ✓ Preset Manager (4 presets)                            │
│ ✓ Export (WebP/GIF)                                     │
│ ✓ Public Launch                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Q3-Q4 2026 - PHASE 2: Growth                           │
│ • Video URL Support (HLS/MP4)                          │
│ • MP4 Export (Backend Rendering)                       │
│ • AI Preset Generator                                  │
│ • User Gallery                                         │
│ • Real-time Collaboration                             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 2027+ - PHASE 3: Enterprise                            │
│ • 3D Particle System                                   │
│ • Audio-Reactive Features                             │
│ • Custom Fonts/Characters                             │
│ • Mobile App                                          │
│ • API for Developers                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Use Cases

### Use Case 1: Content Creator
> "Quero criar intros de vídeo com efeito Matrix para meu canal YouTube"
- Cola URL do YouTube
- TRONHERO extrai vídeo e aplica shader
- Gera versão MP4 com efeito
- Download para edição final
- Usa em próximo vídeo intro

### Use Case 2: Artist/Designer
> "Quero explorar efeitos de profundidade terminal em meus trabalhos"
- Upload artwork
- Ajusta parâmetros em tempo real
- Cria múltiplas variações
- Exporta para portfólio

### Use Case 3: Hacker/Technologist
> "Preciso de textos ASCII com efeito Matrix para meu site de portfolio"
- Abre aba "Text"
- Cola seu ASCII art (ou escreve novo)
- Aplica shader com profundidade
- Gera MP4 com efeito de digitação
- Embeds no portfólio ou GitHub

### Use Case 4: Developer (Demo)
> "Preciso de um efeito visual cool para meu projeto"
- Embeds TRONHERO em site
- Usa a imagem do produto
- Shader roda no navegador
- Sem dependência de servidor

### Use Case 5: Visual Effects Studio
> "Quero automatizar a criação de 100 variações de imagens e vídeos"
- Batch upload via API (Phase 2)
- Define parâmetros e presets
- Processa em paralelo
- Download ZIP com todos os renders

### Use Case 6: Live Streamer
> "Quero aplicar efeito Matrix em tempo real na minha stream do Twitch"
- Cola URL de stream Twitch
- TRONHERO captura frames ao vivo
- Renderiza com shader em tempo real
- Output para software de streaming (OBS)

---

## 🔐 Segurança & Privacidade

### Coleta de Dados

**O que coletamos:**
- ✅ Evento: tipo de upload (image/video/webcam)
- ✅ Evento: preset selecionado
- ✅ Métrica: tempo de render, FPS
- ❌ NÃO coletamos imagens/vídeos enviados pelo usuário

**Retenção:**
- Eventos: 30 dias
- Cache de renders: 24 horas (auto-delete)
- Nenhum armazenamento persistente de uploads

### Conformidade

- ✅ GDPR compliant (EU users)
- ✅ CCPA compliant (US West Coast)
- ✅ Sem tracking de terceiros
- ✅ Política de privacidade clara

---

## 📖 API Reference (Futuro)

```javascript
// Phase 2: Public API para developers

const tronhero = new TronHero({
  canvas: document.getElementById('canvas'),
  source: 'image|webcam|video',
  sourceData: imageElement | videoStream | videoUrl,
  preset: 'tron|matrix|retro|cyber',
  onReady: () => console.log('Ready'),
  onFrame: (frameData) => {}
});

// Métodos
tronhero.setPreset('matrix');
tronhero.setParameter('stiffness', 0.15);
tronhero.export('mp4', { quality: 1080 });
tronhero.destroy();
```

---

## 🎓 Conclusão

**TRONHERO Shader Service** é um produto inovador que democratiza criação de efeitos visuais Matrix/Terminal de alta qualidade.

**Diferenciais:**
1. ✅ Sem GPU/GLSL knowledge required
2. ✅ Web-native, zero instalação
3. ✅ Interatividade real-time
4. ✅ Multi-formato export
5. ✅ Extensível via API

**Sucesso depende de:**
- Launch limpo (MVP solid)
- Community building (showcase user work)
- Continuous iteration (feedback → features)
- Performance excellence (60fps sempre)

---

**Próximos Passos:**
1. ✅ Validar PRD com stakeholders
2. ⏭️ Começar Sprint 1 (Foundation)
3. ⏭️ Setup de dev environment
4. ⏭️ First working prototype em 4 semanas

---

**Referências:**
- `TRONHERO_ENGINEERING.md` — Especificações técnicas do componente original
- `TronHero.tsx` — Implementação React atual
- Design Guidelines: `/skills/guidelines/designer2627.md`

---

**Documento criado em 11 de abril de 2026**  
**Versão 1.0 - Ready for Review**
