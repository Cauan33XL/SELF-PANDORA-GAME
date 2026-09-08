export abstract class BaseUIComponent {
  protected container: HTMLElement;
  protected isVisible: boolean = false;

  constructor(id: string, className: string) {
    this.container = document.createElement('div');
    this.container.id = id;
    this.container.className = className;
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public show(): void {
    if (this.isVisible) return;
    this.isVisible = true;
    this.onShow();
  }

  public hide(): void {
    this.isVisible = false;
    this.onHide();
  }

  /**
   * Hook that runs when the component is shown.
   * Can be overridden by subclasses to add specific animations or logic.
   */
  protected onShow(): void {
    this.container.classList.add('active', 'pointer-events-auto', 'opacity-100');
    this.container.classList.remove('pointer-events-none', 'opacity-0');
    this.container.style.display = '';
  }

  /**
   * Hook that runs when the component is hidden.
   * Can be overridden by subclasses to add specific animations or logic.
   */
  protected onHide(): void {
    this.container.classList.remove('active', 'pointer-events-auto', 'opacity-100');
    this.container.classList.add('pointer-events-none', 'opacity-0');
  }
}
