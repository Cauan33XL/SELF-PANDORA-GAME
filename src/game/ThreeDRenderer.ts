import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { type Platform } from './LevelManager';

function ml(color: number): THREE.Group {
  const t = new THREE.Group(),
      n = new THREE.MeshStandardMaterial({color: color, emissive: color, emissiveIntensity: .4, metalness: .15, roughness: .7}),
      rVal = new THREE.Mesh(new THREE.ConeGeometry(.32, .65, 16), n);
  rVal.position.y = -.1;
  rVal.rotation.x = Math.PI;
  rVal.castShadow = !0;
  rVal.receiveShadow = !0;
  t.add(rVal);
  
  const i = new THREE.Mesh(new THREE.CylinderGeometry(.16, .2, .35, 16), n);
  i.position.y = .25;
  i.castShadow = !0;
  t.add(i);
  
  const a = new THREE.Mesh(new THREE.SphereGeometry(.24, 16, 16), n);
  a.position.y = .62;
  a.castShadow = !0;
  t.add(a);
  
  const oVal = new THREE.Mesh(new THREE.SphereGeometry(.25, 16, 16), n);
  oVal.position.set(0, .64, -.04);
  oVal.scale.set(1.02, 1.02, 1.05);
  oVal.castShadow = !0;
  t.add(oVal);
  
  const s = new THREE.CylinderGeometry(.045, .07, .45, 8),
      cVal = new THREE.Mesh(s, n);
  cVal.position.set(-.24, .52, -.08);
  cVal.rotation.z = Math.PI / 6;
  cVal.castShadow = !0;
  t.add(cVal);
  
  const l = new THREE.Mesh(s, n);
  l.position.set(.24, .52, -.08);
  l.rotation.z = -Math.PI / 6;
  l.castShadow = !0;
  t.add(l);
  
  const u = new THREE.ConeGeometry(.06, .16, 4),
      d = new THREE.Mesh(u, n);
  d.position.set(-.06, .78, -.1);
  d.rotation.z = Math.PI / 3;
  t.add(d);
  
  const f = new THREE.Mesh(u, n);
  f.position.set(.06, .78, -.1);
  f.rotation.z = -Math.PI / 3;
  t.add(f);
  
  const p = new THREE.CylinderGeometry(.05, .05, .45, 8),
      m = new THREE.Mesh(p, n);
  m.position.set(-.1, -.58, 0);
  m.castShadow = !0;
  t.add(m);
  
  const h = new THREE.Mesh(p, n);
  h.position.set(.1, -.58, 0);
  h.castShadow = !0;
  t.add(h);
  
  const g = new THREE.CylinderGeometry(.045, .045, .4, 8),
      _ = new THREE.Mesh(g, n);
  _.position.set(-.24, .15, 0);
  _.rotation.z = Math.PI / 12;
  _.castShadow = !0;
  t.add(_);
  
  const v = new THREE.Mesh(g, n);
  v.position.set(.24, .15, 0);
  v.rotation.z = -Math.PI / 12;
  v.castShadow = !0;
  t.add(v);
  
  const y = new THREE.Mesh(new THREE.SphereGeometry(.8, 16, 16), new THREE.MeshBasicMaterial({color: color, transparent: !0, opacity: .15, side: 1}));
  t.add(y);
  return t;
}

