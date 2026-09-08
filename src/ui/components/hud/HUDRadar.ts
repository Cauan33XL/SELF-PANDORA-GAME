import { BaseUIComponent } from '../../core/BaseUIComponent';

export class HUDRadar extends BaseUIComponent {
  private radarCanvas: HTMLCanvasElement;
  private radarCtx: CanvasRenderingContext2D | null;
  private radarSweepAngle: number = 0;

  constructor() {
    super('radar-container', 'relative w-40 h-40 border border-white/15 rounded-full bg-zinc-950/70 backdrop-blur-md overflow-hidden pointer-events-auto flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.08)] transition-all duration-300');
    
    this.container.innerHTML = `
      <canvas id="radar-canvas" width="160" height="160" class="w-full h-full"></canvas>
      <div class="absolute inset-0 rounded-full border border-white/5 pointer-events-none scale-75"></div>
      <div class="absolute inset-0 rounded-full border border-white/5 pointer-events-none scale-50"></div>
      <div class="absolute inset-0 rounded-full border border-white/5 pointer-events-none scale-25"></div>
      <div class="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2"></div>
      <div class="absolute left-1/2 top-0 h-full w-[1px] bg-white/10 -translate-x-1/2"></div>
      <div class="radar-sweep absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
    `;

    this.radarCanvas = this.container.querySelector('#radar-canvas') as HTMLCanvasElement;
    this.radarCtx = this.radarCanvas.getContext('2d');
  }

  public getCanvas(): HTMLCanvasElement {
    return this.radarCanvas;
  }

  public getCtx(): CanvasRenderingContext2D | null {
    return this.radarCtx;
  }

  public updateSweep() {
    const sweep = this.container.querySelector('.radar-sweep') as HTMLElement;
    if (sweep) {
      this.radarSweepAngle = (this.radarSweepAngle + 2) % 360;
      sweep.style.transform = `rotate(${this.radarSweepAngle}deg)`;
    }
  }
}
