export class MainMenuUI {
  private container: HTMLElement;
  private topContainer: HTMLElement;

  private onStartGame: () => void;
  private onOpenDiary: () => void;
  private onOpenCredits: () => void;

  constructor(
    onStartGame: () => void,
    onOpenDiary: () => void,
    onOpenCredits: () => void
  ) {
    this.onStartGame = onStartGame;
    this.onOpenDiary = onOpenDiary;
    this.onOpenCredits = onOpenCredits;
    
    // Container base (Fica atrás do CRT, contém os botões e vidro)
    this.container = document.createElement('div');
    this.container.id = 'menu-screen-base';
    this.container.className = 'screen pointer-events-none flex flex-col justify-center items-center w-full h-full transition-all duration-700';
    
    this.container.innerHTML = `
      <div class="glass-panel menu-container flex flex-col items-center justify-between min-h-[60vh] max-w-3xl w-[90%] py-20 px-12 text-center border border-white/10 bg-black/30 backdrop-blur-3xl rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.02)] scale-100 transition-transform duration-500 hover:shadow-[0_0_100px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(255,255,255,0.05)] hover:border-white/20">
        
        <div class="flex flex-col items-center w-full min-h-[140px] opacity-0">
          <!-- Espaço reservado para o título (que está na camada superior) -->
        </div>

        <div class="menu-options flex flex-col gap-4 w-[60%] max-w-[280px] my-12 mx-auto">
          <button id="btn-start-game" class="btn-surreal relative overflow-hidden group w-full h-16 text-lg font-bold uppercase tracking-[0.3em] border border-white/30 hover:border-white rounded-[2rem] bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
            <span class="relative z-10 w-full h-full flex items-center justify-center gap-4">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_15px_#ffffff]"></span>
              Iniciar
              <span class="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_15px_#ffffff]"></span>
            </span>
            <div class="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
          <button id="btn-open-diary" class="btn-surreal relative overflow-hidden group w-full h-16 text-lg font-bold uppercase tracking-[0.3em] border border-white/10 hover:border-white/50 rounded-[2rem] bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            <span class="relative z-10 w-full h-full flex items-center justify-center">Diário</span>
          </button>
          <button id="btn-open-credits" class="btn-surreal relative overflow-hidden group w-full h-16 text-lg font-bold uppercase tracking-[0.3em] border border-white/10 hover:border-white/40 rounded-[2rem] bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span class="relative z-10 w-full h-full flex items-center justify-center">Créditos</span>
          </button>
        </div>
        
        <div class="flex flex-col items-center w-full -translate-y-12">
          <div class="text-xs text-zinc-500 tracking-[0.4em] uppercase font-light">
            Speculum Sui, Abyssus Mentis
          </div>
          <div class="w-32 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent mt-4"></div>
        </div>
        
      </div>
    `;

    // Container do Topo (Fica na frente do CRT, contém apenas o título)
    this.topContainer = document.createElement('div');
    this.topContainer.id = 'menu-screen-top';
    this.topContainer.className = 'screen pointer-events-none flex flex-col justify-center items-center w-full h-full transition-all duration-700 absolute inset-0';
    
    this.topContainer.innerHTML = `
      <div class="flex flex-col items-center justify-start min-h-[60vh] max-w-3xl w-[90%] py-20 px-12 text-center pointer-events-none">
        <div class="flex flex-col items-center w-full pointer-events-auto translate-y-12">
          <!-- Animated decorative top element -->
          <div class="w-24 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent mb-10 opacity-70"></div>
          
          <h1 class="game-title text-5xl sm:text-7xl font-normal tracking-[0.35em] text-white uppercase text-shadow-lg mb-4 pl-[0.35em] animate-[title-breathe_6s_ease-in-out_infinite]">
            O Self de Pandora
          </h1>
          <div class="h-[1px] w-32 bg-white/20 mb-6 mt-2"></div>
          <p class="game-subtitle font-serif italic text-zinc-300 tracking-[0.2em] text-sm opacity-90 mt-20">
            despertando no abismo do próprio reflexo
          </p>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-start-game')?.addEventListener('click', this.onStartGame);
    this.container.querySelector('#btn-open-diary')?.addEventListener('click', this.onOpenDiary);
    this.container.querySelector('#btn-open-credits')?.addEventListener('click', this.onOpenCredits);
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public getTopElement(): HTMLElement {
    return this.topContainer;
  }

  public show(): void {
    this.container.classList.add('active', 'pointer-events-auto');
    this.container.classList.remove('pointer-events-none');
    
    this.topContainer.classList.add('active');
    this.topContainer.classList.remove('pointer-events-none');
    this.topContainer.style.pointerEvents = 'none';
  }

  public hide(): void {
    this.container.classList.remove('active', 'pointer-events-auto');
    this.container.classList.add('pointer-events-none');
    
    this.topContainer.classList.remove('active');
    this.topContainer.classList.add('pointer-events-none');
    this.topContainer.style.pointerEvents = 'none';
  }
}