function hl(): THREE.Group {
  const e = new THREE.Group(),
      t = new THREE.MeshStandardMaterial({color: 131587, metalness: .95, roughness: .05}),
      n = new THREE.MeshBasicMaterial({color: 16711680}),
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

function _l(t: number, n: number, i: boolean, a: boolean, oVal: boolean, s: number, cVal: THREE.Texture, l: THREE.Texture, u: THREE.Texture, d: THREE.Texture): THREE.Group {
  const f = new THREE.Group();
  let p: number;
  let m: THREE.Texture;
  if (i) {
    p = 2282478;
    m = s <= 15 ? cVal : u;
  } else if (a || oVal) {
    p = 14239471;
    m = s <= 15 ? l : d;
  } else {
    p = 2282478;
    m = s <= 15 ? cVal : u;
  }
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
  g = h(m, 1.8, Math.max(1, n / 48 * 1.5)),
  _ = h(m, Math.max(1, t / 48 * 1.5), 1.8),
  v = h(m, Math.max(1, t / 48 * 1.5), Math.max(1, n / 48 * 1.5)),
  y = (tex: THREE.Texture) => new THREE.MeshStandardMaterial({color: 16777215, map: tex, metalness: .1, roughness: .9, side: 0}),
  b = [y(g), y(g), y(_), y(_), y(v), y(v)],
  x = new THREE.Mesh(new THREE.BoxGeometry(t / 48, n / 48, 1.2), b);
  x.castShadow = !0;
  x.receiveShadow = !0;
  f.add(x);
  
  const S = new THREE.Mesh(new THREE.BoxGeometry(t / 48 + .05, .04, .05), new THREE.MeshStandardMaterial({color: p, emissive: p, emissiveIntensity: .5, metalness: .5, roughness: .4}));
  S.position.y = n / 48 / 2 + .02;
  S.position.z = .6;
  f.add(S);
  return f;
}

function vl(eVal: number, t: number, n: number): THREE.Group {
  const rVal = new THREE.Group(),
      i = new THREE.Mesh(new THREE.BoxGeometry(eVal / 48 + .2, t / 48 + .2, .3), new THREE.MeshStandardMaterial({color: 1710626, metalness: .5, roughness: .7}));
  i.castShadow = !0;
  rVal.add(i);
  const a = new THREE.Mesh(new THREE.BoxGeometry(eVal / 48, t / 48, .1), new THREE.MeshStandardMaterial({color: n, emissive: n, emissiveIntensity: .5, metalness: .4, roughness: .5, transparent: !0, opacity: .9}));
  a.position.z = .1;
  rVal.add(a);
  const oVal = new THREE.Mesh(new THREE.RingGeometry(.3, .5, 32), new THREE.MeshBasicMaterial({color: n, transparent: !0, opacity: .6, side: 2}));
  oVal.position.z = .15;
  rVal.add(oVal);
  const s = new THREE.Mesh(new THREE.SphereGeometry(.8, 16, 16), new THREE.MeshBasicMaterial({color: n, transparent: !0, opacity: .2, side: 1}));
  rVal.add(s);
  return rVal;
}

function yl(): THREE.Group {
  const e = new THREE.Group(),
      t = new THREE.Mesh(new THREE.OctahedronGeometry(.35), new THREE.MeshStandardMaterial({color: 14239471, emissive: 14239471, emissiveIntensity: .6, metalness: .3, roughness: .4}));
  t.castShadow = !0;
  e.add(t);
  const n = new THREE.Mesh(new THREE.OctahedronGeometry(.5), new THREE.MeshBasicMaterial({color: 14239471, transparent: !0, opacity: .3, wireframe: !0}));
  e.add(n);
  const rVal = new THREE.Mesh(new THREE.SphereGeometry(.7, 16, 16), new THREE.MeshBasicMaterial({color: 14239471, transparent: !0, opacity: .15, side: 1}));
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
  platformMeta: { w: number; h: number; isRealityOnly: boolean; isReverieOnly: boolean }[] = [];
  reminiscenceMeshes: THREE.Group[] = [];
  skySphere!: THREE.Mesh;
  mistParticles!: THREE.Points;
  ambientParticles!: THREE.Points;
  particlesGroup!: THREE.Group;
  particleSystems: THREE.Points[] = [];
  waveRing!: THREE.Mesh;
  transitionPlane!: THREE.Mesh;
  isReverieMode = false;
  cameraMode: 'first' | 'third' = 'first';
  currentLevelNum = 1;
  playerAngle = 0;
  targetCamX = 0;
  targetCamY = 0;
  playerColor = 2282478;
  doorColor = 1096065;
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
    const menuScreen = document.getElementById('menu-screen');
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
        if (menuScreen) {
          menuScreen.classList.add('active', 'pointer-events-auto');
          menuScreen.classList.remove('pointer-events-none');
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
        if (menuScreen) {
          menuScreen.classList.add('active', 'pointer-events-auto');
          menuScreen.classList.remove('pointer-events-none');
        }
      }, 1500);
    };

    const t = new THREE.TextureLoader(manager);
    this.realityTexture = t.load(`/textures/reality_texture.png`);
    this.realityTexture.wrapS = THREE.RepeatWrapping;
    this.realityTexture.wrapT = THREE.RepeatWrapping;
    this.realityTexture.minFilter = THREE.LinearFilter;
    this.realityTexture.magFilter = THREE.LinearFilter;
    this.reverieTexture = t.load(`/textures/reverie_texture.png`);
    this.reverieTexture.wrapS = THREE.RepeatWrapping;
    this.reverieTexture.wrapT = THREE.RepeatWrapping;
    this.reverieTexture.minFilter = THREE.LinearFilter;
    this.reverieTexture.magFilter = THREE.LinearFilter;
    this.surrealTexture3 = t.load(`/textures/surreal_texture_3.png`);
    this.surrealTexture3.wrapS = THREE.RepeatWrapping;
    this.surrealTexture3.wrapT = THREE.RepeatWrapping;
    this.surrealTexture3.minFilter = THREE.LinearFilter;
    this.surrealTexture3.magFilter = THREE.LinearFilter;
    this.surrealTexture4 = t.load(`/textures/surreal_texture_4.png`);
    this.surrealTexture4.wrapS = THREE.RepeatWrapping;
    this.surrealTexture4.wrapT = THREE.RepeatWrapping;
    this.surrealTexture4.minFilter = THREE.LinearFilter;
    this.surrealTexture4.magFilter = THREE.LinearFilter;
    this.skyDayTexture = t.load(`/textures/sky_day_texture.png`);
    this.skyDayTexture.wrapS = THREE.RepeatWrapping;
    this.skyDayTexture.wrapT = THREE.RepeatWrapping;
    this.skyDayTexture.repeat.set(6, 4);
    this.skyDayTexture.minFilter = THREE.LinearFilter;
    this.skyDayTexture.magFilter = THREE.LinearFilter;
    this.skyNightTexture = t.load(`/textures/sky_night_texture.png`);
    this.skyNightTexture.wrapS = THREE.RepeatWrapping;
    this.skyNightTexture.wrapT = THREE.RepeatWrapping;
    this.skyNightTexture.repeat.set(6, 4);
    this.skyNightTexture.minFilter = THREE.LinearFilter;
    this.skyNightTexture.magFilter = THREE.LinearFilter;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(394764);
    this.scene.fog = new THREE.Fog(394764, 8, 35);
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

  setupPostProcessing(w: number, h: number) {
    this.composer = new EffectComposer(this.renderer);
    const n = new RenderPass(this.scene, this.camera);
    this.composer.addPass(n);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.4, 0.85);
    this.composer.addPass(this.bloomPass);
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(4210752, 0.6);
    this.scene.add(ambient);
    const dir = new THREE.DirectionalLight(16777215, 0.6);
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
    this.purpleLight = new THREE.PointLight(14239471, 0.8, 35);
    this.purpleLight.position.set(-12, 8, 12);
    this.scene.add(this.purpleLight);
    this.cyanLight = new THREE.PointLight(440020, 0.8, 35);
    this.cyanLight.position.set(12, 8, 12);
    this.scene.add(this.cyanLight);
    const backDir = new THREE.DirectionalLight(16777215, 0.2);
    backDir.position.set(0, 0, -10);
    this.scene.add(backDir);
  }

  createBackground() {
    const t = new THREE.SphereGeometry(350, 32, 32),
        n = new THREE.MeshBasicMaterial({map: this.skyDayTexture, side: 1, fog: false});
    this.skySphere = new THREE.Mesh(t, n);
    this.skySphere.position.set(25, -25, 0);
    this.scene.add(this.skySphere);
    const grass = new THREE.TextureLoader().load(`/textures/grass_texture.png`);
    grass.wrapS = THREE.RepeatWrapping;
    grass.wrapT = THREE.RepeatWrapping;
    grass.repeat.set(75, 75);
    grass.minFilter = THREE.LinearMipmapLinearFilter;
    grass.magFilter = THREE.LinearFilter;
    grass.generateMipmaps = true;
    grass.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({color: 16777215, map: grass, metalness: 0.05, roughness: 0.95}));
    ground.position.set(25, -25, -1.09);
    ground.receiveShadow = true;
    this.scene.add(ground);
    const grid = new THREE.GridHelper(600, 150, 2039597, 789518);
    grid.rotation.x = Math.PI / 2;
    grid.position.set(25, -25, -1.08);
    this.scene.add(grid);
    const s = [-25, -18, -10, 50, 58, 65],
        l = [-35, -28, -20, -10, 0, 10];
    for (const eVal of s) {
      for (const tVal of l) {
        const nVal = (eVal + tVal) % 2 === 0,
            rVal = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 28), new THREE.MeshStandardMaterial({color: 592140, emissive: nVal ? 2282478 : 14239471, emissiveIntensity: 0.15, metalness: 0.85, roughness: 0.15}));
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
    const n = new THREE.PointsMaterial({size: 0.08, color: 5592422, transparent: true, opacity: 0.6, blending: 2});
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

  setCameraMode(mode: 'first' | 'third') {
    this.cameraMode = mode;
  }

  setReverieMode(t: boolean, n?: number) {
    this.isReverieMode = t;
    if (n !== undefined) {
      this.currentLevelNum = n;
    }
    if (t) {
      this.scene.background = new THREE.Color(1707054);
      this.scene.fog = new THREE.Fog(1707054, 8, 35);
      this.purpleLight.color.setHex(14239471);
      this.cyanLight.color.setHex(15485081);
      this.bloomPass.strength = 0.8;
      this.setMistIntensity(1);
      if (this.skySphere) {
        (this.skySphere.material as THREE.MeshBasicMaterial).map = this.skyNightTexture;
        (this.skySphere.material as THREE.MeshBasicMaterial).needsUpdate = true;
      }
      this.platformMeshes.forEach((tVal, nVal) => {
        const iVal = this.platformMeta[nVal];
        if (!iVal) return;
        const isActive = !iVal.isRealityOnly;
        const aVal = tVal.children[0] as THREE.Mesh;
        if (aVal && Array.isArray(aVal.material)) {
          const tex = iVal.isRealityOnly ? (this.currentLevelNum <= 15 ? this.realityTexture : this.surrealTexture3) : (this.currentLevelNum <= 15 ? this.reverieTexture : this.surrealTexture4);
          if (tex && tex.image) {
            const mat = aVal.material as THREE.MeshStandardMaterial[],
                oVal = new THREE.CanvasTexture(tex.image);
            oVal.wrapS = THREE.RepeatWrapping;
            oVal.wrapT = THREE.RepeatWrapping;
            oVal.minFilter = THREE.LinearFilter;
            oVal.magFilter = THREE.LinearFilter;
            oVal.repeat.set(1.8, Math.max(1, iVal.h / 48 * 1.5));
            oVal.needsUpdate = true;
            mat.forEach(m => {
              m.map = oVal;
              m.transparent = true;
              m.opacity = isActive ? 1.0 : 0.15;
              m.needsUpdate = true;
            });
          }
        }
        const oVal2 = tVal.children[1] as THREE.Mesh;
        if (oVal2 && oVal2.material) {
          const mat = oVal2.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = isActive ? 1.0 : 0.15;
          mat.color.setHex(iVal.isRealityOnly ? 2282478 : 14239471);
          mat.emissive.setHex(iVal.isRealityOnly ? 2282478 : 14239471);
          mat.needsUpdate = true;
        }
      });
    } else {
      this.scene.background = new THREE.Color(394764);
      this.scene.fog = new THREE.Fog(394764, 8, 35);
      this.purpleLight.color.setHex(959977);
      this.cyanLight.color.setHex(440020);
      this.bloomPass.strength = 0.5;
      this.setMistIntensity(0.12);
      if (this.skySphere) {
        (this.skySphere.material as THREE.MeshBasicMaterial).map = this.skyDayTexture;
        (this.skySphere.material as THREE.MeshBasicMaterial).needsUpdate = true;
      }
      this.platformMeshes.forEach((tVal, nVal) => {
        const iVal = this.platformMeta[nVal];
        if (!iVal) return;
        const isActive = !iVal.isReverieOnly;
        const aVal = tVal.children[0] as THREE.Mesh;
        if (aVal && Array.isArray(aVal.material)) {
          const tex = iVal.isReverieOnly ? (this.currentLevelNum <= 15 ? this.reverieTexture : this.surrealTexture4) : (this.currentLevelNum <= 15 ? this.realityTexture : this.surrealTexture3);
          if (tex && tex.image) {
            const mat = aVal.material as THREE.MeshStandardMaterial[],
                oVal = new THREE.CanvasTexture(tex.image);
            oVal.wrapS = THREE.RepeatWrapping;
            oVal.wrapT = THREE.RepeatWrapping;
            oVal.minFilter = THREE.LinearFilter;
            oVal.magFilter = THREE.LinearFilter;
            oVal.repeat.set(1.8, Math.max(1, iVal.h / 48 * 1.5));
            oVal.needsUpdate = true;
            mat.forEach(m => {
              m.map = oVal;
              m.transparent = true;
              m.opacity = isActive ? 1.0 : 0.15;
              m.needsUpdate = true;
            });
          }
        }
        const oVal2 = tVal.children[1] as THREE.Mesh;
        if (oVal2 && oVal2.material) {
          const mat = oVal2.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = isActive ? 1.0 : 0.15;
          mat.color.setHex(iVal.isReverieOnly ? 14239471 : 2282478);
          mat.emissive.setHex(iVal.isReverieOnly ? 14239471 : 2282478);
          mat.needsUpdate = true;
        }
      });
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

  createPlayer(eVal: number, t: number) {
    if (this.playerMesh) {
      this.scene.remove(this.playerMesh);
    }
    const n = ml(this.playerColor);
    this.playerMesh = n;
    this.playerMesh.position.set(eVal / 48 - 10, 5 - t / 48, -0.45);
    this.scene.add(this.playerMesh);
  }

  updatePlayer(eVal: number, t: number, n: number) {
    const rVal = eVal / 48 - 10,
        i = 5 - t / 48;
    this.playerAngle = n;
    this.targetCamX = rVal;
    this.targetCamY = i;
    if (this.playerMesh) {
      this.playerMesh.position.set(rVal, i, -0.45);
      this.playerMesh.visible = (this.cameraMode === 'third');
      this.playerMesh.rotation.z = -this.playerAngle - Math.PI / 2;
    }
  }

  createShadow(eVal: number, t: number) {
    if (this.shadowMesh) {
      this.scene.remove(this.shadowMesh);
    }
    const n = hl();
    this.shadowMesh = n;
    this.shadowMesh.position.set((eVal + 10) / 48 - 10, 5 - (t + 21) / 48, -0.3);
    this.scene.add(this.shadowMesh);
  }

  updateShadow(eVal: number, t: number, isStunned = false) {
    if (this.shadowMesh) {
      const n = this.isReverieMode ? -0.3 : -0.65;
      this.shadowMesh.position.set((eVal + 10) / 48 - 10, 5 - (t + 21) / 48, n);
      gl(this.shadowMesh, this.isReverieMode, this.clock.getElapsedTime());

      // Visual feedback for stunned state
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

  createPlatform(eVal: number, t: number, n: number, rVal: number, _i = false, _a = 0, oVal = false, s = false) {
    const cVal = _l(n, rVal, oVal, s, this.isReverieMode, this.currentLevelNum, this.realityTexture, this.reverieTexture, this.surrealTexture3, this.surrealTexture4);
    cVal.position.set((eVal + n / 2) / 48 - 10, 5 - (t + rVal / 2) / 48, -0.5);
    this.scene.add(cVal);
    this.platformMeshes.push(cVal);
    this.platformMeta.push({w: n, h: rVal, isRealityOnly: oVal, isReverieOnly: s});
    return cVal;
  }

  updatePlatforms(eVal: Platform[]) {
    eVal.forEach((item, tVal) => {
      if (this.platformMeshes[tVal]) {
        this.platformMeshes[tVal].position.set((item.x + item.w / 2) / 48 - 10, 5 - (item.y + item.h / 2) / 48, -0.5);
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
    const rVal = n;
    rVal.position.set((eVal + 7.5) / 48 - 10, 5 - (t + 7.5) / 48, 0);
    this.scene.add(rVal);
    this.reminiscenceMeshes.push(rVal);
    return rVal;
  }

  updateReminiscences(eVal: any[], t: number) {
    eVal.forEach((item, nVal) => {
      if (this.reminiscenceMeshes[nVal]) {
        if (item.collected) {
          this.reminiscenceMeshes[nVal].visible = false;
        } else {
          this.reminiscenceMeshes[nVal].visible = true;
          const rVal = this.reminiscenceMeshes[nVal];
          rVal.position.set((item.x + 7.5) / 48 - 10, 5 - (item.y + 7.5) / 48, 0);
          rVal.rotation.y = t * 2 + (rVal.userData.floatOffset || 0);
          rVal.rotation.x = t * 1.5;
          rVal.position.y += Math.sin(t * 3 + (rVal.userData.floatOffset || 0)) * 0.15;
        }
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

  resetCamera() {
    const eVal = Math.cos(this.playerAngle),
        t = -Math.sin(this.playerAngle);
    if (this.cameraMode === 'third') {
      const dist = 3.2;
      const height = 1.8;
      this.camera.position.x = this.targetCamX - eVal * dist;
      this.camera.position.y = this.targetCamY - t * dist;
      this.camera.position.z = height;
      this.camera.up.set(0, 0, 1);
      if (this.skySphere) {
        this.skySphere.position.set(this.targetCamX, this.targetCamY, 0);
      }
      const n = new THREE.Vector3(this.targetCamX + eVal * 1.5, this.targetCamY + t * 1.5, 0.1);
      this.camera.lookAt(n);
    } else {
      this.camera.position.x = this.targetCamX;
      this.camera.position.y = this.targetCamY;
      this.camera.position.z = -0.25;
      this.camera.up.set(0, 0, 1);
      if (this.skySphere) {
        this.skySphere.position.set(this.targetCamX, this.targetCamY, 0);
      }
      const n = new THREE.Vector3(this.targetCamX + eVal * 5, this.targetCamY + t * 5, -0.25);
      this.camera.lookAt(n);
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