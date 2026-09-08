import { BaseUIComponent } from '../core/BaseUIComponent';

export class LoadingUI extends BaseUIComponent {
  constructor() {
    super('loading-screen', 'screen active pointer-events-auto flex flex-col justify-center items-center w-full h-full transition-all duration-1000 bg-[#0c0c0e]/95 z-50');
    
    this.container.innerHTML = `
      <div class="glass-panel max-w-md w-[85%] p-10 text-center border border-white/5 bg-zinc-950/80 backdrop-blur-2xl rounded-2xl shadow-2xl flex flex-col items-center gap-6">
        <div class="relative w-16 h-16 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full border border-white/30 animate-ping"></div>
          <div class="absolute w-12 h-12 rounded-full border border-zinc-500/40 bg-zinc-900/20 shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center">
            <span class="w-4 h-4 rounded-full bg-white shadow-[0_0_8px_#ffffff]"></span>
          </div>
        </div>

        <div class="flex flex-col gap-2 w-full">
          <h2 class="text-xl sm:text-2xl font-extralight tracking-[0.3em] text-white uppercase pl-[0.3em]">
            O Self de Pandora
          </h2>
          <div class="h-[1px] w-12 bg-white/20 mx-auto my-1"></div>
          <p id="loading-status-text" class="text-[10px] text-zinc-400 uppercase tracking-[0.25em] font-light">
            Estabelecendo conexões neurais...
          </p>
        </div>

        <div class="w-full relative h-[3px] bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div id="loading-progress-bar" class="h-full bg-gradient-to-r from-white via-zinc-500 to-white transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.4)]" style="width: 0%;"></div>
        </div>
        
        <p id="loading-poetic-quote" class="font-serif italic text-xs text-zinc-500 leading-relaxed mt-2 max-w-[280px]">
          "As sombras dão forma às memórias..."
        </p>
      </div>
    `;
  }

  protected override onHide(): void {
    super.onHide();
    setTimeout(() => {
      if (!this.container.classList.contains('active')) {
        this.container.style.display = 'none';
      }
    }, 1000);
  }

  protected override onShow(): void {
    this.container.style.display = '';
    super.onShow();
  }
}
