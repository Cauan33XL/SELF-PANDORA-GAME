import * as THREE from 'three';
// Env filter removed: all procedural materials are authored directly in grayscale.
// State transitions use texture swaps instead of runtime shader injection.
export function updateEnvFilter(_isReverie: boolean) { /* reserved for future texture-swap logic */ }

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { type Platform } from '../level/LevelManager';

function ml(_color: number): THREE.Group {
  const g = new THREE.Group();

  const loader = new GLTFLoader();
  loader.load(
    '/pandora/PANDORA-MODEL.glb',
    (gltf) => {
      const object = gltf.scene;
      
      // Escala restaurada para 1.0
      object.scale.set(1.0, 1.0, 1.0);
      
      // Rotacionando para alinhar (Z-Up)
      object.rotation.x = Math.PI / 2;
      
      // Habilitar sombras
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.geometry) {
            child.geometry.computeVertexNormals();
          }
          // NÃO aplicar filtro de ambiente — Pandora mantém suas cores originais
          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach(mat => {
              mat.flatShading = false;
              mat.needsUpdate = true;
            });
          }
        }
      });
      
      g.add(object);
      g.userData.isGLB = true;
      
      // Força atualização de matrizes antes do Box3
      object.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      box.getSize(size);
      
      // O Box3 nativo em SkinnedMeshes costuma ser impreciso, fazendo afundar ou flutuar.
      // O valor size.z * 0.5 a fazia flutuar um pouco. Usaremos size.z * 0.38 para estabilizar os pés no chão.
      g.userData.feetOffset = size.z * 0.38;
      console.log('[Pandora] Box3 size:', size, '| feetOffset:', g.userData.feetOffset);

    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
      console.error('Erro ao carregar o GLB:', error);
    }
  );

  return g;
}

function hl(): THREE.Group {
  const e = new THREE.Group(),
      t = new THREE.MeshStandardMaterial({color: 0x333333, metalness: .95, roughness: .05}),
     n = new THREE.MeshBasicMaterial({color: 0x888888}),
      rVal = new THREE.Mesh(new THREE.SphereGeometry(.3, 16, 16), t);
  rVal.position.set(0, 0, 0);
  rVal.castShadow = !0;
  e.add(rVal);
  
  const i = new THREE.Mesh(new THREE.SphereGeometry(.42, 16, 16), t);
  i.scale.set(1.3, 1.6, .9);
  i.position.set(0, -.45, -.05);
  i.castShadow = !0;
  e.add(i);
  
  const a: THREE.Mesh[] = [];
  [{x: -.15, y: .12, z: .18, r: .03}, {x: -.05, y: .14, z: .24, r: .045}, {x: .05, y: .14, z: .24, r: .055}, {x: .15, y: .12, z: .18, r: .025}, {x: -.18, y: .02, z: .15, r: .02}, {x: -.06, y: .04, z: .22, r: .04}, {x: .06, y: .04, z: .22, r: .035}, {x: .18, y: .02, z: .15, r: .025}].forEach(tVal => {
    const rVal2 = new THREE.Mesh(new THREE.SphereGeometry(tVal.r, 8, 8), n);
    rVal2.position.set(tVal.x, tVal.y, tVal.z);
    e.add(rVal2);
    a.push(rVal2);
  });
  e.userData.eyes = a;
  
  const oVal = new THREE.ConeGeometry(.06, .22, 4),
      s = new THREE.Mesh(oVal, t);
  s.position.set(-.08, -.16, .22);
  s.rotation.x = Math.PI / 6;
  s.rotation.z = Math.PI / 12;
  s.castShadow = !0;
  e.add(s);
  
  const cVal = new THREE.Mesh(oVal, t);
  cVal.position.set(.08, -.16, .22);
  cVal.rotation.x = Math.PI / 6;
  cVal.rotation.z = -Math.PI / 12;
  cVal.castShadow = !0;
  e.add(cVal);
  
  const l: THREE.Group[] = [],
      u = new THREE.CylinderGeometry(.025, .018, .75, 6),
      d = new THREE.CylinderGeometry(.018, .008, .65, 6);
  for (let nVal = 0; nVal < 8; nVal++) {
    const rVal3 = nVal < 4,
        iVal = nVal % 4,
        aVal = new THREE.Group(),
        oVal2 = rVal3 ? -.22 : .22;
    aVal.position.set(oVal2, .05 - iVal * .1, .05);
    const cVal2 = new THREE.Mesh(u, t);
    cVal2.rotation.z = rVal3 ? Math.PI / 2.2 : -Math.PI / 2.2;
    cVal2.rotation.y = rVal3 ? -Math.PI / 6 : Math.PI / 6;
    cVal2.position.set(rVal3 ? -.25 : .25, .1, .1);
    cVal2.castShadow = !0;
    aVal.add(cVal2);
    const fVal = new THREE.Mesh(d, t);
    fVal.rotation.z = rVal3 ? Math.PI / 4 : -Math.PI / 4;
    fVal.position.set(rVal3 ? -.45 : .45, -.05, -.25);
    fVal.castShadow = !0;
    aVal.add(fVal);
    e.add(aVal);
    l.push(aVal);
  }
  e.userData.legs = l;
  
  const f = new THREE.SphereGeometry(.08, 8, 8),
      p = new THREE.SphereGeometry(.05, 8, 8),
      m = new THREE.Mesh(f, t);
  m.position.set(-.6, .4, -.3);
  e.add(m);
  const h = new THREE.Mesh(p, t);
  h.position.set(.65, -.2, .25);
  e.add(h);
  const g = new THREE.Mesh(p, t);
  g.position.set(-.3, -.7, .45);
  e.add(g);
  e.scale.set(1.45, 1.45, 1.45);
  return e;
}

