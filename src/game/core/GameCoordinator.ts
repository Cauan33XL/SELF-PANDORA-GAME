import { CoreRenderer } from '../renderer/CoreRenderer';
import { LevelManager, type Platform, type Reminiscence, type NexusInfo } from '../level/LevelManager';
import { Player } from '../entities/Player';
import { Shadow } from '../entities/Shadow';
import { AudioManager } from './AudioManager';
import { UIManager } from '../../ui/core/UIManager';
import RAPIER from '@dimforge/rapier3d-compat';

export class GameCoordinator {
  renderer: CoreRenderer;
  levelManager: LevelManager;
  audioManager: AudioManager;
  ui: UIManager;
  gameState = 'menu';
  currentNexus: NexusInfo | null = null;
  unlockedLevels: number[] = [1];
  player = new Player();
  shadow = new Shadow();
  
  // Chunked subsets for performance
  activePlatforms: (Platform & { dissolveTimer?: number })[] = [];
  activeReminiscences: Reminiscence[] = [];
  
  physicsWorld!: RAPIER.World;
  
  globalCollectedCount = 0;
  
  time = 0;
  pulseTime = 0;
  shakeTimer = 0;
  shakeAmount = 0;
  glitchIntensity = 0;
  victoryTimer = 0;
  frameId: number | null = null;
  keys: Record<string, boolean> = {};

  constructor() {
    this.physicsWorld = new RAPIER.World({ x: 0, y: 0, z: -20.0 });
    this.levelManager = LevelManager.getInstance();
    this.audioManager = AudioManager.getInstance();
    
    this.ui = new UIManager({
      onStartGame: () => {
        this.audioManager.init();
        this.startGameWorld();
      },
      onOpenDiary: () => {
        this.audioManager.init();
        this.showScreen('diary');
      },
      onOpenCredits: () => {
        this.audioManager.init();
        this.showScreen('credits');
      },
      onBackToMenu: () => {
        this.showScreen('menu');
      },
      onReturnToGame: () => {
        if (this.renderer.envRenderer.platformMeshes.length > 0) {
          this.showScreen('hud');
        } else {
          this.showScreen('menu');
        }
      },
      onCloseDiary: () => {
        this.showScreen('menu');
      },
      onCloseCredits: () => {
        this.showScreen('menu');
      },
      onExitToSelector: () => {
        this.showScreen('menu');
      },
      onToggleAudio: () => {
        this.audioManager.init();
        const isMuted = this.audioManager.toggleMute();
        const toggleAudioBtn = document.getElementById('btn-toggle-audio');
        if (toggleAudioBtn) {
          toggleAudioBtn.innerHTML = isMuted
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-zinc-500"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        }
      },
      onToggleCrt: () => {
        const crtOverlay = document.getElementById('crt-overlay');
        const toggleCrtBtn = document.getElementById('btn-toggle-crt');
        if (crtOverlay && toggleCrtBtn) {
          const isActive = crtOverlay.classList.toggle('crt-active');
          toggleCrtBtn.classList.toggle('active', isActive);
        }
      }
    });

    const crtOverlay = document.getElementById('crt-overlay');
    const toggleCrtBtn = document.getElementById('btn-toggle-crt');
    if (toggleCrtBtn && crtOverlay) {
      crtOverlay.classList.add('crt-active');
      toggleCrtBtn.classList.add('active');
    }

    this.loadProgress();
    this.setupKeyboardListeners();
    const container = document.getElementById('game-container')!;
    this.renderer = new CoreRenderer(container);
    window.addEventListener('resize', () => {
      this.renderer.resize(window.innerWidth, window.innerHeight);
    });
    this.startLoop();
    this.showScreen('menu');
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('pandora_unlocked_levels');
      if (saved) {
        this.unlockedLevels = JSON.parse(saved);
      } else {
        this.unlockedLevels = [1];
      }
    } catch {
      this.unlockedLevels = [1];
    }
  }

  saveProgress() {
    try {
      localStorage.setItem('pandora_unlocked_levels', JSON.stringify(this.unlockedLevels));
    } catch (e) {
      console.warn('Failed to save progress to localStorage:', e);
    }
  }

