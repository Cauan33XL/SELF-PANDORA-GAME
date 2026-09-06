import { MainMenuUI } from './MainMenuUI';
import { LevelSelectUI } from './LevelSelectUI';
import { DiaryUI } from './DiaryUI';
import { CreditsUI } from './CreditsUI';
import { HUDUI } from './HUDUI';
import { LoadingUI } from './LoadingUI';

export interface UICallbacks {
  onStartGame: () => void;
  onOpenDiary: () => void;
  onOpenCredits: () => void;
  onBackToMenu: () => void;
  onResetProgress: () => void;
  onCloseDiary: () => void;
  onCloseCredits: () => void;
  onExitToSelector: () => void;
  onToggleCamera: () => void;
  onToggleAudio: () => void;
  onToggleCrt: () => void;
}

export class UIManager {
  public loading: LoadingUI;
  public mainMenu: MainMenuUI;
  public levelSelect: LevelSelectUI;
  public diary: DiaryUI;
  public credits: CreditsUI;
  public hud: HUDUI;

  private uiLayer: HTMLElement;
  private uiLayerTop: HTMLElement;
  private staticFooters: HTMLElement;

  constructor(callbacks: UICallbacks) {
    this.uiLayer = document.getElementById('ui-layer')!;
    this.uiLayerTop = document.getElementById('ui-layer-top')!;
    if (!this.uiLayer || !this.uiLayerTop) {
      console.warn("UI Layers not found in DOM");
    }
    
    this.loading = new LoadingUI();
    this.mainMenu = new MainMenuUI(callbacks.onStartGame, callbacks.onOpenDiary, callbacks.onOpenCredits);
    this.levelSelect = new LevelSelectUI(callbacks.onBackToMenu, callbacks.onResetProgress);
    this.diary = new DiaryUI(callbacks.onCloseDiary);
    this.credits = new CreditsUI(callbacks.onCloseCredits);
    this.hud = new HUDUI(callbacks.onExitToSelector);

    this.uiLayer.appendChild(this.loading.getElement());
    this.uiLayer.appendChild(this.mainMenu.getElement());
    if (this.mainMenu.getTopElement) {
        this.uiLayerTop.appendChild(this.mainMenu.getTopElement());
    }
    this.uiLayer.appendChild(this.levelSelect.getElement());
    this.uiLayer.appendChild(this.diary.getElement());
    this.uiLayer.appendChild(this.credits.getElement());
    this.uiLayer.appendChild(this.hud.getElement());

    this.staticFooters = this.createStaticFooters(callbacks);
    document.getElementById('app')?.appendChild(this.staticFooters);
  }

  private createStaticFooters(callbacks: UICallbacks): HTMLElement {
    const wrapper = document.createElement('div');
    
    // Bottom left credits
    const bottomLeft = document.createElement('div');
    bottomLeft.className = 'absolute bottom-6 left-8 z-20 pointer-events-auto flex items-center gap-6 text-[10px] tracking-widest text-zinc-500 uppercase';
    bottomLeft.innerHTML = '<span>© 2026 self-pandora</span>';
    wrapper.appendChild(bottomLeft);

    // Bottom right controls
    const bottomRight = document.createElement('div');
    bottomRight.className = 'absolute bottom-6 right-8 z-20 pointer-events-auto flex items-center gap-3';
    bottomRight.innerHTML = `
      <!-- Camera Mode Toggle Button -->
      <button id="btn-toggle-camera" class="camera-toggle flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white bg-zinc-950/40 backdrop-blur transition-all duration-300 cursor-pointer shadow-lg" title="Alternar Câmera (1ª / 3ª Pessoa)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </button>

      <!-- CRT Shader Toggle Button -->
      <button id="btn-toggle-crt" class="crt-toggle flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white bg-zinc-950/40 backdrop-blur transition-all duration-300 cursor-pointer shadow-lg active" title="Alternar Filtro CRT">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
          <rect x="2" y="3" width="20" height="15" rx="2" />
          <line x1="12" y1="18" x2="12" y2="21" />
          <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
      </button>

      <!-- Audio Mute/Unmute Toggle Button -->
      <button id="btn-toggle-audio" class="audio-toggle flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white bg-zinc-950/40 backdrop-blur transition-all duration-300 cursor-pointer shadow-lg" title="Ativar/Mudar Som">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 audio-icon-muted">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      </button>
    `;

    bottomRight.querySelector('#btn-toggle-camera')?.addEventListener('click', callbacks.onToggleCamera);
    bottomRight.querySelector('#btn-toggle-crt')?.addEventListener('click', callbacks.onToggleCrt);
    bottomRight.querySelector('#btn-toggle-audio')?.addEventListener('click', callbacks.onToggleAudio);
    
    wrapper.appendChild(bottomRight);
    return wrapper;
  }

  public showScreen(screenName: string) {
    this.mainMenu.hide();
    this.levelSelect.hide();
    this.diary.hide();
    this.credits.hide();
    this.hud.hide();
    this.loading.hide();

    if (screenName === 'menu') {
      this.mainMenu.show();
    } else if (screenName === 'level') {
      this.levelSelect.show();
    } else if (screenName === 'diary') {
      this.diary.show();
    } else if (screenName === 'credits') {
      this.credits.show();
    } else if (screenName === 'hud') {
      this.hud.show();
    } else if (screenName === 'loading') {
      this.loading.show();
    }
  }
}
