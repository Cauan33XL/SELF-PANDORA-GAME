export class CreditsUI {
  private container: HTMLElement;

  private onClose: () => void;

  constructor(onClose: () => void) {
    this.onClose = onClose;
    this.container = document.createElement('div');
    this.container.id = 'credits-screen';
    this.container.className = 'screen pointer-events-none flex flex-col justify-center items-center w-full h-full p-10 transition-all duration-700';
    
    this.container.innerHTML = `
      <div class="glass-panel flex flex-col items-center max-w-xl w-[90%] p-12 text-center border border-white/5 bg-zinc-950/75 backdrop-blur-xl rounded-2xl shadow-2xl transition-transform duration-500">
        <h2 class="text-2xl font-light tracking-[0.25em] text-white uppercase mb-8 border-b border-white/5 pb-4 w-full">
          Créditos da Mente
        </h2>
        
        <div class="flex flex-col gap-6 text-sm text-zinc-300 max-h-[300px] overflow-y-auto w-full pr-2">
          <div>
            <h4 class="font-serif italic text-zinc-400 text-xs tracking-wider uppercase mb-1">Poesia e Conceito</h4>
            <p class="font-light">O Self de Pandora — Jogo de Plataforma Psicológico</p>
          </div>
          <div>
            <h4 class="font-serif italic text-zinc-400 text-xs tracking-wider uppercase mb-1">Tecnologias</h4>
            <p class="font-light text-zinc-300">Three.js • Web Audio API • Tailwind CSS 4.0</p>
          </div>
          <div>
            <h4 class="font-serif italic text-zinc-400 text-xs tracking-wider uppercase mb-1">Referências Estéticas</h4>
            <p class="font-light text-zinc-500">Sic Mundus Creatus Est • Detetive Evan Brecht</p>
            <p class="text-xs text-zinc-500 mt-1">"O Zebrão que repele o medo nas colinas de Sycamore Valley"</p>
          </div>
        </div>

        <button id="btn-close-credits" class="btn-surreal w-full mt-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] border border-white/10 rounded-xl hover:bg-white/5 transition-all shadow-md">
          Voltar ao Menu
        </button>
      </div>
    `;

    this.container.querySelector('#btn-close-credits')?.addEventListener('click', this.onClose);
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
