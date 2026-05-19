import { ThreeDRenderer } from './ThreeDRenderer';
import { LevelManager, type LevelConfig, type Platform } from './LevelManager';
import { Player } from './Player';
import { Shadow } from './Shadow';
import { AudioManager } from './AudioManager';
import { ThoughtsUI } from './ThoughtsUI';

export class GameCoordinator {
  renderer: ThreeDRenderer;
  levelManager: LevelManager;
  audioManager: AudioManager;
  thoughtsUI: ThoughtsUI;
  gameState = 'menu';
  currentLevelNumber = 1;
  currentLevel: LevelConfig | null = null;
  unlockedLevels: number[] = [1];
  isReverie = false;
  player = new Player();
  shadow = new Shadow();
  platforms: (Platform & { dissolveTimer?: number })[] = [];
  reminiscenceCount = 0;
  collectedCountThisLevel = 0;
  reminiscencesList: any[] = [];
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
    this.thoughtsUI = new ThoughtsUI();
    this.loadProgress();
    this.setupDOMEvents();
    this.setupKeyboardListeners();
    const container = document.getElementById('game-container')!;
    this.renderer = new ThreeDRenderer(container);
    this.renderer.setReverieMode(false, this.currentLevelNumber);
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
      this.showScreen('level');
    }
  }

  setupDOMEvents() {
    document.getElementById('btn-start-game')?.addEventListener('click', () => {
      this.audioManager.init();
      this.showScreen('level');
    });
    document.getElementById('btn-open-diary')?.addEventListener('click', () => {
      this.audioManager.init();
      this.showScreen('diary');
    });
    document.getElementById('btn-open-credits')?.addEventListener('click', () => {
      this.audioManager.init();
      this.showScreen('credits');
    });
    document.getElementById('btn-level-back')?.addEventListener('click', () => {
      this.showScreen('menu');
    });
    document.getElementById('btn-reset-progress')?.addEventListener('click', () => {
      this.resetProgress();
    });
    document.getElementById('btn-close-diary')?.addEventListener('click', () => {
      this.showScreen('menu');
    });
    document.getElementById('btn-close-credits')?.addEventListener('click', () => {
      this.showScreen('menu');
    });
    document.getElementById('btn-exit-to-selector')?.addEventListener('click', () => {
      this.exitLevel();
    });

    const toggleCrtBtn = document.getElementById('btn-toggle-crt');
    const crtOverlay = document.getElementById('crt-overlay');
    if (toggleCrtBtn && crtOverlay) {
      toggleCrtBtn.addEventListener('click', () => {
        const isActive = crtOverlay.classList.toggle('crt-active');
        toggleCrtBtn.classList.toggle('active', isActive);
      });
      crtOverlay.classList.add('crt-active');
      toggleCrtBtn.classList.add('active');
    }

    const toggleAudioBtn = document.getElementById('btn-toggle-audio');
    if (toggleAudioBtn) {
      toggleAudioBtn.addEventListener('click', () => {
        this.audioManager.init();
        const isMuted = this.audioManager.toggleMute();
        toggleAudioBtn.innerHTML = isMuted
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-zinc-500"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
      });
    }

    const toggleCameraBtn = document.getElementById('btn-toggle-camera');
    if (toggleCameraBtn) {
      toggleCameraBtn.addEventListener('click', () => {
        this.toggleCameraMode();
      });
    }
  }

  setupKeyboardListeners() {
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (e.key === 'Escape' && this.gameState === 'playing') {
        this.exitLevel();
      }
      if (e.key === ' ' && this.gameState === 'playing') {
        if (this.isReverie) {
          this.keys.KeyW = true;
        } else {
          this.toggleStateReality();
        }
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
        this.keys.KeyW = false;
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

    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active', 'pointer-events-auto');
      screen.classList.add('pointer-events-none');
    });

    const targetScreen = document.getElementById(`${screenName}-screen`) || document.getElementById(`${screenName}-overlay`);
    if (targetScreen) {
      targetScreen.classList.add('active', 'pointer-events-auto');
      targetScreen.classList.remove('pointer-events-none');
    }

    if (screenName === 'level') {
      this.drawSynapseMap();
      this.renderer.setReverieMode(false, this.currentLevelNumber);
      document.body.classList.remove('state-reverie');
    } else if (screenName === 'diary') {
      this.thoughtsUI.populateDiary(this.levelManager.getLevelsList(), this.unlockedLevels);
    } else if (screenName === 'menu') {
      this.renderer.setReverieMode(false, this.currentLevelNumber);
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

    const levels = this.levelManager.getLevelsList();
    const positions: { x: number; y: number }[] = [];
    levels.forEach((_, idx) => {
      const posX = idx * 220 + 120;
      const posY = 200 + Math.sin(idx * 1.3) * 90 + (idx % 2 === 0 ? 30 : -30);
      positions.push({ x: posX, y: posY });
    });

    for (let idx = 1; idx < positions.length; idx++) {
      const prev = positions[idx - 1];
      const curr = positions[idx];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', prev.x.toString());
      line.setAttribute('y1', prev.y.toString());
      line.setAttribute('x2', curr.x.toString());
      line.setAttribute('y2', curr.y.toString());

      const currentLevelCfg = levels[idx];
      const isNextCompleted = this.unlockedLevels.includes(currentLevelCfg.number + 1) || (currentLevelCfg.number === 33 && this.unlockedLevels.includes(33));
      const isCurrentUnlocked = this.unlockedLevels.includes(currentLevelCfg.number);

      if (isNextCompleted) {
        line.setAttribute('class', 'completed-path');
      } else if (isCurrentUnlocked) {
        line.setAttribute('class', 'active-path');
      }
      synapseSvg.appendChild(line);
    }

    levels.forEach((level, idx) => {
      const pos = positions[idx];
      const isUnlocked = this.unlockedLevels.includes(level.number);
      const isNextCompleted = this.unlockedLevels.includes(level.number + 1) || (level.number === 33 && this.unlockedLevels.includes(33));
      
      const node = document.createElement('div');
      node.style.left = `${pos.x}px`;
      node.style.top = `${pos.y}px`;

      let stateClass = 'locked';
      if (isUnlocked) {
        stateClass = isNextCompleted ? 'completed' : 'active';
      }
      node.className = `synapse-node ${stateClass}`;
      node.innerText = level.number.toString();

      const tooltip = document.createElement('div');
      tooltip.className = 'node-tooltip';
      tooltip.innerHTML = `
        <div class="tooltip-title">${level.title}</div>
        <div class="tooltip-tag">${level.tag.toUpperCase()}</div>
      `;
      node.appendChild(tooltip);

      if (isUnlocked) {
        node.addEventListener('click', () => {
          this.currentLevelNumber = level.number;
          this.enterLevel(level.number);
        });
      }
      synapseMap.appendChild(node);
    });

    const scrollLeftVal = positions[Math.max(0, this.unlockedLevels.length - 1)].x - window.innerWidth / 2;
    const synapseContainer = document.querySelector('.synapse-map-container');
    if (synapseContainer) {
      synapseContainer.scrollLeft = scrollLeftVal;
    }
  }

  enterLevel(levelNum: number) {
    this.currentLevelNumber = levelNum;
    this.currentLevel = this.levelManager.getLevel(levelNum);
    if (!this.currentLevel) return;

    this.reminiscenceCount = 0;
    this.collectedCountThisLevel = 0;
    this.victoryTimer = 0;
    this.glitchIntensity = 0;
    this.time = 0;
    this.pulseTime = 0;

    this.platforms = this.currentLevel.platforms.map(p => ({
      ...p,
      dissolveTimer: p.maxDissolveTime || 120
    }));

    this.reminiscencesList = this.currentLevel.reminiscences.map(rem => ({
      ...rem,
      collected: false
    }));

    this.player.spawn(this.currentLevel.playerSpawn);
    this.shadow.spawn(this.currentLevel.shadowSpawn);
    this.isReverie = this.currentLevel.tag === 'reverie';
    this.renderer.setReverieMode(this.isReverie, this.currentLevelNumber);
    document.body.classList.toggle('state-reverie', this.isReverie);

    this.renderer.clearLevel();
    this.renderer.createPlayer(this.player.x, this.player.y);
    this.renderer.createShadow(this.shadow.x, this.shadow.y);

    this.platforms.forEach(p => {
      this.renderer.createPlatform(p.x, p.y, p.w, p.h, p.isDissolving, 0, p.isRealityOnly, p.isReverieOnly);
    });

    this.renderer.createDoor(
      this.currentLevel.door.x,
      this.currentLevel.door.y,
      this.currentLevel.door.w,
      this.currentLevel.door.h
    );

    this.reminiscencesList.forEach(rem => {
      this.renderer.createReminiscence(rem.x, rem.y);
    });

    this.thoughtsUI.clearAll();
    this.showHUDInfo();
    this.thoughtsUI.showStorySubtitle(this.currentLevel.thoughts[0] || 'Onde eu me encontro?', 4000);
    this.showScreen('hud');
  }

  showHUDInfo() {
    const levelNumHud = document.getElementById('hud-level-num');
    const levelTagHud = document.getElementById('hud-level-tag');
    const reminiscenceHud = document.getElementById('hud-reminiscence');

    if (levelNumHud) {
      levelNumHud.innerText = `Fase ${this.currentLevelNumber}: ${this.currentLevel?.title}`;
    }
    if (levelTagHud) {
      levelTagHud.innerText = this.currentLevel?.tag === 'reality' ? 'Realidade' : 'Devaneio (Reverie)';
    }
    if (reminiscenceHud) {
      reminiscenceHud.innerText = `Pensamentos: 0 / ${this.reminiscencesList.length}`;
    }
  }

  toggleStateReality() {
    if (this.gameState !== 'playing') return;
    this.isReverie = !this.isReverie;
    this.renderer.triggerTransition(600, () => {
      this.renderer.setReverieMode(this.isReverie, this.currentLevelNumber);
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
        this.isReverie ? 'rgba(217, 70, 239, ' : 'rgba(34, 211, 238, '
      );
    });
  }

  exitLevel() {
    this.thoughtsUI.clearAll();
    this.showScreen('level');
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
    if (!this.currentLevel) return;
    const behavior = this.currentLevel.shadowBehavior;
    const t = this.time * 0.5;

    this.platforms.forEach((p, idx) => {
      if (p.origX === undefined) p.origX = p.x;
      if (p.origY === undefined) p.origY = p.y;

      if (this.isReverie) {
        const rOffset = idx * 0.7;
        const dx = Math.sin(t + rOffset) * 28;
        const dy = Math.cos(t * 0.8 + rOffset) * 24;
        p.x = p.origX + dx;
        p.y = p.origY + dy;
      } else {
        p.x += (p.origX - p.x) * 0.1;
        p.y += (p.origY - p.y) * 0.1;
      }

      if (this.currentLevel!.platforms[idx]) {
        const origPlatform = this.currentLevel!.platforms[idx];
        origPlatform.x = p.x;
        origPlatform.y = p.y;
      }
    });

    this.player.update(this.keys, this.currentLevel, this.isReverie);
    
    const platformsBackup = this.currentLevel.platforms;
    if (behavior === 'companion' && !this.shadow.isStunned) {
      const shadowPlatform = this.shadow.getAsPlatform();
      this.currentLevel.platforms = [...platformsBackup, shadowPlatform];
    }
    
    this.player.resolvePhysicsAndCollisions(this.currentLevel, this.isReverie);
    this.currentLevel.platforms = platformsBackup;

    this.shadow.update(this.player, this.currentLevel, this.isReverie);

    this.reminiscencesList.forEach(rem => {
      if (!rem.collected) {
        const playerCenterX = this.player.x + this.player.w / 2;
        const playerCenterY = this.player.y + this.player.h / 2;
        if (
          playerCenterX > rem.x &&
          playerCenterX < rem.x + 20 &&
          playerCenterY > rem.y &&
          playerCenterY < rem.y + 20
        ) {
          rem.collected = true;
          this.collectedCountThisLevel++;
          this.audioManager.playCollectSound();
          this.renderer.addParticleBurst(rem.x + 10, rem.y + 10, 'rgba(217, 70, 239, ');
          
          const remHud = document.getElementById('hud-reminiscence');
          if (remHud) {
            remHud.innerText = `Pensamentos: ${this.collectedCountThisLevel} / ${this.reminiscencesList.length}`;
          }
          if (rem.text) {
            this.thoughtsUI.triggerFloatingThought(rem.text, 0.5, 0.4);
          }
        }
      }
    });

    const isHostile = behavior === 'chase' || behavior === 'mirror' || behavior === 'stationary';
    if (this.isReverie && !this.shadow.isStunned && isHostile && this.shadow.checkPlayerContact(this.player)) {
      this.shakeTimer = 35;
      this.shakeAmount = 8;
      this.glitchIntensity = 0.8;
      this.toggleStateReality();
      this.audioManager.playShadowMergeSound();
      this.thoughtsUI.triggerFloatingThought('O medo me consome...', 0.5, 0.4);
    }

    const hasCollectedAll = this.collectedCountThisLevel >= this.reminiscencesList.length;
    const playerCenterX = this.player.x + this.player.w / 2;
    const playerCenterY = this.player.y + this.player.h / 2;
    const door = this.currentLevel.door;

    if (
      playerCenterX > door.x &&
      playerCenterX < door.x + door.w &&
      playerCenterY > door.y &&
      playerCenterY < door.y + door.h
    ) {
      if (hasCollectedAll) {
        if (this.currentLevelNumber === 3 || this.currentLevelNumber === 33) {
          this.runVictoryCutscene();
        } else {
          this.completeLevel();
        }
      } else if (Math.sin(this.pulseTime * 2) > 0.96) {
        this.thoughtsUI.showStorySubtitle('Preciso recolher meus fragmentos de pensamento primeiro...', 2000);
      }
    }

    const wind = this.currentLevel ? this.currentLevel.windX : 0;
    this.renderer.updatePlayer(this.player.x, this.player.y, this.player.facingAngle);
    this.renderer.updateShadow(this.shadow.x, this.shadow.y, this.shadow.isStunned);
    this.renderer.updatePlatforms(this.platforms);
    this.renderer.updateReminiscences(this.reminiscencesList, this.time);
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
      const fillPercent = this.player.waveCooldown === 0 ? 100 : ((120 - this.player.waveCooldown) / 120) * 100;
      waveCooldownBar.style.width = `${fillPercent}%`;
      waveStatusText.innerText = this.player.waveCooldown === 0 ? 'Pronta (E)' : 'Recarregando...';
      waveStatusText.style.color = this.player.waveCooldown === 0 ? '#22d3ee' : '#555';
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
    this.renderer.render();
  }

  runVictoryCutscene() {
    this.victoryTimer++;
    this.player.vx = 0;
    this.player.vy = 0;

    const dx = this.shadow.x - this.player.x;
    const dy = this.shadow.y - this.player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {
      this.player.x += (dx / dist) * 1.5;
      this.player.y += (dy / dist) * 1.5;
    }

    if (this.victoryTimer % 10 === 0 && this.victoryTimer < 160) {
      this.renderer.addParticleBurst(this.player.x + 10, this.player.y + 20, 'rgba(217, 70, 239, ');
      this.renderer.addParticleBurst(this.shadow.x + 10, this.shadow.y + 20, 'rgba(6, 182, 212, ');
    }

    if (this.currentLevelNumber === 3) {
      const subtitle = [
        { frame: 40, text: '"Você sempre esteve aí... me seguindo no escuro."' },
        { frame: 120, text: '"Meus medos de errar me distanciaram do mundo."' },
        { frame: 200, text: '"Mas você ficou. Para me proteger de mim mesma."' },
        { frame: 280, text: '"Eu não preciso te repelir. Preciso te aceitar."' }
      ].find(s => s.frame === this.victoryTimer);

      if (subtitle) {
        this.thoughtsUI.showStorySubtitle(subtitle.text, 3500);
      }

      if (this.victoryTimer === 350) {
        this.shakeTimer = 40;
        this.shakeAmount = 14;
        this.glitchIntensity = 1;
      }
    }

    if (this.currentLevelNumber === 33) {
      const subtitle = [
        { frame: 40, text: '"O Self se completou. Nenhuma ferida é um erro."' },
        { frame: 120, text: '"Sou feita de luz, mas as sombras dão forma à minha história."' },
        { frame: 200, text: '"Pandora finalmente abriu a caixa... e encontrou a aceitação."' }
      ].find(s => s.frame === this.victoryTimer);

      if (subtitle) {
        this.thoughtsUI.showStorySubtitle(subtitle.text, 3800);
      }

      if (this.victoryTimer === 280) {
        this.shakeTimer = 45;
        this.shakeAmount = 15;
        this.glitchIntensity = 1.2;
      }
    }

    if (this.victoryTimer >= 420) {
      this.completeLevel();
    }
  }

  completeLevel() {
    const nextLevel = this.currentLevelNumber + 1;
    if (!this.unlockedLevels.includes(nextLevel) && nextLevel <= 33) {
      this.unlockedLevels.push(nextLevel);
      this.saveProgress();
    }

    if (nextLevel > 33) {
      this.showScreen('menu');
      alert('Parabéns! O Self de Pandora foi integrado com sucesso nas 33 memórias de colina neural. Você se libertou do medo.');
    } else {
      this.enterLevel(nextLevel);
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

    const modeName = nextMode === 'first' ? 'Primeira Pessoa' : 'Terceira Pessoa';
    this.thoughtsUI.triggerFloatingThought(`Câmera: ${modeName}`, 0.5, 0.2);
  }

  updateRadar() {
    const canvas = document.getElementById('radar-canvas') as HTMLCanvasElement;
    if (!canvas || !this.currentLevel) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radarScale = 0.08;
    const angle = -this.player.facingAngle - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    this.reminiscencesList.forEach(rem => {
      if (rem.collected) return;
      const dx = rem.x - this.player.x;
      const dy = rem.y - this.player.y;

      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;

      ctx.beginPath();
      ctx.arc(cx + rx * radarScale, cy + ry * radarScale, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 6;
      ctx.fill();
    });

    const behavior = this.currentLevel.shadowBehavior;
    if (behavior !== 'none') {
      const dx = this.shadow.x - this.player.x;
      const dy = this.shadow.y - this.player.y;

      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;

      ctx.beginPath();
      ctx.arc(cx + rx * radarScale, cy + ry * radarScale, 3.5, 0, Math.PI * 2);
      if (this.shadow.isStunned) {
        const flash = Math.sin(this.time * 20) > 0;
        ctx.fillStyle = flash ? '#ef4444' : '#ffffff';
        ctx.shadowColor = '#ef4444';
      } else {
        ctx.fillStyle = '#d946ef';
        ctx.shadowColor = '#d946ef';
      }
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    const dx = this.currentLevel.door.x - this.player.x;
    const dy = this.currentLevel.door.y - this.player.y;

    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;

    ctx.beginPath();
    ctx.arc(cx + rx * radarScale, cy + ry * radarScale, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 10;
    ctx.fill();

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