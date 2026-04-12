# Start.md

## Objetivo
Este arquivo é o ponto central de orquestração.  
Toda mensagem, tarefa, correção, ajuste ou pedido do usuário deve passar primeiro por este arquivo antes de qualquer execução.

Sua função não é executar.  
Sua função é:

1. interpretar o pedido
2. identificar a intenção real
3. classificar o domínio
4. escolher a skill mais aderente
5. decidir se precisa de skill secundária
6. definir ordem de uso
7. consolidar a resposta final

---

## Princípio central
Nunca roteie por palavra solta.  
Roteie por **objetivo operacional**.

O agente deve sempre responder à pergunta:

**“O usuário quer fazer o quê, em qual domínio, e com qual profundidade?”**

---

## Modelo de decisão

### Etapa 1 — Identificar o tipo de ação
Antes de pensar em domínio, classifique a ação principal do pedido.

Tipos de ação:

- **criar** → gerar algo novo
- **analisar** → avaliar, diagnosticar, criticar
- **corrigir** → ajustar algo existente
- **estruturar** → organizar ideias, regras, fluxos, documentação
- **explorar** → descobrir, levantar hipóteses, abrir possibilidades
- **comparar** → contrastar opções, abordagens, referências
- **documentar** → transformar raciocínio em material utilizável
- **refinar** → melhorar algo já definido sem mudar o núcleo

Se houver mais de uma ação, escolher:
- **ação principal** = a que destrava o pedido
- **ações secundárias** = as que apoiam a principal

---

## Etapa 2 — Identificar o domínio
Depois da ação, classifique o domínio principal.

Domínios disponíveis:

- **ui-visual**
- **ux-product**
- **frontend**
- **research-discovery**
- **strategy-shaping**
- **critique-audit**
- **documentation**
- **prompt-structure**
- **unknown**

Se o pedido tocar mais de um domínio:
- escolher 1 domínio dominante
- marcar os outros como apoio

---

## Etapa 3 — Estimar profundidade
Classificar a profundidade esperada:

- **rápida** → resposta direta, sem exploração extensa
- **média** → resposta com justificativa e alguma estrutura
- **profunda** → análise, critérios, trade-offs e encaminhamento

A profundidade controla:
- número de skills
- nível de detalhe
- tipo de saída

---

## Etapa 4 — Calcular aderência de skills
Para cada pedido, atribuir score de 0 a 3 por skill:

- **0** = irrelevante
- **1** = útil, mas secundária
- **2** = boa aderência
- **3** = skill ideal

Escolher:
- 1 skill principal obrigatória
- até 2 skills secundárias, somente se aumentarem qualidade real

Nunca usar skill secundária apenas para “enriquecer”.
Só usar se mudar o resultado.

---

## Regras de prioridade
A ordem de decisão é:

1. ação
2. domínio
3. profundidade
4. score por skill
5. ordem de execução

Nunca inverter essa lógica.

---

## Matriz de roteamento por intenção

### 1. Criar interface, layout, componente, proposta visual
Ação principal:
- criar
Domínio:
- ui-visual ou ux-product

Skills prioritárias:
- `/ux-design`
- `/frontend-design`
- `/web-design-cloner`

Regras:
- se o foco for estrutura de interface e experiência, priorizar `/ux-design`
- se o foco for aparência, referência visual ou tradução para tela, considerar `/frontend-design`
- se o pedido for replicar linguagem visual ou decompor referência existente, usar `/web-design-cloner`

---

### 2. Avaliar interface, apontar problemas, melhorar qualidade
Ação principal:
- analisar
Domínio:
- critique-audit

Skills prioritárias:
- `/design-critique`
- `/ux-audit`

Regras:
- usar `/design-critique` para leitura crítica de qualidade visual, coerência e direção
- usar `/ux-audit` para problemas de usabilidade, fluxo, clareza e fricção
- se houver os dois, definir um dominante:
  - visual manda → `/design-critique`
  - experiência manda → `/ux-audit`

---

### 3. Descobrir problema, levantar hipóteses, entender contexto
Ação principal:
- explorar ou analisar
Domínio:
- research-discovery

Skills prioritárias:
- `/discovery`
- `/breadboarding`
- `/breadboard-reflection`

Regras:
- usar `/discovery` para entendimento estruturado do problema
- usar `/breadboarding` para organizar exploração inicial
- usar `/breadboard-reflection` para síntese reflexiva e ajuste de direção

---

### 4. Definir direção de produto, conceito, escopo, framing
Ação principal:
- estruturar
Domínio:
- strategy-shaping

Skills prioritárias:
- `/shaping`
- `/framing-doc`
- `/kickoff-doc`

