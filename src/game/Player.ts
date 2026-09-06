import { type Platform } from './LevelManager';
import { AudioManager } from './AudioManager';

export class Player {
  x = 100;
  y = 400;
  vx = 0;
  vy = 0;
  w = 20;
  h = 42;
  facingAngle = 0;
  targetAngle = 0;

  // Tuned for smoothness
  runSpeed = 3.8;
  accel = 0.2;          // exponential approach to target velocity (gentle ease)
  decel = 0.06;         // gentle deceleration when no input
  friction = 0.92;      // higher = more slide / momentum
  turnSpeed = 0.07;     // smooth angular interpolation

  waveActive = false;
  waveRadius = 0;
  waveMaxRadius = 220;
  waveSpeed = 7;
  waveCooldown = 0;

  // Jump / hop
  jumpHeight = 0;       // 0 = grounded, >0 = airborne (used by renderer for scale)
  jumpVelocity = 0;
  jumpGravity = 0.18;
  jumpStrength = 3.2;
  isJumping = false;
  jumpCooldown = 0;

  // For smooth collection magnetism
  magnetRadius = 120;
  magnetStrength = 0.05; // pull multiplier: gentle drift that accelerates near Pandora
  collectRadius = 22;    // distance at which the memory starts being absorbed

  constructor() {}

  spawn(e: { x: number; y: number }) {
    this.x = e.x;
    this.y = e.y;
    this.vx = 0;
    this.vy = 0;
    this.facingAngle = 0;
    this.targetAngle = 0;
    this.waveActive = false;
    this.waveRadius = 0;
    this.waveCooldown = 0;
    this.jumpHeight = 0;
    this.jumpVelocity = 0;
    this.isJumping = false;
    this.jumpCooldown = 0;
  }

  update(keys: Record<string, boolean>, isReverie: boolean) {
    const audio = AudioManager.getInstance();
    const left = keys.KeyA || keys.ArrowLeft;
    const right = keys.KeyD || keys.ArrowRight;
    const up = keys.KeyW || keys.ArrowUp;
    const down = keys.KeyS || keys.ArrowDown;

    // ── Smooth turning ───────────────────────────────────────
    if (left) {
      this.targetAngle -= 0.065;
    }
    if (right) {
      this.targetAngle += 0.065;
    }
    this.targetAngle = (this.targetAngle + Math.PI * 2) % (Math.PI * 2);

    // Interpolate actual angle toward target for smoothness
    let angleDiff = this.targetAngle - this.facingAngle;
    // Wrap to [-PI, PI]
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    this.facingAngle += angleDiff * this.turnSpeed;
    this.facingAngle = (this.facingAngle + Math.PI * 2) % (Math.PI * 2);

    // ── Movement with smooth target-velocity interpolation ─────
    let moveDir = 0;
    if (up) {
      moveDir = 1;
    } else if (down) {
      moveDir = -0.6; // backpedaling is slower
    }

    const limit = isReverie ? this.runSpeed * 1.2 : this.runSpeed;

    if (moveDir !== 0) {
      // Approach the desired velocity exponentially — buttery acceleration,
      // no overshoot, and a natural ease-out when turning mid-stride.
      const desiredVx = Math.cos(this.facingAngle) * limit * moveDir;
      const desiredVy = Math.sin(this.facingAngle) * limit * moveDir;
      this.vx += (desiredVx - this.vx) * this.accel;
      this.vy += (desiredVy - this.vy) * this.accel;
    } else {
      // Smooth deceleration — blend toward zero (momentum glide)
      this.vx *= this.friction;
      this.vy *= this.friction;
      // Kill micro-drift
      if (Math.abs(this.vx) < 0.05) this.vx = 0;
      if (Math.abs(this.vy) < 0.05) this.vy = 0;
    }

    // Soft speed clamping (keeps hops/momentum in check without hard cuts)
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > limit) {
      const dampFactor = limit / speed;
      this.vx *= dampFactor * 0.98 + 0.02; // blend toward limit
      this.vy *= dampFactor * 0.98 + 0.02;
    }

    // ── Wave ability ─────────────────────────────────────────
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

    // ── Jump / Hop ───────────────────────────────────────────
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    }

    if (keys.Space && !this.isJumping && this.jumpCooldown === 0) {
      this.isJumping = true;
      this.jumpVelocity = this.jumpStrength;
      this.jumpCooldown = 30;
    }

    if (this.isJumping) {
      this.jumpHeight += this.jumpVelocity;
      this.jumpVelocity -= this.jumpGravity;

      // Give a small forward boost during the hop
      this.vx += Math.cos(this.facingAngle) * 0.12;
      this.vy += Math.sin(this.facingAngle) * 0.12;

      if (this.jumpHeight <= 0) {
        this.jumpHeight = 0;
        this.jumpVelocity = 0;
        this.isJumping = false;
      }
    }
  }

  resolvePhysicsAndCollisions(platforms: Platform[], isReverie: boolean) {
    // Filter out non-active platforms for this state
    const activePlatforms = platforms.filter(p => {
      return !(
        (isReverie && p.isRealityOnly) ||
        (!isReverie && p.isReverieOnly) ||
        (p.isDissolving && p.dissolveTimer === 0)
      );
    });

    if (activePlatforms.length === 0) {
      this.x += this.vx;
      this.y += this.vy;
      return;
    }

    // ── Sub-stepped solid collision resolution ─────────────────
    // Collision is enforced every frame (even mid-hop), so Pandora can never
    // phase through a wall. Steps are sized so she can't skip through even the
    // thinnest obstacle, regardless of speed or momentum boosts.
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const SUBSTEPS = Math.max(4, Math.min(12, Math.ceil(speed / 1.2)));
    const stepVx = this.vx / SUBSTEPS;
    const stepVy = this.vy / SUBSTEPS;

    for (let step = 0; step < SUBSTEPS; step++) {
      this.x += stepVx;
      this.y += stepVy;
      this.resolveOverlaps(activePlatforms);
    }
  }

  private resolveOverlaps(platforms: Platform[]) {
    // Resolve every overlap using the direction of least penetration. This
    // yields natural wall-sliding, robust corner handling, and also behaves
    // correctly when a moving (Reverie) platform drifts into the player.
    let guard = 0;
    let moved = true;
    while (moved && guard < 4) {
      moved = false;
      guard++;
      for (const p of platforms) {
        if (!this.isColliding(this, p)) continue;

        const penLeft = this.x + this.w - p.x; // push → left
        const penRight = p.x + p.w - this.x;   // push → right
        const penUp = this.y + this.h - p.y;   // push → up
        const penDown = p.y + p.h - this.y;    // push → down
        const penX = Math.min(penLeft, penRight);
        const penY = Math.min(penUp, penDown);

        if (penX <= penY) {
          this.x += penLeft < penRight ? -(penLeft + 0.01) : penRight + 0.01;
          this.vx = 0;
        } else {
          this.y += penUp < penDown ? -(penUp + 0.01) : penDown + 0.01;
          this.vy = 0;
        }
        moved = true;
      }
    }
  }

  isColliding(
    rectA: { x: number; y: number; w: number; h: number },
    rectB: { x: number; y: number; w: number; h: number }
  ) {
    return (
      rectA.x < rectB.x + rectB.w &&
      rectA.x + rectA.w > rectB.x &&
      rectA.y < rectB.y + rectB.h &&
      rectA.y + rectA.h > rectB.y
    );
  }
}