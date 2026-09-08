import { BaseUIComponent } from '../core/BaseUIComponent';

export class MainMenuUI extends BaseUIComponent {
  private topContainer: HTMLElement;

  private onStartGame: () => void;
  private onOpenDiary: () => void;
  private onOpenCredits: () => void;

  constructor(
    onStartGame: () => void,
    onOpenDiary: () => void,
    onOpenCredits: () => void
  ) {
    super('menu-screen-base', 'screen pointer-events-none flex flex-col justify-center items-center w-full h-full transition-all duration-700');
    
    this.onStartGame = onStartGame;
    this.onOpenDiary = onOpenDiary;
    this.onOpenCredits = onOpenCredits;
    
    this.container.innerHTML = `
      <div class="glass-panel menu-container flex flex-col items-center justify-between min-h-[65vh] max-w-4xl w-[95%] py-24 px-12 text-center border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(255,255,255,0.03)] scale-100 transition-all duration-700 hover:shadow-[0_0_120px_rgba(0,0,0,1),inset_0_0_50px_rgba(255,255,255,0.06)] hover:border-white/20">
        
        <div class="flex flex-col items-center w-full min-h-[160px] opacity-0">
          <!-- Espaço reservado para o título (camada superior) -->
        </div>

        <div class="menu-options flex flex-col gap-6 w-[70%] max-w-[320px] my-12 mx-auto">
          
          <button id="btn-start-game" style="animation-delay: 0.2s" class="btn-surreal animate-[fade-in-up_0.8s_ease-out_forwards] opacity-0 relative overflow-hidden group w-full h-16 text-xl font-bold uppercase tracking-[0.4em] border border-white/40 hover:border-white rounded-[2rem] bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
            <span class="relative z-10 w-full h-full flex items-center justify-center gap-4">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_20px_#ffffff] group-hover:scale-150 transition-transform"></span>
              INICIAR
              <span class="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_20px_#ffffff] group-hover:scale-150 transition-transform"></span>
            </span>
            <div class="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
          
          <button id="btn-open-diary" style="animation-delay: 0.4s" class="btn-surreal animate-[fade-in-up_0.8s_ease-out_forwards] opacity-0 relative overflow-hidden group w-full h-14 text-sm font-semibold uppercase tracking-[0.3em] border border-white/10 hover:border-white/50 rounded-[2rem] bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            <span class="relative z-10 w-full h-full flex items-center justify-center transition-transform group-hover:scale-110">DIÁRIO</span>
          </button>
          
          <button id="btn-open-credits" style="animation-delay: 0.6s" class="btn-surreal animate-[fade-in-up_0.8s_ease-out_forwards] opacity-0 relative overflow-hidden group w-full h-14 text-sm font-semibold uppercase tracking-[0.3em] border border-white/10 hover:border-white/40 rounded-[2rem] bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <span class="relative z-10 w-full h-full flex items-center justify-center transition-transform group-hover:scale-110">CRÉDITOS</span>
          </button>
        </div>
        
        <div class="flex flex-col items-center w-full mt-auto mb-4" style="animation-delay: 0.8s; animation: fade-in-up 1s ease-out forwards; opacity: 0;">
          <div class="text-[0.65rem] text-zinc-600 tracking-[0.6em] uppercase font-light">
            Speculum Sui, Abyssus Mentis
          </div>
          <div class="w-48 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/30 to-transparent mt-6"></div>
        </div>
        
      </div>
    `;

    // Container do Topo (Fica na frente do CRT, contém apenas o título)
    this.topContainer = document.createElement('div');
    this.topContainer.id = 'menu-screen-top';
    this.topContainer.className = 'screen pointer-events-none flex flex-col justify-center items-center w-full h-full transition-all duration-700 absolute inset-0';
    
    this.topContainer.innerHTML = `
      <div class="flex flex-col items-center justify-start min-h-[65vh] max-w-4xl w-[95%] py-24 px-12 text-center pointer-events-none">
        <div class="flex flex-col items-center w-full pointer-events-auto translate-y-8">
          
          <div class="w-32 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent mb-12 opacity-80 animate-[fade-in-up_1s_ease-out_forwards]"></div>
          
          <h1 class="game-title text-6xl sm:text-8xl font-black tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 uppercase text-shadow-lg mb-6 pl-[0.4em] animate-[title-breathe_5s_ease-in-out_infinite,fade-in-up_1.2s_ease-out_forwards] opacity-0" style="font-family: 'Orbitron', sans-serif;">
            O Self de Pandora
          </h1>
          
          <div class="h-[2px] w-48 bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8 mt-4 animate-[fade-in-up_1.4s_ease-out_forwards] opacity-0"></div>
          
          <p class="game-subtitle font-serif italic text-zinc-400 tracking-[0.25em] text-base opacity-0 mt-8 animate-[fade-in-up_1.6s_ease-out_forwards]">
            despertando no abismo do próprio reflexo
          </p>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-start-game')?.addEventListener('click', this.onStartGame);
    this.container.querySelector('#btn-open-diary')?.addEventListener('click', this.onOpenDiary);
    this.container.querySelector('#btn-open-credits')?.addEventListener('click', this.onOpenCredits);

    this.setupKeyboardNavigation();
  }

  private selectedIndex = 0;
  private buttons: HTMLButtonElement[] = [];
  private isActive = false;

  private setupKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;

      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.selectedIndex = (this.selectedIndex + 1) % this.buttons.length;
        this.updateSelection();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.selectedIndex = (this.selectedIndex - 1 + this.buttons.length) % this.buttons.length;
        this.updateSelection();
      } else if (e.key === 'Enter' || e.key === ' ') {
        this.buttons[this.selectedIndex]?.click();
      }
    });
  }

  private updateSelection() {
    this.buttons.forEach((btn, index) => {
      if (index === this.selectedIndex) {
        btn.classList.add('selected');
        // Adiciona um feedback visual na label se for o primeiro botão
        const labelText = btn.querySelector('span');
        if (labelText) labelText.classList.add('scale-110');
      } else {
        btn.classList.remove('selected');
        const labelText = btn.querySelector('span');
        if (labelText) labelText.classList.remove('scale-110');
      }
    });
  }

  public getTopElement(): HTMLElement {
    return this.topContainer;
  }

  protected override onShow(): void {
    super.onShow();
    this.isActive = true;
    
    this.topContainer.classList.add('active');
    this.topContainer.classList.remove('pointer-events-none');
    this.topContainer.style.pointerEvents = 'none';

    this.buttons = [
      this.container.querySelector('#btn-start-game') as HTMLButtonElement,
      this.container.querySelector('#btn-open-diary') as HTMLButtonElement,
      this.container.querySelector('#btn-open-credits') as HTMLButtonElement
    ].filter(Boolean);
    
    this.selectedIndex = 0;
    this.updateSelection();
  }

  protected override onHide(): void {
    super.onHide();
    this.isActive = false;
    
    this.topContainer.classList.remove('active');
    this.topContainer.classList.add('pointer-events-none');
    this.topContainer.style.pointerEvents = 'none';
  }
}