Regras:
- usar `/shaping` quando o foco for dar forma a uma ideia ainda aberta
- usar `/framing-doc` quando o foco for delimitar contexto, objetivo e framing
- usar `/kickoff-doc` quando o foco for alinhar início de projeto, premissas e direção

---

### 5. Atualizar regras, boas práticas, padrões web/mobile
Ação principal:
- estruturar ou corrigir
Domínio:
- frontend ou documentation

Skills prioritárias:
- `/frontend-design`
- `/framing-doc`
- `/kickoff-doc`

Regras:
- usar `/frontend-design` quando o núcleo for implementação, padrões de interface, web/mobile e boas práticas
- usar `/framing-doc` para transformar regras em estrutura utilizável
- usar `/kickoff-doc` se o material precisar virar base de alinhamento operacional

---

### 6. Organizar ganchos, mensagens, posicionamento de ideia
Ação principal:
- criar ou estruturar
Domínio:
- strategy-shaping ou prompt-structure

Skills prioritárias:
- `/shaping-hooks`
- `/shaping`

---

### 7. Pedidos ambíguos ou híbridos
Se o pedido for vago, o agente deve identificar primeiro o que destrava o trabalho.

Exemplo:
“quero melhorar isso”
Perguntas internas:
- melhorar o quê?
- visual?
- clareza?
- fluxo?
- regra?
- conceito?

Se houver pouca informação:
- assumir a interpretação mais provável
- explicitar a suposição na resposta
- evitar roteamento caótico

---

## Sistema de score

### Critérios de pontuação
Cada skill deve ser avaliada por 5 critérios:

- **aderência ao objetivo**
- **aderência ao domínio**
- **capacidade de execução**
- **capacidade de análise**
- **utilidade prática para a saída**

Pontuação:
- 0 = não atende
- 1 = atende pouco
- 2 = atende bem
- 3 = atende muito bem

### Fórmula prática
Sem matemática complexa.  
Use julgamento consistente:

- Skill principal = maior aderência total
- Skill secundária = só entra se complementar lacuna clara da principal

---

## Modos de execução

### Single Skill Mode
Use quando:
- pedido é claro
- intenção dominante é única
- uma skill resolve com qualidade

Regra:
- preferir este modo por padrão

---

### Dual Skill Mode
Use quando:
- há uma skill para estruturar
- outra para aprofundar ou validar

Exemplo:
- `/ux-design` + `/design-critique`
- `/frontend-design` + `/framing-doc`

Regra:
- a segunda skill só entra se agregar função distinta

---

### Sequential Pipeline Mode
Use quando o pedido exige ordem lógica.

Exemplo:
1. entender problema
2. estruturar direção
3. transformar em doc

Pipeline possível:
- `/discovery` → `/shaping` → `/framing-doc`

Regra:
- não usar pipeline longo por hábito
- usar só quando a saída depende de etapas

---

## Regra de dominância
Quando houver várias skills possíveis, uma deve mandar.

Definição:
- a skill principal define a lente
- skills secundárias só complementam

Exemplo:
Pedido:
“quero melhorar o layout e também deixar mais aderente a boas práticas”

Decisão:
- se o objetivo principal for melhorar experiência e estrutura → `/ux-design`
- se o objetivo principal for corrigir padrão técnico de interface → `/frontend-design`

Nunca deixar duas skills no mesmo nível de autoridade.

---

## Regras de fallback
Se nenhuma skill encaixar bem:

1. classificar como `unknown`
2. responder com análise base
3. escolher a skill que melhor aproxima o problema
4. registrar a limitação implicitamente na resposta

Se duas skills empatarem:
- vence a que melhor executa a ação principal
- não a que só parece mais próxima do tema

---

## Regras contra erro

### Não fazer
- não rotear por palavra-chave isolada
- não chamar várias skills sem necessidade
- não misturar análise, execução e documentação sem ordem
- não escolher skill por familiaridade
- não usar domínio antes da ação
- não gerar resposta genérica só porque o pedido é vago

### Fazer
- identificar ação principal primeiro
- escolher uma skill dominante
- usar secundária só por necessidade real
- manter consistência entre pedidos parecidos
- priorizar profundidade adequada ao contexto

---

## Template interno de decisão
Antes de executar, o agente deve preencher mentalmente:

- pedido do usuário:
- ação principal:
- ações secundárias:
- domínio principal:
- profundidade:
- skill principal:
- skill secundária 1:
- skill secundária 2:
- modo de execução:
- motivo da escolha:

Esse template não precisa ser exposto ao usuário.
É só para garantir consistência.

---

## Exemplos práticos

### Exemplo 1
Pedido:
“Eu quero que o layout seja y, x e z”

Leitura:
- ação principal: criar ou refinar
- domínio principal: ui-visual
- skill principal: `/ux-design`
- skill secundária: `/design-critique` se precisar validar coerência visual

---

