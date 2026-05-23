import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

/* ------------------------------------------------------------------
 *  Patrick Hartono — About page node graph (data-classification view)
 *
 *  Center: Patrick.
 *  Color-coded categories:
 *    discipline  → red    — research interests / fields
 *    school      → blue   — education
 *    appointment → teal   — workplaces
 *    venue       → purple — festivals / conferences / journals
 *
 *  Concentric shells:
 *    inner  (R≈3.2) — disciplines
 *    middle (R≈4.9–5.4 split) — schools + appointments
 *    outer  (R≈7.4) — venues
 * ------------------------------------------------------------------ */

const COLORS = {
  bg: 0xf7f3ec,
  patrick: 0x1d262f,
  discipline: 0xc1392b,
  school: 0x1f5fa8,
  appointment: 0x256f74,
  venue: 0x6b3fa0,
  edge: 0x1d262f,
};

const RADIUS = {
  inner: 3.2,
  school: 4.9,
  appointment: 5.4,
  outer: 7.4,
};

const NODE_SIZE = {
  center: 0.46,
  discipline: 0.22,
  school: 0.18,
  appointment: 0.18,
  venue: 0.15,
};

const NODES = [
  { id: 'patrick', label: 'Patrick Hartono', category: 'center',
    desc: 'PhD — HCI & Creative AI Researcher. Interaction Designer. Practice-based research.' },

  /* ----- DISCIPLINES (red) — RMIT research interests ----- */
  { id: 'd-music-interaction', label: 'Music Interaction', category: 'discipline',
    desc: 'How musical gesture, listening, and computation interact.' },
  { id: 'd-nime', label: 'NIME', category: 'discipline',
    desc: 'New Interfaces for Musical Expression — instrument design and embodiment.' },
  { id: 'd-creative-ml', label: 'Creative ML & Generative AI', category: 'discipline',
    desc: 'Interactive machine learning, small-dataset pipelines, LLM-integrated practice.' },
  { id: 'd-expanded-cinema', label: 'Expanded Cinema / Audiovisual', category: 'discipline',
    desc: 'Cinema as live, spatial, computational image-sound system.' },
  { id: 'd-electroacoustic', label: 'Electroacoustic / Acousmatic', category: 'discipline',
    desc: 'Composition with recorded, synthesised, and spatialised sound.' },
  { id: 'd-hci', label: 'Human–Computer Interaction', category: 'discipline',
    desc: 'Embodied interaction, accessible design, sensing systems.' },
  { id: 'd-comp-visual', label: 'Computational Visual Design', category: 'discipline',
    desc: 'Generative visuals, real-time graphics, image as computed behaviour.' },

  /* ----- SCHOOLS (blue) — education ----- */
  { id: 's-melbourne', label: 'University of Melbourne', category: 'school',
    desc: 'PhD in Interactive Composition (2024) — Conservatorium Director\'s Award.' },
  { id: 's-goldsmiths-edu', label: 'Goldsmiths · MMus', category: 'school',
    desc: 'MMus in Sonic Arts (2018) — University of London.' },
  { id: 's-codarts', label: 'Codarts Rotterdam', category: 'school',
    desc: 'BMus in Composition, Cum Laude (2016) — Rotterdam Conservatorium.' },
  { id: 's-sonology', label: 'Institute of Sonology', category: 'school',
    desc: 'Minor study, The Hague — electronic & computer music tradition.' },
  { id: 's-ircam-edu', label: 'IRCAM', category: 'school',
    desc: 'In Vivo Electro Live — live electronic music course, Paris.' },

  /* ----- APPOINTMENTS (teal) — workplaces ----- */
  { id: 'a-rmit', label: 'RMIT Vietnam', category: 'appointment',
    desc: 'Lecturer in Digital Media (2025–present). HCI, Creative AI, interaction design.' },
  { id: 'a-goldsmiths-job', label: 'Goldsmiths · Lecturer', category: 'appointment',
    desc: 'Lecturer in Computational Arts (2024–2025) — University of London.' },
  { id: 'a-une', label: 'Univ. of New England', category: 'appointment',
    desc: 'Adjunct Lecturer in Music Technology (2023) — Australia.' },
  { id: 'a-vienna', label: 'Applied Arts Vienna', category: 'appointment',
    desc: 'Technical Research Assistant (2022) — University of Applied Arts.' },

  /* ----- VENUES (purple) — festivals / conferences / journals ----- */
  { id: 'v-siggraph', label: 'SIGGRAPH', category: 'venue',
    desc: 'ACM SIGGRAPH — graphics & art papers; SPARK reviewer.' },
  { id: 'v-nime', label: 'NIME', category: 'venue',
    desc: 'New Interfaces for Musical Expression — Demo/Poster Chair 2026.' },
  { id: 'v-acm-dis', label: 'ACM DIS', category: 'venue',
    desc: 'ACM Designing Interactive Systems — peer reviewer.' },
  { id: 'v-ars-electronica', label: 'Ars Electronica', category: 'venue',
    desc: 'Linz — Hutan Plastik (2025), Spectral Chaos (2022).' },
  { id: 'v-icmc', label: 'ICMC', category: 'venue',
    desc: 'International Computer Music Conference — board member of ICMA.' },
  { id: 'v-zkm', label: 'ZKM', category: 'venue',
    desc: 'Zentrum für Kunst und Medien, Karlsruhe — exhibited works.' },
  { id: 'v-ccrma', label: 'CCRMA · Stanford', category: 'venue',
    desc: 'Stanford\'s Center for Computer Research in Music — Trapped (2019), Dystopia (2021).' },
  { id: 'v-isea', label: 'ISEA', category: 'venue',
    desc: 'International Symposium on Electronic Art.' },
  { id: 'v-artech', label: 'ARTECH', category: 'venue',
    desc: 'International Conference on Digital & Interactive Arts (ACM) — Mycortex (2025).' },
  { id: 'v-aimc', label: 'AIMC', category: 'venue',
    desc: 'AI Music Creativity Conference, Brussels — Practice-Based Methodology (2025).' },
  { id: 'v-cmmr', label: 'CMMR', category: 'venue',
    desc: 'Computer Music Multidisciplinary Research — Sonic Maze (2025).' },
  { id: 'v-organised-sound', label: 'Organised Sound', category: 'venue',
    desc: 'Cambridge University Press journal — Soundscapes of Papua, Paguyuban Algorave.' },
  { id: 'v-cmj', label: 'Computer Music Journal', category: 'venue',
    desc: 'MIT Press peer-reviewed journal.' },
  { id: 'v-mit-press', label: 'MIT Press', category: 'venue',
    desc: 'SuperCollider Book, 2nd ed. — Chapter 5: Artist\'s Statement.' },
];