function gl(e: THREE.Group, t: boolean, n: number) {
  const rVal = e.userData.legs as THREE.Group[],
      i = e.userData.eyes as THREE.Mesh[];
  if (t) {
    if (i) {
      i.forEach(eVal => { eVal.scale.set(1, 1, 1); });
    }
    if (rVal && rVal.length === 8) {
      const eVal = n * 18;
      rVal.forEach((tVal, nVal) => {
        const rVal2 = nVal < 4,
            iVal = nVal % 4,
            aVal = rVal2 ? Math.PI / 6 + iVal * Math.PI / 8 : -Math.PI / 6 - iVal * Math.PI / 8,
            oVal = rVal2 ? Math.PI / 4 : -Math.PI / 4,
            sVal = nVal * 1.5;
        tVal.rotation.y = aVal + Math.sin(eVal + sVal) * .25;
        tVal.rotation.z = oVal + Math.cos(eVal + sVal) * .18;
      });
    }
  } else {
    if (i) {
      i.forEach(eVal => { eVal.scale.set(0, 0, 0); });
    }
    if (rVal && rVal.length === 8) {
      rVal.forEach((eVal, tVal) => {
        const nVal = tVal < 4,
            rVal3 = tVal % 4;
        eVal.rotation.y = nVal ? Math.PI / 1.5 - rVal3 * .05 : -Math.PI / 1.5 + rVal3 * .05;
        eVal.rotation.z = nVal ? Math.PI / 8 : -Math.PI / 8;
      });
    }
  }
}

function _l(t: number, n: number, s: number, cVal: THREE.Texture, u: THREE.Texture): THREE.Group {
  const f = new THREE.Group();
  const p: number = 0x444444; // dark gray edge
  const m: THREE.Texture = s <= 15 ? cVal : u;
  const h = (tex: THREE.Texture, nVal: number, iVal: number) => {
    const aVal = tex.clone();
    aVal.wrapS = THREE.RepeatWrapping;
    aVal.wrapT = THREE.RepeatWrapping;
    aVal.minFilter = THREE.LinearFilter;
    aVal.magFilter = THREE.LinearFilter;
    aVal.repeat.set(nVal, iVal);
    aVal.needsUpdate = !0;
    return aVal;
  },
  g = h(m, 7.2, Math.max(1, n / 48 * 1.5)),
  _ = h(m, Math.max(1, t / 48 * 1.5), 7.2),
  v = h(m, Math.max(1, t / 48 * 1.5), Math.max(1, n / 48 * 1.5)),
  y = (tex: THREE.Texture) =>
    new THREE.MeshStandardMaterial({color: 0xffffff, map: tex, metalness: .1, roughness: .9, side: 0}),
  b = [y(g), y(g), y(_), y(_), y(v), y(v)],
  x = new THREE.Mesh(new THREE.BoxGeometry(t / 48, n / 48, 4.8), b);
  x.castShadow = !0;
  x.receiveShadow = !0;
  f.add(x);
  
  // Borda luminosa cinza para todas as plataformas
  const S_mat = new THREE.MeshStandardMaterial({color: p, emissive: p, emissiveIntensity: .3, metalness: .5, roughness: .4});
  const S = new THREE.Mesh(new THREE.BoxGeometry(t / 48 + .05, .04, .05), S_mat);
  S.position.y = n / 48 / 2 + .02;
  S.position.z = 2.4;
  f.add(S);
  return f;
}

function vl(eVal: number, t: number, _n: number): THREE.Group {
  const rVal = new THREE.Group(),
      // Moldura cinza escura
      i = new THREE.Mesh(new THREE.BoxGeometry(eVal / 48 + .2, t / 48 + .2, .3), new THREE.MeshStandardMaterial({color: 0x333333, metalness: .5, roughness: .7}));
  i.castShadow = !0;
  rVal.add(i);
  // Painel cinza claro com brilho sutil
  const a = new THREE.Mesh(new THREE.BoxGeometry(eVal / 48, t / 48, .1), new THREE.MeshStandardMaterial({color: 0xaaaaaa, emissive: 0x888888, emissiveIntensity: .3, metalness: .4, roughness: .5, transparent: !0, opacity: .85}));
  a.position.z = .1;
  rVal.add(a);
  const oVal = new THREE.Mesh(new THREE.RingGeometry(.3, .5, 32), new THREE.MeshBasicMaterial({color: 0xcccccc, transparent: !0, opacity: .5, side: 2}));
  oVal.position.z = .15;
  rVal.add(oVal);
  const s = new THREE.Mesh(new THREE.SphereGeometry(.8, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: !0, opacity: .12, side: 1}));
  rVal.add(s);
  return rVal;
}

function yl(): THREE.Group {
  const e = new THREE.Group(),
      // Cristal cinza com brilho branco suave
      t = new THREE.Mesh(new THREE.OctahedronGeometry(.35), new THREE.MeshStandardMaterial({color: 0x888888, emissive: 0xaaaaaa, emissiveIntensity: .4, metalness: .3, roughness: .4}));
  t.castShadow = !0;
  e.add(t);
  const n = new THREE.Mesh(new THREE.OctahedronGeometry(.5), new THREE.MeshBasicMaterial({color: 0xcccccc, transparent: !0, opacity: .25, wireframe: !0}));
  e.add(n);
  const rVal = new THREE.Mesh(new THREE.SphereGeometry(.7, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: !0, opacity: .1, side: 1}));
  e.add(rVal);
  return e;
}

