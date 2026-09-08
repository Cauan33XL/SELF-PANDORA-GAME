import './style.css';
import { GameCoordinator } from './game/core/GameCoordinator';
import { initPhaser } from './phaser/config';
import RAPIER from '@dimforge/rapier3d-compat';

document.addEventListener('DOMContentLoaded', async () => {
  await RAPIER.init();
  (window as any).game = new GameCoordinator();
  (window as any).phaser = initPhaser('phaser-container');
});
