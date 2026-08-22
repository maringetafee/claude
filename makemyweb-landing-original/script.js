const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  document.body.classList.toggle('nav-open');
});

const REVISION_PRICE = 30;

const baseInputs = document.querySelectorAll('input[name="base"]');
const maintInputs = document.querySelectorAll('input[name="maint"]');
const reservasInput = document.getElementById('addReservas');
const revMinus = document.getElementById('revMinus');
const revPlus = document.getElementById('revPlus');
const revCountEl = document.getElementById('revCount');

const summaryList = document.getElementById('summaryList');
const totalOnceEl = document.getElementById('totalOnce');
const totalMonthlyEl = document.getElementById('totalMonthly');

let revCount = 0;

revMinus.addEventListener('click', () => {
  if (revCount > 0) revCount--;
  revCountEl.textContent = revCount;
  updateSummary();
});
revPlus.addEventListener('click', () => {
  revCount++;
  revCountEl.textContent = revCount;
  updateSummary();
});

baseInputs.forEach(i => i.addEventListener('change', updateSummary));
maintInputs.forEach(i => i.addEventListener('change', updateSummary));
reservasInput.addEventListener('change', updateSummary);

function getChecked(list) {
  return Array.from(list).find(i => i.checked);
}

function updateSummary() {
  const base = getChecked(baseInputs);
  const maint = getChecked(maintInputs);

  const items = [];
  let once = 0;
  let monthly = 0;

  once += Number(base.value);
  items.push({ label: base.dataset.name, price: `${base.value}€` });

  if (reservasInput.checked) {
    once += Number(reservasInput.value);
    items.push({ label: 'Sistema de reservas', price: `+${reservasInput.value}€` });
  }

  if (revCount > 0) {
    const cost = revCount * REVISION_PRICE;
    once += cost;
    items.push({ label: `${revCount} revisión(es) extra`, price: `+${cost}€` });
  }

  monthly = Number(maint.value);
  items.push({ label: maint.dataset.name, price: monthly > 0 ? `${monthly}€/mes` : '0€' });

  summaryList.innerHTML = items
    .map(it => `<li><span>${it.label}</span><span>${it.price}</span></li>`)
    .join('');

  totalOnceEl.textContent = `${once}€`;
  totalMonthlyEl.textContent = `${monthly}€/mes`;
}

updateSummary();

/* Animaciones al hacer scroll */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.cards-grid, .clients-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.classList.add('reveal');
    child.style.transitionDelay = `${(i % 4) * 0.09}s`;
  });
});

