import { MainMenuUI } from '../screens/MainMenuUI';
import { LevelSelectUI } from '../screens/LevelSelectUI';
import { DiaryUI } from '../screens/DiaryUI';
import { CreditsUI } from '../screens/CreditsUI';
import { HUDUI } from '../components/HUDUI';
import { LoadingUI } from '../screens/LoadingUI';

export interface UICallbacks {
  onStartGame: () => void;
  onOpenDiary: () => void;
  onOpenCredits: () => void;
  onBackToMenu: () => void;
  onReturnToGame: () => void;
  onCloseDiary: () => void;
  onCloseCredits: () => void;
  onExitToSelector: () => void;
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
    this.levelSelect = new LevelSelectUI(callbacks.onBackToMenu, callbacks.onReturnToGame);
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

    this.staticFooters = this.createStaticFooters();
    document.getElementById('app')?.appendChild(this.staticFooters);
  }

  private createStaticFooters(): HTMLElement {
    const wrapper = document.createElement('div');
    
    // Bottom left credits
    const bottomLeft = document.createElement('div');
    bottomLeft.className = 'absolute bottom-6 left-8 z-20 pointer-events-auto flex items-center gap-6 text-[10px] tracking-widest text-zinc-500 uppercase';
    bottomLeft.innerHTML = '<span>© 2026 self-pandora</span>';
    wrapper.appendChild(bottomLeft);

    // As antigas opções globais de CRT e Áudio foram removidas para dar lugar à engrenagem de configurações na HUD.
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
