import { xl } from './levelsData';

export interface DiaryLevelInfo {
  number: number;
  title: string;
  tag: string;
  diaryText: string;
  thoughts: string[];
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
}

export interface LevelConfig {
  number: number;
  title: string;
  tag: string;
  diaryText: string;
  thoughts: string[];
  gravity: number;
  windX: number;
  mistOpacity: number;
  shadowBehavior: string;
  reverieColor: string;
  playerSpawn: { x: number; y: number };
  shadowSpawn: { x: number; y: number };
  door: { x: number; y: number; w: number; h: number };
  platforms: Platform[];
  reminiscences: Reminiscence[];
}

export class LevelManager {
  static instance: LevelManager | null = null;
  levels: LevelConfig[] = [];

  constructor() {
    if (LevelManager.instance) {
      return LevelManager.instance;
    }
    this.generateLevelsDatabase();
    LevelManager.instance = this;
  }

  static getInstance(): LevelManager {
    return LevelManager.instance ||= new LevelManager();
  }

  getLevelsList(): DiaryLevelInfo[] {
    return this.levels.map(e => ({
      number: e.number,
      title: e.title,
      tag: e.tag,
      diaryText: e.diaryText,
      thoughts: e.thoughts
    }));
  }

  getLevel(e: number): LevelConfig | null {
    return this.levels.find(t => t.number === e) || null;
  }

  generateLevelsDatabase() {
    this.levels = xl.map(e => {
      const t: Platform[] = [];
      const n: Reminiscence[] = [];
      const r = { x: 120, y: 120 };
      const i = { x: 1200, y: 670 };
      const a = { x: 2200, y: 1150, w: 50, h: 80 };

      t.push({ x: 0, y: 0, w: 2400, h: 50 });
      t.push({ x: 0, y: 1300, w: 2400, h: 50 });
      t.push({ x: 0, y: 0, w: 50, h: 1350 });
      t.push({ x: 2350, y: 0, w: 50, h: 1350 });

      for (let nVal = 1; nVal < 15; nVal++) {
        for (let rVal = 1; rVal < 8; rVal++) {
          if ((nVal <= 2 && rVal <= 2) || (nVal >= 12 && rVal >= 6) || (nVal === 8 && rVal === 4)) {
            continue;
          }
          const iVal = Math.sin(nVal * 17.13 + rVal * 53.97 + e.number * 29.83) * 12345.6789;
          const aVal = iVal - Math.floor(iVal);
          const o = 50 + nVal * 150;
          const s = 50 + rVal * 150;

          if (aVal < .22) {
            t.push({ x: o, y: s, w: 30, h: 150 });
          } else if (aVal >= .22 && aVal < .44) {
            t.push({ x: o, y: s, w: 150, h: 30 });
          } else if (aVal >= .44 && aVal < .54) {
            t.push({ x: o + 35, y: s + 35, w: 80, h: 80 });
          } else if (aVal >= .54 && aVal < .65) {
            t.push({ x: o, y: s, w: 150, h: 30, isRealityOnly: true });
          } else if (aVal >= .65 && aVal < .76) {
            t.push({ x: o, y: s, w: 30, h: 150, isReverieOnly: true });
          }
        }
      }

      n.push({ x: 2100, y: 150, w: 15, h: 15, collected: false, text: e.thoughts[0] || 'Um fragmento de verdade...' });
      n.push({ x: 200, y: 1100, w: 15, h: 15, collected: false, text: e.thoughts[1] || 'A imaginação se expande...' });
      n.push({ x: 1200, y: 200, w: 15, h: 15, collected: false, text: e.thoughts[2] || 'Quem eu sou de verdade?' });

      return {
        number: e.number,
        title: e.title,
        tag: e.tag,
        diaryText: e.diaryText,
        thoughts: e.thoughts,
        gravity: 0,
        windX: 0,
        mistOpacity: e.mistOpacity,
        shadowBehavior: e.shadowBehavior,
        reverieColor: e.reverieColor,
        playerSpawn: r,
        shadowSpawn: i,
        door: a,
        platforms: t,
        reminiscences: n
      };
    });
  }
}