document.querySelectorAll('.calc-block, .calc-summary, .contact-box').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 0.09}s`;
});

document.querySelectorAll('.section > .container > h2, .section > .container > .section-subtitle').forEach(el => {
  el.classList.add('reveal');
});

const revealEls = document.querySelectorAll('.reveal');

if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ============================================================
   Escena del coche 3D: aproximación -> giro a perfil -> reposo,
   más una versión miniatura que se queda animada en el header.
   ============================================================ */
(function initCarScene() {
  const carScene = document.querySelector('.car-scene');
  const carCanvasEl = document.getElementById('carCanvas');
  const carCaption = document.getElementById('carCaption');
  const headerCanvasEl = document.getElementById('headerCarCanvas');
  if (!carScene || !carCanvasEl) return;

  import('./assets/vendor/three.module.js')
    .then((THREE) => setupCarScene(THREE, { carScene, carCanvasEl, carCaption, headerCanvasEl }))
    .catch(() => {
      carCanvasEl.style.display = 'none';
      carCaption.classList.add('is-interactive');
    });
})();

function buildCar(THREE) {
  const group = new THREE.Group();
  const width = 1.8;

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x08080a, metalness: 0.85, roughness: 0.22 });
  const neonMat = new THREE.MeshStandardMaterial({
    color: 0x2a0a4a, emissive: 0xb266ff, emissiveIntensity: 2.4, metalness: 0.2, roughness: 0.4,
  });
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xdff2ff, emissive: 0xdff2ff, emissiveIntensity: 1.8, metalness: 0, roughness: 0.3,
  });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.4, roughness: 0.6 });

  const shape = new THREE.Shape();
  shape.moveTo(2.6, 0.35);
  shape.lineTo(2.3, 0.55);
  shape.lineTo(1.1, 0.62);
  shape.quadraticCurveTo(0.75, 0.85, 0.65, 1.05);
  shape.lineTo(0.45, 1.15);
  shape.lineTo(-0.55, 1.15);
  shape.quadraticCurveTo(-0.8, 1.1, -0.9, 0.85);
  shape.lineTo(-1.55, 0.62);
  shape.lineTo(-2.3, 0.5);
  shape.lineTo(-2.5, 0.3);
  shape.lineTo(-2.5, 0.12);
  shape.lineTo(2.6, 0.12);
  shape.closePath();

  const bodyGeo = new THREE.ExtrudeGeometry(shape, {
    depth: width, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2,
  });
  bodyGeo.translate(0, 0, -width / 2);
  group.add(new THREE.Mesh(bodyGeo, bodyMat));

  const underglow = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.04, width + 0.15), neonMat);
  underglow.position.set(-0.1, 0.06, 0);
  group.add(underglow);

  [1, -1].forEach((side) => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.06, 0.04), neonMat);
    strip.position.set(-0.1, 0.4, side * (width / 2 + 0.02));
    group.add(strip);

    const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.3), headlightMat);
    headlight.position.set(2.36, 0.46, (side * width) / 3.2);
    group.add(headlight);

    const taillight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.34), neonMat);
    taillight.position.set(-2.28, 0.46, (side * width) / 3.2);
    group.add(taillight);

    const strut = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.42, 0.05), bodyMat);
    strut.position.set(-2.15, 0.76, side * (width / 2 - 0.15));
    group.add(strut);
  });

  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, width + 0.1), bodyMat);
  wing.position.set(-2.15, 1.02, 0);
  group.add(wing);

  const wheelPositions = [
    [1.72, 0.42, width / 2 + 0.06],
    [1.72, 0.42, -(width / 2 + 0.06)],
    [-1.72, 0.42, width / 2 + 0.06],
    [-1.72, 0.42, -(width / 2 + 0.06)],
  ];
  const spinning = [];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 20), wheelMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, y, z);
    group.add(wheel);
    spinning.push(wheel);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 8, 24), neonMat);
    rim.rotation.y = Math.PI / 2;
    rim.position.set(x, y, z + (z > 0 ? 0.16 : -0.16));
    group.add(rim);
    spinning.push(rim);
  });

  return { group, neonMat, headlightMat, spinning };
}

function buildRoad(THREE) {
  const road = new THREE.Group();
  const length = 46;
  const roadWidth = 5.5;

  const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x0b0a10, roughness: 0.92, metalness: 0.04 });
  const surface = new THREE.Mesh(new THREE.PlaneGeometry(90, roadWidth), asphaltMat);
  surface.rotation.x = -Math.PI / 2;
  surface.position.set(-4, 0, 0);
  road.add(surface);

  // Líneas discontinuas: se reposicionan cada frame (ver dashSpan) para dar
  // sensación de carretera infinita que se mueve hacia atrás bajo el coche.
  const dashSpan = 40;
  const dashSpacing = 1.3;
  const dashMat = new THREE.MeshStandardMaterial({
    color: 0xcfc4e6, emissive: 0x6a4a9c, emissiveIntensity: 0.5, roughness: 0.6,
  });
  const dashes = [];
  for (let x = -dashSpan / 2; x < dashSpan / 2; x += dashSpacing) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.12), dashMat);
    dash.position.set(-4 + x, 0.011, 0);
    road.add(dash);
    dashes.push({ mesh: dash, base: x });
  }

  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0x9d86bf, emissive: 0x3d2a5c, emissiveIntensity: 0.35, roughness: 0.7,
  });
  [1, -1].forEach((side) => {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(90, 0.015, 0.1), edgeMat);
    edge.position.set(-4, 0.008, side * (roadWidth / 2 - 0.3));
    road.add(edge);
  });

  return { group: road, dashes, dashSpan };
}

function setupCarScene(THREE, { carScene, carCanvasEl, carCaption, headerCanvasEl }) {
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: carCanvasEl, antialias: true, alpha: true });
  } catch (e) {
    carCanvasEl.style.display = 'none';
    carCaption.classList.add('is-interactive');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0612, 9, 26);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const cameraTarget = new THREE.Vector3(0, 0.55, 0);

  scene.add(new THREE.AmbientLight(0x140c28, 0.6));
  scene.add(new THREE.HemisphereLight(0x2a1a4a, 0x050308, 0.5));

  const keyLight = new THREE.PointLight(0xb266ff, 60, 20, 2);
  keyLight.position.set(3, 3, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x8a2be2, 50, 20, 2);
  rimLight.position.set(-4, 2, -3);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
  fillLight.position.set(2, 5, 5);
  scene.add(fillLight);

  const { group: road, dashes, dashSpan } = buildRoad(THREE);
  scene.add(road);

  const { group: car, neonMat, headlightMat, spinning } = buildCar(THREE);
  scene.add(car);
  const spinAxis = new THREE.Vector3(0, 0, 1);

  function resize() {
    const w = carCanvasEl.clientWidth;
    const h = carCanvasEl.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  if (reduceMotion) {
    // Fotograma único, sin animación: coche ya de perfil, con el texto visible.
    camera.position.set(0, 0.8, 9.5);
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
    carCaption.classList.add('is-interactive');
    return;
  }

  // --- Parallax del ratón (solo con puntero fino, evita falsos hovers táctiles) ---
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let mouseX = 0, mouseY = 0, mouseXSmooth = 0, mouseYSmooth = 0;
  if (supportsHover) {
    carCanvasEl.addEventListener('mousemove', (e) => {
      const rect = carCanvasEl.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    });
    carCanvasEl.addEventListener('mouseleave', () => { mouseX = 0; mouseY = 0; });
  }

  // --- Destello de faros al hacer click ---
  let flashPulse = 0;
  carCanvasEl.addEventListener('click', () => { flashPulse = 1; });

  function getProgress() {
    const rect = carScene.getBoundingClientRect();
    const total = carScene.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
  }

  let smoothRadius = 16;
  let smoothAngle = 0;
  let smoothCamY = 2.3;
  let sceneVisible = true;

  new IntersectionObserver((entries) => {
    entries.forEach((entry) => { sceneVisible = entry.isIntersecting; });
  }, { threshold: 0 }).observe(carScene);

  const headerCar = setupHeaderCar(THREE, headerCanvasEl);
  let headerVisible = false;
  function updateHeaderVisibility() {
    const rect = carScene.getBoundingClientRect();
    const shouldShow = rect.bottom <= 90;
    if (shouldShow !== headerVisible) {
      headerVisible = shouldShow;
      headerCanvasEl.classList.toggle('is-visible', headerVisible);
      headerCar.setActive(headerVisible);
    }
  }
  window.addEventListener('scroll', updateHeaderVisibility, { passive: true });

  const clock = new THREE.Clock();
  const ROAD_SPEED = 7.5;
  const WHEEL_RADIUS = 0.42;
  let roadOffset = 0;
  let lastT = 0;

  function animate() {
    requestAnimationFrame(animate);
    if (!sceneVisible) return;

    const progress = getProgress();
    const t = clock.getElapsedTime();

    // Cámara: aproximación (0-0.4) -> giro a perfil lateral (0.4-0.62) -> reposo (0.62-1)
    const approachEase = 1 - Math.pow(1 - clamp(progress / 0.4, 0, 1), 3);
    const orbitT = clamp((progress - 0.4) / 0.22, 0, 1);
    const orbitEase = 1 - Math.pow(1 - orbitT, 3);
    const settleT = clamp((progress - 0.62) / 0.38, 0, 1);

    const radiusTarget = lerp(lerp(16, 7, approachEase), 11.5, orbitEase);
    const angleTarget = orbitEase * (Math.PI / 2);
    const camYTarget = lerp(2.3, 1.1, approachEase) - orbitEase * 0.15;

    smoothRadius = lerp(smoothRadius, radiusTarget, 0.06);
    smoothAngle = lerp(smoothAngle, angleTarget, 0.06);
    smoothCamY = lerp(smoothCamY, camYTarget, 0.06);

    const parallaxInfluence = 1 - clamp(progress / 0.35, 0, 1);
    mouseXSmooth = lerp(mouseXSmooth, mouseX, 0.05);
    mouseYSmooth = lerp(mouseYSmooth, mouseY, 0.05);

    const camX = Math.cos(smoothAngle) * smoothRadius + mouseXSmooth * 0.8 * parallaxInfluence;
    const camZ = Math.sin(smoothAngle) * smoothRadius;
    const camY = smoothCamY + mouseYSmooth * 0.35 * parallaxInfluence;

    camera.position.set(camX, camY, camZ);
    camera.lookAt(cameraTarget);

    // Carretera infinita: las líneas discontinuas se deslizan hacia atrás a
    // velocidad de carretera, y las ruedas giran acorde a esa misma velocidad
    const dt = Math.min(t - lastT || 0, 0.05);
    roadOffset += ROAD_SPEED * dt;
    dashes.forEach(({ mesh, base }) => {
      const wrapped = (((base - roadOffset) % dashSpan) + dashSpan) % dashSpan - dashSpan / 2;
      mesh.position.x = -4 + wrapped;
    });
    lastT = t;

    const wheelAngularSpeed = ROAD_SPEED / WHEEL_RADIUS;
    spinning.forEach((mesh) => mesh.rotateOnWorldAxis(spinAxis, wheelAngularSpeed * dt));
    const idleVibration = Math.sin(t * 9) * 0.004 + Math.sin(t * 2.2) * 0.006;
    car.position.y = idleVibration;

    // Balanceo adicional, más presente una vez el coche queda asentado de perfil
    car.rotation.y = Math.sin(t * 0.5) * 0.02 * settleT;

    // Pulso ambiental del neón + decaimiento del destello de click
    flashPulse *= 0.92;
    neonMat.emissiveIntensity = 2.4 + Math.sin(t * 1.3) * 0.35 + flashPulse * 3;
    headlightMat.emissiveIntensity = 1.8 + flashPulse * 4;
    keyLight.intensity = 60 + flashPulse * 120;

    // El texto entra una vez el coche queda de perfil
    const captionT = clamp((progress - 0.68) / 0.28, 0, 1);
    carCaption.style.opacity = captionT;
    carCaption.style.transform = `translateY(${16 - captionT * 16}px)`;
    carCaption.classList.toggle('is-interactive', captionT > 0.6);

    renderer.render(scene, camera);
  }
  animate();
}

function setupHeaderCar(THREE, canvasEl) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
  } catch (e) {
    return { setActive() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(4.2, 2, 4.2);
  camera.lookAt(0, 0.4, 0);

  scene.add(new THREE.AmbientLight(0x140c28, 0.7));
  const key = new THREE.PointLight(0xb266ff, 45, 15, 2);
  key.position.set(3, 3, 3);
  scene.add(key);
  const rim = new THREE.PointLight(0x8a2be2, 35, 15, 2);
  rim.position.set(-3, 2, -2);
  scene.add(rim);

  const { group: car, neonMat } = buildCar(THREE);
  scene.add(car);

  function resize() {
    const size = canvasEl.clientWidth || 34;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  let active = false;
  let raf = null;

  function loop() {
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    car.rotation.y = t * 0.35;
    neonMat.emissiveIntensity = 2.2 + Math.sin(t * 1.4) * 0.3;
    renderer.render(scene, camera);
  }

  return {
    setActive(state) {
      if (state === active) return;
      active = state;
      if (active && !raf) loop();
      else if (!active && raf) { cancelAnimationFrame(raf); raf = null; }
    },
  };
}

/* ============================================================
   Hojas cayendo por toda la página. Viven en el espacio del
   DOCUMENTO (cada una tiene una posición fija en la página), no
   en el de la pantalla: al hacer scroll se quedan "ancladas" al
   fondo en vez de perseguir al lector. El lienzo en sí es barato
   (del tamaño del viewport) porque solo se dibuja lo que entra en
   pantalla, restando el scroll actual en cada frame.
   ============================================================ */
(function initPageLeaves() {
  const canvas = document.getElementById('pageLeaves');
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext('2d');
  let vw = 0;
  let vh = 0;
  let docHeight = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    vw = window.innerWidth;
    vh = window.innerHeight;
    docHeight = Math.max(document.documentElement.scrollHeight, vh);
    canvas.width = vw * dpr;
    canvas.height = vh * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const palettes = [
    ['#e8934a', '#c9622e'],
    ['#d99a5b', '#a83a3a'],
    ['#c9622e', '#8a3a2e'],
  ];

  function spawnLeaf(docY) {
    const colors = palettes[Math.floor(Math.random() * palettes.length)];
    return {
      x: Math.random() * vw,
      docY: docY !== undefined ? docY : Math.random() * docHeight,
      size: 3 + Math.random() * 3.5,
      speed: 8 + Math.random() * 10,
      swayAmp: 14 + Math.random() * 22,
      swayFreq: 0.3 + Math.random() * 0.4,
      swayPhase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.1,
      colors,
      opacity: 0.3 + Math.random() * 0.25,
    };
  }

  const count = Math.min(55, Math.max(16, Math.round(docHeight / 190)));
  const leaves = Array.from({ length: count }, () => spawnLeaf());

  function drawLeaf(leaf, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(leaf.rotation);
    ctx.globalAlpha = leaf.opacity;
    const s = leaf.size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * 0.8, -s * 0.4, 0, s);
    ctx.quadraticCurveTo(-s * 0.8, -s * 0.4, 0, -s);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, -s, 0, s);
    grad.addColorStop(0, leaf.colors[0]);
    grad.addColorStop(1, leaf.colors[1]);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  let lastTime = performance.now();
  let visible = document.visibilityState === 'visible';
  document.addEventListener('visibilitychange', () => {
    visible = document.visibilityState === 'visible';
    if (visible) lastTime = performance.now();
  });

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const t = now / 1000;
    const scrollY = window.scrollY;

    ctx.clearRect(0, 0, vw, vh);
    leaves.forEach((leaf) => {
      leaf.docY += leaf.speed * dt;
      leaf.rotation += leaf.spin * dt;
      if (leaf.docY > docHeight + 20) Object.assign(leaf, spawnLeaf(-20 - Math.random() * 40));

      const screenY = leaf.docY - scrollY;
      if (screenY < -20 || screenY > vh + 20) return;
      const x = leaf.x + Math.sin(t * leaf.swayFreq + leaf.swayPhase) * leaf.swayAmp;
      drawLeaf(leaf, x, screenY);
    });
  }
  requestAnimationFrame(frame);
})();
