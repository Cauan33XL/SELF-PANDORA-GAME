import { xl } from './levelsData';

export interface NexusInfo {
  number: number;
  title: string;
  tag: string;
  diaryText: string;
  thoughts: string[];
  gravity: number;
  windX: number;
  mistOpacity: number;
  shadowBehavior: string;
  worldX: number;
  worldY: number;
}

export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  isRealityOnly?: boolean;
  isReverieOnly?: boolean;
  isDissolving?: boolean;
  dissolveTimer?: number;
  maxDissolveTime?: number;
  origX?: number;
  origY?: number;
}

export interface Reminiscence {
  x: number;
  y: number;
  w: number;
  h: number;
  collected: boolean;
  text: string;
  nexusNumber: number;
  pickupProgress?: number;
}

// ── Deterministic pseudo-random & noise ──────────────────────────
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hash2d(x: number, y: number): number {
  let n = x * 374761393 + y * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  n = n ^ (n >> 16);
  return (n & 0x7fffffff) / 0x7fffffff;
}

function smoothNoise(x: number, y: number, scale: number): number {
  const sx = x / scale;
  const sy = y / scale;
  const ix = Math.floor(sx);
  const iy = Math.floor(sy);
  const fx = sx - ix;
  const fy = sy - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2d(ix, iy);
  const b = hash2d(ix + 1, iy);
  const c = hash2d(ix, iy + 1);
  const d = hash2d(ix + 1, iy + 1);
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
}

function fbm(x: number, y: number, octaves: number, scale: number): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxVal = 0;
  for (let i = 0; i < octaves; i++) {
    value += smoothNoise(x * frequency, y * frequency, scale) * amplitude;
    maxVal += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / maxVal;
}

// ── World Generator ──────────────────────────────────────────────
export class LevelManager {
  static instance: LevelManager | null = null;
  
  public nexuses: NexusInfo[] = [];
  public worldPlatforms: Platform[] = [];
  public worldReminiscences: Reminiscence[] = [];
  public playerSpawn = { x: 0, y: 0 };
  public shadowSpawn = { x: 0, y: 0 };

  constructor() {
    if (LevelManager.instance) {
      return LevelManager.instance;
    }
    this.generateOpenWorld();
    LevelManager.instance = this;
  }

  static getInstance(): LevelManager {
    return LevelManager.instance ||= new LevelManager();
  }

  getNexuses(): NexusInfo[] {
    return this.nexuses;
  }
  
  getNearestNexus(playerX: number, playerY: number): NexusInfo | null {
    if (this.nexuses.length === 0) return null;
    let nearest = this.nexuses[0];
    let minDist = Infinity;
    for (const n of this.nexuses) {
      const dx = playerX - n.worldX;
      const dy = playerY - n.worldY;
      const dist = dx * dx + dy * dy;
      if (dist < minDist) {
        minDist = dist;
        nearest = n;
      }
    }
    return nearest;
  }

