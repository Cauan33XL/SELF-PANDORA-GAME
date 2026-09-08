import { type NexusInfo } from '../level/LevelManager';
import { AudioManager } from '../core/AudioManager';
import { Player } from './Player';

export class Shadow {
  x = 300;
  y = 400;
  w = 20;
  h = 42;
  pulseTime = 0;
  historyBuffer: { x: number; y: number }[] = [];
  bufferSize = 50;
  isStunned = false;
  stunnedTimer = 0;

  constructor() {}

  spawn(e: { x: number; y: number }) {
    this.x = e.x;
    this.y = e.y;
    this.historyBuffer = [];
    this.pulseTime = Math.random() * 100;
    this.isStunned = false;
    this.stunnedTimer = 0;
  }

  update(player: Player, nearestNexus: NexusInfo, isReverie: boolean) {
    this.pulseTime += 0.08;
    const behavior = nearestNexus.shadowBehavior;
    const audio = AudioManager.getInstance();

    if (behavior === 'none') {
      this.x = -999;
      this.y = -999;
      return;
    }

    if (this.stunnedTimer > 0) {
      this.stunnedTimer--;
      if (this.stunnedTimer === 0) {
        this.isStunned = false;
      }
    }

    if (player.waveActive && !this.isStunned) {
      const dx = this.x + this.w / 2 - (player.x + player.w / 2);
      const dy = this.y + this.h / 2 - (player.y + player.h / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= player.waveRadius && dist > player.waveRadius - 40) {
        this.isStunned = true;
        this.stunnedTimer = 90;
        const angle = dist > 0 ? Math.atan2(dy, dx) : Math.PI;
        this.x += Math.cos(angle) * 120;
        this.y += Math.sin(angle) * 120;
        this.x = Math.max(50, Math.min(2350 - this.w, this.x));
        this.y = Math.max(50, Math.min(1300 - this.h, this.y));
      }
    }

    if (this.isStunned) {
      audio.setHeartbeatSpeed(0);
      return;
    }

    this.historyBuffer.push({ x: player.x, y: player.y });
    if (this.historyBuffer.length > this.bufferSize) {
      this.historyBuffer.shift();
    }

    if (!isReverie) {
      if (behavior === 'chase' || behavior === 'mirror') {
        this.x += (nearestNexus.worldX + 500 - this.x) * 0.05;
        this.y += (nearestNexus.worldY - this.y) * 0.05;
      } else if (behavior === 'stationary') {
        this.x = nearestNexus.worldX + 500;
        this.y = nearestNexus.worldY;
      }
      audio.setHeartbeatSpeed(0);
      return;
    }

    if (behavior === 'stationary') {
      this.x = nearestNexus.worldX + 500;
      this.y = nearestNexus.worldY + Math.sin(this.pulseTime * 1.5) * 4;
      audio.setHeartbeatSpeed(0);
    } else if (behavior === 'mirror') {
      if (this.historyBuffer.length >= this.bufferSize) {
        const oldest = this.historyBuffer[0];
        this.x += (oldest.x - this.x) * 0.15;
        this.y += (oldest.y - this.y) * 0.15;
      } else {
        this.x = nearestNexus.worldX + 500;
        this.y = nearestNexus.worldY;
      }
      const dist = this.getDistanceTo(player.x, player.y);
      const intensity = Math.max(0, 1 - dist / 300);
      audio.setHeartbeatSpeed(intensity * 0.5);
    } else if (behavior === 'chase') {
      const speed = 1.6;
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 5) {
        this.x += (dx / dist) * speed;
        this.y += (dy / dist) * speed;
      }
      const intensity = Math.max(0, 1 - dist / 350);
      audio.setHeartbeatSpeed(intensity);
    } else if (behavior === 'companion') {
      const targetX = player.x;
      if (nearestNexus.number === 33) {
        this.x = nearestNexus.worldX + 500;
        this.y = nearestNexus.worldY;
      } else {
        this.x += (targetX - this.x) * 0.04;
        this.y += (nearestNexus.worldY - this.y) * 0.04;
      }
      audio.setHeartbeatSpeed(0);
    }
  }

  checkPlayerContact(player: Player): boolean {
    return (
      player.x < this.x + this.w &&
      player.x + player.w > this.x &&
      player.y < this.y + this.h &&
      player.y + player.h > this.y
    );
  }

  getAsPlatform() {
    return {
      x: this.x - 6,
      y: this.y,
      w: this.w + 12,
      h: 12,
      color: 'rgba(217, 70, 239, 0.4)'
    };
  }

  getDistanceTo(targetX: number, targetY: number): number {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}