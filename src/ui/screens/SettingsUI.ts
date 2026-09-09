import { BaseUIComponent } from '../core/BaseUIComponent';

export class SettingsUI extends BaseUIComponent {
  private onClose: () => void;
  private onToggleAudio: () => void;
  private onToggleCrt: () => void;
  private onExitToMenu: () => void;

  constructor(
    onClose: () => void,
    onToggleAudio: () => void,
    onToggleCrt: () => void,
    onExitToMenu: () => void
  ) {
    super('settings-screen', 'screen pointer-events-none flex flex-col justify-center items-center w-full h-full transition-all duration-700 absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm opacity-0');

    this.onClose = onClose;
    this.onToggleAudio = onToggleAudio;
    this.onToggleCrt = onToggleCrt;
    this.onExitToMenu = onExitToMenu;

    this.container.innerHTML = `
      <div class="glass-panel flex flex-col items-center w-[90%] max-w-md p-8 sm:p-12 relative overflow-hidden animate-[fade-in-up_0.6s_ease-out_forwards]">
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-transparent"></div>
        
        <h2 class="text-2xl sm:text-3xl font-serif text-white tracking-[0.3em] uppercase mb-8 text-shadow-lg text-center" style="font-family: 'Cinzel', serif;">Sintonia</h2>
        
        <div class="flex flex-col w-full gap-4 relative z-10 mb-10">
          <button id="btn-toggle-audio" class="btn-surreal relative overflow-hidden group w-full h-14 flex items-center justify-between px-6 border border-white/10 hover:border-white/40 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
            <span class="text-sm font-semibold tracking-widest text-zinc-400 group-hover:text-white transition-colors pointer-events-none">ÁUDIO</span>
            <div id="audio-icon-container" class="text-white pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </div>
          </button>
          
          <button id="btn-toggle-crt" class="btn-surreal crt-toggle relative overflow-hidden group w-full h-14 flex items-center justify-between px-6 border border-white/10 hover:border-white/40 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
            <span class="text-sm font-semibold tracking-widest text-zinc-400 group-hover:text-white transition-colors pointer-events-none">FILTRO CRT</span>
            <div id="crt-icon-container" class="text-zinc-500 group-[.active]:text-white pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            </div>
          </button>
        </div>

        <div class="flex flex-col w-full gap-3 relative z-10">
          <button id="btn-settings-close" class="btn-surreal w-full h-12 text-xs font-semibold tracking-[0.2em] border border-white/10 rounded-lg bg-transparent hover:bg-white/10 text-white transition-all duration-300">
            VOLTAR AO JOGO
          </button>
          <button id="btn-settings-exit" class="btn-surreal w-full h-12 text-xs font-semibold tracking-[0.2em] border border-red-500/20 rounded-lg bg-red-500/5 hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-all duration-300">
            ABANDONAR MEMÓRIA
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-settings-close')?.addEventListener('click', this.onClose);
    this.container.querySelector('#btn-settings-exit')?.addEventListener('click', this.onExitToMenu);
    this.container.querySelector('#btn-toggle-audio')?.addEventListener('click', this.onToggleAudio);
    this.container.querySelector('#btn-toggle-crt')?.addEventListener('click', this.onToggleCrt);
  }
}