  generateOpenWorld() {
    const WORLD_W = 24000;
    const WORLD_H = 16000;
    const GRID_COLS = 6;
    const SPACING_X = 3600;
    const SPACING_Y = 2400;
    
    this.playerSpawn = { x: SPACING_X, y: SPACING_Y - 60 };
    this.shadowSpawn = { x: SPACING_X + 1200, y: SPACING_Y };
    
    const rng = seededRandom(42);

    // ── 1. Place the 33 Nexuses ──────────────────────────────────
    this.nexuses = xl.map((e, idx) => {
      const col = (idx % GRID_COLS) + 1;
      const row = Math.floor(idx / GRID_COLS) + 1;
      const jitterX = (rng() - 0.5) * 1200;
      const jitterY = (rng() - 0.5) * 800;
      const worldX = col * SPACING_X + jitterX;
      const worldY = row * SPACING_Y + jitterY;

      // Nexus central clearing — a large ground slab
      this.worldPlatforms.push({ x: worldX - 300, y: worldY + 260, w: 600, h: 50 });
      // Smaller "altar" platform elevated above
      this.worldPlatforms.push({ x: worldX - 80, y: worldY + 120, w: 160, h: 24 });

      // Reminiscences hidden near each nexus
      const thoughts = e.thoughts || [];
      this.worldReminiscences.push({
        x: worldX + 180 + rng() * 200,
        y: worldY - 80 - rng() * 120,
        w: 15, h: 15, collected: false,
        text: thoughts[0] || 'Um fragmento de verdade...',
        nexusNumber: e.number
      });
      this.worldReminiscences.push({
        x: worldX - 250 - rng() * 200,
        y: worldY + 60 + rng() * 100,
        w: 15, h: 15, collected: false,
        text: thoughts[1] || 'A imaginação se expande...',
        nexusNumber: e.number
      });
      this.worldReminiscences.push({
        x: worldX + rng() * 300 - 150,
        y: worldY + 350 + rng() * 150,
        w: 15, h: 15, collected: false,
        text: thoughts[2] || 'Quem eu sou de verdade?',
        nexusNumber: e.number
      });

      return {
        number: e.number,
        title: e.title,
        tag: e.tag,
        diaryText: e.diaryText,
        thoughts: e.thoughts,
        gravity: e.gravity || 0.35,
        windX: e.windX || 0,
        mistOpacity: e.mistOpacity || 0.3,
        shadowBehavior: e.shadowBehavior,
        worldX,
        worldY
      };
    });

    // ── 2. Surrealist Forest Generation ──────────────────────────
    // We use a sparse sampling approach:
    //   - Large step (600px) for "trunk" candidates
    //   - Each trunk spawns branches, roots, canopies
    //   - Between trunks we scatter debris and floating fragments

    const STEP = 600;
    const MARGIN = 800;

    for (let gx = MARGIN; gx < WORLD_W - MARGIN; gx += STEP) {
      for (let gy = MARGIN; gy < WORLD_H - MARGIN; gy += STEP) {

        // Skip areas very close to nexus centers so they stay open
        let tooCloseToNexus = false;
        for (const nex of this.nexuses) {
          const dx = gx - nex.worldX;
          const dy = gy - nex.worldY;
          if (dx * dx + dy * dy < 500 * 500) {
            tooCloseToNexus = true;
            break;
          }
        }
        if (tooCloseToNexus) continue;

        const density = fbm(gx, gy, 4, 800);
        const chaosVal = fbm(gx + 9999, gy + 3333, 3, 500);
        const localRng = seededRandom(gx * 7919 + gy * 104729);

        // ─── TREE TRUNKS ────────────────────────────────────────
        // Dense areas (density > 0.52) get tall vertical columns 
        if (density > 0.52) {
          const trunkH = 200 + localRng() * 400; // tall vertical pillars
          const trunkW = 28 + localRng() * 24;
          const trunkX = gx + (localRng() - 0.5) * 200;
          const trunkY = gy - trunkH;

          this.worldPlatforms.push({ x: trunkX, y: trunkY, w: trunkW, h: trunkH });

          // ─── BRANCHES (horizontal arms extending from trunk) ──
          const branchCount = 1 + Math.floor(localRng() * 3);
          for (let b = 0; b < branchCount; b++) {
            const bY = trunkY + trunkH * (0.15 + localRng() * 0.6);
            const goLeft = localRng() > 0.5;
            const branchLen = 80 + localRng() * 180;
            const branchThick = 14 + localRng() * 14;
            const bX = goLeft ? trunkX - branchLen : trunkX + trunkW;

            this.worldPlatforms.push({ x: bX, y: bY, w: branchLen, h: branchThick });

            // Small twig at branch tip (angled platform)
            if (localRng() > 0.4) {
              const tipX = goLeft ? bX - 30 - localRng() * 40 : bX + branchLen;
              const tipY = bY - 20 - localRng() * 60;
              this.worldPlatforms.push({ x: tipX, y: tipY, w: 50 + localRng() * 40, h: 10 + localRng() * 8 });
            }
          }

          // ─── CANOPY (cluster of platforms at tree top) ─────────
          if (localRng() > 0.3) {
            const canopyCount = 2 + Math.floor(localRng() * 3);
            for (let c = 0; c < canopyCount; c++) {
              const cx = trunkX - 60 + localRng() * 160;
              const cy = trunkY - 20 - localRng() * 80;
              const cw = 60 + localRng() * 120;
              const ch = 14 + localRng() * 12;
              const isReverie = localRng() > 0.75;
              this.worldPlatforms.push({
                x: cx, y: cy, w: cw, h: ch,
                isReverieOnly: isReverie ? true : undefined
              });
            }
          }

          // ─── EXPOSED ROOTS (sprawling floor-level platforms) ───
          if (localRng() > 0.4) {
            const rootCount = 1 + Math.floor(localRng() * 3);
            for (let r = 0; r < rootCount; r++) {
              const rDir = localRng() > 0.5 ? 1 : -1;
              const rootLen = 100 + localRng() * 200;
              const rx = rDir > 0 ? trunkX + trunkW : trunkX - rootLen;
              const ry = gy - 10 + localRng() * 30;
              this.worldPlatforms.push({ x: rx, y: ry, w: rootLen, h: 16 + localRng() * 12 });
            }
          }
        }

        // ─── GROUND / FOREST FLOOR ──────────────────────────────
        // Medium density areas get irregular ground patches
        else if (density > 0.38) {
          const floorW = 100 + localRng() * 250;
          const floorH = 20 + localRng() * 20;
          this.worldPlatforms.push({ x: gx, y: gy, w: floorW, h: floorH });

          // Occasional small rock or stump
          if (localRng() > 0.6) {
            const rockX = gx + localRng() * floorW;
            const rockH = 30 + localRng() * 50;
            this.worldPlatforms.push({ x: rockX, y: gy - rockH, w: 24 + localRng() * 30, h: rockH });
          }
        }

        // ─── SURREAL FLOATING DEBRIS ────────────────────────────
        // Low density + high chaos = impossible floating fragments
        else if (density < 0.3 && chaosVal > 0.6) {
          const floatX = gx + (localRng() - 0.5) * 300;
          const floatY = gy - 100 - localRng() * 400;
          const floatW = 40 + localRng() * 100;
          const floatH = 12 + localRng() * 20;
          const isReality = localRng() > 0.6;

          this.worldPlatforms.push({
            x: floatX, y: floatY, w: floatW, h: floatH,
            isRealityOnly: isReality ? true : undefined
          });

          // Floating pair (surreal mirror)
          if (localRng() > 0.5) {
            this.worldPlatforms.push({
              x: floatX + 40 + localRng() * 60,
              y: floatY - 60 - localRng() * 80,
              w: 30 + localRng() * 50,
              h: 10 + localRng() * 10,
              isReverieOnly: true
            });
          }
        }

        // ─── VINE BRIDGES (thin horizontal connectors) ──────────
        // Sparse areas with moderate density become paths
        else if (density > 0.3 && density <= 0.38 && localRng() > 0.5) {
          const bridgeW = 200 + localRng() * 400;
          this.worldPlatforms.push({
            x: gx, y: gy - 40 - localRng() * 100,
            w: bridgeW, h: 10 + localRng() * 8,
            isDissolving: localRng() > 0.7 ? true : undefined
          });
        }
      }
    }

    // ── 3. Paths between Nexuses ─────────────────────────────────
    // Create stepping-stone trails that loosely connect adjacent nexuses
    for (let i = 0; i < this.nexuses.length - 1; i++) {
      const a = this.nexuses[i];
      const b = this.nexuses[i + 1];
      const steps = 8 + Math.floor(rng() * 6);
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const mx = a.worldX + (b.worldX - a.worldX) * t;
        const my = a.worldY + (b.worldY - a.worldY) * t;
        // Organic wobble
        const wobX = (rng() - 0.5) * 300;
        const wobY = (rng() - 0.5) * 200;
        this.worldPlatforms.push({
          x: mx + wobX,
          y: my + wobY,
          w: 80 + rng() * 120,
          h: 18 + rng() * 14
        });
      }
    }

    // ── 4. World Boundaries (invisible massive walls) ────────────
    this.worldPlatforms.push({ x: 0, y: 0, w: WORLD_W, h: 60 });
    this.worldPlatforms.push({ x: 0, y: WORLD_H, w: WORLD_W, h: 60 });
    this.worldPlatforms.push({ x: 0, y: 0, w: 60, h: WORLD_H });
    this.worldPlatforms.push({ x: WORLD_W, y: 0, w: 60, h: WORLD_H });
  }
}