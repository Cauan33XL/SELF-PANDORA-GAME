import './style.css';
import { GameCoordinator } from './game/core/GameCoordinator';
import RAPIER from '@dimforge/rapier3d-compat';

document.addEventListener('DOMContentLoaded', async () => {
  await RAPIER.init();
  (window as any).game = new GameCoordinator();
});
