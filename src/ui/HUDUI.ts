export class HUDUI {
  private container: HTMLElement;
  private overlay: HTMLElement | null = null;
  private activeFloatingElements: HTMLElement[] = [];

  private onExitToSelector: () => void;

  constructor(onExitToSelector: () => void) {
    this.onExitToSelector = onExitToSelector;
    this.container = document.createElement('div');
    this.container.id = 'hud-overlay';
    this.container.className = 'screen pointer-events-none flex flex-col justify-between w-full h-full p-8 transition-all duration-500';
    
    this.container.innerHTML = `
      <!-- Cabeçalho HUD -->
      <div class="flex justify-between items-start w-full pointer-events-none">
        <!-- Esquerda: Fase e Emoção -->
        <div class="hud-left flex flex-col gap-1 pointer-events-auto">
          <h3 id="hud-level-num" class="text-sm font-semibold tracking-wider text-white uppercase">
            Fase 1: Sycamore Valley
          </h3>
          <p id="hud-level-tag" class="font-serif italic text-xs text-zinc-400">
            Normalidade
          </p>
        </div>

        <!-- Direita: Pensamentos Coletados e Recarga da Onda -->
        <div class="hud-right flex gap-8 items-center pointer-events-auto">
          <div class="flex items-center gap-2 text-sm font-medium">
            <span class="reminiscence-icon w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"></span>
            <span id="hud-reminiscence">Pensamentos: 0 / 3</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs uppercase tracking-wider text-zinc-400">Onda de Lucidez:</span>
            <div class="relative w-28 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <div id="hud-wave-cooldown-bar" class="h-full bg-gradient-to-r from-white to-zinc-500 transition-all duration-100" style="width: 100%;"></div>
            </div>
            <span id="hud-wave-status" class="text-[10px] tracking-widest uppercase font-semibold text-white">Pronta (E)</span>
          </div>
        </div>
      </div>

      <!-- Centro: Subtítulos e Pensamentos Poéticos -->
      <div id="thoughts-overlay" class="absolute inset-0 pointer-events-none w-full h-full z-0 flex flex-col justify-center items-center">
        <!-- Subtítulos e textos flutuantes serão injetados dinamicamente aqui -->
      </div>

      <!-- Rodapé HUD: Comandos e Menu de Fases -->
      <div class="flex justify-between items-center w-full mt-auto pointer-events-auto">
        <div class="text-[10px] tracking-widest uppercase text-zinc-500">
          A/D ou ◄/► Rotacionar • W/S Mover • ESPAÇO Devaneio • E Lucidez • C Câmera
        </div>
        <button id="btn-exit-to-selector" class="btn-surreal px-6 py-2.5 text-[10px] font-semibold uppercase tracking-widest border border-white/10 rounded-lg hover:bg-white/5 transition-all">
          ESC: Sair da Fase
        </button>
      </div>

      <!-- Radar HUD Container (canto inferior esquerdo) -->
      <div id="radar-container" class="absolute bottom-20 left-8 w-36 h-36 border border-white/10 rounded-full bg-zinc-950/60 backdrop-blur-md overflow-hidden pointer-events-auto flex items-center justify-center shadow-lg transition-all duration-300">
        <canvas id="radar-canvas" width="144" height="144" class="w-full h-full"></canvas>
        <!-- Linhas de Grid do Radar -->
        <div class="absolute inset-0 rounded-full border border-white/10 pointer-events-none scale-75"></div>
        <div class="absolute inset-0 rounded-full border border-white/10 pointer-events-none scale-50"></div>
        <div class="absolute inset-0 rounded-full border border-white/10 pointer-events-none scale-25"></div>
        <div class="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2"></div>
        <div class="absolute left-1/2 top-0 h-full w-[1px] bg-white/5 -translate-x-1/2"></div>
        <!-- Efeito de Varredura -->
        <div class="radar-sweep absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
      </div>
    `;

    this.container.querySelector('#btn-exit-to-selector')?.addEventListener('click', this.onExitToSelector);
    this.overlay = this.container.querySelector('#thoughts-overlay');
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

  public triggerFloatingThought(text: string, x: number, y: number) {
    if (!this.overlay) return;
    const r = document.createElement('div');
    r.className = 'floating-thought';
    r.innerText = text;
    const leftPct = x * 100;
    const topPct = y * 100;
    r.style.left = `${leftPct}%`;
    r.style.top = `${topPct}%`;
    r.style.opacity = '0';
    r.style.transform = 'translate(-50%, 0) scale(0.95)';
    this.overlay.appendChild(r);
    this.activeFloatingElements.push(r);
    requestAnimationFrame(() => {
      r.style.opacity = '0.85';
      r.style.transform = 'translate(-50%, -25px) scale(1)';
    });
    setTimeout(() => {
      r.style.opacity = '0';
      r.style.transform = 'translate(-50%, -65px) scale(1.05)';
      setTimeout(() => {
        if (r.parentNode) {
          r.parentNode.removeChild(r);
        }
        this.activeFloatingElements = this.activeFloatingElements.filter(e => e !== r);
      }, 1500);
    }, 2800);
  }

  public showStorySubtitle(text: string, duration = 4000) {
    if (!this.overlay) return;
    const existing = this.overlay.querySelector('.story-subtitle');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
    const r = document.createElement('div');
    r.className = 'story-subtitle';
    this.overlay.appendChild(r);
    let currentText = '';
    let charIdx = 0;
    const typeWriter = () => {
      if (charIdx < text.length) {
        currentText += text.charAt(charIdx);
        r.innerText = currentText;
        charIdx++;
        setTimeout(typeWriter, 35);
      }
    };
    r.style.opacity = '0.9';
    typeWriter();
    setTimeout(() => {
      r.style.opacity = '0';
      r.style.transform = 'translate(-50%, -15px)';
      setTimeout(() => {
        if (r.parentNode) {
          r.parentNode.removeChild(r);
        }
      }, 1200);
    }, duration);
  }

  public clearAll() {
    if (this.overlay) {
      this.overlay.innerHTML = '';
    }
    this.activeFloatingElements = [];
  }
}