  resetProgress() {
    if (confirm('Deseja realmente resetar toda a sua jornada? Seus sentimentos e memórias serão apagados.')) {
      this.unlockedLevels = [1];
      this.saveProgress();
      this.startGameWorld();
    }
  }

  setupKeyboardListeners() {
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (e.key === 'Escape') {
        if (this.gameState === 'playing') {
          this.showScreen('level');
        } else if (this.gameState === 'level_select') {
          if (this.renderer.envRenderer.platformMeshes.length > 0) {
            this.showScreen('hud');
          } else {
            this.showScreen('menu');
          }
        } else if (this.gameState === 'diary' || this.gameState === 'credits') {
          this.showScreen('menu');
        }
      }
      if (e.key === ' ' && this.gameState === 'playing') {
        this.keys.Space = true;
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', e => {
      this.keys[e.code] = false;
      if (e.key === ' ') {
        this.keys.Space = false;
      }
    });
  }

  showScreen(screenName: string) {
    if (screenName === 'menu') {
      this.gameState = 'menu';
    } else if (screenName === 'level') {
      this.gameState = 'level_select';
    } else if (screenName === 'diary') {
      this.gameState = 'diary';
    } else if (screenName === 'credits') {
      this.gameState = 'credits';
    } else if (screenName === 'hud') {
      this.gameState = 'playing';
    }

    this.ui.showScreen(screenName);

    if (screenName === 'level') {
      this.drawSynapseMap();
    } else if (screenName === 'diary') {
      this.ui.diary.populateDiary(this.levelManager.getNexuses(), this.unlockedLevels);
    } else if (screenName === 'menu') {
      this.isStartingGame = false;
      this.audioManager.setHeartbeatSpeed(0);
    }
  }

  drawSynapseMap() {
    const synapseMap = document.getElementById('synapse-network');
    const synapseSvg = document.getElementById('synapse-svg');
    if (!synapseMap || !synapseSvg) return;

    synapseMap.innerHTML = '';
    synapseSvg.innerHTML = '';
    synapseMap.appendChild(synapseSvg);

    const levels = this.levelManager.getNexuses();
    
    levels.forEach((level) => {
      const unlocked = this.unlockedLevels.includes(level.number);
      const node = document.createElement('div');
      
      const mx = (level.worldX / 24000) * 1600;
      const my = (level.worldY / 16000) * 800;

      node.style.left = mx + 'px';
      node.style.top = (my + 200) + 'px';

      node.className = 'synapse-node ' + (unlocked ? 'active' : 'locked');
      node.innerText = level.number.toString();

      const tooltip = document.createElement('div');
      tooltip.className = 'node-tooltip';
      tooltip.innerHTML = `
        <div class="tooltip-title">${level.title}</div>
        <div class="tooltip-tag">${level.tag.toUpperCase()}</div>
      `;
      node.appendChild(tooltip);

      synapseMap.appendChild(node);
    });
  }

  private isStartingGame = false;

  clearWorld() {
    if (this.renderer && this.renderer.envRenderer) {
      this.renderer.envRenderer.platformMeshes.forEach((m) => this.renderer.scene.remove(m));
      this.renderer.envRenderer.platformMeshes = [];
      this.renderer.envRenderer.platformMeta = [];
    }
    if (this.renderer && this.renderer.entityRenderer) {
      if (this.renderer.entityRenderer.doorMesh) {
        this.renderer.scene.remove(this.renderer.entityRenderer.doorMesh);
        this.renderer.entityRenderer.doorMesh = null;
      }
      this.renderer.entityRenderer.reminiscenceMeshes.forEach((m) => this.renderer.scene.remove(m));
      this.renderer.entityRenderer.reminiscenceMeshes = [];
    }
    this.activePlatforms = [];
    this.activeReminiscences = [];
    
    if (this.physicsWorld) {
      this.physicsWorld.free();
    }
    this.physicsWorld = new RAPIER.World({ x: 0, y: 0, z: -20.0 });
  }

  startGameWorld() {
    if (this.isStartingGame) return;
    this.isStartingGame = true;
    
    this.clearWorld();

    this.victoryTimer = 0;
    this.glitchIntensity = 0;
    this.time = 0;
    this.pulseTime = 0;
    this.globalCollectedCount = 0;
    
    this.showScreen('loading');
    const statusText = document.getElementById('loading-status-text');
    const progressBar = document.getElementById('loading-progress-bar');
    if (statusText) statusText.innerText = 'Despertando Pandora...';
    if (progressBar) progressBar.style.width = '72%';
    
    this.player.spawn(this.levelManager.playerSpawn, this.physicsWorld);
    this.shadow.spawn(this.levelManager.shadowSpawn);
    
    this.levelManager.initPhysics(this.physicsWorld);

    this.renderer.createPlayer(this.player.x, this.player.y, () => {
      this.renderer.createShadow(this.shadow.x, this.shadow.y);
      if (statusText) statusText.innerText = 'Integração concluída.';
      if (progressBar) progressBar.style.width = '100%';
      setTimeout(() => this.showScreen('hud'), 500);
    });

    this.levelManager.worldPlatforms.forEach(p => {
      this.renderer.createPlatform(p.x, p.y, p.w, p.h, p.isDissolving, 0);
    });

    this.levelManager.worldReminiscences.forEach(rem => {
      this.renderer.createReminiscence(rem.x, rem.y);
    });

    this.ui.hud.clearAll();
    this.ui.hud.showStorySubtitle('A vastidão da mente me aguarda...', 4000);
  }

  startLoop() {
    const loop = () => {
      this.update();
      this.frameId = requestAnimationFrame(loop);
    };
    loop();
  }

  update() {
    this.time += 0.016;
    this.pulseTime += 0.05;
    if (this.gameState === 'playing') {
      this.updateGameplay();
    } else {
      this.renderer.updateMenuCamera(this.time);
      this.renderer.updateParticles();
      this.renderer.render();
    }
  }

  updateGameplay() {
    const nearest = this.levelManager.getNearestNexus(this.player.x, this.player.y);
    if (nearest && nearest !== this.currentNexus) {
      this.currentNexus = nearest;
      this.ui.hud.status.updateLevel(this.currentNexus.number, this.currentNexus.title, this.currentNexus.tag);
      
      if (!this.unlockedLevels.includes(this.currentNexus.number)) {
          this.unlockedLevels.push(this.currentNexus.number);
          this.saveProgress();
          this.ui.hud.showStorySubtitle(`Descoberta: ${this.currentNexus.title}`, 4000);
      }
    }

    this.activePlatforms = this.levelManager.worldPlatforms.filter(p => {
      const dx = p.x - this.player.x;
      const dy = p.y - this.player.y;
      return dx * dx + dy * dy < 6250000;
    });

    this.activeReminiscences = this.levelManager.worldReminiscences.filter(r => {
      if (r.collected) return false;
      const dx = r.x - this.player.x;
      const dy = r.y - this.player.y;
      return dx * dx + dy * dy < 6250000;
    });

    this.physicsWorld.step();

    this.player.update(this.keys, this.renderer.pandoraRenderer.cameraOrbitYaw);
    
    this.levelManager.worldPlatforms.forEach((p) => {
      if (p.origX === undefined) p.origX = p.x;
      if (p.origY === undefined) p.origY = p.y;
      p.x += (p.origX - p.x) * 0.1;
    });
    
    if (this.currentNexus) {
        this.shadow.update(this.player, this.currentNexus, false);
    }

    this.activeReminiscences.forEach(rem => {
      if (rem.collected) return;

      const playerCenterX = this.player.x + this.player.w / 2;
      const playerCenterY = this.player.y + this.player.h / 2;
      const remCenterX = rem.x + rem.w / 2;
      const remCenterY = rem.y + rem.h / 2;
      const dx = playerCenterX - remCenterX;
      const dy = playerCenterY - remCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (rem.pickupProgress !== undefined && rem.pickupProgress < 1) {
        const step = 0.22 + rem.pickupProgress * 0.12;
        rem.x += dx * step;
        rem.y += dy * step;
        rem.pickupProgress += step;
        if (rem.pickupProgress >= 1) {
          this.completeMemoryCollection(rem);
        }
        return;
      }

      if (dist < this.player.magnetRadius && dist > this.player.collectRadius) {
        const t = 1 - dist / this.player.magnetRadius;
        const pull = this.player.magnetStrength * t * (t * 30 + 8);
        rem.x += (dx / dist) * pull;
        rem.y += (dy / dist) * pull;
      }

      if (dist <= this.player.collectRadius) {
        rem.pickupProgress = 0;
        const step = 0.22;
        rem.x += dx * step;
        rem.y += dy * step;
        rem.pickupProgress += step;
      }
    });

    this.renderer.updatePlayer(this.player.x, this.player.y, this.player.facingAngle, this.player.jumpHeight, Math.hypot(this.player.vx, this.player.vy));
    this.renderer.updateShadow(this.shadow.x, this.shadow.y, this.shadow.isStunned);
    
    this.renderer.updatePlatforms(this.levelManager.worldPlatforms, this.player.x, this.player.y);
    this.renderer.updateReminiscences(this.levelManager.worldReminiscences);
    
    this.renderer.updateParticles();
    this.renderer.updateWaveRing(
      this.player.x + this.player.w / 2,
      this.player.y + this.player.h / 2,
      this.player.waveRadius,
      this.player.waveActive
    );
    this.updateRadar();

    this.ui.hud.status.updateWaveCooldown((120 - this.player.waveCooldown) / 120.0);
    this.ui.hud.radar.updateSweep();
    
    if (this.shakeTimer > 0) {
      this.renderer.setCameraShake(this.shakeAmount * (this.shakeTimer / 35));
      this.shakeTimer--;
    } else {
      this.renderer.resetCamera();
    }

    if (this.glitchIntensity > 0) {
      this.renderer.setBloom(0.5 + this.glitchIntensity * 0.7);
      this.glitchIntensity *= 0.95;
    }
    
    if (this.currentNexus) {
        this.renderer.setMistIntensity(this.currentNexus.mistOpacity);
    }
    
    this.renderer.render();
  }

  completeMemoryCollection(rem: Reminiscence) {
    rem.collected = true;
    this.globalCollectedCount++;
    this.audioManager.playCollectSound();
    this.renderer.addParticleBurst(
      this.player.x + this.player.w / 2,
      this.player.y + this.player.h / 2,
      'rgba(255, 255, 255, '
    );

    this.ui.hud.fragments.updateCount(this.globalCollectedCount, this.levelManager.worldReminiscences.length);
    if (rem.text) {
      this.ui.hud.triggerFloatingThought(rem.text, 0.5, 0.4);
    }
  }

  updateRadar() {
    const canvas = document.getElementById('radar-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radarScale = 0.08;
    const angle = -this.player.facingAngle - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    this.activeReminiscences.forEach(rem => {
      if (rem.collected) return;
      const dx = rem.x - this.player.x;
      const dy = rem.y - this.player.y;

      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;

      ctx.beginPath();
      ctx.arc(cx + rx * radarScale, cy + ry * radarScale, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.fill();
    });

    const behavior = this.currentNexus ? this.currentNexus.shadowBehavior : 'none';
    if (behavior !== 'none') {
      const dx = this.shadow.x - this.player.x;
      const dy = this.shadow.y - this.player.y;

      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;

      ctx.beginPath();
      ctx.arc(cx + rx * radarScale, cy + ry * radarScale, 3.5, 0, Math.PI * 2);
      if (this.shadow.isStunned) {
        const flash = Math.sin(this.time * 20) > 0;
        ctx.fillStyle = flash ? '#555555' : '#ffffff';
        ctx.shadowColor = '#555555';
      } else {
        ctx.fillStyle = '#aaaaaa';
        ctx.shadowColor = '#aaaaaa';
      }
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 6);
    ctx.lineTo(cx - 4, cy + 4);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.closePath();
    ctx.fill();
  }
}