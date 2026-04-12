# 🛡️ TronHero Engineering Specs
**Engine de Tipografia Generativa e Física de Partículas**

## 1. Visão Geral
O `TronHero` é uma engine de renderização 2D baseada em HTML5 Canvas, projetada para processamento de alta densidade de caracteres ( ~10.400 partículas simultâneas) com resposta física em tempo real.

## 2. Arquitetura de Dados (ASCII Matrix)
Diferente de sistemas de partículas tradicionais que usam formas geométricas, esta engine utiliza um **Campo de Escala de Densidade**:
- **Source:** `/img/wess_tron_raw.txt` (Arquivo de texto bruto).
- **Mapping:** Cada caractere no TXT representa um nível de brilho (0 a 4).
- **Lookup Table (POOLS):** Um array de strings que define a "massa visual" de cada caractere (e.g., `.` para luz fraca, `&` para luz intensa).

## 3. Dinâmica de Partículas (Verlet Integration Lite)
Cada partícula no Canvas opera sob um regime de **Física de Restauração**:
- **Âncoras (`ox`, `oy`):** Coordenadas originais baseadas no grid ASCII.
- **Estado Atual (`px`, `py`):** Posição afetada por forças externas.
- **Força de Mola:** Uma aceleração constante `(anchor - current) * stiffness` que tenta retornar a partícula à sua origem.
- **Fricção (Damping):** Um multiplicador de velocidade (0.84) para evitar oscilações infinitas.

## 4. Interaction Matrix (Cursor Influence)
O rastro do cursor não é um ponto único, mas uma **Lista de Trail Estocástica**:
- Cada movimento do mouse adiciona um ponto com `age` (idade).
- Partículas dentro de um `RADIUS` de 380px calculam a distância quadrada (`distSq`) para evitar o custo de `Math.sqrt`.
- O deslocamento é baseado em penetração de raio: quanto mais perto do cursor, maior o "empurrão".

## 5. Ciclos de Estado (Text Clusters)
As informações textuais laterais utilizam um **Sistema de Machine State** autônomo:
- **Typing:** Incremento progressivo de caracteres via delay aleatório.
- **Hold:** Timer de retenção visual.
- **Deleting:** Decremento progressivo (efeito retro-terminal).
- **Blink Logic:** Utiliza timestamp global para simular o cursor `█` em 400ms.

## 6. Otimizações de Performance
- **willReadFrequently:** Habilitado para otimizar leitura de buffer do Canvas.
- **DPR Scaling:** Sincronização automática com `window.devicePixelRatio` para garantir nitidez em telas Retina/4K.
- **Double Buffering Virtual:** Separação entre o Canvas de fundo (estático/clusters) e o Canvas principal (partículas dinâmicas).

## 7. Aplicação em `wshaders`
Para transformar isso em uma ferramenta, o core de `loop()` deve ser abstraído para aceitar um `MediaStream` ou `ImageData` como fonte de bitmap, permitindo que qualquer imagem ou vídeo seja "tronificado" em tempo real.