export class ThreeDRenderer {
  container: HTMLElement;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  clock: THREE.Clock;
  composer!: EffectComposer;
  bloomPass!: UnrealBloomPass;
  purpleLight!: THREE.PointLight;
  cyanLight!: THREE.PointLight;
  playerMesh: THREE.Group | null = null;
  shadowMesh: THREE.Group | null = null;
  doorMesh: THREE.Group | null = null;
  platformMeshes: THREE.Group[] = [];
  platformMeta: { w: number; h: number; }[] = [];
  reminiscenceMeshes: THREE.Group[] = [];
  skySphere!: THREE.Mesh;
  mistParticles!: THREE.Points;
  ambientParticles!: THREE.Points;
  particlesGroup!: THREE.Group;
  particleSystems: THREE.Points[] = [];
  waveRing!: THREE.Mesh;
  transitionPlane!: THREE.Mesh;
  groundMesh: THREE.Mesh | null = null;
  groundRaycaster = new THREE.Raycaster();
  groundRayDir = new THREE.Vector3(0, 0, -1);
  cameraOrbitYaw = 0;
  cameraOrbitPitch = 0.55;
  cameraDistance = 2.8;
  // Controles de câmera por mouse
  private _rmb = false;          // botão direito pressionado
  private _rmbLastX = 0;
  private _rmbLastY = 0;
  private readonly ZOOM_MIN = 0.8;
  private readonly ZOOM_MAX = 20.0;
  currentLevelNum = 1;
  playerAngle = 0;
  walkPhase = 0;
  targetCamX = 0;
  targetCamY = 0;
  playerColor = 0x888888; // cinza
  doorColor = 0x666666;   // cinza escuro
  realityTexture!: THREE.Texture;
  reverieTexture!: THREE.Texture;
  surrealTexture3!: THREE.Texture;
  surrealTexture4!: THREE.Texture;
  skyDayTexture!: THREE.Texture;
  skyNightTexture!: THREE.Texture;

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.loadTextures();
    this.initScene();
    this.setupCameraControls(); // registra eventos de scroll e drag da câmera
    this.setupPostProcessing(this.container.clientWidth, this.container.clientHeight);
    this.setupLights();
    this.createBackground();
    this.createAmbientParticles();
    this.createMistParticles();
    this.createWaveRing();
    this.createTransitionPlane();
  }

  loadTextures() {
    const progressBar = document.getElementById('loading-progress-bar');
    const statusText = document.getElementById('loading-status-text');
    const loadingScreen = document.getElementById('loading-screen');
    const menuScreenBase = document.getElementById('menu-screen-base');
    const menuScreenTop = document.getElementById('menu-screen-top');
    const quoteElement = document.getElementById('loading-poetic-quote');

    const quotes = [
      "\"As sombras dão forma às memórias...\"",
      "\"Quem eu sou de verdade?\"",
      "\"A imaginação se expande no escuro...\"",
      "\"A aceitação é o primeiro passo da cura...\"",
      "\"Nenhuma ferida é um erro.\""
    ];
    if (quoteElement) {
      quoteElement.innerText = quotes[Math.floor(Math.random() * quotes.length)];
    }

    const manager = new THREE.LoadingManager();

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const percentage = Math.round((itemsLoaded / itemsTotal) * 100);
      if (progressBar) progressBar.style.width = `${percentage}%`;
      if (statusText) statusText.innerText = `Reintegrando memórias: ${percentage}%`;
      console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
    };

    manager.onLoad = () => {
      if (statusText) statusText.innerText = 'Integração concluída.';
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.remove('active', 'pointer-events-auto');
          loadingScreen.classList.add('pointer-events-none');
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 1000);
        }
        if (menuScreenBase) {
          menuScreenBase.classList.add('active', 'pointer-events-auto');
          menuScreenBase.classList.remove('pointer-events-none');
        }
        if (menuScreenTop) {
          menuScreenTop.classList.add('active');
          menuScreenTop.style.pointerEvents = 'none';
          menuScreenTop.classList.remove('pointer-events-none');
        }
      }, 600);
    };

    manager.onError = (url) => {
      console.error('Error loading texture:', url);
      if (statusText) {
        statusText.innerText = 'Conexão instável. Carregando mesmo assim...';
        statusText.style.color = '#f59e0b';
      }
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.remove('active', 'pointer-events-auto');
          loadingScreen.classList.add('pointer-events-none');
          loadingScreen.style.display = 'none';
        }
        if (menuScreenBase) {
          menuScreenBase.classList.add('active', 'pointer-events-auto');
          menuScreenBase.classList.remove('pointer-events-none');
        }
        if (menuScreenTop) {
          menuScreenTop.classList.add('active');
          menuScreenTop.style.pointerEvents = 'none';
          menuScreenTop.classList.remove('pointer-events-none');
        }
      }, 1500);
    };

    const t = new THREE.TextureLoader(manager);
    // Todas as texturas de parede/plataforma são B&W
    this.realityTexture = t.load(`/textures/wall_bricks_bw.jpg`);
    this.realityTexture.wrapS = THREE.RepeatWrapping;
    this.realityTexture.wrapT = THREE.RepeatWrapping;
    this.realityTexture.minFilter = THREE.LinearFilter;
    this.realityTexture.magFilter = THREE.LinearFilter;
    this.reverieTexture = t.load(`/textures/wall_bricks_bw.jpg`);
    this.reverieTexture.wrapS = THREE.RepeatWrapping;
    this.reverieTexture.wrapT = THREE.RepeatWrapping;
    this.reverieTexture.minFilter = THREE.LinearFilter;
    this.reverieTexture.magFilter = THREE.LinearFilter;
    this.surrealTexture3 = t.load(`/textures/wall_bricks_bw.jpg`);
    this.surrealTexture3.wrapS = THREE.RepeatWrapping;
    this.surrealTexture3.wrapT = THREE.RepeatWrapping;
    this.surrealTexture3.minFilter = THREE.LinearFilter;
    this.surrealTexture3.magFilter = THREE.LinearFilter;
    this.surrealTexture4 = t.load(`/textures/wall_bricks_bw.jpg`);
    this.surrealTexture4.wrapS = THREE.RepeatWrapping;
    this.surrealTexture4.wrapT = THREE.RepeatWrapping;
    this.surrealTexture4.minFilter = THREE.LinearFilter;
    this.surrealTexture4.magFilter = THREE.LinearFilter;
    this.skyDayTexture = t.load(`/textures/sky_clouds_bw_pano.jpg`);
    this.skyDayTexture.wrapS = THREE.RepeatWrapping;
    this.skyDayTexture.wrapT = THREE.RepeatWrapping;
    this.skyDayTexture.repeat.set(6, 4);
    this.skyDayTexture.minFilter = THREE.LinearFilter;
    this.skyDayTexture.magFilter = THREE.LinearFilter;
    this.skyNightTexture = t.load(`/textures/sky_clouds_bw_pano.jpg`);
    this.skyNightTexture.wrapS = THREE.RepeatWrapping;
    this.skyNightTexture.wrapT = THREE.RepeatWrapping;
    this.skyNightTexture.repeat.set(6, 4);
    this.skyNightTexture.minFilter = THREE.LinearFilter;
    this.skyNightTexture.magFilter = THREE.LinearFilter;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111); // cinza escuro neutro
    this.scene.fog = new THREE.Fog(0x111111, 8, 40);
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(65, aspect, 0.05, 500);
    this.renderer = new THREE.WebGLRenderer({antialias: false, alpha: false});
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = 2;
    this.container.appendChild(this.renderer.domElement);
    this.particlesGroup = new THREE.Group();
    this.scene.add(this.particlesGroup);
  }

  setupCameraControls() {
    // IMPORTANTE: O Phaser renderiza um canvas por cima do Three.js.
    // Por isso os eventos devem ser registrados no document/container,
    // não no canvas do Three.js (que fica por baixo e não recebe eventos).

    // --- Scroll: zoom in/out (no container do jogo) ---
    this.container.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? 1 : -1;
      const zoomSpeed = 0.3;
      this.cameraDistance = Math.max(
        this.ZOOM_MIN,
        Math.min(this.ZOOM_MAX, this.cameraDistance + delta * zoomSpeed)
      );
    }, { passive: false, capture: true });

    // --- Botão direito: inicia drag de órbita ---
    // Usa document para capturar independente de qual canvas está na frente
    document.addEventListener('mousedown', (e: MouseEvent) => {
      if (e.button === 2) {
        this._rmb = true;
        this._rmbLastX = e.clientX;
        this._rmbLastY = e.clientY;
      }
    }, { capture: true });

    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this._rmb) return;
      const dx = e.clientX - this._rmbLastX;
      const dy = e.clientY - this._rmbLastY;
      this._rmbLastX = e.clientX;
      this._rmbLastY = e.clientY;

      const sensitivity = 0.005;
      this.cameraOrbitYaw   += dx * sensitivity;
      this.cameraOrbitPitch  = Math.max(
        0.05,
        Math.min(Math.PI / 2 - 0.05, this.cameraOrbitPitch - dy * sensitivity)
      );
    });

    document.addEventListener('mouseup', (e: MouseEvent) => {
      if (e.button === 2) this._rmb = false;
    });

    // Bloqueia menu de contexto em fase de captura: impede ANTES de qualquer overlay
    document.addEventListener('contextmenu', (e: Event) => {
      // Só bloqueia se o mouse estiver dentro do container do jogo
      if (this.container.contains(e.target as Node)) {
        e.preventDefault();
      }
    }, { capture: true });
  }


  setupPostProcessing(w: number, h: number) {
    this.composer = new EffectComposer(this.renderer);
    const n = new RenderPass(this.scene, this.camera);
    this.composer.addPass(n);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.4, 0.85);
    this.composer.addPass(this.bloomPass);
  }

  setupLights() {
    // Luz ambiente: cinza neutro para iluminar uniformemente em B&W
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(15, 25, 20);
    dir.castShadow = true;
    dir.shadow.mapSize.width = 2048;
    dir.shadow.mapSize.height = 2048;
    dir.shadow.camera.near = 0.5;
    dir.shadow.camera.far = 100;
    dir.shadow.camera.left = -30;
    dir.shadow.camera.right = 30;
    dir.shadow.camera.top = 30;
    dir.shadow.camera.bottom = -30;
    this.scene.add(dir);
    // Pontos de luz sutis em cinza para dar volume sem tingir
    this.purpleLight = new THREE.PointLight(0xaaaaaa, 0.5, 35);
    this.purpleLight.position.set(-12, 8, 12);
    this.scene.add(this.purpleLight);
    this.cyanLight = new THREE.PointLight(0xcccccc, 0.5, 35);
    this.cyanLight.position.set(12, 8, 12);
    this.scene.add(this.cyanLight);
    const backDir = new THREE.DirectionalLight(0xffffff, 0.15);
    backDir.position.set(0, 0, -10);
    this.scene.add(backDir);
  }

  createBackground() {
    const t = new THREE.SphereGeometry(350, 32, 32),
        n = new THREE.MeshBasicMaterial({map: this.skyDayTexture, side: 1, fog: false});
    this.skySphere = new THREE.Mesh(t, n);
    this.skySphere.position.set(240, -160, 0); // Center on world
    this.scene.add(this.skySphere);
    
    const grass = new THREE.TextureLoader().load(`/textures/floor_grass_bw.jpg`);
    grass.wrapS = THREE.RepeatWrapping;
    grass.wrapT = THREE.RepeatWrapping;
    grass.repeat.set(450, 450); // Scale repeat for larger floor
    grass.minFilter = THREE.LinearMipmapLinearFilter;
    grass.magFilter = THREE.LinearFilter;
    grass.generateMipmaps = true;
    grass.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    
    // Ground: textura B&W, cor branca para não tingir
    const groundMat = new THREE.MeshStandardMaterial({color: 0xffffff, map: grass, metalness: 0.05, roughness: 0.95});
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), groundMat);
    // Center ground perfectly for a 24000x16000 world (ThreeJS coords: 500x333)
    ground.position.set(240, -160, -1.09);
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.groundMesh = ground; // guarda ref para raycasting

    
    const s = [-25, -18, -10, 50, 58, 65],
        l = [-35, -28, -20, -10, 0, 10];
    for (const eVal of s) {
      for (const tVal of l) {
        // Cubos decorativos: cinza escuro com brilho sutil alternado
        const nVal = (eVal + tVal) % 2 === 0;
        const rValMat = new THREE.MeshStandardMaterial({
          color: 0x1a1a1a,
          emissive: nVal ? 0x333333 : 0x222222,
          emissiveIntensity: 0.4,
          metalness: 0.85,
          roughness: 0.15
        });
        const rVal = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 28), rValMat);
        rVal.position.set(eVal, tVal, -5);
        rVal.receiveShadow = true;
        rVal.castShadow = true;
        this.scene.add(rVal);
      }
    }
  }

  createAmbientParticles() {
    const e = new Float32Array(600);
    for (let t = 0; t < 200; t++) {
      e[t * 3] = (Math.random() - 0.5) * 60;
      e[t * 3 + 1] = (Math.random() - 0.5) * 40;
      e[t * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    const t = new THREE.BufferGeometry();
    t.setAttribute(`position`, new THREE.BufferAttribute(e, 3));
    const n = new THREE.PointsMaterial({size: 0.08, color: 0x888888, transparent: true, opacity: 0.4, blending: 2});
    this.ambientParticles = new THREE.Points(t, n);
    this.scene.add(this.ambientParticles);
  }

  createMistParticles() {
    const e = new Float32Array(240),
        t = new Float32Array(240);
    for (let n = 0; n < 80; n++) {
      e[n * 3] = (Math.random() - 0.5) * 70;
      e[n * 3 + 1] = (Math.random() - 0.5) * 50;
      e[n * 3 + 2] = -0.5 + Math.random() * 2;
      t[n * 3] = 0.13;
      t[n * 3 + 1] = 0.83;
      t[n * 3 + 2] = 0.93;
    }
    const n = new THREE.BufferGeometry();
    n.setAttribute(`position`, new THREE.BufferAttribute(e, 3));
    n.setAttribute(`color`, new THREE.BufferAttribute(t, 3));
    const rVal = new THREE.PointsMaterial({size: 0.5, vertexColors: true, transparent: true, opacity: 0, blending: 2});
    this.mistParticles = new THREE.Points(n, rVal);
    this.scene.add(this.mistParticles);
  }

  createWaveRing() {
    const e = new THREE.RingGeometry(0.1, 0.3, 64),
        t = new THREE.MeshBasicMaterial({color: 2282478, transparent: true, opacity: 0, side: 2});
    this.waveRing = new THREE.Mesh(e, t);
    this.waveRing.rotation.x = -Math.PI / 2;
    this.waveRing.position.z = -0.1;
    this.scene.add(this.waveRing);
  }

  createTransitionPlane() {
    const e = new THREE.PlaneGeometry(100, 60),
        t = new THREE.MeshBasicMaterial({color: 657932, transparent: true, opacity: 0});
    this.transitionPlane = new THREE.Mesh(e, t);
    this.transitionPlane.position.z = 5;
    this.scene.add(this.transitionPlane);
  }

  setMistIntensity(e: number) {
    if (this.mistParticles) {
      (this.mistParticles.material as THREE.PointsMaterial).opacity = e * 0.4;
    }
  }

  triggerTransition(e: number, t: () => void) {
    const mat = this.transitionPlane.material as THREE.MeshBasicMaterial,
        rVal = Date.now(),
        i = () => {
          const a = (Date.now() - rVal) / e;
          if (a < 0.5) {
            mat.opacity = a * 2;
          } else if (a < 1) {
            t();
            mat.opacity = (1 - a) * 2;
          } else {
            mat.opacity = 0;
            return;
          }
          requestAnimationFrame(i);
        };
    i();
  }

  updateMist(e: number, windX = 0) {
    if (this.mistParticles && (this.mistParticles.material as THREE.PointsMaterial).opacity > 0) {
      const t = this.mistParticles.geometry.attributes.position.array as Float32Array;
      const windSpeed = 0.01 + windX * 0.4;
      for (let n = 0; n < t.length; n += 3) {
        t[n] += windSpeed;
        t[n + 1] += Math.sin(e + n) * 0.005;
        if (windSpeed >= 0) {
          if (t[n] > 35) t[n] = -35;
        } else {
          if (t[n] < -35) t[n] = 35;
        }
      }
      this.mistParticles.geometry.attributes.position.needsUpdate = true;
      this.mistParticles.rotation.z += 0.001 + windX * 0.002;
    }
  }

  clearLevel() {
    this.platformMeshes.forEach(eVal => this.scene.remove(eVal));
    this.platformMeshes = [];
    this.platformMeta = [];
    this.reminiscenceMeshes.forEach(eVal => this.scene.remove(eVal));
    this.reminiscenceMeshes = [];
    if (this.doorMesh) {
      this.scene.remove(this.doorMesh);
      this.doorMesh = null;
    }
    if (this.shadowMesh) {
      this.scene.remove(this.shadowMesh);
      this.shadowMesh = null;
    }
    this.particleSystems.forEach(eVal => this.particlesGroup.remove(eVal));
    this.particleSystems = [];
  }

  /** Dispara um raio para baixo em (x, y) e retorna o Z do chão. Fallback: -1.09 */
  getGroundZ(x: number, y: number): number {
    if (!this.groundMesh) return -1.09;
    const origin = new THREE.Vector3(x, y, 20); // começa bem acima
    this.groundRaycaster.set(origin, this.groundRayDir);
    const hits = this.groundRaycaster.intersectObject(this.groundMesh);
    if (hits.length > 0) return hits[0].point.z;
    return -1.09;
  }

  createPlayer(eVal: number, t: number, onLoad?: () => void) {
    if (this.playerMesh) {
      this.scene.remove(this.playerMesh);
    }
    const n = ml(this.playerColor);
    this.playerMesh = n;
    this.playerMesh.position.set(eVal / 48 - 10, 5 - t / 48, 0.55);
    this.walkPhase = 0;
    this.scene.add(this.playerMesh);
    
    // Notify immediately, the model will stream in asynchronously
    if (onLoad) {
      onLoad();
    }
  }

  updatePlayer(eVal: number, t: number, n: number, jumpHeight = 0, moveSpeed = 0) {
    const rVal = eVal / 48 - 10,
        i = 5 - t / 48;
    this.playerAngle = n;
    this.targetCamX = rVal;
    this.targetCamY = i;
    if (this.playerMesh) {
      const elapsed = this.clock.getElapsedTime();
      const zLift = jumpHeight * 0.08;
      const bob = this.animatePlayer(moveSpeed, jumpHeight, elapsed);
      const scaleFactor = 1 + jumpHeight * 0.03;
      
      // Ground snapping: raio para baixo detecta o Z do chão
      const groundZ = this.getGroundZ(rVal, i);
      // feetOffset: distancia do pivô do modelo até os pés (0 se modelo ainda não carregou)
      const feetOffset = (this.playerMesh.userData.feetOffset as number) ?? 0;
      const finalZ = groundZ + feetOffset + zLift + bob;
      
      this.playerMesh.position.set(rVal, i, finalZ);
      this.playerMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
      if (this.playerMesh) {
        this.playerMesh.visible = true;
        this.playerMesh.rotation.z = this.playerAngle;
      }
    }
  }

  animatePlayer(moveSpeed: number, jumpHeight: number, elapsed: number) {
    const mesh = this.playerMesh;
    if (!mesh || !mesh.visible) return 0;

    const legs = mesh.userData.legs as THREE.Group[] | undefined;
    const arms = mesh.userData.arms as THREE.Group[] | undefined;
    const hair = mesh.userData.hair as THREE.Group | undefined;
    const hairLocks = mesh.userData.hairLocks as THREE.Mesh[] | undefined;
    const dress = mesh.userData.dress as THREE.Group | THREE.Mesh | undefined;
    const head = mesh.userData.head as THREE.Group | undefined;

    const isMoving = moveSpeed > 0.35;

    // Advance walk phase smoothly based on movement speed
    if (isMoving) {
      this.walkPhase += 0.05 + moveSpeed * 0.045;
    }

    const phase = this.walkPhase;
    const swing = isMoving ? Math.sin(phase) * 0.48 : 0;
    const swingOpp = isMoving ? Math.sin(phase + Math.PI) * 0.48 : 0;

    // Legs stride with subtle stride curves
    if (legs) {
      legs[0].rotation.y = swing;
      legs[1].rotation.y = swingOpp;
    }

    // Arms counter-swing smoothly with feminine elbow flex
    if (arms) {
      arms[0].rotation.y = isMoving ? swingOpp * 0.7 : Math.sin(elapsed * 1.5) * 0.04;
      arms[1].rotation.y = isMoving ? swing * 0.7 : Math.cos(elapsed * 1.5) * 0.04;
      arms[0].rotation.x = isMoving ? -0.12 + Math.abs(swingOpp) * 0.15 : -0.12;
      arms[1].rotation.x = isMoving ? 0.12 - Math.abs(swing) * 0.15 : 0.12;
    }

    // Dynamic Hair sway (back hair locks curve backward with speed)
    if (hair) {
      hair.rotation.y = isMoving ? Math.sin(phase) * 0.09 : Math.sin(elapsed * 1.2) * 0.02;
      hair.rotation.x = isMoving ? Math.abs(Math.sin(phase)) * 0.06 : 0;
    }
    if (hairLocks) {
      hairLocks.forEach((lock, idx) => {
        const lag = idx * 0.12;
        lock.rotation.y = isMoving ? Math.sin(phase - lag) * 0.14 : Math.sin(elapsed * 1.5 + lag) * 0.03;
        lock.rotation.z = isMoving ? 0.1 + moveSpeed * 0.05 : 0;
      });
    }

    // Skirt sways subtly opposite to hip stride
    if (dress) {
      dress.rotation.y = isMoving ? Math.sin(phase + Math.PI / 2) * 0.08 : Math.sin(elapsed * 1.8) * 0.015;
      dress.rotation.x = isMoving ? Math.cos(phase * 2) * 0.03 : 0;
    }

    // Head breathing micro-movement
    if (head) {
      head.rotation.y = isMoving ? Math.sin(phase * 0.5) * 0.03 : Math.sin(elapsed * 1.2) * 0.015;
      head.rotation.x = Math.sin(elapsed * 1.8) * 0.01;
    }

    // Jump posture — arms float forward/up, legs tuck gracefully, hair floats back
    if (jumpHeight > 0.2) {
      if (legs) {
        legs[0].rotation.y = 0.32;
        legs[1].rotation.y = 0.22;
      }
      if (arms) {
        arms[0].rotation.y = -0.42;
        arms[1].rotation.y = -0.28;
      }
      if (hair) {
        hair.rotation.x = -0.25;
      }
    }

    // Vertical bob: organic springy gait while walking, gentle breathing when standing still
    return isMoving ? Math.abs(Math.sin(phase)) * 0.038 : Math.sin(elapsed * 2.1) * 0.006;
  }

  createShadow(eVal: number, t: number) {
    if (this.shadowMesh) {
      this.scene.remove(this.shadowMesh);
    }
    const n = hl();
    this.shadowMesh = n;
    this.shadowMesh.position.set((eVal + 10) / 48 - 10, 5 - (t + 21) / 48, -0.1);
    this.scene.add(this.shadowMesh);
  }

  updateShadow(eVal: number, t: number, isStunned = false) {
    if (this.shadowMesh) {
      const n = -0.3;
      this.shadowMesh.position.set((eVal + 10) / 48 - 10, 5 - (t + 21) / 48, n);
      if (this.shadowMesh) {
        gl(this.shadowMesh, false, this.clock.getElapsedTime());
      } // Visual feedback for stunned state
      this.shadowMesh.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              if (isStunned) {
                if (mat.userData.origEmissive === undefined) {
                  mat.userData.origEmissive = mat.emissive ? mat.emissive.getHex() : 0;
                  mat.userData.origEmissiveIntensity = mat.emissiveIntensity || 0;
                }
                mat.emissive = mat.emissive || new THREE.Color();
                const flash = Math.sin(this.clock.getElapsedTime() * 25) > 0;
                mat.emissive.setHex(flash ? 0xff3333 : 0xffffff);
                mat.emissiveIntensity = 1.0;
              } else if (mat.userData.origEmissive !== undefined) {
                if (mat.emissive) {
                  mat.emissive.setHex(mat.userData.origEmissive);
                }
                mat.emissiveIntensity = mat.userData.origEmissiveIntensity;
              }
            }
          });
        }
      });
    }
  }

  createPlatform(eVal: number, t: number, n: number, rVal: number, _i = false, _a = 0) {
    const cVal = _l(n, rVal, this.currentLevelNum, this.realityTexture, this.surrealTexture3);
    cVal.position.set((eVal + n / 2) / 48 - 10, 5 - (t + rVal / 2) / 48, 1.3);
    this.scene.add(cVal);
    this.platformMeshes.push(cVal);
    this.platformMeta.push({w: n, h: rVal});
    return cVal;
  }

  updatePlatforms(eVal: Platform[], playerX: number, playerY: number) {
    eVal.forEach((item, tVal) => {
      const mesh = this.platformMeshes[tVal];
      if (mesh) {
        const dx = item.x - playerX;
        const dy = item.y - playerY;
        if (dx * dx + dy * dy > 9000000) {
          mesh.visible = false;
        } else {
          mesh.visible = true;
          const targetX = (item.x + item.w / 2) / 48 - 10;
          const targetY = 5 - (item.y + item.h / 2) / 48;
          if (Math.abs(mesh.position.x - targetX) > 0.001 || Math.abs(mesh.position.y - targetY) > 0.001) {
            mesh.position.set(targetX, targetY, 1.3);
          }
        }
      }
    });
  }

  createDoor(eVal: number, t: number, n: number, rVal: number) {
    const i = vl(n, rVal, this.doorColor);
    this.doorMesh = i;
    this.doorMesh.position.set((eVal + n / 2) / 48 - 10, 5 - (t + rVal / 2) / 48, 0);
    this.scene.add(this.doorMesh);
  }

  createReminiscence(eVal: number, t: number) {
    const n = yl();
    n.userData.floatOffset = Math.random() * Math.PI * 2;
    n.userData.fadeChildren = [];
    n.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        n.userData.fadeChildren.push({
          mesh: child as THREE.Mesh,
          baseOpacity: ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity ?? 1
        });
      }
    });
    const rVal = n;
    rVal.position.set((eVal + 7.5) / 48 - 10, 5 - (t + 7.5) / 48, 0);
    this.scene.add(rVal);
    this.reminiscenceMeshes.push(rVal);
    return rVal;
  }

  updateReminiscences(eVal: any[], t: number) {
    eVal.forEach((item, nVal) => {
      const rVal = this.reminiscenceMeshes[nVal];
      if (!rVal) return;

      if (item.collected) {
        rVal.visible = false;
        return;
      }
      rVal.visible = true;

      const pick = item.pickupProgress;
      const isAbsorbing = pick !== undefined && pick < 1;
      const fadeChildren = rVal.userData.fadeChildren as { mesh: THREE.Object3D; baseOpacity: number }[] | undefined;

      if (isAbsorbing && fadeChildren) {
        // Absorb flight: glide to Pandora, shrink and dissolve
        rVal.scale.setScalar(1 - pick * 0.85);
        rVal.position.set((item.x + 7.5) / 48 - 10, 5 - (item.y + 7.5) / 48, 0);
        rVal.rotation.x = t * 1.5;
        rVal.rotation.y = t * 2 + (rVal.userData.floatOffset || 0);
        const fade = 1 - pick * 0.8;
        fadeChildren.forEach(({ mesh, baseOpacity }) => {
          const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.transparent = true;
            mat.opacity = baseOpacity * fade;
          }
        });
        return;
      }

      // Normal floaty idling
      rVal.scale.set(1, 1, 1);
      rVal.position.set((item.x + 7.5) / 48 - 10, 5 - (item.y + 7.5) / 48, 0);
      rVal.rotation.y = t * 2 + (rVal.userData.floatOffset || 0);
      rVal.rotation.x = t * 1.5;
      rVal.position.y += Math.sin(t * 3 + (rVal.userData.floatOffset || 0)) * 0.15;

      if (fadeChildren) {
        fadeChildren.forEach(({ mesh, baseOpacity }) => {
          const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.transparent = baseOpacity < 1;
            mat.opacity = baseOpacity;
          }
        });
      }
    });
  }

  updateWaveRing(eVal: number, t: number, n: number, rVal: boolean) {
    if (this.waveRing && rVal) {
      this.waveRing.position.set(eVal / 48 - 10, 5 - t / 48, -0.1);
      const ringScale = n / 14.4;
      this.waveRing.scale.set(ringScale, ringScale, 1);
      (this.waveRing.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - n / 220);
    } else if (this.waveRing) {
      (this.waveRing.material as THREE.MeshBasicMaterial).opacity = 0;
    }
  }

  addParticleBurst(eVal: number, t: number, n: string) {
    const rVal = new Float32Array(36),
        i = new Float32Array(36),
        a = new Float32Array(12),
        oVal = this.parseColor(n);
    for (let nVal = 0; nVal < 12; nVal++) {
      rVal[nVal * 3] = eVal / 48 - 10 + (Math.random() - 0.5) * 1.5;
      rVal[nVal * 3 + 1] = 5 - t / 48 + (Math.random() - 0.5) * 1.5;
      rVal[nVal * 3 + 2] = (Math.random() - 0.5) * 0.8;
      i[nVal * 3] = oVal.r;
      i[nVal * 3 + 1] = oVal.g;
      i[nVal * 3 + 2] = oVal.b;
      a[nVal] = 0.1 + Math.random() * 0.15;
    }
    const s = new THREE.BufferGeometry();
    s.setAttribute(`position`, new THREE.BufferAttribute(rVal, 3));
    s.setAttribute(`color`, new THREE.BufferAttribute(i, 3));
    s.setAttribute(`size`, new THREE.BufferAttribute(a, 1));
    const cVal = new THREE.Points(s, new THREE.PointsMaterial({size: 0.2, vertexColors: true, transparent: true, opacity: 1, blending: 2, sizeAttenuation: true}));
    cVal.userData.life = 40;
    cVal.userData.maxLife = 40;
    cVal.userData.velocity = Array.from({length: 12}, () => ({x: (Math.random() - 0.5) * 0.3, y: (Math.random() - 0.5) * 0.3, z: (Math.random() - 0.5) * 0.1}));
    this.particlesGroup.add(cVal);
    this.particleSystems.push(cVal);
  }

  updateParticles(windX = 0) {
    if (this.ambientParticles) {
      this.ambientParticles.rotation.z += 3e-4 + windX * 5e-4;
    }
    this.updateMist(this.clock.getElapsedTime(), windX);
    for (let e = this.particleSystems.length - 1; e >= 0; e--) {
      const t = this.particleSystems[e];
      t.userData.life--;
      if (t.userData.life <= 0) {
        this.particlesGroup.remove(t);
        this.particleSystems.splice(e, 1);
        continue;
      }
      const n = t.geometry.attributes.position.array as Float32Array,
          rVal = t.userData.velocity,
          i = t.userData.life / t.userData.maxLife;
      for (let eVal = 0; eVal < rVal.length; eVal++) {
        n[eVal * 3] += rVal[eVal].x + windX * 0.1;
        n[eVal * 3 + 1] += rVal[eVal].y;
        n[eVal * 3 + 2] += rVal[eVal].z;
        rVal[eVal].y -= 0.008;
      }
      t.geometry.attributes.position.needsUpdate = true;
      (t.material as THREE.PointsMaterial).opacity = i;
    }
  }

  parseColor(eVal: string) {
    if (eVal.includes(`217, 70, 239`)) {
      return {r: 0.85, g: 0.27, b: 0.94};
    } else if (eVal.includes(`6, 182, 212`)) {
      return {r: 0.02, g: 0.71, b: 0.83};
    } else if (eVal.includes(`34, 211, 238`)) {
      return {r: 0.13, g: 0.83, b: 0.93};
    } else if (eVal.includes(`236, 72, 153`)) {
      return {r: 0.93, g: 0.28, b: 0.6};
    } else {
      return {r: 1, g: 1, b: 1};
    }
  }

  setCameraShake(eVal: number) {
    const t = (Math.random() - 0.5) * eVal * 0.04,
        n = (Math.random() - 0.5) * eVal * 0.04,
        rVal = (Math.random() - 0.5) * eVal * 0.04;
    this.camera.position.x += t;
    this.camera.position.y += n;
    this.camera.position.z += rVal;
  }

  currentCamPos?: THREE.Vector3;
  currentCamLookAt?: THREE.Vector3;

  resetCamera() {
    const desiredPos = new THREE.Vector3();
    const desiredLookAt = new THREE.Vector3();

    const dist = this.cameraDistance;
    const height = Math.sin(this.cameraOrbitPitch) * dist;
    const flatDist = Math.cos(this.cameraOrbitPitch) * dist;
    
    const offsetX = -Math.cos(this.cameraOrbitYaw) * flatDist;
    const offsetY = -Math.sin(this.cameraOrbitYaw) * flatDist;
    
    desiredPos.set(this.targetCamX + offsetX, this.targetCamY + offsetY, height - 0.3);
    desiredLookAt.set(this.targetCamX, this.targetCamY, 0.5);

    if (!this.currentCamPos || !this.currentCamLookAt) {
      this.currentCamPos = desiredPos.clone();
      this.currentCamLookAt = desiredLookAt.clone();
    } else {
      // Lerp rápido para seguir de perto, mas suave para troca de câmeras
      const lerpSpeed = 0.25; 
      this.currentCamPos.lerp(desiredPos, lerpSpeed);
      this.currentCamLookAt.lerp(desiredLookAt, lerpSpeed);
    }

    this.camera.position.copy(this.currentCamPos);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(this.currentCamLookAt);
    
    if (this.skySphere) {
      this.skySphere.position.set(this.targetCamX, this.targetCamY, 0);
    }
  }

  updateMenuCamera(time: number) {
    const orbitRadius = 45;
    const orbitSpeed = 0.08;
    const angle = time * orbitSpeed;
    const centerX = 25;
    const centerY = -25;
    this.camera.position.x = centerX + Math.cos(angle) * orbitRadius;
    this.camera.position.y = centerY + Math.sin(angle) * orbitRadius;
    this.camera.position.z = 15;
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(new THREE.Vector3(centerX, centerY, -2));
    if (this.skySphere) {
      this.skySphere.position.set(this.camera.position.x, this.camera.position.y, 0);
    }
  }

  setBloom(eVal: number) {
    this.bloomPass.strength = eVal;
  }

  render() {
    this.composer.render();
  }

  resize(eVal: number, t: number) {
    this.camera.aspect = eVal / t;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(eVal, t);
    this.composer.setSize(eVal, t);
  }

  getCanvas() {
    return this.renderer.domElement;
  }
}