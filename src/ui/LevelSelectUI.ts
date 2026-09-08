export class LevelSelectUI {
  private container: HTMLElement;

  private onBackToMenu: () => void;
  private onReturnToGame: () => void;

  constructor(
    onBackToMenu: () => void,
    onReturnToGame: () => void
  ) {
    this.onBackToMenu = onBackToMenu;
    this.onReturnToGame = onReturnToGame;
    this.container = document.createElement('div');
    this.container.id = 'level-screen';
    this.container.className = 'screen pointer-events-none flex flex-col justify-start items-center w-full h-full p-10 transition-all duration-700';
    
    this.container.innerHTML = `
      <div class="level-header text-center mb-6 z-10 pointer-events-auto">
        <h2 class="level-title text-2xl font-light tracking-[0.2em] text-white uppercase mb-1">
          Mapa de Sinapses
        </h2>
        <p class="level-subtitle font-serif italic text-zinc-400 text-xs">
          navegue pela rede neural de Pandora para reintegrar suas memórias
        </p>
      </div>

      <!-- Container do Mapa Neural -->
      <div class="synapse-map-container pointer-events-auto relative w-[95%] max-w-6xl h-[65%] overflow-x-auto overflow-y-hidden border border-white/5 rounded-2xl shadow-inner select-none flex items-center">
        <div id="synapse-network" class="relative w-[3400px] h-full flex items-center">
          <!-- Camada de Conexões em Linhas SVG -->
          <svg id="synapse-svg" class="synapse-svg-layer absolute inset-0 w-full h-full pointer-events-none z-0"></svg>
          <!-- Os nós dinâmicos das sinapses serão gerados aqui via JS -->
        </div>
      </div>

      <!-- Rodapé do Seletor de Fases -->
      <div class="level-footer flex gap-8 z-10 pointer-events-auto mt-6">
        <button id="btn-level-back" class="btn-surreal px-10 py-5 text-sm font-medium uppercase tracking-widest border border-white/10 rounded-xl hover:bg-white/5 transition-all shadow-md">
          Voltar ao Menu
        </button>
        <button id="btn-return-game" class="btn-surreal px-8 py-5 text-sm font-medium uppercase tracking-widest border border-white/20 text-zinc-400 hover:text-zinc-300 hover:border-white/50 rounded-xl hover:bg-white/10 transition-all shadow-md">
          Retornar ao Jogo
        </button>
      </div>
    `;

    this.container.querySelector('#btn-level-back')?.addEventListener('click', this.onBackToMenu);
    this.container.querySelector('#btn-return-game')?.addEventListener('click', this.onReturnToGame);
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public show(): void {
    this.container.classList.add('active', 'pointer-events-auto');
    this.container.classList.remove('pointer-events-none');
  }

  public hide(): void {
    this.container.classList.remove('active', 'pointer-events-auto');
    this.container.classList.add('pointer-events-none');
  }
}
