# O Self de Pandora

> **"Eu não preciso te eliminar. Você é parte de quem eu sou."**  
> *Um jogo de plataforma 2D psicológico, abstrato e atmosférico sobre a jornada de integrar as próprias fragilidades.*

---

## 📖 O Conceito e a Narrativa

**O Self de Pandora** acompanha Pandora, uma garota extremamente imaginativa e melancólica que vive constantemente dividida entre o mundo cotidiano e os espaços impossíveis criados por sua própria mente.

Enquanto tenta levar uma vida normal, Pandora enfrenta dificuldades causadas por seus devaneios intensos e sua percepção incomum da realidade. Aquilo que parece apenas distração ou estranheza no dia a dia esconde uma dimensão interior viva, simbólica e mutável: o **Self**, uma realidade abstrata formada por memórias fragmentadas, emoções reprimidas, medos silenciosos e construções psicológicas.

O jogo se divide em **33 fases** baseadas em estados de espírito (como *Dúvida*, *Solidão*, *Ansiedade*, *Melancolia* e *Aceitação*). O gameplay não gira em torno de destruir inimigos, mas sim de explorar, escutar a si mesma, coletar seus pensamentos perdidos e, acima de tudo, **integrar a sua Sombra** — uma manifestação de suas inseguranças e traumas que a persegue no mundo dos sonhos, mas que serve como suporte crucial quando compreendida e aceita.

---

## 🎨 Design e Estética Premium

A interface de *O Self de Pandora* foi construída para causar impacto visual e sonoro imediato, utilizando técnicas modernas de web design:

*   **Tipografia Curada**: Uso harmônico das fontes **Outfit** (para títulos limpos, modernos e ligeiramente espaçados) e **Lora** (uma serifada elegante e reflexiva para textos de história e o diário de memórias).
*   **Filtros Glassmorphic**: Painéis translúcidos com efeito de vidro fosco (`backdrop-filter: blur`), bordas finas e brilhantes e sombras suaves que destacam o HUD e o Diário sem quebrar o clima melancólico do jogo.
*   **Iluminação Dinâmica e Foco**: A tela do jogo é constantemente coberta por uma máscara de escuridão profunda (com opacidade acentuada em fases de *Ansiedade/Dúvida*), recortando uma lanterna suave radial ao redor de Pandora, representando sua auto-percepção.
*   **Vignette & Efeitos de Glitch**: Um filtro cinemático escurece os cantos do Canvas. Em caso de contato com a Sombra no *Devaneio*, a tela sofre uma violenta desestabilização gráfica (*RGB color shift*, fatias horizontais deslocadas e estática analógica de white noise).
*   **Ondas de Fundo Fluidas**: No Menu Principal, o Canvas renderiza ondas senoidais translúcidas em tempo real que se movem de forma hipnótica, criando uma atmosfera contemplativa.

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

O jogo equilibra plataforma precisa com manipulação de realidades:

*   **Alternância de Estados (Reality & Reverie)**: Ao apertar **Espaço** ou **Shift Esquerdo**, Pandora transita entre a *Realidade* (cinza, melancólica, física pesada) e o *Devaneio* (violeta-neon, física leve e plataformas ocultas reveladas).
*   **Silhueta Flexível (Squash & Stretch)**: O corpo vetorial de Pandora achata-se ao aterrissar e estica-se ao saltar, dando uma sensação orgânica e fluida de inércia.
*   **Escalada e Salto na Parede (Wall Jump)**: Pandora pode escorregar por superfícies verticais e realizar saltos angulares sucessivos para escalar poços profundos.
*   **A Sombra Inteligente**: Apresenta quatro comportamentos distintos de acordo com a fase:
    *   `stationary`: Paira pulsando em um ponto chave do cenário.
    *   `mirror`: Imita a trajetória exata feita por Pandora com um buffer de atraso de 0.8 segundos.
    *   `chase`: Flutua agressivamente em direção à personagem apenas quando esta entra no *Devaneio*. O contato força Pandora de volta à *Realidade* com um coice de física e efeito de glitch.
    *   `companion`: A Sombra torna-se estável e age como uma **plataforma sólida e flutuante** brilhante, na qual a jogadora pode subir para alcançar locais inacessíveis.

### Controles Rápidos:
| Tecla | Ação |
| :--- | :--- |
| **A / D** ou **Seta Esquerda / Direita** | Correr Horizontalmente (com aceleração e inércia) |
| **W** ou **Seta Acima** | Pular / Escalar Parede |
| **Espaço** ou **Shift Esquerdo** | Alternar entre *Realidade* (Reality) e *Devaneio* (Reverie) |
| **Esc** | Sair da fase ativa e retornar ao Mapa de Sinapses |
| **Clique no Ícone de Som** | Ativar / Mutar os Sintetizadores procedurais |

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
        ├── Player.ts           # Física AABB de Pandora, Wall-jump, Squash/Stretch e lógica local
        ├── Shadow.ts           # IA da Sombra, rotinas de perseguição e deformações visuais
        ├── AudioManager.ts     # Sintetizadores de som procedural via Web Audio API
        ├── LevelManager.ts     # Gerador de banco de dados procedimental das 33 fases
        ├── levelsData.ts       # Configurações brutas (textos, gravidade, ventos, névoa e sombras)
        ├── ThoughtsUI.ts       # Typewriter cinemático e listagem dinâmica do Diário do Self
        ├── ThreeDRenderer.ts   # Renderizador 2.5D/3D (Câmera, Luzes, UnrealBloom, Névoa e Meshes)
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
