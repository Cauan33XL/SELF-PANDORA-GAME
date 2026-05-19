# O Self de Pandora

> **"Eu não preciso te eliminar. Você é parte de quem eu sou."**  
> *Um jogo de exploração e plataforma 3D psicológico, abstrato e atmosférico sobre a jornada de integrar as próprias fragilidades.*

---

## 📖 O Conceito e a Narrativa

**O Self de Pandora** acompanha Pandora, uma garota extremamente imaginativa e melancólica que vive constantemente dividida entre o mundo cotidiano e os espaços impossíveis criados por sua própria mente.

Enquanto tenta levar uma vida normal, Pandora enfrenta dificuldades causadas por seus devaneios intensos e sua percepção incomum da realidade. Aquilo que parece apenas distração ou estranheza no dia a dia esconde uma dimensão interior viva, simbólica e mutável: o **Self**, uma realidade abstrata formada por memórias fragmentadas, emoções reprimidas, medos silenciosos e construções psicológicas.

O jogo se divide em **33 fases** baseadas em estados de espírito (como *Dúvida*, *Solidão*, *Ansiedade*, *Melancolia* e *Aceitação*). O gameplay não gira em torno de destruir inimigos, mas sim de explorar, escutar a si mesma, coletar seus pensamentos perdidos e, acima de tudo, **integrar a sua Sombra** — uma manifestação de suas inseguranças e traumas que a persegue no mundo dos sonhos, mas que serve como suporte crucial quando compreendida e aceita.

---

## 🎨 Design e Estética Premium

A interface e o ambiente de *O Self de Pandora* foram construídos para causar impacto visual e sonoro imediato, utilizando técnicas modernas de web design e renderização 3D em tempo real com **Three.js**:

*   **Tipografia Curada**: Uso harmônico das fontes **Outfit** (para títulos limpos, modernos e ligeiramente espaçados) e **Lora** (uma serifada elegante e reflexiva para textos de história e o diário de memórias).
*   **Filtros Glassmorphic**: Painéis translúcidos com efeito de vidro fosco (`backdrop-filter: blur`), bordas finas e brilhantes e sombras suaves que destacam o HUD e o Diário sem quebrar o clima melancólico do jogo.
*   **Ambiente 3D Imersivo**: Uma abóbada celeste dinâmica (Sky Sphere) com texturas de dia/noite que alternam entre a *Realidade* e o *Devaneio*, além de uma névoa espessa e partículas ambientais que dançam ao sabor do vento procedimental.
*   **Iluminação e Pós-processamento**: Uso de iluminação direcional e fontes de luz pontuais coloridas (púrpura e ciano) que mudam de cor e intensidade dinamicamente. Efeitos de pós-processamento aplicados através de `EffectComposer`, incluindo um brilho difuso intenso (`UnrealBloomPass`) que realça o ambiente no modo Devaneio.
*   **Efeito CRT Retrô & Glitch**: Uma máscara CRT de tubo simulada sobre o jogo para dar uma estética analógica vintage. Ao sofrer contato com a Sombra no *Devaneio*, o jogo simula uma violenta desestabilização gráfica com distorções visuais e tremor de câmera.

---

## 🎧 Sonoplastia Procedural em Tempo Real

O jogo conta com um motor de áudio procedural construído sobre a **Web Audio API** do navegador. **Não há arquivos de áudio externos (MP3/WAV)**; todos os sons são sintetizados matematicamente em tempo real:

1.  **O Drone Atmosférico (C Minor)**: Uma textura de fundo profunda composta por quatro osciladores (misturando ondas senoidais e triangulares) afinados na escala de Dó Menor com desafinação sutil para criar um efeito de coro. Um oscilador de baixa frequência (LFO) varre o filtro passa-baixa lentamente.
    *   No estado de *Realidade*, o som é abafado (passa-baixa denso em 300Hz) e calmo.
    *   Ao alternar para o *Devaneio*, o drone se torna um filtro passa-banda brilhante de 650Hz, ressonante e espacial.
2.  **Batimento Cardíaco Dinâmico**: Um sintetizador analógico de bumbo com envelope exponencial e sub-graves. A frequência dos batimentos (BPM) acelera organicamente à medida que a Sombra se aproxima de Pandora no *Devaneio*, gerando uma forte tensão psicológica.
3.  **Chimes Crystalline (Coleta)**: Ao capturar um fragmento de pensamento, o sintetizador dispara um arpejo consonante ascendente de ondas triangulares e senoidais com decaimento longo, simulando sinos de cristal.
4.  **Varreduras de Frequência**: Efeitos dinâmicos de pitch para pulos (sopro agudo ascendente), aterrissagens (impacto de baixa frequência) e transições de mundo (um sweep pesado que desce na realidade e sobe no devaneio).

---

## 🕹️ Mecânicas de Gameplay e Controles

O jogo equilibra exploração tridimensional, orientação espacial e manipulação de realidades:

*   **Perspectiva de Câmera Alternável**: Alterne perfeitamente entre visão em **Primeira Pessoa** (imersiva, direta) e **Terceira Pessoa** (visão do modelo 3D de Pandora e do seu entorno).
*   **Física de Navegação em Plano 3D**: Controle Pandora rotacionando e movimentando-se para frente e para trás, guiado por um radar HUD holográfico no canto inferior esquerdo que mostra a direção dos fragmentos de pensamento, do portal de saída e da Sombra.
*   **Alternância de Estados (Reality & Reverie)**: Pandora transita entre a *Realidade* (física padrão, texturas rochosas) e o *Devaneio* (visual neon violeta, física acelerada e plataformas flutuantes móveis/ocultas reveladas).
*   **Onda de Lucidez (Lucidity Wave)**: Dispara um pulso radial de energia que afasta e atordoa temporariamente a Sombra que a persegue.
*   **A Sombra Inteligente**: Manifestação dos medos de Pandora, apresentando quatro comportamentos dinâmicos:
    *   `stationary`: Paira de forma estática em um ponto chave do cenário.
    *   `mirror`: Imita a trajetória de passos de Pandora com um atraso de buffer.
    *   `chase`: Persegue Pandora ativamente quando ela entra no *Devaneio* (com batimentos cardíacos sonoros acelerando conforme ela se aproxima).
    *   `companion`: Uma aliada que serve como um anteparo ou barreira física sólida para ajudar na locomoção.

### Controles Rápidos:
| Tecla / Ação | Ação no Jogo |
| :--- | :--- |
| **A / D** ou **Seta Esquerda / Direita** | Rotacionar a personagem |
| **W / S** ou **Seta Acima / Abaixo** | Mover-se para frente / trás |
| **Espaço** ou **Shift** ou **Q** ou **E** | Alternar entre *Realidade* (Reality) e *Devaneio* (Reverie) |
| **E** ou **Clique do Mouse** | Disparar Onda de Lucidez |
| **C** | Alternar Câmera (Primeira ou Terceira Pessoa) |
| **Esc** ou **Botão Sair** | Retornar ao Mapa de Sinapses |
| **Botão de Som (HUD)** | Ativar / Mutar sintetizadores procedurais |
| **Botão CRT (HUD)** | Ativar / Desativar filtro retrô de tela CRT |

---

## 🧠 O Mapa de Sinapses e o Diário

*   **Rede Neural Interativa**: O seletor de fases renderiza as **33 fases** como nós de uma rede neural em um mapa SVG rolável horizontalmente de `3100px`. Linhas de sinapses conectam os nós e mudam de cor conforme as fases são completadas.
*   **Diário do Self**: Acessível pelo menu principal. À medida que o jogador completa as fases, páginas correspondentes são desbloqueadas no Diário. Cada página contém reflexões íntimas e poéticas escritas por Pandora sobre o estado emocional daquele nível.

---

## 📁 Estrutura de Arquivos do Projeto

O código do jogo foi meticulosamente projetado em **TypeScript** com separação estrita de responsabilidades e integração com o motor **Three.js**:

```text
SELF-PANDORA-GAME/
├── index.html                  # Layout de tela cheia, HUD e contêineres de diário
├── package.json                # Gerenciador de dependências e scripts Vite
├── tsconfig.json               # Configurações estritas do compilador TypeScript
├── LICENSE                     # Licença GNU GPL v3.0
├── README.md                   # Documentação detalhada do projeto
├── public/                     # Pasta de recursos estáticos do servidor
│   ├── textures/               # Texturas ambientais e plataformas (sky spheres, ground, etc.)
│   └── icons/                  # Vetores gráficos e o Favicon Premium (favicon.png)
└── src/
    ├── style.css               # Design System, variáveis HSL, painéis glassmorphism
    ├── main.ts                 # Ponto de entrada que inicializa o GameCoordinator
    └── game/
        ├── Player.ts           # Física AABB de Pandora, movimento direcional e lógica local
        ├── Shadow.ts           # IA da Sombra, rotinas de perseguição e plataforma companion
        ├── AudioManager.ts     # Sintetizadores de som procedural via Web Audio API
        ├── LevelManager.ts     # Gerador de banco de dados procedimental das 33 fases
        ├── levelsData.ts       # Configurações brutas (textos, gravidade, ventos, névoa e sombras)
        ├── ThoughtsUI.ts       # Typewriter cinemático e listagem dinâmica do Diário do Self
        ├── ThreeDRenderer.ts   # Renderizador 3D (Câmera, Luzes, UnrealBloom, Névoa e Meshes)
        └── GameCoordinator.ts  # Master Loop, físicas, colisões, eventos de teclado e HUD
```

---

## 🚀 Como Instalar e Executar Localmente

Certifique-se de possuir o **Node.js** instalado em seu sistema operacional.

1. **Clonar ou navegar até o diretório do projeto**:
   ```bash
   cd SELF-PANDORA-GAME
   ```

2. **Instalar as dependências necessárias**:
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento local**:
   ```bash
   npm run dev
   ```
   *O console exibirá o endereço local, geralmente `http://localhost:5173/`. Abra esta URL no seu navegador.*

4. **Checagem de tipos estrita (TypeScript)**:
   ```bash
   npx tsc --noEmit
   ```

5. **Compilar a versão de produção**:
   ```bash
   npm run build
   ```
   *Este comando compila o código TypeScript e otimiza o bundle final de distribuição na pasta `dist/`.*

---

## 📄 Licença

Este projeto está licenciado sob a **GNU General Public License v3.0** - consulte o arquivo [LICENSE](file:///home/coelho-branco/Documentos/PROJETOS GERAIS/GAMES PROJETOS/GAMES/SELF-PANDORA-GAME/LICENSE) para obter mais detalhes.