const EDGES = [
  // Patrick → every category (anchored to the center)
  ...['d-music-interaction','d-nime','d-creative-ml','d-expanded-cinema','d-electroacoustic','d-hci','d-comp-visual']
    .map((d) => ['patrick', d]),
  ...['s-melbourne','s-goldsmiths-edu','s-codarts','s-sonology','s-ircam-edu']
    .map((s) => ['patrick', s]),
  ...['a-rmit','a-goldsmiths-job','a-une','a-vienna']
    .map((a) => ['patrick', a]),

  // Schools → discipline focus
  ['s-melbourne', 'd-music-interaction'],
  ['s-melbourne', 'd-hci'],
  ['s-melbourne', 'd-creative-ml'],
  ['s-goldsmiths-edu', 'd-electroacoustic'],
  ['s-goldsmiths-edu', 'd-comp-visual'],
  ['s-goldsmiths-edu', 'd-hci'],
  ['s-codarts', 'd-electroacoustic'],
  ['s-codarts', 'd-music-interaction'],
  ['s-sonology', 'd-electroacoustic'],
  ['s-ircam-edu', 'd-electroacoustic'],
  ['s-ircam-edu', 'd-music-interaction'],

  // Appointments → disciplines taught/researched there
  ['a-rmit', 'd-hci'],
  ['a-rmit', 'd-creative-ml'],
  ['a-rmit', 'd-comp-visual'],
  ['a-goldsmiths-job', 'd-comp-visual'],
  ['a-goldsmiths-job', 'd-electroacoustic'],
  ['a-goldsmiths-job', 'd-hci'],
  ['a-une', 'd-music-interaction'],
  ['a-vienna', 'd-creative-ml'],

  // Venues → the disciplines they're associated with
  ['v-siggraph', 'd-comp-visual'],
  ['v-siggraph', 'd-creative-ml'],
  ['v-siggraph', 'd-hci'],
  ['v-nime', 'd-nime'],
  ['v-nime', 'd-music-interaction'],
  ['v-nime', 'd-hci'],
  ['v-acm-dis', 'd-hci'],
  ['v-acm-dis', 'd-music-interaction'],
  ['v-ars-electronica', 'd-electroacoustic'],
  ['v-ars-electronica', 'd-expanded-cinema'],
  ['v-icmc', 'd-electroacoustic'],
  ['v-icmc', 'd-music-interaction'],
  ['v-zkm', 'd-electroacoustic'],
  ['v-zkm', 'd-expanded-cinema'],
  ['v-zkm', 'd-creative-ml'],
  ['v-ccrma', 'd-electroacoustic'],
  ['v-ccrma', 'd-music-interaction'],
  ['v-isea', 'd-expanded-cinema'],
  ['v-isea', 'd-creative-ml'],
  ['v-artech', 'd-comp-visual'],
  ['v-artech', 'd-creative-ml'],
  ['v-aimc', 'd-creative-ml'],
  ['v-aimc', 'd-music-interaction'],
  ['v-cmmr', 'd-music-interaction'],
  ['v-cmmr', 'd-electroacoustic'],
  ['v-organised-sound', 'd-electroacoustic'],
  ['v-cmj', 'd-electroacoustic'],
  ['v-cmj', 'd-creative-ml'],
  ['v-mit-press', 'd-electroacoustic'],
];

