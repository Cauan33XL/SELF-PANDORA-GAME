import './style.css';
import { GameCoordinator } from './game/GameCoordinator';

document.addEventListener('DOMContentLoaded', () => {
  (window as any).game = new GameCoordinator();
});
