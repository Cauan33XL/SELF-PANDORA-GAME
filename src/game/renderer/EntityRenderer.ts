import * as THREE from 'three';

function hl(): THREE.Group {
  const e = new THREE.Group(),
      t = new THREE.MeshStandardMaterial({color: 0x333333, metalness: .95, roughness: .05}),
      n = new THREE.MeshBasicMaterial({color: 0x888888}),
      rVal = new THREE.Mesh(new THREE.SphereGeometry(.3, 16, 16), t);
  rVal.position.set(0, 0, 0);
  rVal.castShadow = true;
  e.add(rVal);
  
  const i = new THREE.Mesh(new THREE.SphereGeometry(.42, 16, 16), t);
  i.scale.set(1.3, 1.6, .9);
  i.position.set(0, -.45, -.05);
  i.castShadow = true;
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
  s.castShadow = true;
  e.add(s);
  
  const cVal = new THREE.Mesh(oVal, t);
  cVal.position.set(.08, -.16, .22);
  cVal.rotation.x = Math.PI / 6;
  cVal.rotation.z = -Math.PI / 12;
  cVal.castShadow = true;
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
    cVal2.castShadow = true;
    aVal.add(cVal2);
    const fVal = new THREE.Mesh(d, t);
    fVal.rotation.z = rVal3 ? Math.PI / 4 : -Math.PI / 4;
    fVal.position.set(rVal3 ? -.45 : .45, -.05, -.25);
    fVal.castShadow = true;
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

function vl(eVal: number, t: number, _doorColor: number): THREE.Group {
  const rVal = new THREE.Group(),
      i = new THREE.Mesh(new THREE.BoxGeometry(eVal / 48 + .2, t / 48 + .2, .3), new THREE.MeshStandardMaterial({color: 0x333333, metalness: .5, roughness: .7}));
  i.castShadow = true;
  rVal.add(i);
  const a = new THREE.Mesh(new THREE.BoxGeometry(eVal / 48, t / 48, .1), new THREE.MeshStandardMaterial({color: 0xaaaaaa, emissive: 0x888888, emissiveIntensity: .3, metalness: .4, roughness: .5, transparent: true, opacity: .85}));
  a.position.z = .1;
  rVal.add(a);
  const oVal = new THREE.Mesh(new THREE.RingGeometry(.3, .5, 32), new THREE.MeshBasicMaterial({color: 0xcccccc, transparent: true, opacity: .5, side: 2}));
  oVal.position.z = .15;
  rVal.add(oVal);
  const s = new THREE.Mesh(new THREE.SphereGeometry(.8, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: .12, side: 1}));
  rVal.add(s);
  return rVal;
}

function yl(): THREE.Group {
  const e = new THREE.Group(),
      t = new THREE.Mesh(new THREE.OctahedronGeometry(.35), new THREE.MeshStandardMaterial({color: 0x888888, emissive: 0xaaaaaa, emissiveIntensity: .4, metalness: .3, roughness: .4}));
  t.castShadow = true;
  e.add(t);
  const n = new THREE.Mesh(new THREE.OctahedronGeometry(.5), new THREE.MeshBasicMaterial({color: 0xcccccc, transparent: true, opacity: .25, wireframe: true}));
  e.add(n);
  const rVal = new THREE.Mesh(new THREE.SphereGeometry(.7, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: .1, side: 1}));
  e.add(rVal);
  return e;
}

export class EntityRenderer {
  scene: THREE.Scene;
  clock: THREE.Clock;
  
  shadowMesh: THREE.Group | null = null;
  doorMesh: THREE.Group | null = null;
  reminiscenceMeshes: THREE.Group[] = [];
  
  doorColor = 0x666666;

  constructor(scene: THREE.Scene, clock: THREE.Clock) {
    this.scene = scene;
    this.clock = clock;
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
      }
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

  clearEntities() {
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
  }
}
