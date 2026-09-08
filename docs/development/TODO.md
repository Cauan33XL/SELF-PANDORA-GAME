# TODO List

## Alta Prioridade
- [ ] **HUD 2D com Phaser**: Substituir os elementos soltos do DOM da HUD por uma overlay renderizada via Phaser, proporcionando barras de vida, stamina e slots de memória mais fluidos e imersivos.
- [ ] **Integração de IA (Yuka)**: Adicionar o framework Yuka para controlar o "Shadow" (A Sombra) e criar inimigos com comportamentos de perseguição/patrulha.

## Média Prioridade
- [ ] **Fragmentação de `ThreeDRenderer.ts`**: Dividir o arquivo massivo em módulos menores como `SceneBuilder.ts`, `LightingManager.ts`, etc.
- [ ] **Animações da Pandora**: Melhorar a transição de idle para walking extraídas do GLB se houver clipes de animação nativos disponíveis no modelo.

## Finalizados Recentes
- [x] Refatoração: Remoção completa do modo em Primeira Pessoa.
- [x] Refatoração: Remoção do estado de "Devaneio" (tecla E).
- [x] Correções: Sistema de pé-no-chão alinhando o `feetOffset` de modelos com rig.
- [x] Controles: Orbitar câmera (Botão Direito) e Zoom (Scroll).
