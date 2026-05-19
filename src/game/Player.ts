import { type LevelConfig } from './LevelManager';
import { AudioManager } from './AudioManager';

export class Player {
  x = 100;
  y = 400;
  vx = 0;
  vy = 0;
  w = 20;
  h = 42;
  facingAngle = 0;
  runSpeed = 3.6;
  accel = 0.45;
  friction = 0.84;
  waveActive = false;
  waveRadius = 0;
  waveMaxRadius = 220;
  waveSpeed = 7;
  waveCooldown = 0;

  constructor() {}

  spawn(e: { x: number; y: number }) {
    this.x = e.x;
    this.y = e.y;
    this.vx = 0;
    this.vy = 0;
    this.facingAngle = 0;
    this.waveActive = false;
    this.waveRadius = 0;
    this.waveCooldown = 0;
  }

  update(keys: Record<string, boolean>, level: LevelConfig, isReverie: boolean) {
    const audio = AudioManager.getInstance();
    const left = keys.KeyA || keys.ArrowLeft;
    const right = keys.KeyD || keys.ArrowRight;
    const up = keys.KeyW || keys.ArrowUp;
    const down = keys.KeyS || keys.ArrowDown;

    if (left) {
      this.facingAngle -= 0.055;
    }
    if (right) {
      this.facingAngle += 0.055;
    }
    this.facingAngle = (this.facingAngle + Math.PI * 2) % (Math.PI * 2);

    let moveDir = 0;
    if (up) {
      moveDir = 1;
    } else if (down) {
      moveDir = -1;
    }

    if (moveDir === 0) {
      this.vx *= this.friction;
      this.vy *= this.friction;
    } else {
      this.vx += Math.cos(this.facingAngle) * this.accel * moveDir;
      this.vy += Math.sin(this.facingAngle) * this.accel * moveDir;
    }

    const limit = isReverie ? this.runSpeed * 1.25 : this.runSpeed;
    if (Math.abs(this.vx) > limit) {
      this.vx = Math.sign(this.vx) * limit;
    }
    if (Math.abs(this.vy) > limit) {
      this.vy = Math.sign(this.vy) * limit;
    }

    if (this.waveCooldown > 0) {
      this.waveCooldown--;
    }

    if (this.waveActive) {
      this.waveRadius += this.waveSpeed;
      if (this.waveRadius >= this.waveMaxRadius) {
        this.waveActive = false;
        this.waveRadius = 0;
      }
    }

    if ((keys.KeyE || keys.MouseClick) && this.waveCooldown === 0 && !this.waveActive) {
      this.waveActive = true;
      this.waveRadius = 0;
      this.waveCooldown = 120;
      audio.playLucidityWave();
    }
  }

  resolvePhysicsAndCollisions(level: LevelConfig, isReverie: boolean) {
    const activePlatforms = level.platforms.filter(p => {
      return !(
        (isReverie && p.isRealityOnly) ||
        (!isReverie && p.isReverieOnly) ||
        (p.isDissolving && p.dissolveTimer === 0)
      );
    });

    this.x += this.vx;
    for (const p of activePlatforms) {
      if (this.isColliding(this, p)) {
        if (this.vx > 0) {
          this.x = p.x - this.w;
          this.vx = 0;
        } else if (this.vx < 0) {
          this.x = p.x + p.w;
          this.vx = 0;
        }
      }
    }

    this.y += this.vy;
    for (const p of activePlatforms) {
      if (this.isColliding(this, p)) {
        if (this.vy > 0) {
          this.y = p.y - this.h;
          this.vy = 0;
        } else if (this.vy < 0) {
          this.y = p.y + p.h;
          this.vy = 0;
        }
      }
    }
  }

  isColliding(rectA: { x: number; y: number; w: number; h: number }, rectB: { x: number; y: number; w: number; h: number }) {
    return (
      rectA.x < rectB.x + rectB.w &&
      rectA.x + rectA.w > rectB.x &&
      rectA.y < rectB.y + rectB.h &&
      rectA.y + rectA.h > rectB.y
    );
  }
}