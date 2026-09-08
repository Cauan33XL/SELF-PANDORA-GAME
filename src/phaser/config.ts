import Phaser from 'phaser';
import { UIScene } from './scenes/UIScene';

export function initPhaser(containerId: string): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    parent: containerId,
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true, // Allows Three.js to show underneath
    pixelArt: false,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [UIScene]
  };

  return new Phaser.Game(config);
}