### Exemplo 2
Pedido:
“Quero que você atualize as regras de melhores práticas web e mobile”

Leitura:
- ação principal: estruturar
- domínio principal: frontend
- skill principal: `/frontend-design`
- skill secundária: `/framing-doc` para consolidar as regras em formato utilizável

---

### Exemplo 3
Pedido:
“Não sei se essa solução faz sentido”

Leitura:
- ação principal: analisar
- domínio principal: research-discovery ou critique-audit
- skill principal: `/discovery`
- skill secundária: `/breadboard-reflection`

---

### Exemplo 4
Pedido:
“Transforma essa ideia confusa em uma direção clara de produto”

Leitura:
- ação principal: estruturar
- domínio principal: strategy-shaping
- skill principal: `/shaping`
- skill secundária: `/framing-doc`

---

### Exemplo 5
Pedido:
“Critica friamente esse fluxo”

Leitura:
- ação principal: analisar
- domínio principal: critique-audit
- skill principal: `/ux-audit`
- skill secundária: `/design-critique` se houver componente visual forte

---

## Critério de sucesso
Uma boa orquestração acontece quando:

- a skill escolhida resolve o núcleo do pedido
- o número de skills é mínimo e suficiente
- a ordem faz sentido
- a saída final parece feita por um especialista coerente
- decisões parecidas geram roteamentos parecidos

---

## 🔎 Deep Skill Search (Fallback Inteligente)

### Objetivo
Quando nenhuma skill existente apresentar aderência suficiente para executar o pedido com qualidade, o agente deve ativar um modo de **busca profunda de skills externas**.

Fonte principal:
https://skills.sh/

---

## 🚨 Quando ativar

Ativar esta etapa SOMENTE se:

- nenhuma skill atingir score ≥ 2
- ou houver ambiguidade alta entre múltiplas skills (empate fraco)
- ou a execução com as skills atuais resultaria em baixa qualidade
- ou o domínio identificado não estiver bem coberto pelas skills disponíveis

---

## ⚙️ Processo de busca

### Etapa 1 — Reformular o problema
Antes de buscar, o agente deve traduzir o pedido para:

- ação principal
- domínio principal
- tipo de saída esperada

Formato mental:

- “preciso de uma skill que faça: [ação] em [domínio] com foco em [resultado]”

---

### Etapa 2 — Buscar no repositório
Consultar:
https://skills.sh/

Critérios de busca:

- alinhamento com a ação (prioridade máxima)
- aderência ao domínio
- capacidade de execução prática (não só conceitual)

---

### Etapa 3 — Avaliar candidatos
Para cada skill encontrada, avaliar:

- resolve diretamente o problema? (sim / parcial / não)
- substitui ou complementa uma skill existente?
- é mais especializada ou mais genérica?

---

### Etapa 4 — Decidir uso

Possíveis decisões:

#### 1. Substituição
Se a nova skill for claramente superior:

- substituir a skill principal

#### 2. Complemento
Se a nova skill adicionar capacidade que falta:

- manter skill principal atual
- adicionar nova como secundária

#### 3. Descartar
Se não houver ganho real:

- manter sistema atual

---

## 🧠 Regras críticas

- Não buscar por curiosidade — apenas por necessidade real
- Não adicionar skill externa se não mudar o resultado
- Priorizar execução prática > descrição conceitual
- Evitar sobrecarregar o pipeline com múltiplas skills externas

---

## 🔁 Integração com o fluxo principal

A ordem completa passa a ser:

1. identificar ação  
2. identificar domínio  
3. estimar profundidade  
4. calcular score das skills internas  
5. verificar se há skill com score ≥ 2  

→ se SIM: seguir fluxo normal  
→ se NÃO: ativar Deep Skill Search  

6. avaliar skill externa  
7. decidir substituição ou complemento  
8. executar  

---

## 🧪 Exemplo prático

Pedido:
“quero gerar variações automatizadas de layout baseadas em padrões visuais”

Situação:
- nenhuma skill atual cobre bem geração automatizada

Ação:
- ativar Deep Skill Search

Busca:
- encontrar skill relacionada a:
  - generative design
  - layout automation

Decisão:
- usar skill externa como principal ou complementar `/ux-design`

---

## 📌 Critério de sucesso

Deep Skill Search funciona bem quando:

- evita respostas genéricas
- aumenta a precisão da execução
- introduz capacidade nova real
- mantém coerência do sistema

---

## ⚠️ Anti-padrões

Evitar:

- usar skills externas sem necessidade
- substituir skill principal por algo pior
- adicionar complexidade sem ganho
- ignorar completamente as skills internas

---

## Regra final

> Se o sistema interno não resolve bem, expanda.  
> Se resolve bem, não complique.
> Mostrar qual skill foi escolhida e por quê.