# Arquitetura do Projeto

O jogo é construído usando um stack moderno para web:
- **Vite + TypeScript**: Build system rápido e código fortemente tipado.
- **Three.js**: Renderização 3D, câmeras, cenários procedurais e shaders (CRT/Glitch).
- **Rapier.js**: Engine de física determinística para colisões e gravidade.
- **Phaser 3**: [EM BREVE] Usado primariamente para uma HUD 2D performática e independente.

## Organização de Pastas (`src/`)
- `game/`: Lógica central do jogo
  - `core/`: Maestros do fluxo (`GameCoordinator.ts`, `AudioManager.ts`).
  - `entities/`: Representações visuais e físicas dos personagens (`Player.ts`, `Shadow.ts`).
  - `level/`: Lógica de spawn de plataformas e dados dos níveis (`LevelManager.ts`, `levelsData.ts`).
  - `renderer/`: Comunicação direta com a engine do Three.js (`ThreeDRenderer.ts`).
- `ui/`: Menus em HTML/DOM, que flutuam sobre o canvas do Three.js (`UIManager.ts` e afins).
- `phaser/`: [EM BREVE] Lógica da HUD avançada.

## O Game Loop
Tudo é orquestrado pelo `GameCoordinator.ts`. Ele cria a física (`physicsWorld`), inicia a renderização (`ThreeDRenderer.ts`), captura o input do DOM/Janela e, no `requestAnimationFrame`, invoca os updates dos componentes sequencialmente.
