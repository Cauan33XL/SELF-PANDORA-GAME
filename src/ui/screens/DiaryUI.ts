import { type NexusInfo } from '../../game/level/LevelManager';
import { BaseUIComponent } from '../core/BaseUIComponent';

export class DiaryUI extends BaseUIComponent {
  private diaryList: HTMLElement | null = null;
  private diaryContent: HTMLElement | null = null;

  private onClose: () => void;

  constructor(onClose: () => void) {
    super('diary-screen', 'screen pointer-events-none flex flex-col justify-center items-center w-full h-full p-10 transition-all duration-700');
    this.onClose = onClose;
    
    this.container.innerHTML = `
      <div class="glass-panel diary-container flex flex-col w-[90%] max-w-4xl h-[80%] p-10 border border-white/5 bg-zinc-950/75 backdrop-blur-xl rounded-2xl shadow-2xl transition-transform duration-500">
        
        <div class="diary-header flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <h2 class="diary-title text-xl font-light tracking-[0.25em] text-white uppercase">
            Diário do Self
          </h2>
          <button id="btn-close-diary" class="btn-surreal px-8 py-4 text-sm font-semibold uppercase tracking-widest border border-white/10 hover:border-white/30 rounded-xl hover:bg-white/5 transition-all shadow-md">
            Fechar Diário
          </button>
        </div>

        <div class="diary-layout flex gap-8 flex-1 overflow-hidden h-full">
          <!-- Esquerda: Lista de Fase Recolhidas -->
          <div id="diary-stages-list" class="diary-list w-[35%] overflow-y-auto pr-4 border-r border-white/5 flex flex-col gap-2 select-none">
            <!-- Injetado dinamicamente -->
          </div>

          <!-- Direita: Página de Pensamentos -->
          <div id="diary-content-panel" class="diary-content w-[65%] overflow-y-auto pl-6 flex flex-col justify-center items-center text-center">
            <!-- Exibe reflexão poética da fase -->
            <div class="font-serif italic text-zinc-400 text-sm max-w-md">
              Selecione uma fase desbloqueada à esquerda para ler as reflexões íntimas de Pandora.
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-close-diary')?.addEventListener('click', this.onClose);
    this.diaryList = this.container.querySelector('#diary-stages-list');
    this.diaryContent = this.container.querySelector('#diary-content-panel');
  }

  public populateDiary(allLevels: NexusInfo[], unlockedLevelNumbers: number[]) {
    if (!this.diaryList || !this.diaryContent) return;
    this.diaryList.innerHTML = '';
    
    // Reset right panel content
    this.diaryContent.innerHTML = `
      <div class="font-serif italic text-zinc-400 text-sm max-w-md">
        Selecione uma fase desbloqueada à esquerda para ler as reflexões íntimas de Pandora.
      </div>
    `;

    allLevels.forEach(level => {
      const isUnlocked = unlockedLevelNumbers.includes(level.number);
      const r = document.createElement('div');
      r.className = `diary-item ${isUnlocked ? '' : 'locked'}`;
      if (isUnlocked) {
        r.innerHTML = `<strong>Fase ${level.number}:</strong> ${level.title}`;
        r.addEventListener('click', () => {
          this.diaryList?.querySelectorAll('.diary-item').forEach(e => e.classList.remove('selected'));
          r.classList.add('selected');
          this.displayDiaryReflection(level);
        });
      } else {
        r.innerHTML = `<strong>Fase ${level.number}:</strong> <em>[Bloqueada]</em>`;
      }
      this.diaryList?.appendChild(r);
    });
  }

  private displayDiaryReflection(level: NexusInfo) {
    if (!this.diaryContent) return;
    this.diaryContent.innerHTML = '';
    this.diaryContent.style.opacity = '0';
    this.diaryContent.style.transition = 'opacity 0.4s ease';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'diary-poetry text-left w-full max-w-xl';
    
    const heading = document.createElement('h3');
    heading.className = 'font-sans text-sm font-semibold tracking-wider text-white uppercase mb-4 pb-2 border-b border-white/5';
    heading.innerText = `Fase ${level.number}: ${level.title} — ${level.tag}`;
    wrapper.appendChild(heading);
    
    const body = document.createElement('p');
    body.className = 'font-serif italic text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap';
    body.innerText = level.diaryText;
    wrapper.appendChild(body);
    
    this.diaryContent.appendChild(wrapper);
    requestAnimationFrame(() => {
      if (this.diaryContent) {
        this.diaryContent.style.opacity = '1';
      }
    });
  }
}
