import { ThreeDRenderer } from './ThreeDRenderer';
import { LevelManager, type NexusInfo, type Platform, type Reminiscence } from './LevelManager';
import { Player } from './Player';
import { Shadow } from './Shadow';
import { AudioManager } from './AudioManager';
import { UIManager } from '../ui/UIManager';

export class GameCoordinator {
  renderer: ThreeDRenderer;
  levelManager: LevelManager;
  audioManager: AudioManager;
  ui: UIManager;
  gameState = 'menu';
  currentNexus: NexusInfo | null = null;
  unlockedLevels: number[] = [1];
  isReverie = false;
  player = new Player();
  shadow = new Shadow();
  
  // Chunked subsets for performance
  activePlatforms: (Platform & { dissolveTimer?: number })[] = [];
  activeReminiscences: Reminiscence[] = [];
  
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
      onResetProgress: () => {
        this.resetProgress();
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
      onToggleCamera: () => {
        this.toggleCameraMode();
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
    this.renderer = new ThreeDRenderer(container);
    this.renderer.setReverieMode(false, 1);
    window.addEventListener('resize', () => {
      this.renderer.resize(window.innerWidth, window.innerHeight);
    });
    this.startLoop();
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
      if (e.key === 'Escape' && this.gameState === 'playing') {
        this.showScreen('level');
      }
      if (e.key === ' ' && this.gameState === 'playing') {
        this.keys.Space = true;
        e.preventDefault();
      }
      if ((e.key === 'q' || e.key === 'Q' || e.key === 'e' || e.key === 'E') && this.gameState === 'playing') {
        this.toggleStateReality();
      }
      if ((e.key === 'c' || e.key === 'C') && this.gameState === 'playing') {
        this.toggleCameraMode();
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
      this.renderer.setReverieMode(false, 1);
      document.body.classList.remove('state-reverie');
    } else if (screenName === 'diary') {
      this.ui.diary.populateDiary(this.levelManager.getNexuses(), this.unlockedLevels);
    } else if (screenName === 'menu') {
      this.renderer.setReverieMode(false, 1);
      document.body.classList.remove('state-reverie');
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
    
    // Scale map slightly based on world coordinates to visually match the open world
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
        <div class="tooltip-title">\${level.title}</div>
        <div class="tooltip-tag">\${level.tag.toUpperCase()}</div>
      `;
      node.appendChild(tooltip);

      synapseMap.appendChild(node);
    });
  }

  startGameWorld() {
    this.victoryTimer = 0;
    this.glitchIntensity = 0;
    this.time = 0;
    this.pulseTime = 0;
    this.globalCollectedCount = 0;
    
    this.player.spawn(this.levelManager.playerSpawn);
    this.shadow.spawn(this.levelManager.shadowSpawn);
    this.isReverie = false;
    
    this.renderer.clearLevel();
    this.renderer.createPlayer(this.player.x, this.player.y);
    this.renderer.createShadow(this.shadow.x, this.shadow.y);

    this.levelManager.worldPlatforms.forEach(p => {
      this.renderer.createPlatform(p.x, p.y, p.w, p.h, p.isDissolving, 0, p.isRealityOnly, p.isReverieOnly);
    });

    this.levelManager.worldReminiscences.forEach(rem => {
      this.renderer.createReminiscence(rem.x, rem.y);
    });

    this.ui.hud.clearAll();
    this.ui.hud.showStorySubtitle('A vastidão da mente me aguarda...', 4000);
    this.showScreen('hud');
  }

  toggleStateReality() {
    if (this.gameState !== 'playing') return;
    this.isReverie = !this.isReverie;
    this.renderer.triggerTransition(600, () => {
      this.renderer.setReverieMode(this.isReverie, this.currentNexus?.number || 1);
      document.body.classList.toggle('state-reverie', this.isReverie);
      this.audioManager.setAtmosphereState(this.isReverie);
      this.audioManager.playTransitionSound(this.isReverie);

      const tagHud = document.getElementById('hud-level-tag');
      if (tagHud) {
        tagHud.innerText = this.isReverie ? 'Devaneio (Reverie)' : 'Realidade';
      }

      this.renderer.addParticleBurst(
        this.player.x + 10,
        this.player.y + 20,
        this.isReverie ? 'rgba(255, 255, 255, ' : 'rgba(255, 255, 255, '
      );
    });
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
    // 1. Calculate nearest Nexus for atmosphere and behavior
    const nearest = this.levelManager.getNearestNexus(this.player.x, this.player.y);
    if (nearest && nearest !== this.currentNexus) {
      this.currentNexus = nearest;
      const levelNumHud = document.getElementById('hud-level-num');
      if (levelNumHud) {
        levelNumHud.innerText = `Região: \${this.currentNexus.title}`;
      }
      
      if (!this.unlockedLevels.includes(this.currentNexus.number)) {
          this.unlockedLevels.push(this.currentNexus.number);
          this.saveProgress();
          this.ui.hud.showStorySubtitle(`Descoberta: \${this.currentNexus.title}`, 4000);
      }
    }

    // 2. Chunking: Filter active platforms within 2500 units of the player
    this.activePlatforms = this.levelManager.worldPlatforms.filter(p => {
      const dx = p.x - this.player.x;
      const dy = p.y - this.player.y;
      return dx * dx + dy * dy < 6250000; // 2500^2
    });

    this.activeReminiscences = this.levelManager.worldReminiscences.filter(r => {
      if (r.collected) return false;
      const dx = r.x - this.player.x;
      const dy = r.y - this.player.y;
      return dx * dx + dy * dy < 6250000;
    });

    const behavior = this.currentNexus ? this.currentNexus.shadowBehavior : 'none';
    const t = this.time * 0.5;

    this.levelManager.worldPlatforms.forEach((p, idx) => {
      if (p.origX === undefined) p.origX = p.x;
      if (p.origY === undefined) p.origY = p.y;

      if (this.isReverie) {
        // Only animate platforms near the player to save CPU
        const dx = p.x - this.player.x;
        const dy = p.y - this.player.y;
        if (dx * dx + dy * dy < 6250000) {
          const rOffset = idx * 0.7;
          const animDx = Math.sin(t + rOffset) * 28;
          const animDy = Math.cos(t * 0.8 + rOffset) * 24;
          p.x = p.origX + animDx;
          p.y = p.origY + animDy;
        }
      } else {
        p.x += (p.origX - p.x) * 0.1;
        p.y += (p.origY - p.y) * 0.1;
      }
    });

    this.player.update(this.keys, this.isReverie);
    this.player.resolvePhysicsAndCollisions(this.activePlatforms, this.isReverie);
    
    if (this.currentNexus) {
        this.shadow.update(this.player, this.currentNexus, this.isReverie);
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

      // ── Absorb phase: the memory glides into Pandora with ease-out ──
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

      // ── Magnetic pull: smooth, accelerating drift closer ──
      if (dist < this.player.magnetRadius && dist > this.player.collectRadius) {
        const t = 1 - dist / this.player.magnetRadius;
        const pull = this.player.magnetStrength * t * (t * 30 + 8);
        rem.x += (dx / dist) * pull;
        rem.y += (dy / dist) * pull;
      }

      // ── Kick off the absorb the instant the memory is within reach ──
      if (dist <= this.player.collectRadius) {
        rem.pickupProgress = 0;
        const step = 0.22;
        rem.x += dx * step;
        rem.y += dy * step;
        rem.pickupProgress += step;
      }
    });


    const isHostile = behavior === 'chase' || behavior === 'mirror' || behavior === 'stationary';
    if (this.isReverie && !this.shadow.isStunned && isHostile && this.shadow.checkPlayerContact?.(this.player)) {
      this.shakeTimer = 35;
      this.shakeAmount = 8;
      this.glitchIntensity = 0.8;
      this.toggleStateReality();
      this.audioManager.playShadowMergeSound();
      this.ui.hud.triggerFloatingThought('O medo me consome...', 0.5, 0.4);
    }

    const wind = this.currentNexus ? this.currentNexus.windX : 0;
    this.renderer.updatePlayer(this.player.x, this.player.y, this.player.facingAngle, this.player.jumpHeight, Math.hypot(this.player.vx, this.player.vy));
    this.renderer.updateShadow(this.shadow.x, this.shadow.y, this.shadow.isStunned);
    
    // Update renderer with all platforms
    this.renderer.updatePlatforms(this.levelManager.worldPlatforms, this.player.x, this.player.y);
    this.renderer.updateReminiscences(this.levelManager.worldReminiscences, this.time);
    
    this.renderer.updateParticles(wind);
    this.renderer.updateWaveRing(
      this.player.x + this.player.w / 2,
      this.player.y + this.player.h / 2,
      this.player.waveRadius,
      this.player.waveActive
    );
    this.updateRadar();

    const waveCooldownBar = document.getElementById('hud-wave-cooldown-bar');
    const waveStatusText = document.getElementById('hud-wave-status');
    if (waveCooldownBar && waveStatusText) {
      const pct = this.player.waveCooldown === 0 ? 100 : ((120 - this.player.waveCooldown) / 120) * 100;
      waveCooldownBar.style.width = pct + '%';
      waveStatusText.innerText = this.player.waveCooldown === 0 ? 'Pronta (E)' : 'Recarregando...';
      waveStatusText.style.color = this.player.waveCooldown === 0 ? '#ffffff' : '#555';
    }

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
    
    // Smoothly adjust mist intensity based on nexus
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

    const remHud = document.getElementById('hud-reminiscence');
    if (remHud) {
      remHud.innerText = `Memórias: ${this.globalCollectedCount} / ${this.levelManager.worldReminiscences.length}`;
    }
    if (rem.text) {
      this.ui.hud.triggerFloatingThought(rem.text, 0.5, 0.4);
    }
  }

  toggleCameraMode() {
    if (this.gameState !== 'playing') return;
    const nextMode = this.renderer.cameraMode === 'first' ? 'third' : 'first';
    this.renderer.setCameraMode(nextMode);

    const btn = document.getElementById('btn-toggle-camera');
    if (btn) {
      btn.classList.toggle('active', nextMode === 'third');
    }

    const camLabel = nextMode === 'first' ? 'Primeira Pessoa' : 'Terceira Pessoa';
    this.ui.hud.triggerFloatingThought('Câmera: ' + camLabel, 0.5, 0.2);
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