/* ---------- Fibonacci sphere distribution ---------- */
function fibonacciSphere(n, radius, offset = 0) {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * (i + offset);
    points.push({
      x: Math.cos(theta) * r * radius,
      y: y * radius,
      z: Math.sin(theta) * r * radius,
    });
  }
  return points;
}

/* ---------- Boot ---------- */
export function initNodeGraph({ canvas, tooltipEl }) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(COLORS.bg, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.bg, 12, 22);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.4, 14.5);
  camera.lookAt(0, 0, 0);

  const root = new THREE.Group();
  scene.add(root);

  // ---- Place nodes ----
  const byCat = (c) => NODES.filter((n) => n.category === c);
  const positions = new Map();
  positions.set('patrick', new THREE.Vector3(0, 0, 0));

  fibonacciSphere(byCat('discipline').length, RADIUS.inner).forEach((p, i) => {
    positions.set(byCat('discipline')[i].id, new THREE.Vector3(p.x, p.y, p.z));
  });
  fibonacciSphere(byCat('school').length, RADIUS.school, 0.4).forEach((p, i) => {
    positions.set(byCat('school')[i].id, new THREE.Vector3(p.x, p.y, p.z));
  });
  fibonacciSphere(byCat('appointment').length, RADIUS.appointment, 0.8).forEach((p, i) => {
    positions.set(byCat('appointment')[i].id, new THREE.Vector3(p.x, p.y, p.z));
  });
  fibonacciSphere(byCat('venue').length, RADIUS.outer, 1.3).forEach((p, i) => {
    positions.set(byCat('venue')[i].id, new THREE.Vector3(p.x, p.y, p.z));
  });

  // ---- Build node meshes ----
  const nodeMeshes = new Map();
  const nodeGroup = new THREE.Group();
  root.add(nodeGroup);

  NODES.forEach((data) => {
    const color = COLORS[data.category] ?? COLORS.patrick;
    const size = NODE_SIZE[data.category] ?? 0.15;
    const geom = new THREE.IcosahedronGeometry(size, 1);
    const mat = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(positions.get(data.id));
    mesh.userData = { ...data };
    nodeGroup.add(mesh);
    nodeMeshes.set(data.id, mesh);
  });

  // ---- Build edges ----
  const edgeLines = [];
  EDGES.forEach(([a, b]) => {
    const pa = positions.get(a);
    const pb = positions.get(b);
    if (!pa || !pb) return;
    const geom = new THREE.BufferGeometry().setFromPoints([pa, pb]);
    const baseOpacity = 0.22;
    const mat = new THREE.LineBasicMaterial({
      color: COLORS.edge,
      transparent: true,
      opacity: baseOpacity,
    });
    const line = new THREE.Line(geom, mat);
    root.add(line);
    edgeLines.push({ line, material: mat, ids: [a, b], baseOpacity });
  });

  // ---- Hover state ----
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;

  function setHover(mesh, clientX, clientY) {
    if (hovered === mesh) {
      if (mesh) positionTooltip(clientX, clientY);
      return;
    }
    if (hovered) hovered.scale.setScalar(1);
    hovered = mesh;

    if (mesh) {
      mesh.scale.setScalar(1.55);
      const { label, desc, category } = mesh.userData;
      const catLabel = {
        center: 'Person',
        discipline: 'Discipline',
        school: 'Education',
        appointment: 'Appointment',
        venue: 'Venue',
      }[category] || '';
      tooltipEl.innerHTML =
        `<span class="t-cat t-cat--${category}">${catLabel}</span>` +
        `<span class="t-label">${label}</span>` +
        `<span class="t-desc">${desc}</span>`;
      tooltipEl.classList.add('visible');
      positionTooltip(clientX, clientY);

      const id = mesh.userData.id;
      const hi = COLORS[mesh.userData.category] ?? COLORS.edge;
      edgeLines.forEach((e) => {
        const connected = e.ids.includes(id);
        e.material.opacity = connected ? 0.9 : 0.05;
        e.material.color.setHex(connected ? hi : COLORS.edge);
      });
      canvas.style.cursor = 'pointer';
    } else {
      tooltipEl.classList.remove('visible');
      edgeLines.forEach((e) => {
        e.material.opacity = e.baseOpacity;
        e.material.color.setHex(COLORS.edge);
      });
      canvas.style.cursor = 'default';
    }
  }

  function positionTooltip(x, y) {
    const margin = 16;
    const tw = tooltipEl.offsetWidth || 220;
    const th = tooltipEl.offsetHeight || 70;
    let tx = x + margin;
    let ty = y + margin;
    if (tx + tw > window.innerWidth - 8) tx = x - tw - margin;
    if (ty + th > window.innerHeight - 8) ty = y - th - margin;
    tooltipEl.style.left = `${tx}px`;
    tooltipEl.style.top = `${ty}px`;
  }

  function onPointerMove(ev) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const meshes = Array.from(nodeMeshes.values());
    const hits = raycaster.intersectObjects(meshes, false);

    if (hits.length > 0) {
      setHover(hits[0].object, ev.clientX, ev.clientY);
    } else {
      setHover(null);
    }
  }

  function onPointerLeave() {
    setHover(null);
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);

  // ---- Resize ----
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- Animation loop ----
  const clock = new THREE.Clock();
  const ROT_SPEED = reduceMotion ? 0 : 0.055;

  function tick() {
    const dt = clock.getDelta();
    if (ROT_SPEED) {
      root.rotation.y += dt * ROT_SPEED;
      root.rotation.x = Math.sin(clock.elapsedTime * 0.11) * 0.08;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  return {
    destroy() {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
