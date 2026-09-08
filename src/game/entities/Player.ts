import { AudioManager } from '../core/AudioManager';
import RAPIER from '@dimforge/rapier3d-compat';

export class Player {
  x = 100;
  y = 400;
  vx = 0;
  vy = 0;
  w = 20;
  h = 42;
  facingAngle = 0;
  targetAngle = 0;

  // Tuned for smoothness and responsiveness
  runSpeed = 4.2;
  accel = 0.35;          // faster approach to target velocity
  decel = 0.15;         // faster deceleration when no input (feels less floaty, more responsive)
  friction = 0.90;      // higher = more slide / momentum
  turnSpeed = 0.15;     // smoother and faster angular interpolation

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
  // For smooth collection magnetism
  magnetRadius = 120;
  magnetStrength = 0.05; // pull multiplier: gentle drift that accelerates near Pandora
  collectRadius = 22;    // distance at which the memory starts being absorbed

  rigidBody?: RAPIER.RigidBody;
  characterController?: RAPIER.KinematicCharacterController;

  constructor() {}

  spawn(e: { x: number; y: number }, world: RAPIER.World) {
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

    if (this.rigidBody) {
      world.removeRigidBody(this.rigidBody);
    }
    if (this.characterController) {
      world.removeCharacterController(this.characterController);
    }

    const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(this.x, this.y, 0);
    this.rigidBody = world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(this.w / 2, this.h / 2, 20);
    world.createCollider(colliderDesc, this.rigidBody);
    
    this.characterController = world.createCharacterController(0.1);
    this.characterController.setUp({ x: 0.0, y: 0.0, z: 1.0 });
  }

  update(keys: Record<string, boolean>, cameraAngle: number = 0) {
    const audio = AudioManager.getInstance();
    const left = keys.KeyA || keys.ArrowLeft;
    const right = keys.KeyD || keys.ArrowRight;
    const up = keys.KeyW || keys.ArrowUp;
    const down = keys.KeyS || keys.ArrowDown;

    let inputX = 0;
    let inputY = 0;
    if (up) inputX += 1;
    if (down) inputX -= 1;
    if (left) inputY -= 1;
    if (right) inputY += 1;

    let moveDir = 0;
    if (inputX !== 0 || inputY !== 0) {
      moveDir = 1;
      const inputAngle = Math.atan2(inputY, inputX);
      this.targetAngle = cameraAngle + inputAngle;
      this.targetAngle = (this.targetAngle + Math.PI * 2) % (Math.PI * 2);
    }

      // Smooth turning for third-person
      let angleDiff = this.targetAngle - this.facingAngle;
      // Wrap to [-PI, PI]
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.facingAngle += angleDiff * this.turnSpeed; // Visual turning speed
      this.facingAngle = (this.facingAngle + Math.PI * 2) % (Math.PI * 2);

    const limit = this.runSpeed;

    if (moveDir !== 0) {
      // Move in the direction the model actually faces. The character
      // turns smoothly into the new heading and walks along it, instead
      // of instantly sliding diagonally while still facing another way.
      const desiredVx = Math.cos(this.facingAngle) * limit;
      const desiredVy = Math.sin(this.facingAngle) * limit;
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

    if (keys.MouseClick && this.waveCooldown === 0 && !this.waveActive) {
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

    if (this.characterController && this.rigidBody) {
      const collider = this.rigidBody.collider(0);
      const currentPos = this.rigidBody.translation();

      // ── Axis-separated collision resolution ─────────────────
      // Resolving X and Y independently lets diagonal movement slide
      // smoothly against the axis-aligned platforms. The single diagonal
      // sweep used before got stuck on platform corners, freezing input.
      // Move along X first and resolve collisions
      this.characterController.computeColliderMovement(
        collider,
        new RAPIER.Vector3(this.vx, 0, 0),
        RAPIER.QueryFilterFlags.EXCLUDE_SENSORS,
        undefined,
        undefined
      );
      const mx = this.characterController.computedMovement().x;
      const finalX = currentPos.x + mx;
      this.vx = mx; // sync velocity to what was actually applied

      // Reposition the collider before checking the Y axis so the
      // second resolution starts from the X-resolved location
      this.rigidBody.setTranslation({ x: finalX, y: currentPos.y, z: currentPos.z }, false);

      // Move along Y and resolve collisions
      this.characterController.computeColliderMovement(
        collider,
        new RAPIER.Vector3(0, this.vy, 0),
        RAPIER.QueryFilterFlags.EXCLUDE_SENSORS,
        undefined,
        undefined
      );
      const my = this.characterController.computedMovement().y;
      const finalY = currentPos.y + my;
      this.vy = my; // sync velocity to what was actually applied

      this.rigidBody.setNextKinematicTranslation({
        x: finalX,
        y: finalY,
        z: currentPos.z
      });

      this.x = finalX;
      this.y = finalY;
    }
  }
}